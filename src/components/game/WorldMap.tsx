import { useGame } from '@/context/GameContext';
import { mapRegions } from '@/data/mapData';
import { useState, useEffect } from 'react';
import { MapPin, Lock, ChevronLeft, Swords, Shield, Truck, Search, Target, Skull, Pickaxe, ZoomIn, ZoomOut } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type MapLevel = 'global' | 'regional' | 'town';

const missionTypeIcons: Record<string, typeof Swords> = {
  Combat: Swords, Escort: Shield, Delivery: Truck, Investigation: Search,
  Bounty: Target, Survival: Skull, Heist: Pickaxe,
};

const dangerColors: Record<string, string> = {
  Low: 'text-rarity-advanced', Medium: 'text-accent', High: 'text-rarity-epic',
  Extreme: 'text-destructive', Deadly: 'text-destructive',
};

// Regional groupings for the 3-level map
const regionGroups: Record<string, { name: string; description: string; x: number; y: number; regionIds: string[]; terrain: string }> = {
  'frontier': { name: 'The Frontier', description: 'Dusty towns and open plains where new cowboys begin.', x: 50, y: 80, regionIds: ['dusty-gulch', 'coyote-flats', 'red-mesa-canyon', 'silver-creek-mine', 'rattlesnake-pass'], terrain: 'Plains & Towns' },
  'territories': { name: 'The Territories', description: 'Saloon towns, forts, and haunted valleys.', x: 30, y: 55, regionIds: ['deadwood-saloon', 'fort-horizon', 'ghost-valley', 'tombstone-ridge', 'eagle-peak'], terrain: 'Towns & Valleys' },
  'badlands': { name: 'The Badlands', description: 'Scorching deserts and treacherous gorges.', x: 70, y: 40, regionIds: ['scorpion-desert', 'devils-crossing', 'gold-rush-basin'], terrain: 'Desert & Gorge' },
  'wilds': { name: 'The Wilds', description: 'Untamed rivers, sacred canyons, and storm-lashed peaks.', x: 40, y: 25, regionIds: ['black-river-ford', 'painted-canyon', 'thunderhead-range'], terrain: 'Mountains & Rivers' },
  'deep-frontier': { name: 'The Deep Frontier', description: 'Cursed valleys and lawless railroad towns.', x: 60, y: 15, regionIds: ['bone-hollow', 'iron-horse-junction', 'apache-territory'], terrain: 'Wilderness' },
  'endgame': { name: 'The Outlaw Wastes', description: 'Ghost cities, impossible mountains, and the legendary El Dorado.', x: 50, y: 5, regionIds: ['vulture-city', 'dragons-spine', 'el-dorado'], terrain: 'Legendary' },
};

// Town features for local-level view
const townFeatures: Record<string, { name: string; icon: string; x: number; y: number }[]> = {
  'dusty-gulch': [
    { name: 'Silver Dollar Saloon', icon: '🍺', x: 40, y: 35 },
    { name: 'Sheriff\'s Office', icon: '⭐', x: 60, y: 30 },
    { name: 'General Store', icon: '🏪', x: 30, y: 55 },
    { name: 'Livery Stable', icon: '🐴', x: 70, y: 60 },
    { name: 'Church', icon: '⛪', x: 50, y: 20 },
    { name: 'Boarding House', icon: '🏠', x: 20, y: 40 },
  ],
  'deadwood-saloon': [
    { name: 'Gambling Hall', icon: '🎰', x: 45, y: 30 },
    { name: 'Gunsmith', icon: '🔫', x: 25, y: 45 },
    { name: 'Bank', icon: '🏦', x: 65, y: 35 },
    { name: 'Doctor\'s Office', icon: '💊', x: 35, y: 60 },
    { name: 'Telegraph Office', icon: '📬', x: 55, y: 55 },
    { name: 'Hotel & Bathhouse', icon: '🛁', x: 75, y: 50 },
  ],
  'tombstone-ridge': [
    { name: 'Marshal\'s Post', icon: '⭐', x: 50, y: 25 },
    { name: 'Jail', icon: '🔒', x: 60, y: 30 },
    { name: 'Assay Office', icon: '⚖️', x: 30, y: 40 },
    { name: 'Undertaker', icon: '⚰️', x: 70, y: 55 },
    { name: 'Blacksmith', icon: '🔨', x: 40, y: 65 },
    { name: 'Brothel', icon: '💃', x: 20, y: 50 },
  ],
  'iron-horse-junction': [
    { name: 'Railroad Depot', icon: '🚂', x: 50, y: 70 },
    { name: 'Freight Office', icon: '📦', x: 35, y: 45 },
    { name: 'Workers\' Camp', icon: '⛺', x: 65, y: 40 },
    { name: 'Dynamite Storage', icon: '💥', x: 20, y: 30 },
    { name: 'Chop House', icon: '🍖', x: 55, y: 25 },
    { name: 'Land Office', icon: '📜', x: 75, y: 35 },
  ],
};

