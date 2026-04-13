import { useGame } from '@/context/GameContext';
import { mapRegions, type DigSpot } from '@/data/mapData';
import { itemDatabase } from '@/data/gameData';
import { useState, useMemo } from 'react';
import { MapPin, Lock, ChevronLeft, ZoomIn, ZoomOut, Shovel } from 'lucide-react';
import westernMapImg from '@/assets/western-map.jpg';
import { toast } from 'sonner';

type MapLevel = 'global' | 'regional' | 'town';

const dangerColors: Record<string, string> = {
  Low: 'text-rarity-advanced', Medium: 'text-accent', High: 'text-rarity-epic',
  Extreme: 'text-destructive', Deadly: 'text-destructive',
};

// Dynamic region groupings from actual data
const regionGroups: Record<string, { name: string; description: string; x: number; y: number; terrain: string; levelRange: string }> = {
  'frontier': { name: 'The Frontier', description: 'Dusty towns and open plains where new cowboys begin.', x: 50, y: 80, terrain: 'Plains & Towns', levelRange: '1-5' },
  'territories': { name: 'The Territories', description: 'Saloon towns, forts, and haunted valleys.', x: 28, y: 55, terrain: 'Towns & Valleys', levelRange: '6-15' },
  'badlands': { name: 'The Badlands', description: 'Scorching deserts and treacherous gorges.', x: 72, y: 28, terrain: 'Desert & Gorge', levelRange: '16-30' },
  'wilds': { name: 'The Wilds', description: 'Untamed rivers, sacred canyons, and storm-lashed peaks.', x: 38, y: 14, terrain: 'Mountains & Rivers', levelRange: '30-50' },
  'deep-frontier': { name: 'The Deep Frontier', description: 'Cursed valleys and lawless railroad towns.', x: 62, y: 6, terrain: 'Wilderness', levelRange: '50-70' },
  'outlaw-wastes': { name: 'The Outlaw Wastes', description: 'Ghost cities, impossible mountains, and the legendary El Dorado.', x: 50, y: 2, terrain: 'Legendary', levelRange: '70-100' },
};

function getGroupForRegion(levelReq: number): string {
  if (levelReq <= 5) return 'frontier';
  if (levelReq <= 15) return 'territories';
  if (levelReq <= 30) return 'badlands';
  if (levelReq <= 50) return 'wilds';
  if (levelReq <= 70) return 'deep-frontier';
  return 'outlaw-wastes';
}

// Town features for local-level view
const townFeatures: Record<string, { name: string; icon: string; x: number; y: number; hasQuests?: boolean }[]> = {
  'dusty-gulch': [
    { name: 'Silver Dollar Saloon', icon: '⌂', x: 40, y: 35, hasQuests: true },
    { name: "Sheriff's Office", icon: '★', x: 60, y: 30, hasQuests: true },
    { name: 'General Store', icon: '⊞', x: 30, y: 55 },
    { name: 'Livery Stable', icon: '⊳', x: 70, y: 60 },
    { name: 'Church', icon: '†', x: 50, y: 20 },
    { name: 'Boarding House', icon: '⌂', x: 20, y: 40 },
  ],
  'deadwood-saloon': [
    { name: 'Gambling Hall', icon: '✦', x: 45, y: 30, hasQuests: true },
    { name: 'Gunsmith', icon: '⌁', x: 25, y: 45 },
    { name: 'Bank', icon: '$', x: 65, y: 35 },
    { name: "Doctor's Office", icon: '+', x: 35, y: 60 },
    { name: 'Telegraph Office', icon: '≡', x: 55, y: 55 },
    { name: 'Hotel & Bathhouse', icon: '⌂', x: 75, y: 50, hasQuests: true },
  ],
  'tombstone-ridge': [
    { name: "Marshal's Post", icon: '★', x: 50, y: 25, hasQuests: true },
    { name: 'Jail', icon: '▣', x: 60, y: 30, hasQuests: true },
    { name: 'Assay Office', icon: '⚖', x: 30, y: 40 },
    { name: 'Undertaker', icon: '⊗', x: 70, y: 55 },
    { name: 'Blacksmith', icon: '⚒', x: 40, y: 65 },
    { name: 'Dance Hall', icon: '♪', x: 20, y: 50 },
  ],
  'iron-horse-junction': [
    { name: 'Railroad Depot', icon: '═', x: 50, y: 70, hasQuests: true },
    { name: 'Freight Office', icon: '⊞', x: 35, y: 45 },
    { name: "Workers' Camp", icon: '△', x: 65, y: 40, hasQuests: true },
    { name: 'Dynamite Storage', icon: '※', x: 20, y: 30 },
    { name: 'Chop House', icon: '≡', x: 55, y: 25 },
    { name: 'Land Office', icon: '⌂', x: 75, y: 35 },
  ],
};

