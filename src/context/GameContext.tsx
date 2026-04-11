import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { type GameItem, type SlotType, itemDatabase, STANDARD_STATS } from '@/data/gameData';
import { getLevelFromXp, mapRegions, type Mission } from '@/data/mapData';
import { useAuth } from './AuthContext';
import { loadProgress, saveProgress, type SaveData } from '@/lib/progressSync';
import { supabase } from '@/integrations/supabase/client';
import { archetypes, TRAIT_STAT_MAP, type TraitCategory } from '@/data/archetypes';

interface ItemLocation {
  area: 'bag-left' | 'bag-right' | 'equipped';
  slotType?: SlotType;
}

interface GameState {
  gender: 'male' | 'female';
  selectedCharacterId: string;
  activeTab: string;
  itemLocations: Record<string, ItemLocation>;
  walletAmount: number;
  totalXp: number;
  completedMissions: string[];
  selectedRegionId: string | null;
  characterName: string;
  archetypeId: string;
  traitPoints: Record<string, number>;
}

interface GameContextType {
  state: GameState;
  setGender: (g: 'male' | 'female') => void;
  setSelectedCharacter: (id: string) => void;
  setActiveTab: (t: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  moveItem: (itemId: string, target: 'bag-left' | 'bag-right') => void;
  getItemsInLocation: (area: string, slotType?: SlotType) => GameItem[];
  getEquippedItem: (slotType: SlotType) => GameItem | undefined;
  getCalculatedStats: () => Record<string, number>;
  getCoinTotal: () => number;
  getBagCount: (bag: 'bag-left' | 'bag-right') => number;
  getPlayerLevel: () => { level: number; currentXp: number; xpToNext: number };
  completeMission: (missionId: string) => void;
  setSelectedRegion: (regionId: string | null) => void;
  isMissionCompleted: (missionId: string) => boolean;
  buyItem: (itemId: string, price: number) => boolean;
  sellItem: (itemId: string, sellPrice: number) => boolean;
  hasItem: (itemId: string) => boolean;
  loaded: boolean;
}

const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

function defaultState(): GameState {
  return {
    gender: 'male',
    selectedCharacterId: 'male-0',
    activeTab: 'CHARACTER',
    itemLocations: {},
    walletAmount: 0,
    totalXp: 0,
    completedMissions: [],
    selectedRegionId: null,
    characterName: 'Outlaw',
    archetypeId: 'jace',
    traitPoints: {},
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<GameState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!user) {
      setState(defaultState());
      setLoaded(true);
      return;
    }

    Promise.all([
      loadProgress(user.id),
      supabase
        .from('player_characters')
        .select('character_name, archetype_id, portrait_id, trait_points')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .single(),
    ]).then(([progressData, charResult]) => {
      setState(s => {
        let next = { ...s };

        if (progressData) {
          next = {
            ...next,
            gender: progressData.gender as 'male' | 'female',
            selectedCharacterId: progressData.selectedCharacterId,
            totalXp: progressData.totalXp,
            walletAmount: progressData.walletAmount,
            completedMissions: progressData.completedMissions,
            itemLocations: (progressData.itemLocations as Record<string, ItemLocation>) || {},
          };
        }

        if (charResult.data) {
          const arch = archetypes.find(a => a.id === charResult.data.archetype_id);
          next = {
            ...next,
            characterName: charResult.data.character_name,
            archetypeId: charResult.data.archetype_id,
            traitPoints: (charResult.data.trait_points as Record<string, number>) || {},
            selectedCharacterId: charResult.data.portrait_id || next.selectedCharacterId,
            gender: arch?.gender || next.gender,
          };
        }

        return next;
      });
      setLoaded(true);
    });
  }, [user]);

  // Auto-save debounced
  useEffect(() => {
    if (!user || !loaded) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      const data: SaveData = {
        gender: state.gender,
        selectedCharacterId: state.selectedCharacterId,
        totalXp: state.totalXp,
        walletAmount: state.walletAmount,
        completedMissions: state.completedMissions,
        itemLocations: state.itemLocations,
      };
      saveProgress(user.id, data);
    }, 2000);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  }, [user, loaded, state.gender, state.selectedCharacterId, state.totalXp, state.walletAmount, state.completedMissions, state.itemLocations]);

  const setGender = useCallback((g: 'male' | 'female') => {
    setState(s => ({ ...s, gender: g, selectedCharacterId: g === 'male' ? 'male-0' : 'female-0' }));
  }, []);

  const setSelectedCharacter = useCallback((id: string) => {
    setState(s => ({ ...s, selectedCharacterId: id }));
  }, []);

  const setActiveTab = useCallback((t: string) => setState(s => ({ ...s, activeTab: t })), []);

  const equipItem = useCallback((itemId: string) => {
    const item = itemDatabase.find(i => i.id === itemId);
    if (!item) return;
    setState(s => {
      const locs = { ...s.itemLocations };
      const existing = Object.entries(locs).find(([, loc]) => loc.area === 'equipped' && loc.slotType === item.type);
      if (existing) { locs[existing[0]] = { area: 'bag-left' }; }
      locs[itemId] = { area: 'equipped', slotType: item.type };
      return { ...s, itemLocations: locs };
    });
  }, []);

  const unequipItem = useCallback((itemId: string) => {
    setState(s => ({ ...s, itemLocations: { ...s.itemLocations, [itemId]: { area: 'bag-left' } } }));
  }, []);

  const moveItem = useCallback((itemId: string, target: 'bag-left' | 'bag-right') => {
    setState(s => ({ ...s, itemLocations: { ...s.itemLocations, [itemId]: { area: target } } }));
  }, []);

  const getItemsInLocation = useCallback((area: string, slotType?: SlotType) => {
    return itemDatabase.filter(item => {
      const loc = state.itemLocations[item.id];
      if (!loc) return false;
      if (loc.area !== area) return false;
      if (slotType && loc.slotType !== slotType) return false;
      return true;
    });
  }, [state.itemLocations]);

  const getEquippedItem = useCallback((slotType: SlotType) => {
    return itemDatabase.find(item => {
      const loc = state.itemLocations[item.id];
      return loc?.area === 'equipped' && loc.slotType === slotType;
    });
  }, [state.itemLocations]);

  const getCalculatedStats = useCallback(() => {
    const playerLevel = getLevelFromXp(state.totalXp);
    const current = { ...STANDARD_STATS };
    for (const key of Object.keys(current)) {
      current[key] += (playerLevel.level - 1) * 2;
    }
    const arch = archetypes.find(a => a.id === state.archetypeId);
    if (arch) {
      for (const [s, v] of Object.entries(arch.bonusStats)) {
        if (s in current) current[s] += v;
      }
    }
    for (const [traitName, pts] of Object.entries(state.traitPoints)) {
      const mapping = TRAIT_STAT_MAP[traitName as TraitCategory];
      if (mapping && typeof pts === 'number') {
        for (const [stat, mult] of Object.entries(mapping)) {
          if (stat in current) current[stat] += pts * mult;
        }
      }
    }
    itemDatabase.forEach(item => {
      const loc = state.itemLocations[item.id];
      if (loc?.area === 'equipped') {
        for (const [s, v] of Object.entries(item.stats)) {
          if (s in current) current[s] += v as number;
        }
      }
    });
    return current;
  }, [state.itemLocations, state.totalXp, state.archetypeId, state.traitPoints]);

  const getCoinTotal = useCallback(() => {
    // Sum values of owned items only
    return itemDatabase.reduce((sum, item) => {
      const loc = state.itemLocations[item.id];
      if (loc) return sum + item.value;
      return sum;
    }, 0);
  }, [state.itemLocations]);

  const getBagCount = useCallback((bag: 'bag-left' | 'bag-right') => {
    return Object.values(state.itemLocations).filter(loc => loc.area === bag).length;
  }, [state.itemLocations]);

  const getPlayerLevel = useCallback(() => {
    return getLevelFromXp(state.totalXp);
  }, [state.totalXp]);

  const buyItem = useCallback((itemId: string, price: number): boolean => {
    let success = false;
    setState(s => {
      if (s.walletAmount < price) return s;
      if (s.itemLocations[itemId]) return s; // already owned
      // Check bag space
      const leftCount = Object.values(s.itemLocations).filter(l => l.area === 'bag-left').length;
      const rightCount = Object.values(s.itemLocations).filter(l => l.area === 'bag-right').length;
      const targetBag: 'bag-left' | 'bag-right' = leftCount <= rightCount ? 'bag-left' : 'bag-right';
      const targetCount = targetBag === 'bag-left' ? leftCount : rightCount;
      if (targetCount >= 20) return s; // bags full
      success = true;
      return {
        ...s,
        walletAmount: s.walletAmount - price,
        itemLocations: { ...s.itemLocations, [itemId]: { area: targetBag } },
      };
    });
    return success;
  }, []);

  const sellItem = useCallback((itemId: string, sellPrice: number): boolean => {
    let success = false;
    setState(s => {
      if (!s.itemLocations[itemId]) return s; // don't own it
      const newLocs = { ...s.itemLocations };
      delete newLocs[itemId];
      success = true;
      return {
        ...s,
        walletAmount: s.walletAmount + sellPrice,
        itemLocations: newLocs,
      };
    });
    return success;
  }, []);

  const hasItem = useCallback((itemId: string): boolean => {
    return !!state.itemLocations[itemId];
  }, [state.itemLocations]);

  const completeMission = useCallback((missionId: string) => {
    setState(s => {
      if (s.completedMissions.includes(missionId)) return s;
      let mission: Mission | undefined;
      for (const region of mapRegions) {
        mission = region.missions.find(m => m.id === missionId);
        if (mission) break;
      }
      if (!mission) return s;
      return {
        ...s,
        completedMissions: [...s.completedMissions, missionId],
        totalXp: s.totalXp + mission.xpReward,
        walletAmount: s.walletAmount + mission.coinReward,
      };
    });
  }, []);

  const setSelectedRegion = useCallback((regionId: string | null) => {
    setState(s => ({ ...s, selectedRegionId: regionId }));
  }, []);

  const isMissionCompleted = useCallback((missionId: string) => {
    return state.completedMissions.includes(missionId);
  }, [state.completedMissions]);

  return (
    <GameContext.Provider value={{
      state, setGender, setSelectedCharacter, setActiveTab, equipItem, unequipItem, moveItem,
      getItemsInLocation, getEquippedItem, getCalculatedStats, getCoinTotal, getBagCount,
      getPlayerLevel, completeMission, setSelectedRegion, isMissionCompleted,
      buyItem, sellItem, hasItem, loaded,
    }}>
      {children}
    </GameContext.Provider>
  );
}