export function WorldMap() {
  const { state, getPlayerLevel, startMission, completeMission, processEncounter, isMissionCompleted, setSelectedRegion } = useGame();
  const { level } = getPlayerLevel();
  const [mapLevel, setMapLevel] = useState<MapLevel>('global');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (state.activeQuest) {
      const interval = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(interval);
    }
  }, [state.activeQuest]);

  const selectedRegion = mapRegions.find(r => r.id === state.selectedRegionId);
  const activeQuest = state.activeQuest;

  // ============== TOWN / LOCAL VIEW ==============
  if (selectedRegion && mapLevel === 'town') {
    const features = townFeatures[selectedRegion.id] || [];
    const missions = selectedRegion.missions;

    return (
      <div className="flex-1 border-2 border-game-slot p-4" style={{ background: 'linear-gradient(180deg, hsl(30 20% 10%) 0%, hsl(25 25% 8%) 100%)' }}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { setMapLevel('regional'); setSelectedRegion(null); }}
            className="flex items-center gap-1 text-primary hover:text-accent transition-colors text-sm font-bold">
            <ChevronLeft className="w-4 h-4" /> {selectedGroupId ? regionGroups[selectedGroupId]?.name : 'Region'}
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => { setMapLevel('regional'); setSelectedRegion(null); }}
              className="p-1 bg-game-slot border border-game-slot-border hover:border-primary transition-colors" title="Zoom out to region">
              <ZoomOut className="w-3.5 h-3.5 text-primary" />
            </button>
            <button onClick={() => { setMapLevel('global'); setSelectedRegion(null); setSelectedGroupId(null); }}
              className="p-1 bg-game-slot border border-game-slot-border hover:border-primary transition-colors" title="Global map">
              <MapPin className="w-3.5 h-3.5 text-primary" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <h2 className="font-display text-lg font-bold text-accent">{selectedRegion.name}</h2>
          <span className={`text-[10px] font-bold ${dangerColors[selectedRegion.dangerLevel]}`}>⚠ {selectedRegion.dangerLevel}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mb-3">{selectedRegion.description}</p>

        {/* Local map with features */}
        <div className="relative w-full h-[220px] bg-game-slot border-2 border-game-slot-border mb-4 overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at center, hsl(30 25% 18%) 0%, hsl(25 20% 10%) 100%)' }}>
          {/* Roads */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M10,50 L90,50" stroke="hsl(30 20% 30%)" strokeWidth="1.5" fill="none" />
            <path d="M50,10 L50,90" stroke="hsl(30 20% 30%)" strokeWidth="1.2" fill="none" />
            <path d="M20,20 L80,80" stroke="hsl(30 15% 25%)" strokeWidth="0.8" fill="none" strokeDasharray="2,2" />
          </svg>

          {features.map((f, i) => (
            <div key={i} className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-default"
              style={{ left: `${f.x}%`, top: `${f.y}%` }}>
              <div className="flex flex-col items-center">
                <span className="text-lg drop-shadow-lg">{f.icon}</span>
                <span className="text-[7px] text-foreground font-bold mt-0.5 bg-game-slot/80 px-1 whitespace-nowrap">{f.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Missions list */}
        <h3 className="font-display text-sm font-bold text-primary mb-2 border-b border-game-slot-border pb-1">MISSIONS</h3>
        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto">
          {missions.map(mission => {
            const completed = isMissionCompleted(mission.id);
            const locked = level < mission.levelRequired;
            const Icon = missionTypeIcons[mission.type] || Swords;
            const isActiveQuest = activeQuest?.missionId === mission.id;
            const hasActiveQuest = activeQuest && activeQuest.status !== 'completed' && activeQuest.status !== 'failed';

            return (
              <div key={mission.id} className={`p-3 border transition-all ${
                isActiveQuest ? 'bg-primary/10 border-primary' :
                completed ? 'bg-rarity-advanced/10 border-rarity-advanced/30' :
                locked ? 'bg-game-slot/30 border-game-slot-border opacity-50' :
                'bg-game-slot border-game-slot-border hover:border-primary'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    <span className="font-bold text-xs text-foreground">{mission.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-game-slot-border text-muted-foreground">{mission.type}</span>
                  </div>
                  {completed && <span className="text-[9px] text-rarity-advanced font-bold">✓ DONE</span>}
                  {locked && <span className="text-[9px] text-muted-foreground"><Lock className="w-3 h-3 inline" /> LVL {mission.levelRequired}</span>}
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">{mission.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-[9px]">
                    <span className="text-accent">+{mission.xpReward} XP</span>
                    <span className="text-rarity-legendary">${mission.coinReward}</span>
                    <span className="text-muted-foreground">⏱ {mission.durationMinutes}m</span>
                  </div>
                  {!completed && !locked && !isActiveQuest && !hasActiveQuest && (
                    <button onClick={() => startMission(mission.id)}
                      className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold hover:bg-accent transition-all active:scale-95">
                      START QUEST
                    </button>
                  )}
                  {isActiveQuest && <span className="text-[10px] text-primary font-bold animate-pulse">🏇 IN PROGRESS</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ============== REGIONAL VIEW ==============
  if (selectedGroupId && mapLevel === 'regional') {
    const group = regionGroups[selectedGroupId];
    const regions = mapRegions.filter(r => group.regionIds.includes(r.id));

    return (
      <div className="flex-1 border-2 border-game-slot p-4" style={{ background: 'linear-gradient(180deg, hsl(30 20% 10%) 0%, hsl(25 25% 8%) 100%)' }}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { setMapLevel('global'); setSelectedGroupId(null); }}
            className="flex items-center gap-1 text-primary hover:text-accent transition-colors text-sm font-bold">
            <ChevronLeft className="w-4 h-4" /> THE FRONTIER
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => { setMapLevel('global'); setSelectedGroupId(null); }}
              className="p-1 bg-game-slot border border-game-slot-border hover:border-primary transition-colors" title="Zoom out">
              <ZoomOut className="w-3.5 h-3.5 text-primary" />
            </button>
          </div>
        </div>

        <h2 className="font-display text-lg font-bold text-accent mb-1">{group.name}</h2>
        <p className="text-[10px] text-muted-foreground mb-4">{group.description} — {group.terrain}</p>

        {/* Active quest banner */}
        {activeQuest && activeQuest.status !== 'completed' && activeQuest.status !== 'failed' && (
          <div className="mb-3 bg-primary/10 border border-primary p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="animate-pulse">🏇</span>
              <span className="text-xs font-bold text-primary">
                Active: {mapRegions.flatMap(r => r.missions).find(m => m.id === activeQuest.missionId)?.name}
              </span>
            </div>
            <Progress value={Math.min(100, ((now - activeQuest.startTime) / (activeQuest.endTime - activeQuest.startTime)) * 100)} className="w-24 h-2" />
          </div>
        )}

        {/* Regional map */}
        <div className="relative w-full h-[280px] bg-game-slot border-2 border-game-slot-border mb-4 overflow-hidden"
          style={{ background: `radial-gradient(ellipse at 50% 50%, hsl(30 30% 18%) 0%, hsl(25 20% 10%) 100%)` }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {regions.map((r, i) => {
              if (i < regions.length - 1) {
                const next = regions[i + 1];
                const rx = 15 + (i * 70 / Math.max(1, regions.length - 1));
                const ry = 20 + Math.sin(i * 1.5) * 25 + 25;
                const nx = 15 + ((i + 1) * 70 / Math.max(1, regions.length - 1));
                const ny = 20 + Math.sin((i + 1) * 1.5) * 25 + 25;
                return <path key={i} d={`M${rx},${ry} L${nx},${ny}`} stroke="hsl(30 20% 25%)" strokeWidth="0.5" fill="none" strokeDasharray="2,1" />;
              }
              return null;
            })}
          </svg>

          {regions.map((region, i) => {
            const unlocked = level >= region.levelRequired;
            const completedCount = region.missions.filter(m => isMissionCompleted(m.id)).length;
            const allComplete = completedCount === region.missions.length;
            const isQuestHere = activeQuest?.regionId === region.id;
            const rx = 15 + (i * 70 / Math.max(1, regions.length - 1));
            const ry = 20 + Math.sin(i * 1.5) * 25 + 25;

            return (
              <button key={region.id}
                onClick={() => { if (unlocked) { setSelectedRegion(region.id); setMapLevel('town'); } }}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                style={{ left: `${rx}%`, top: `${ry}%` }}
                disabled={!unlocked}>
                {isQuestHere && (
                  <div className="absolute -inset-3 bg-primary/20 rounded-full animate-pulse" />
                )}
                <div className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  !unlocked ? 'bg-game-slot-border border-game-slot-border' :
                  allComplete ? 'bg-rarity-advanced border-rarity-advanced' :
                  'bg-primary border-accent group-hover:scale-125'
                }`}>
                  {unlocked ? <MapPin className="w-4 h-4 text-primary-foreground" /> : <Lock className="w-3 h-3 text-muted-foreground" />}
                  {isQuestHere && <span className="absolute -top-1 -right-1 text-sm">🏇</span>}
                </div>
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                  <span className={`text-[8px] font-bold block ${unlocked ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                    {region.name.toUpperCase()}
                  </span>
                  {unlocked && <span className="text-[7px] text-muted-foreground">{completedCount}/{region.missions.length}</span>}
                  {!unlocked && <span className="text-[7px] text-muted-foreground">LVL {region.levelRequired}</span>}
                </div>

                {hoveredRegion === region.id && unlocked && (
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-game-slot border border-primary p-2 z-20 w-40">
                    <div className="text-[10px] font-bold text-accent">{region.name}</div>
                    <div className="text-[8px] text-muted-foreground">{region.terrain} • {region.dangerLevel}</div>
                    <div className="text-[8px] text-primary mt-1">{region.missions.length} missions • Click to enter</div>
                    <div className="flex items-center gap-1 mt-1">
                      <ZoomIn className="w-3 h-3 text-accent" />
                      <span className="text-[7px] text-accent">Click to zoom in</span>
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

        {/* Region list below map */}
        <div className="flex flex-col gap-1">
          {regions.map(region => {
            const unlocked = level >= region.levelRequired;
            const completedCount = region.missions.filter(m => isMissionCompleted(m.id)).length;
            return (
              <button key={region.id}
                onClick={() => { if (unlocked) { setSelectedRegion(region.id); setMapLevel('town'); } }}
                disabled={!unlocked}
                className={`flex items-center justify-between p-2 border transition-all text-left ${
                  unlocked ? 'bg-game-slot border-game-slot-border hover:border-primary cursor-pointer' : 'bg-game-slot/30 border-game-slot-border/30 opacity-50'
                }`}>
                <div className="flex items-center gap-2">
                  <MapPin className={`w-3 h-3 ${unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-bold text-foreground">{region.name}</span>
                  <span className={`text-[8px] ${dangerColors[region.dangerLevel]}`}>{region.dangerLevel}</span>
                </div>
                <div className="flex items-center gap-2">
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
    <div className="flex-1 border-2 border-game-slot p-4" style={{ background: 'linear-gradient(180deg, hsl(30 20% 10%) 0%, hsl(25 25% 8%) 100%)' }}>
      <h2 className="font-display text-lg font-bold text-accent mb-3 text-center">🗺️ THE FRONTIER — WORLD MAP</h2>

      {/* Active quest banner */}
      {activeQuest && activeQuest.status !== 'completed' && activeQuest.status !== 'failed' && (
        <div className="mb-3 bg-primary/10 border border-primary p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">🏇</span>
            <span className="text-xs font-bold text-primary">
              Active: {mapRegions.flatMap(r => r.missions).find(m => m.id === activeQuest.missionId)?.name}
            </span>
          </div>
          <Progress value={Math.min(100, ((now - activeQuest.startTime) / (activeQuest.endTime - activeQuest.startTime)) * 100)} className="w-24 h-2" />
        </div>
      )}

      {/* World Map */}
      <div className="relative w-full h-[450px] bg-game-slot border-2 border-game-slot-border overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse at 30% 80%, hsl(30 40% 20%) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 50%, hsl(20 35% 18%) 0%, transparent 40%),
            radial-gradient(ellipse at 20% 30%, hsl(25 30% 15%) 0%, transparent 35%),
            radial-gradient(ellipse at 80% 20%, hsl(15 25% 12%) 0%, transparent 45%),
            linear-gradient(180deg, hsl(25 20% 8%) 0%, hsl(30 35% 15%) 50%, hsl(25 45% 20%) 100%)
          `
        }}>
        {/* Terrain texture */}
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 25px, hsl(30 20% 25%) 25px, hsl(30 20% 25%) 26px)` }} />

        {/* Trail lines connecting groups */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M50,80 L30,55 L40,25 L50,5" stroke="hsl(30 25% 25%)" strokeWidth="0.4" fill="none" strokeDasharray="1.5,1" />
          <path d="M50,80 L70,40 L60,15 L50,5" stroke="hsl(30 25% 25%)" strokeWidth="0.4" fill="none" strokeDasharray="1.5,1" />
          <path d="M30,55 L70,40" stroke="hsl(30 20% 22%)" strokeWidth="0.3" fill="none" strokeDasharray="1,1.5" />
        </svg>

        {/* Active quest indicator */}
        {activeQuest && activeQuest.status !== 'completed' && activeQuest.status !== 'failed' && (() => {
          const questRegion = mapRegions.find(r => r.id === activeQuest.regionId);
          if (!questRegion) return null;
          const groupEntry = groupEntries.find(([, g]) => g.regionIds.includes(questRegion.id));
          if (!groupEntry) return null;
          const [, groupData] = groupEntry;
          return (
            <div className="absolute z-20 animate-pulse"
              style={{ left: `${groupData.x}%`, top: `${groupData.y}%`, transform: 'translate(-50%, -50%)' }}>
              <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <span className="text-xl">🏇</span>
              </div>
            </div>
          );
        })()}

        {/* Region group pins */}
        {groupEntries.map(([groupId, group]) => {
          const regions = mapRegions.filter(r => group.regionIds.includes(r.id));
          const minLevel = Math.min(...regions.map(r => r.levelRequired));
          const unlocked = level >= minLevel;
          const totalMissions = regions.reduce((s, r) => s + r.missions.length, 0);
          const completedMissions = regions.reduce((s, r) => s + r.missions.filter(m => isMissionCompleted(m.id)).length, 0);
          const allComplete = completedMissions === totalMissions;
          const isHovered = hoveredRegion === groupId;

          return (
            <button key={groupId}
              onClick={() => { if (unlocked) { setSelectedGroupId(groupId); setMapLevel('regional'); } }}
              onMouseEnter={() => setHoveredRegion(groupId)}
              onMouseLeave={() => setHoveredRegion(null)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              style={{ left: `${group.x}%`, top: `${group.y}%` }}
              disabled={!unlocked}>
              {unlocked && (
                <div className={`absolute inset-0 w-10 h-10 -translate-x-2 -translate-y-2 rounded-full ${allComplete ? 'bg-rarity-advanced/30' : 'bg-accent/20'} blur-lg group-hover:blur-xl transition-all`} />
              )}
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                !unlocked ? 'bg-game-slot-border border-game-slot-border' :
                allComplete ? 'bg-rarity-advanced border-rarity-advanced' :
                'bg-primary border-accent group-hover:scale-125'
              }`}>
                {unlocked ? <MapPin className="w-4 h-4 text-primary-foreground" /> : <Lock className="w-3 h-3 text-muted-foreground" />}
              </div>
              <div className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-center transition-all ${
                isHovered ? 'scale-110' : ''
              }`}>
                <span className={`text-[9px] font-bold block ${unlocked ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                  {group.name.toUpperCase()}
                </span>
                {unlocked && <span className="text-[7px] text-muted-foreground">{completedMissions}/{totalMissions} missions</span>}
                {!unlocked && <span className="text-[7px] text-muted-foreground">LVL {minLevel}+</span>}
              </div>

              {isHovered && unlocked && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-game-slot border border-primary p-2 z-20 w-48 animate-fade-in">
                  <div className="text-[10px] font-bold text-accent mb-0.5">{group.name}</div>
                  <div className="text-[8px] text-muted-foreground mb-1">{group.description}</div>
                  <div className="text-[8px] text-primary">{regions.length} areas • {totalMissions} missions</div>
                  <div className="flex items-center gap-1 mt-1 text-accent">
                    <ZoomIn className="w-3 h-3" />
                    <span className="text-[7px]">Click to zoom in</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}

        {/* Compass */}
        <div className="absolute bottom-3 right-3 text-accent/30 font-display text-[10px] font-bold">
          <div className="text-center">N</div>
          <div className="flex gap-3"><span>W</span><span>✦</span><span>E</span></div>
          <div className="text-center">S</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3 text-[9px] text-muted-foreground">
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Available</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rarity-advanced" /> Completed</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-game-slot-border" /> Locked</span>
        {activeQuest && <span className="flex items-center gap-1"><span className="text-sm">🏇</span> Active Quest</span>}
      </div>
    </div>
  );
}