export function WorldMap() {
  const { state, getPlayerLevel, isMissionCompleted, setSelectedRegion, hasItem, addItemToBag, restoreVital } = useGame();
  const { level } = getPlayerLevel();
  const [mapLevel, setMapLevel] = useState<MapLevel>('global');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [dugSpots, setDugSpots] = useState<Set<string>>(new Set());

  const selectedRegion = mapRegions.find(r => r.id === state.selectedRegionId);
  const activeQuest = state.activeQuest;

  const hasShovel = hasItem('item-300') || hasItem('item-301') || hasItem('item-302') || hasItem('item-303');

  const handleDig = (spot: DigSpot) => {
    if (!hasShovel) {
      toast.error('You need a shovel to dig here!');
      return;
    }
    if (level < spot.levelRequired) {
      toast.error(`Requires level ${spot.levelRequired}`);
      return;
    }
    if (dugSpots.has(spot.id)) {
      toast.info('You already dug here. Nothing left.');
      return;
    }
    // Check energy
    if ((state.vitals?.energy ?? 100) < 10) {
      toast.error('Too exhausted to dig! Rest first.');
      return;
    }
    // Deduct energy for digging
    restoreVital('energy', -8);

    const roll = Math.random();
    let cumChance = 0;
    for (const loot of spot.lootTable) {
      cumChance += loot.chance;
      if (roll <= cumChance) {
        const added = addItemToBag(loot.itemId);
        const { itemDatabase } = require('@/data/gameData');
        const foundItem = itemDatabase.find((i: any) => i.id === loot.itemId);
        const itemName = foundItem?.name || 'something';
        if (added) {
          toast.success(`⛏️ You dug up: ${itemName}!`, { description: 'Check your saddlebags.' });
        } else {
          toast.success(`⛏️ You found: ${itemName}! (already in bag)`);
        }
        setDugSpots(prev => new Set(prev).add(spot.id));
        return;
      }
    }
    setDugSpots(prev => new Set(prev).add(spot.id));
    toast.info('Nothing but dirt and rocks... 🪨');
  };

  // ============== TOWN / LOCAL VIEW ==============
  if (selectedRegion && mapLevel === 'town') {
    const features = townFeatures[selectedRegion.id] || [];
    const regionMissions = selectedRegion.missions;
    const questCount = regionMissions.filter(m => !isMissionCompleted(m.id)).length;
    const digSpots = selectedRegion.digSpots || [];

    return (
      <div className="flex-1 border-2 border-game-slot-border p-3 md:p-4" style={{ background: 'linear-gradient(180deg, hsl(30 20% 10%) 0%, hsl(25 25% 8%) 100%)' }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-3 text-[10px] flex-wrap">
          <button onClick={() => { setMapLevel('global'); setSelectedRegion(null); setSelectedGroupId(null); }}
            className="text-primary hover:text-accent transition-colors font-bold">🗺️ World</button>
          <span className="text-muted-foreground">/</span>
          <button onClick={() => { setMapLevel('regional'); setSelectedRegion(null); }}
            className="text-primary hover:text-accent transition-colors font-bold">
            {selectedGroupId ? regionGroups[selectedGroupId]?.name : 'Region'}
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-accent font-bold">{selectedRegion.name}</span>
        </div>

        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h2 className="font-display text-base md:text-lg font-bold text-accent">{selectedRegion.name}</h2>
          <span className={`text-[10px] font-bold ${dangerColors[selectedRegion.dangerLevel]}`}>⚠ {selectedRegion.dangerLevel}</span>
          {questCount > 0 && <span className="text-[9px] text-primary font-bold bg-primary/10 px-2 py-0.5 border border-primary/30">{questCount} quests</span>}
          {digSpots.length > 0 && <span className="text-[9px] text-accent font-bold bg-accent/10 px-2 py-0.5 border border-accent/30">⛏️ {digSpots.length} dig spots</span>}
        </div>
        <p className="text-[10px] text-muted-foreground mb-3">{selectedRegion.description}</p>

        {/* Local map */}
        <div className="relative w-full h-[250px] md:h-[300px] bg-game-slot border-2 border-game-slot-border mb-3 overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at center, hsl(30 25% 18%) 0%, hsl(25 20% 10%) 100%)' }}>
          {/* Dirt roads */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M5,50 L95,50" stroke="hsl(30 25% 28%)" strokeWidth="3" fill="none" />
            <path d="M50,5 L50,95" stroke="hsl(30 25% 28%)" strokeWidth="2.5" fill="none" />
            <path d="M15,25 L85,75" stroke="hsl(30 18% 23%)" strokeWidth="1.5" fill="none" strokeDasharray="3,2" />
            <path d="M10,15 L40,15" stroke="hsl(25 30% 25%)" strokeWidth="0.5" fill="none" />
            <path d="M60,85 L90,85" stroke="hsl(25 30% 25%)" strokeWidth="0.5" fill="none" />
          </svg>

          {/* Scenery */}
          <div className="absolute text-lg opacity-20" style={{ left: '8%', top: '12%' }}>🌵</div>
          <div className="absolute text-sm opacity-15" style={{ left: '85%', top: '18%' }}>🌵</div>
          <div className="absolute text-sm opacity-10" style={{ left: '92%', top: '75%' }}>🪨</div>

          {/* Dig spots */}
          {digSpots.map((spot) => (
            <button key={spot.id}
              onClick={() => handleDig(spot)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}>
              <div className="relative">
                <span className="text-sm opacity-60 group-hover:opacity-100 transition-opacity group-hover:scale-125 inline-block transition-transform">⛏️</span>
                {hasShovel && <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />}
              </div>
            </button>
          ))}

          {/* Buildings */}
          {features.map((f, i) => {
            const featureQuests = regionMissions.filter(m => !isMissionCompleted(m.id));
            const hasAvailableQuests = f.hasQuests && featureQuests.length > 0;
            return (
              <div key={i} className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
                onMouseEnter={() => setHoveredFeature(f.name)}
                onMouseLeave={() => setHoveredFeature(null)}>
                <div className="flex flex-col items-center cursor-default relative">
                  {hasAvailableQuests && (
                    <div className="absolute -top-1 -right-2 w-3 h-3 bg-primary rounded-full animate-pulse flex items-center justify-center">
                      <span className="text-[6px] text-primary-foreground font-bold">!</span>
                    </div>
                  )}
                  <span className="text-xl drop-shadow-lg transition-transform group-hover:scale-125">{f.icon}</span>
                  <span className="text-[7px] text-foreground font-bold mt-0.5 bg-game-slot/90 px-1.5 py-0.5 whitespace-nowrap border border-game-slot-border/50">{f.name}</span>
                  {hoveredFeature === f.name && hasAvailableQuests && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-game-slot border border-primary p-2 z-20 w-36 animate-fade-in">
                      <div className="text-[9px] font-bold text-accent">{f.name}</div>
                      <div className="text-[8px] text-primary mt-0.5">📜 Quests available here</div>
                      <div className="text-[7px] text-muted-foreground mt-0.5">Check Quests tab to start</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {activeQuest && activeQuest.regionId === selectedRegion.id && activeQuest.status !== 'completed' && activeQuest.status !== 'failed' && (
            <div className="absolute bottom-3 left-3 bg-primary/20 border border-primary px-2 py-1 flex items-center gap-1.5 animate-pulse">
              <span className="text-sm">🏇</span>
              <span className="text-[8px] text-primary font-bold">Quest in progress</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setMapLevel('regional'); setSelectedRegion(null); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-game-slot border border-game-slot-border text-[10px] font-bold text-foreground hover:border-primary transition-colors">
            <ZoomOut className="w-3 h-3" /> Back to Region
          </button>
          <button onClick={() => { setMapLevel('global'); setSelectedRegion(null); setSelectedGroupId(null); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-game-slot border border-game-slot-border text-[10px] font-bold text-foreground hover:border-primary transition-colors">
            <MapPin className="w-3 h-3" /> World Map
          </button>
        </div>
      </div>
    );
  }

  // ============== REGIONAL VIEW ==============
  if (selectedGroupId && mapLevel === 'regional') {
    const group = regionGroups[selectedGroupId];
    const regions = mapRegions.filter(r => getGroupForRegion(r.levelRequired) === selectedGroupId);

    return (
      <div className="flex-1 border-2 border-game-slot-border p-3 md:p-4" style={{ background: 'linear-gradient(180deg, hsl(30 20% 10%) 0%, hsl(25 25% 8%) 100%)' }}>
        <div className="flex items-center gap-2 mb-3 text-[10px]">
          <button onClick={() => { setMapLevel('global'); setSelectedGroupId(null); }}
            className="text-primary hover:text-accent transition-colors font-bold">🗺️ World</button>
          <span className="text-muted-foreground">/</span>
          <span className="text-accent font-bold">{group.name}</span>
        </div>

        <h2 className="font-display text-base md:text-lg font-bold text-accent mb-1">{group.name}</h2>
        <p className="text-[10px] text-muted-foreground mb-3">{group.description} — {group.terrain} — Levels {group.levelRange}</p>

        {/* Regional map */}
        <div className="relative w-full h-[220px] md:h-[280px] bg-game-slot border-2 border-game-slot-border mb-3 overflow-hidden"
          style={{ background: `radial-gradient(ellipse at 50% 50%, hsl(30 30% 18%) 0%, hsl(25 20% 10%) 100%)` }}>
          <div className="absolute inset-0 opacity-8"
            style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, hsl(30 20% 22%) 30px, hsl(30 20% 22%) 31px)` }} />

          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {regions.map((r, i) => {
              if (i < regions.length - 1) {
                const rx = 8 + (i * 84 / Math.max(1, regions.length - 1));
                const ry = 20 + Math.sin(i * 0.8) * 20 + (i % 3) * 10;
                const nx = 8 + ((i + 1) * 84 / Math.max(1, regions.length - 1));
                const ny = 20 + Math.sin((i + 1) * 0.8) * 20 + ((i + 1) % 3) * 10;
                return <path key={i} d={`M${rx},${ry} L${nx},${ny}`} stroke="hsl(30 20% 25%)" strokeWidth="0.5" fill="none" strokeDasharray="2,1" />;
              }
              return null;
            })}
          </svg>

          {regions.map((region, i) => {
            const unlocked = level >= region.levelRequired;
            const completedCount = region.missions.filter(m => isMissionCompleted(m.id)).length;
            const allComplete = completedCount === region.missions.length;
            const availableQuests = region.missions.filter(m => !isMissionCompleted(m.id)).length;
            const isQuestHere = activeQuest?.regionId === region.id;
            const digCount = region.digSpots?.length || 0;
            const rx = 8 + (i * 84 / Math.max(1, regions.length - 1));
            const ry = 20 + Math.sin(i * 0.8) * 20 + (i % 3) * 10;

            return (
              <button key={region.id}
                onClick={() => { if (unlocked) { setSelectedRegion(region.id); setMapLevel('town'); } }}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                style={{ left: `${rx}%`, top: `${ry}%` }}
                disabled={!unlocked}>
                {isQuestHere && <div className="absolute -inset-3 bg-primary/20 rounded-full animate-pulse" />}
                <div className={`relative w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  !unlocked ? 'bg-game-slot-border border-game-slot-border' :
                  allComplete ? 'bg-rarity-advanced border-rarity-advanced' :
                  'bg-primary border-accent group-hover:scale-125'
                }`}>
                  {unlocked ? <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" /> : <Lock className="w-2 h-2 md:w-3 md:h-3 text-muted-foreground" />}
                  {digCount > 0 && unlocked && hasShovel && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-[5px]">⛏️</span>
                    </div>
                  )}
                </div>
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                  <span className={`text-[7px] md:text-[8px] font-bold block ${unlocked ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                    {region.name.length > 14 ? region.name.slice(0, 12) + '…' : region.name.toUpperCase()}
                  </span>
                  {unlocked && <span className="text-[6px] md:text-[7px] text-muted-foreground">{completedCount}/{region.missions.length}</span>}
                  {!unlocked && <span className="text-[6px] md:text-[7px] text-muted-foreground">LVL {region.levelRequired}</span>}
                </div>

                {hoveredRegion === region.id && unlocked && (
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-game-slot border border-primary p-2 z-20 w-44 animate-fade-in">
                    <div className="text-[10px] font-bold text-accent">{region.name}</div>
                    <div className="text-[8px] text-muted-foreground">{region.terrain} • {region.dangerLevel}</div>
                    {availableQuests > 0 && <div className="text-[8px] text-primary mt-0.5">📜 {availableQuests} quests</div>}
                    {digCount > 0 && <div className="text-[8px] text-accent mt-0.5">⛏️ {digCount} dig spots</div>}
                    <div className="flex items-center gap-1 mt-1 text-accent">
                      <ZoomIn className="w-3 h-3" />
                      <span className="text-[7px]">Click to enter</span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}

          <div className="absolute bottom-2 right-2 text-accent/30 font-display text-[9px] font-bold">
            <div className="text-center">N</div>
            <div className="flex gap-2"><span>W</span><span>✦</span><span>E</span></div>
            <div className="text-center">S</div>
          </div>
        </div>

        {/* Region list */}
        <div className="flex flex-col gap-1 max-h-[180px] overflow-y-auto">
          {regions.map(region => {
            const unlocked = level >= region.levelRequired;
            const completedCount = region.missions.filter(m => isMissionCompleted(m.id)).length;
            const availableQuests = region.missions.filter(m => !isMissionCompleted(m.id)).length;
            const digCount = region.digSpots?.length || 0;
            return (
              <button key={region.id}
                onClick={() => { if (unlocked) { setSelectedRegion(region.id); setMapLevel('town'); } }}
                disabled={!unlocked}
                className={`flex items-center justify-between p-1.5 md:p-2 border transition-all text-left ${
                  unlocked ? 'bg-game-slot border-game-slot-border hover:border-primary cursor-pointer' : 'bg-game-slot/30 border-game-slot-border/30 opacity-50'
                }`}>
                <div className="flex items-center gap-2">
                  <MapPin className={`w-3 h-3 ${unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-[10px] md:text-xs font-bold text-foreground">{region.name}</span>
                  <span className={`text-[8px] ${dangerColors[region.dangerLevel]}`}>{region.dangerLevel}</span>
                </div>
                <div className="flex items-center gap-2">
                  {availableQuests > 0 && unlocked && <span className="text-[8px] text-primary">📜 {availableQuests}</span>}
                  {digCount > 0 && unlocked && <span className="text-[8px] text-accent">⛏️ {digCount}</span>}
                  <span className="text-[8px] text-muted-foreground">{completedCount}/{region.missions.length}</span>
                  {unlocked && <ZoomIn className="w-3 h-3 text-accent" />}
                  {!unlocked && <span className="text-[8px] text-muted-foreground">LVL {region.levelRequired}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ============== GLOBAL VIEW ==============
  const groupEntries = Object.entries(regionGroups);

  return (
    <div className="flex-1 border-2 border-game-slot-border p-3 md:p-4" style={{ background: 'linear-gradient(180deg, hsl(30 20% 10%) 0%, hsl(25 25% 8%) 100%)' }}>
      <h2 className="font-display text-base md:text-lg font-bold text-accent mb-3 text-center">🗺️ THE FRONTIER — WORLD MAP</h2>
      <p className="text-center text-[9px] text-muted-foreground mb-2">{mapRegions.length} locations across 6 regions</p>

      <div className="relative w-full h-[350px] md:h-[450px] border-2 border-game-slot-border overflow-hidden">
        <img src={westernMapImg} alt="Frontier Map" className="absolute inset-0 w-full h-full object-cover opacity-60" width={1024} height={768} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, hsl(25 20% 8% / 0.5) 100%)',
        }} />

        {groupEntries.map(([groupId, group]) => {
          const regions = mapRegions.filter(r => getGroupForRegion(r.levelRequired) === groupId);
          const minLevel = Math.min(...regions.map(r => r.levelRequired));
          const unlocked = level >= minLevel;
          const totalMissions = regions.reduce((s, r) => s + r.missions.length, 0);
          const completedMissions = regions.reduce((s, r) => s + r.missions.filter(m => isMissionCompleted(m.id)).length, 0);
          const availableQuests = totalMissions - completedMissions;
          const allComplete = completedMissions === totalMissions;
          const isHovered = hoveredRegion === groupId;
          const isQuestHere = activeQuest && regions.some(r => r.id === activeQuest.regionId);
          const totalDigSpots = regions.reduce((s, r) => s + (r.digSpots?.length || 0), 0);

          return (
            <button key={groupId}
              onClick={() => { if (unlocked) { setSelectedGroupId(groupId); setMapLevel('regional'); } }}
              onMouseEnter={() => setHoveredRegion(groupId)}
              onMouseLeave={() => setHoveredRegion(null)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              style={{ left: `${group.x}%`, top: `${group.y}%` }}
              disabled={!unlocked}>
              {unlocked && (
                <div className={`absolute inset-0 w-12 h-12 -translate-x-2 -translate-y-2 rounded-full ${allComplete ? 'bg-rarity-advanced/30' : 'bg-accent/20'} blur-lg group-hover:blur-xl transition-all`} />
              )}
              {isQuestHere && activeQuest?.status !== 'completed' && activeQuest?.status !== 'failed' && (
                <div className="absolute -inset-4 bg-primary/15 rounded-full animate-pulse" />
              )}

              <div className={`relative flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full border-2 transition-all shadow-lg ${
                !unlocked ? 'bg-game-slot-border border-game-slot-border' :
                allComplete ? 'bg-rarity-advanced border-rarity-advanced shadow-rarity-advanced/30' :
                'bg-primary border-accent group-hover:scale-125 shadow-primary/30'
              }`}>
                {unlocked ? <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" /> : <Lock className="w-2 h-2 md:w-3 md:h-3 text-muted-foreground" />}
                {isQuestHere && activeQuest?.status !== 'completed' && <span className="absolute -top-1 -right-1 text-sm">🏇</span>}
              </div>
              <div className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-center transition-all ${isHovered ? 'scale-110' : ''}`}>
                <span className={`text-[8px] md:text-[9px] font-bold block drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${unlocked ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                  {group.name.toUpperCase()}
                </span>
                {unlocked && <span className="text-[6px] md:text-[7px] text-muted-foreground drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{completedMissions}/{totalMissions}</span>}
                {!unlocked && <span className="text-[6px] md:text-[7px] text-muted-foreground drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">LVL {minLevel}+</span>}
              </div>

              {isHovered && unlocked && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-game-slot border border-primary p-2.5 z-20 w-52 animate-fade-in shadow-lg">
                  <div className="text-[10px] font-bold text-accent mb-0.5">{group.name}</div>
                  <div className="text-[8px] text-muted-foreground mb-1">{group.description}</div>
                  <div className="text-[8px] text-primary">{regions.length} areas • {totalMissions} missions</div>
                  {availableQuests > 0 && <div className="text-[8px] text-accent mt-0.5">📜 {availableQuests} quests available</div>}
                  {totalDigSpots > 0 && <div className="text-[8px] text-accent mt-0.5">⛏️ {totalDigSpots} dig spots</div>}
                  <div className="flex items-center gap-1 mt-1 text-accent">
                    <ZoomIn className="w-3 h-3" />
                    <span className="text-[7px]">Click to zoom in</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-3 md:gap-4 mt-3 text-[8px] md:text-[9px] text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Available</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rarity-advanced" /> Completed</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-game-slot-border" /> Locked</span>
        {hasShovel && <span className="flex items-center gap-1">⛏️ Dig Spots</span>}
        {activeQuest && <span className="flex items-center gap-1"><span className="text-sm">🏇</span> Active Quest</span>}
      </div>
    </div>
  );
}
