import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { type GameItem, type SlotType, itemDatabase, STANDARD_STATS, DEFAULT_SPECIAL, DEFAULT_VITALS, DEFAULT_JUSTICE, DEFAULT_GAMEPLAY, DEFAULT_SKILLS, type SpecialStats, type VitalStats, type JusticeStats, type GameplayStats, type PlayerSkills } from '@/data/gameData';
import { getLevelFromXp, mapRegions, type Mission, type MissionEncounter } from '@/data/mapData';
import { useAuth } from './AuthContext';
import { loadProgress, saveProgress, type SaveData } from '@/lib/progressSync';
import { supabase } from '@/integrations/supabase/client';
import { archetypes, TRAIT_STAT_MAP, type TraitCategory } from '@/data/archetypes';

interface ItemLocation {
  area: 'bag-left' | 'bag-right' | 'equipped';
  slotType?: SlotType;
}

export interface ActiveQuest {
  missionId: string;
  startTime: number;
  endTime: number;
  encounters: MissionEncounter[];
  currentEncounterIndex: number;
  status: 'traveling' | 'encounter' | 'completed' | 'failed';
  log: string[];
  regionId: string;
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
  activeQuest: ActiveQuest | null;
  // New stats systems
  special: SpecialStats;
  vitals: VitalStats;
  justice: JusticeStats;
  gameplay: GameplayStats;
  skills: PlayerSkills;
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
  startMission: (missionId: string) => boolean;
  completeMission: (missionId: string) => void;
  setSelectedRegion: (regionId: string | null) => void;
  isMissionCompleted: (missionId: string) => boolean;
  buyItem: (itemId: string, price: number) => boolean;
  sellItem: (itemId: string, sellPrice: number) => boolean;
  hasItem: (itemId: string) => boolean;
  processEncounter: (action: 'fight' | 'evade' | 'flee') => 'success' | 'fail' | 'none';
  abortQuest: () => void;
  useHealItem: (itemId: string) => void;
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
    activeQuest: null,
    special: { ...DEFAULT_SPECIAL },
    vitals: { ...DEFAULT_VITALS },
    justice: { ...DEFAULT_JUSTICE },
    gameplay: { ...DEFAULT_GAMEPLAY },
    skills: { ...DEFAULT_SKILLS },
  };
}

function generateQuestEncounters(mission: Mission, playerLevel: number): MissionEncounter[] {
  if (mission.encounters && mission.encounters.length > 0) {
    return mission.encounters.map(e => ({
      ...e,
      difficulty: Math.max(1, e.difficulty + Math.floor((playerLevel - mission.levelRequired) * 0.3)),
    }));
  }
  const count = Math.min(1 + Math.floor(mission.levelRequired / 5), 5);
  const types: MissionEncounter['type'][] = ['bandits', 'wildlife', 'weather', 'terrain'];
  const names: Record<string, string[]> = {
    bandits: ['Highway Bandits', 'Rustler Gang', 'Outlaw Posse'],
    wildlife: ['Rattlesnake', 'Wolf Pack', 'Grizzly Bear'],
    weather: ['Dust Storm', 'Heavy Rain', 'Scorching Heat'],
    terrain: ['Rockslide', 'Quicksand', 'Fallen Tree'],
  };
  const result: MissionEncounter[] = [];
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const nameList = names[type];
    result.push({
      type,
      name: nameList[Math.floor(Math.random() * nameList.length)],
      difficulty: mission.levelRequired + Math.floor(Math.random() * 3),
      description: `A ${type} encounter on the trail!`,
    });
  }
  return result;
}

