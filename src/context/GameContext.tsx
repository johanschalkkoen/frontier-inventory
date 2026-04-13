import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { type GameItem, type SlotType, itemDatabase, STANDARD_STATS, DEFAULT_VITALS, DEFAULT_JUSTICE, DEFAULT_GAMEPLAY, DEFAULT_SKILLS, type VitalStats, type JusticeStats, type GameplayStats, type PlayerSkills } from '@/data/gameData';
import { getLevelFromXp, mapRegions, type Mission, type MissionEncounter } from '@/data/mapData';
import { useAuth } from './AuthContext';
import { loadProgress, saveProgress, type SaveData } from '@/lib/progressSync';
import { supabase } from '@/integrations/supabase/client';
import { archetypes, TRAIT_STAT_MAP, type TraitCategory } from '@/data/archetypes';
import { STAT_CLASSES, getStatClassBonuses, UNSELLABLE_ITEMS } from '@/data/statClasses';

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
  statClassId: string;
  statClassValues: Record<string, number>;
  vitals: VitalStats;
  justice: JusticeStats;
  gameplay: GameplayStats;
  skills: PlayerSkills;
  unspentStatPoints: number;
  unspentClassPoints: number;
  horseEnergy: number;
  playTimeStart: number;
  totalPlayTime: number; // seconds accumulated
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
  spendStatPoint: (stat: string) => void;
  spendClassPoint: (attrKey: string) => void;
  restoreVital: (vital: keyof VitalStats, amount: number) => void;
  spendMoney: (amount: number) => boolean;
  refillCanteen: () => void;
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
    statClassId: 'grits',
    statClassValues: { guts: 5, resolve: 5, instinct: 5, toughness: 5, savvy: 5 },
    vitals: { ...DEFAULT_VITALS },
    justice: { ...DEFAULT_JUSTICE },
    gameplay: { ...DEFAULT_GAMEPLAY },
    skills: { ...DEFAULT_SKILLS },
    unspentStatPoints: 0,
    unspentClassPoints: 0,
    horseEnergy: 100,
    playTimeStart: Date.now(),
    totalPlayTime: 0,
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

function getQuestCosts(mission: Mission) {
  const level = mission.levelRequired;
  const encounters = mission.encounters?.length || 0;
  if (level >= 50 || encounters >= 5) return { energy: 40, health: 35, hunger: 25, thirst: 30, sleep: 20, morale: -15, horseEnergy: 35 };
  if (level >= 20 || encounters >= 3) return { energy: 25, health: 20, hunger: 18, thirst: 20, sleep: 15, morale: -10, horseEnergy: 25 };
  if (level >= 8 || encounters >= 2) return { energy: 15, health: 10, hunger: 12, thirst: 12, sleep: 8, morale: -5, horseEnergy: 15 };
  return { energy: 8, health: 5, hunger: 8, thirst: 8, sleep: 5, morale: 5, horseEnergy: 8 };
}

function getLawfulness(honor: number, infamy: number): JusticeStats['lawfulness'] {
  if (honor >= 80 && infamy < 20) return 'Lawman';
  if (honor >= 60 && infamy < 40) return 'Honest';
  if (honor <= 20 && infamy >= 60) return 'Bandit';
  if (honor <= 40 && infamy >= 40) return 'Outlaw';
  return 'Neutral';
}