// Calculate quest stat costs based on risk level
function getQuestCosts(mission: Mission) {
  const level = mission.levelRequired;
  const encounters = mission.encounters?.length || 0;
  if (level >= 50 || encounters >= 5) return { energy: 40, health: 35, hunger: 25, thirst: 30, sleep: 20, morale: -15 };
  if (level >= 20 || encounters >= 3) return { energy: 25, health: 20, hunger: 18, thirst: 20, sleep: 15, morale: -10 };
  if (level >= 8 || encounters >= 2) return { energy: 15, health: 10, hunger: 12, thirst: 12, sleep: 8, morale: -5 };
  return { energy: 8, health: 5, hunger: 8, thirst: 8, sleep: 5, morale: 5 };
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
        .select('character_name, archetype_id, portrait_id, trait_points, skill_points')
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
    // Apply SPECIAL bonuses
    current['health'] += (state.special.endurance - 5) * 20;
    current['energy'] += (state.special.endurance - 5) * 10;
    current['damage'] += (state.special.strength - 5) * 3;
    current['speed'] += (state.special.agility - 5) * 3;
    current['luck'] += (state.special.luck - 5) * 3;
    current['charisma'] += (state.special.charisma - 5) * 3;
    current['defense'] += (state.special.strength - 5) * 2;

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
  }, [state.itemLocations, state.totalXp, state.archetypeId, state.traitPoints, state.special]);

  const getCoinTotal = useCallback(() => {
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

  const startMission = useCallback((missionId: string): boolean => {
    let started = false;
    setState(s => {
      if (s.activeQuest && s.activeQuest.status !== 'completed' && s.activeQuest.status !== 'failed') return s;
      if (s.completedMissions.includes(missionId)) return s;

      let mission: Mission | undefined;
      let regionId = '';
      for (const region of mapRegions) {
        mission = region.missions.find(m => m.id === missionId);
        if (mission) { regionId = region.id; break; }
      }
      if (!mission) return s;

      const playerLevel = getLevelFromXp(s.totalXp).level;
      if (playerLevel < mission.levelRequired) return s;

      // Deduct initial energy for starting quest
      const costs = getQuestCosts(mission);
      const newVitals = { ...s.vitals };
      newVitals.energy = Math.max(0, newVitals.energy - Math.floor(costs.energy * 0.3));
      newVitals.hunger = Math.max(0, newVitals.hunger - Math.floor(costs.hunger * 0.2));
      newVitals.thirst = Math.max(0, newVitals.thirst - Math.floor(costs.thirst * 0.2));

      const encounters = generateQuestEncounters(mission, playerLevel);
      const now = Date.now();
      const durationMs = (mission.durationMinutes || 2) * 60 * 1000;

      started = true;
      return {
        ...s,
        vitals: newVitals,
        activeQuest: {
          missionId,
          startTime: now,
          endTime: now + durationMs,
          encounters,
          currentEncounterIndex: 0,
          status: 'traveling',
          log: [`-- Quest started: ${mission.name}`, `-- Estimated time: ${mission.durationMinutes} minutes`],
          regionId,
        },
      };
    });
    return started;
  }, []);

  const processEncounter = useCallback((action: 'fight' | 'evade' | 'flee'): 'success' | 'fail' | 'none' => {
    let result: 'success' | 'fail' | 'none' = 'none';
    setState(s => {
      if (!s.activeQuest || (s.activeQuest.status !== 'traveling' && s.activeQuest.status !== 'encounter')) return s;
      const quest = { ...s.activeQuest };
      const encounter = quest.encounters[quest.currentEncounterIndex];
      if (!encounter) return s;

      const stats = (() => {
        const playerLevel = getLevelFromXp(s.totalXp);
        const current = { ...STANDARD_STATS };
        for (const key of Object.keys(current)) current[key] += (playerLevel.level - 1) * 2;
        current['damage'] += (s.special.strength - 5) * 3;
        current['speed'] += (s.special.agility - 5) * 3;
        current['luck'] += (s.special.luck - 5) * 3;
        itemDatabase.forEach(item => {
          const loc = s.itemLocations[item.id];
          if (loc?.area === 'equipped') {
            for (const [sk, v] of Object.entries(item.stats)) {
              if (sk in current) current[sk] += v as number;
            }
          }
        });
        return current;
      })();

      const playerPower = (stats.damage || 10) + (stats.defense || 0) + (stats.speed || 0) + (stats.luck || 0);
      const encounterPower = encounter.difficulty * 15 + Math.random() * 20;

      // Apply encounter stat costs
      const newVitals = { ...s.vitals };
      let success = false;

      if (action === 'fight') {
        success = playerPower + Math.random() * 30 > encounterPower;
        // Fighting costs more energy and health
        newVitals.energy = Math.max(0, newVitals.energy - (5 + encounter.difficulty));
        newVitals.hunger = Math.max(0, newVitals.hunger - 3);
        newVitals.thirst = Math.max(0, newVitals.thirst - 4);
        if (!success) {
          newVitals.health = Math.max(0, newVitals.health - (10 + encounter.difficulty * 2));
          newVitals.morale = Math.max(0, newVitals.morale - 8);
        } else {
          newVitals.health = Math.max(0, newVitals.health - Math.floor(encounter.difficulty * 0.5));
          newVitals.morale = Math.min(100, newVitals.morale + 3);
        }
      } else if (action === 'evade') {
        const evadePower = (stats.speed || 5) * 2 + (stats.luck || 0) * 1.5;
        success = evadePower + Math.random() * 25 > encounterPower * 0.8;
        newVitals.energy = Math.max(0, newVitals.energy - (8 + encounter.difficulty));
        newVitals.thirst = Math.max(0, newVitals.thirst - 3);
        if (!success) {
          newVitals.health = Math.max(0, newVitals.health - (5 + encounter.difficulty));
          newVitals.morale = Math.max(0, newVitals.morale - 5);
        }
      } else if (action === 'flee') {
        success = (stats.speed || 5) + Math.random() * 40 > encounterPower * 0.5;
        newVitals.energy = Math.max(0, newVitals.energy - (10 + encounter.difficulty));
        newVitals.morale = Math.max(0, newVitals.morale - 10);
        newVitals.thirst = Math.max(0, newVitals.thirst - 5);
        if (!success) {
          newVitals.health = Math.max(0, newVitals.health - (8 + encounter.difficulty * 1.5));
        }
      }

      if (success) {
        const actionWord = action === 'fight' ? 'VICTORY' : action === 'evade' ? 'EVADED' : 'ESCAPED';
        quest.log = [...quest.log, `${action === 'fight' ? '++ ' : '>> '}${encounter.name}: ${actionWord}!`];
        quest.currentEncounterIndex++;
        quest.status = 'traveling';
        if (quest.currentEncounterIndex >= quest.encounters.length) {
          quest.log = [...quest.log, '>> All encounters cleared! Heading to destination...'];
        }
        result = 'success';
      } else {
        quest.status = 'failed';
        quest.log = [...quest.log, `XX ${encounter.name}: DEFEATED! You were injured and had to retreat.`];
        result = 'fail';
      }

      return { ...s, activeQuest: quest, vitals: newVitals };
    });
    return result;
  }, []);

  const abortQuest = useCallback(() => {
    setState(s => {
      const newVitals = { ...s.vitals };
      newVitals.morale = Math.max(0, newVitals.morale - 15);
      newVitals.energy = Math.max(0, newVitals.energy - 10);
      return { ...s, activeQuest: null, vitals: newVitals };
    });
  }, []);

  const useHealItem = useCallback((itemId: string) => {
    setState(s => {
      if (!s.itemLocations[itemId]) return s;
      const item = itemDatabase.find(i => i.id === itemId);
      const newLocs = { ...s.itemLocations };
      delete newLocs[itemId];
      // Apply item stats to vitals
      const newVitals = { ...s.vitals };
      if (item) {
        if (item.stats.health) newVitals.health = Math.min(100, Math.max(0, newVitals.health + item.stats.health));
        if (item.stats.energy) newVitals.energy = Math.min(100, Math.max(0, newVitals.energy + item.stats.energy));
        if (item.stats.thirst) newVitals.thirst = Math.min(100, Math.max(0, newVitals.thirst + item.stats.thirst));
        if (item.stats.sleep) newVitals.sleep = Math.min(100, Math.max(0, newVitals.sleep + item.stats.sleep));
        if (item.stats.hunger) newVitals.hunger = Math.min(100, Math.max(0, newVitals.hunger + item.stats.hunger));
        if (item.stats.morale) newVitals.morale = Math.min(100, Math.max(0, newVitals.morale + item.stats.morale));
        if (item.stats.hygiene) newVitals.hygiene = Math.min(100, Math.max(0, newVitals.hygiene + item.stats.hygiene));
      }
      const quest = s.activeQuest ? {
        ...s.activeQuest,
        log: [...s.activeQuest.log, `++ Used ${item?.name || 'item'} to restore vitals.`],
      } : null;
      return { ...s, itemLocations: newLocs, activeQuest: quest, vitals: newVitals };
    });
  }, []);

  const buyItem = useCallback((itemId: string, price: number): boolean => {
    let success = false;
    setState(s => {
      if (s.walletAmount < price) return s;
      if (s.itemLocations[itemId]) return s;
      const leftCount = Object.values(s.itemLocations).filter(l => l.area === 'bag-left').length;
      const rightCount = Object.values(s.itemLocations).filter(l => l.area === 'bag-right').length;
      const targetBag: 'bag-left' | 'bag-right' = leftCount <= rightCount ? 'bag-left' : 'bag-right';
      const targetCount = targetBag === 'bag-left' ? leftCount : rightCount;
      if (targetCount >= 20) return s;
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
      if (!s.itemLocations[itemId]) return s;
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

      // Apply completion costs to vitals
      const costs = getQuestCosts(mission);
      const newVitals = { ...s.vitals };
      newVitals.energy = Math.max(0, newVitals.energy - costs.energy);
      newVitals.health = Math.max(0, newVitals.health - costs.health);
      newVitals.hunger = Math.max(0, newVitals.hunger - costs.hunger);
      newVitals.thirst = Math.max(0, newVitals.thirst - costs.thirst);
      newVitals.sleep = Math.max(0, newVitals.sleep - costs.sleep);
      newVitals.morale = Math.min(100, Math.max(0, newVitals.morale + 10)); // completing boosts morale

      // Update skills based on quest type
      const newSkills = { ...s.skills };
      if (mission.type === 'Combat' || mission.type === 'Bounty') {
        newSkills.pistols = Math.min(100, newSkills.pistols + 1);
        newSkills.rifles = Math.min(100, newSkills.rifles + 1);
        newSkills.unarmed = Math.min(100, newSkills.unarmed + 1);
      }
      if (mission.type === 'Escort' || mission.type === 'Delivery') {
        newSkills.horsemanship = Math.min(100, newSkills.horsemanship + 1);
        newSkills.survival = Math.min(100, newSkills.survival + 1);
      }
      if (mission.type === 'Rescue' || mission.type === 'Investigation') {
        newSkills.speech = Math.min(100, newSkills.speech + 1);
        newSkills.firstAid = Math.min(100, newSkills.firstAid + 1);
      }

      // Justice impact
      const newJustice = { ...s.justice };
      if (mission.type === 'Bounty') {
        newJustice.honor = Math.min(100, newJustice.honor + 2);
        newJustice.gunReputation = Math.min(100, newJustice.gunReputation + 3);
      }

      return {
        ...s,
        completedMissions: [...s.completedMissions, missionId],
        totalXp: s.totalXp + mission.xpReward,
        walletAmount: s.walletAmount + mission.coinReward,
        activeQuest: null,
        vitals: newVitals,
        skills: newSkills,
        justice: newJustice,
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
      getPlayerLevel, startMission, completeMission, setSelectedRegion, isMissionCompleted,
      buyItem, sellItem, hasItem, processEncounter, abortQuest, useHealItem, loaded,
    }}>
      {children}
    </GameContext.Provider>
  );
}