// Loot table based on quest level
function rollQuestLoot(mission: Mission): string[] {
  const loot: string[] = [];
  const level = mission.levelRequired;
  // Filter items by level appropriateness
  const candidates = itemDatabase.filter(i => i.levelRequired <= level + 2 && i.value > 0);
  if (candidates.length === 0) return loot;
  
  // 60% chance of 1 item, 25% chance of 2, 10% chance of 3
  const roll = Math.random();
  const itemCount = roll < 0.05 ? 3 : roll < 0.30 ? 2 : roll < 0.90 ? 1 : 0;
  
  for (let i = 0; i < itemCount; i++) {
    // Weight by rarity
    const rarityWeights: Record<string, number> = { basic: 40, advanced: 30, rare: 15, epic: 10, legendary: 5 };
    const rarityRoll = Math.random() * 100;
    let targetRarity = 'basic';
    if (rarityRoll > 95) targetRarity = 'legendary';
    else if (rarityRoll > 85) targetRarity = 'epic';
    else if (rarityRoll > 70) targetRarity = 'rare';
    else if (rarityRoll > 40) targetRarity = 'advanced';
    
    const pool = candidates.filter(c => c.rarity === targetRarity);
    if (pool.length > 0) {
      const item = pool[Math.floor(Math.random() * pool.length)];
      if (!loot.includes(item.id)) loot.push(item.id);
    }
  }
  return loot;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<GameState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();
  const prevLevel = useRef<number>(1);

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
          const skillData = charResult.data.skill_points as any;
          
          let statClassId = 'grits';
          let statClassValues: Record<string, number> = { guts: 5, resolve: 5, instinct: 5, toughness: 5, savvy: 5 };
          
          if (skillData && skillData.statClassId) {
            statClassId = skillData.statClassId;
            statClassValues = skillData.statClassValues || statClassValues;
          }

          next = {
            ...next,
            characterName: charResult.data.character_name,
            archetypeId: charResult.data.archetype_id,
            traitPoints: (charResult.data.trait_points as Record<string, number>) || {},
            selectedCharacterId: charResult.data.portrait_id || next.selectedCharacterId,
            gender: arch?.gender || next.gender,
            statClassId,
            statClassValues,
          };
        }

        prevLevel.current = getLevelFromXp(next.totalXp).level;
        return { ...next, playTimeStart: Date.now() };
      });
      setLoaded(true);
    });
  }, [user]);

  // Level-up detection
  useEffect(() => {
    if (!loaded) return;
    const currentLevel = getLevelFromXp(state.totalXp).level;
    if (currentLevel > prevLevel.current) {
      const levelsGained = currentLevel - prevLevel.current;
      const oldLevel = prevLevel.current;
      prevLevel.current = currentLevel;
      // Count class points: 1 per 5 levels crossed
      let classPoints = 0;
      for (let l = oldLevel + 1; l <= currentLevel; l++) {
        if (l % 5 === 0) classPoints++;
      }
      setState(s => ({
        ...s,
        unspentStatPoints: s.unspentStatPoints + levelsGained, // 1 stat point per level
        unspentClassPoints: s.unspentClassPoints + classPoints, // 1 class point per 5 levels
        vitals: {
          ...s.vitals,
          health: Math.min(100, s.vitals.health + levelsGained * 3),
          energy: Math.min(100, s.vitals.energy + levelsGained * 3),
        },
      }));
    }
  }, [state.totalXp, loaded]);

  // Vital regeneration & decay timer (every 30 seconds)
  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(() => {
      setState(s => {
        const v = { ...s.vitals };
        // Slow regen
        v.health = Math.min(100, v.health + 1);
        v.energy = Math.min(100, v.energy + 0.5);
        // Slow decay
        v.sleep = Math.max(0, v.sleep - 0.5);
        v.hygiene = Math.max(0, v.hygiene - 0.3);
        v.hunger = Math.max(0, v.hunger - 0.3);
        v.thirst = Math.max(0, v.thirst - 0.4);
        // Low hunger/thirst penalties
        if (v.hunger < 30) v.energy = Math.max(0, v.energy - 0.5);
        if (v.thirst < 30) v.energy = Math.max(0, v.energy - 0.5);
        if (v.hunger < 10) v.health = Math.max(1, v.health - 0.5);
        if (v.thirst < 10) v.health = Math.max(1, v.health - 1);
        if (v.sleep < 10) v.morale = Math.max(0, v.morale - 0.5);
        // Horse energy regen
        const he = Math.min(100, s.horseEnergy + 0.5);
        // Play time
        const elapsed = Math.floor((Date.now() - s.playTimeStart) / 1000);
        return { ...s, vitals: v, horseEnergy: he, totalPlayTime: s.totalPlayTime + 30 };
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [loaded]);

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

  // Utility slots that accept various item types
  const POCKET_SLOTS: SlotType[] = ['pocket1', 'pocket2', 'pocket3'];
  const BELT_SLOTS: SlotType[] = ['belt1', 'belt2', 'belt3', 'belt4', 'belt5'];
  const UTILITY_SLOTS: SlotType[] = [...POCKET_SLOTS, ...BELT_SLOTS, 'shovel', 'special'];

  const equipItem = useCallback((itemId: string) => {
    const item = itemDatabase.find(i => i.id === itemId);
    if (!item) return;
    setState(s => {
      const locs = { ...s.itemLocations };

      // Determine which slot(s) this item can go into
      let targetSlot: SlotType = item.type;

      // Items whose native type is a utility slot go directly there
      if (UTILITY_SLOTS.includes(item.type)) {
        targetSlot = item.type;
      }
      // Ammo items → find first empty belt slot
      else if (item.category === 'ammo') {
        const emptyBelt = BELT_SLOTS.find(slot =>
          !Object.values(locs).some(loc => loc.area === 'equipped' && loc.slotType === slot)
        );
        targetSlot = emptyBelt || 'belt1';
      }
      // Edibles (food, drink, medicine) → find first empty pocket, then belt
      else if (['food', 'drink', 'medicine'].includes(item.category)) {
        const emptyPocket = POCKET_SLOTS.find(slot =>
          !Object.values(locs).some(loc => loc.area === 'equipped' && loc.slotType === slot)
        );
        if (emptyPocket) {
          targetSlot = emptyPocket;
        } else {
          const emptyBelt = BELT_SLOTS.find(slot =>
            !Object.values(locs).some(loc => loc.area === 'equipped' && loc.slotType === slot)
          );
          targetSlot = emptyBelt || 'pocket1';
        }
      }
      // EDC / luxury / valuable → pockets first, then belt, then special
      else if (['edc', 'luxury', 'valuable'].includes(item.category)) {
        const emptyPocket = POCKET_SLOTS.find(slot =>
          !Object.values(locs).some(loc => loc.area === 'equipped' && loc.slotType === slot)
        );
        if (emptyPocket) {
          targetSlot = emptyPocket;
        } else {
          targetSlot = 'special';
        }
      }

      // Swap out existing item in that slot
      const existing = Object.entries(locs).find(([, loc]) => loc.area === 'equipped' && loc.slotType === targetSlot);
      if (existing) { locs[existing[0]] = { area: 'bag-left' }; }
      locs[itemId] = { area: 'equipped', slotType: targetSlot };
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
    const classBonuses = getStatClassBonuses(state.statClassId, state.statClassValues);
    for (const [key, val] of Object.entries(classBonuses)) {
      if (key in current) current[key] += val;
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
  }, [state.itemLocations, state.totalXp, state.archetypeId, state.traitPoints, state.statClassId, state.statClassValues]);

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

  // Spend stat point on base stats (damage, defense, speed, luck, charisma)
  const spendStatPoint = useCallback((stat: string) => {
    const validStats = ['damage', 'defense', 'speed', 'luck', 'charisma'];
    if (!validStats.includes(stat)) return;
    setState(s => {
      if (s.unspentStatPoints <= 0) return s;
      return {
        ...s,
        unspentStatPoints: s.unspentStatPoints - 1,
      };
    });
  }, []);

  // Spend class point on class attributes (every 5 levels)
  const spendClassPoint = useCallback((attrKey: string) => {
    setState(s => {
      if (s.unspentClassPoints <= 0) return s;
      const sc = STAT_CLASSES.find(c => c.id === s.statClassId);
      if (!sc) return s;
      const attr = sc.attributes.find(a => a.key === attrKey);
      if (!attr) return s;
      const currentVal = s.statClassValues[attrKey] || 1;
      if (currentVal >= 10) return s;
      return {
        ...s,
        unspentClassPoints: s.unspentClassPoints - 1,
        statClassValues: { ...s.statClassValues, [attrKey]: currentVal + 1 },
      };
    });
  }, []);

  const restoreVital = useCallback((vital: keyof VitalStats, amount: number) => {
    setState(s => ({
      ...s,
      vitals: { ...s.vitals, [vital]: Math.min(100, Math.max(0, s.vitals[vital] + amount)) },
    }));
  }, []);

  const spendMoney = useCallback((amount: number): boolean => {
    let success = false;
    setState(s => {
      if (s.walletAmount < amount) return s;
      success = true;
      return { ...s, walletAmount: s.walletAmount - amount };
    });
    return success;
  }, []);

  const refillCanteen = useCallback(() => {
    setState(s => ({
      ...s,
      vitals: { ...s.vitals, thirst: Math.min(100, s.vitals.thirst + 40) },
    }));
  }, []);

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

      // Health check - can't start if health too low
      if (s.vitals.health < 20) return s;
      // Energy check
      if (s.vitals.energy < 10) return s;

      // Morality check
      if (mission.morality === 'good' && s.justice.honor < 20) return s;
      if (mission.morality === 'bad' && s.justice.honor > 80) return s;

      const costs = getQuestCosts(mission);
      const newVitals = { ...s.vitals };
      newVitals.energy = Math.max(0, newVitals.energy - Math.floor(costs.energy * 0.3));
      newVitals.hunger = Math.max(0, newVitals.hunger - Math.floor(costs.hunger * 0.2));
      newVitals.thirst = Math.max(0, newVitals.thirst - Math.floor(costs.thirst * 0.2));

      // Horse energy check
      const hasHorse = itemDatabase.some(item => {
        const loc = s.itemLocations[item.id];
        return loc && item.name.toLowerCase().includes('saddle');
      });
      let newHorseEnergy = s.horseEnergy;
      if (hasHorse) {
        if (s.horseEnergy < 10) return s; // Horse too tired
        newHorseEnergy = Math.max(0, s.horseEnergy - Math.floor(costs.horseEnergy * 0.3));
      }

      const encounters = generateQuestEncounters(mission, playerLevel);
      const now = Date.now();
      const durationMs = (mission.durationMinutes || 2) * 60 * 1000;

      started = true;
      return {
        ...s,
        vitals: newVitals,
        horseEnergy: newHorseEnergy,
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
        const classBonuses = getStatClassBonuses(s.statClassId, s.statClassValues);
        for (const [key, val] of Object.entries(classBonuses)) {
          if (key in current) current[key] += val;
        }
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

      const newVitals = { ...s.vitals };
      let success = false;

      // Weapon misfire chance (5% per encounter)
      const misfire = Math.random() < 0.05;
      if (misfire && action === 'fight') {
        quest.log = [...quest.log, `!! Your weapon misfired! Reduced combat effectiveness.`];
      }

      if (action === 'fight') {
        const misfirePenalty = misfire ? 0.6 : 1;
        success = (playerPower * misfirePenalty) + Math.random() * 30 > encounterPower;
        newVitals.energy = Math.max(0, newVitals.energy - (5 + encounter.difficulty));
        newVitals.hunger = Math.max(0, newVitals.hunger - 3);
        newVitals.thirst = Math.max(0, newVitals.thirst - 4);
        if (!success) {
          newVitals.health = Math.max(1, newVitals.health - (10 + encounter.difficulty * 2)); // Can't go below 1
          newVitals.morale = Math.max(0, newVitals.morale - 8);
        } else {
          newVitals.health = Math.max(1, newVitals.health - Math.floor(encounter.difficulty * 0.5));
          newVitals.morale = Math.min(100, newVitals.morale + 3);
        }
      } else if (action === 'evade') {
        const evadePower = (stats.speed || 5) * 2 + (stats.luck || 0) * 1.5;
        success = evadePower + Math.random() * 25 > encounterPower * 0.8;
        newVitals.energy = Math.max(0, newVitals.energy - (8 + encounter.difficulty));
        newVitals.thirst = Math.max(0, newVitals.thirst - 3);
        if (!success) {
          newVitals.health = Math.max(1, newVitals.health - (5 + encounter.difficulty));
          newVitals.morale = Math.max(0, newVitals.morale - 5);
        }
      } else if (action === 'flee') {
        success = (stats.speed || 5) + Math.random() * 40 > encounterPower * 0.5;
        newVitals.energy = Math.max(0, newVitals.energy - (10 + encounter.difficulty));
        newVitals.morale = Math.max(0, newVitals.morale - 10);
        newVitals.thirst = Math.max(0, newVitals.thirst - 5);
        if (!success) {
          newVitals.health = Math.max(1, newVitals.health - (8 + encounter.difficulty * 1.5));
        }
      }

      // Auto-flee at health < 10
      if (newVitals.health < 10) {
        quest.status = 'failed';
        quest.log = [...quest.log, `!! Health critical — you barely escaped with your life!`];
        result = 'fail';
        return { ...s, activeQuest: quest, vitals: newVitals };
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
      // Shop only sells basic, advanced, legendary
      const item = itemDatabase.find(i => i.id === itemId);
      if (item && (item.rarity === 'rare' || item.rarity === 'epic')) return s;
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
      // Can't sell indestructible/unsellable items
      if (UNSELLABLE_ITEMS.includes(itemId)) return s;
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

      const costs = getQuestCosts(mission);
      const newVitals = { ...s.vitals };
      newVitals.energy = Math.max(0, newVitals.energy - costs.energy);
      newVitals.health = Math.max(1, newVitals.health - costs.health);
      newVitals.hunger = Math.max(0, newVitals.hunger - costs.hunger);
      newVitals.thirst = Math.max(0, newVitals.thirst - costs.thirst);
      newVitals.sleep = Math.max(0, newVitals.sleep - costs.sleep);
      newVitals.morale = Math.min(100, Math.max(0, newVitals.morale + 10));
      newVitals.hygiene = Math.max(0, newVitals.hygiene - 5); // Quests make you dirty

      // Horse energy depletion
      const hasHorse = itemDatabase.some(item => {
        const loc = s.itemLocations[item.id];
        return loc && item.name.toLowerCase().includes('saddle');
      });
      let newHorseEnergy = s.horseEnergy;
      if (hasHorse) {
        newHorseEnergy = Math.max(0, s.horseEnergy - costs.horseEnergy);
      }

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
      if (mission.type === 'Investigation') {
        newSkills.speech = Math.min(100, newSkills.speech + 1);
        newSkills.firstAid = Math.min(100, newSkills.firstAid + 1);
      }

      // Western Justice effects based on morality
      const newJustice = { ...s.justice };
      const morality = mission.morality || 'neutral';
      
      // All quests increase infamy and gun rep
      newJustice.infamy = Math.min(100, newJustice.infamy + 2);
      newJustice.gunReputation = Math.min(100, newJustice.gunReputation + 2);

      if (morality === 'good') {
        newJustice.honor = Math.min(100, newJustice.honor + 5);
        if (mission.type === 'Bounty') {
          newJustice.honor = Math.min(100, newJustice.honor + 3);
          newJustice.gunReputation = Math.min(100, newJustice.gunReputation + 3);
        }
        // Reduce wanted level for good deeds
        if (newJustice.wantedLevel > 0 && Math.random() < 0.3) {
          newJustice.wantedLevel = Math.max(0, newJustice.wantedLevel - 1);
        }
      } else if (morality === 'bad') {
        newJustice.honor = Math.max(0, newJustice.honor - 5);
        newJustice.bounty += Math.floor(mission.coinReward * 0.5);
        newJustice.wantedLevel = Math.min(5, newJustice.wantedLevel + 1);
        newJustice.infamy = Math.min(100, newJustice.infamy + 5);
      } else {
        // Neutral quests - slight honor/rep
        newJustice.honor = Math.min(100, newJustice.honor + 1);
      }

      // Update lawfulness based on honor/infamy
      newJustice.lawfulness = getLawfulness(newJustice.honor, newJustice.infamy);

      // Bounty quest pays bounty TO player
      let extraReward = 0;
      if (mission.type === 'Bounty' && morality !== 'bad') {
        extraReward = Math.floor(mission.coinReward * 0.5);
      }

      // Roll loot
      const lootedItemIds = rollQuestLoot(mission);
      const newLocs = { ...s.itemLocations };
      for (const lootId of lootedItemIds) {
        if (!newLocs[lootId]) {
          const leftCount = Object.values(newLocs).filter(l => l.area === 'bag-left').length;
          const rightCount = Object.values(newLocs).filter(l => l.area === 'bag-right').length;
          const targetBag: 'bag-left' | 'bag-right' = leftCount <= rightCount ? 'bag-left' : 'bag-right';
          if ((targetBag === 'bag-left' ? leftCount : rightCount) < 20) {
            newLocs[lootId] = { area: targetBag };
          }
        }
      }

      return {
        ...s,
        completedMissions: [...s.completedMissions, missionId],
        totalXp: s.totalXp + mission.xpReward,
        walletAmount: s.walletAmount + mission.coinReward + extraReward,
        activeQuest: null,
        vitals: newVitals,
        skills: newSkills,
        justice: newJustice,
        horseEnergy: newHorseEnergy,
        itemLocations: newLocs,
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
      buyItem, sellItem, hasItem, processEncounter, abortQuest, useHealItem, spendStatPoint,
      spendClassPoint, restoreVital, spendMoney, refillCanteen, loaded,
    }}>
      {children}
    </GameContext.Provider>
  );
}
