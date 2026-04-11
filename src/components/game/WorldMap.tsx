import { useGame } from '@/context/GameContext';
import { mapRegions } from '@/data/mapData';
import { useState, useEffect } from 'react';
import { MapPin, Lock, ChevronLeft, Swords, Shield, Truck, Search, Target, Skull, Pickaxe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const missionTypeIcons: Record<string, typeof Swords> = {
  Combat: Swords,
  Escort: Shield,
  Delivery: Truck,
  Investigation: Search,
  Bounty: Target,
  Survival: Skull,
  Heist: Pickaxe,
};

const dangerColors: Record<string, string> = {
  Low: 'text-rarity-advanced',
  Medium: 'text-accent',
  High: 'text-rarity-epic',
  Extreme: 'text-destructive',
  Deadly: 'text-destructive',
};

export function WorldMap() {
  const { state, getPlayerLevel, startMission, completeMission, processEncounter, isMissionCompleted, setSelectedRegion } = useGame();
  const { level } = getPlayerLevel();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  // Update timer for active quest
  useEffect(() => {
    if (state.activeQuest) {
      const interval = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(interval);
    }
  }, [state.activeQuest]);

  const selectedRegion = mapRegions.find(r => r.id === state.selectedRegionId);
  const activeQuest = state.activeQuest;

  if (selectedRegion) {
    return (
      <div className="flex-1 bg-game-panel border-2 border-game-slot p-4">
        <button
          onClick={() => setSelectedRegion(null)}
          className="flex items-center gap-1 text-primary hover:text-accent transition-colors mb-4 text-sm font-bold"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Map
        </button>

        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display text-xl font-bold text-accent">{selectedRegion.name}</h2>
          <span className={`text-[10px] font-bold ${dangerColors[selectedRegion.dangerLevel]}`}>
            ⚠ {selectedRegion.dangerLevel} Danger
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-1">{selectedRegion.description}</p>
        <p className="text-[10px] text-primary mb-4">Terrain: {selectedRegion.terrain} • Required Level: {selectedRegion.levelRequired}</p>

        <h3 className="font-display text-sm font-bold text-primary mb-3 border-b border-game-slot-border pb-1">MISSIONS</h3>
        <div className="flex flex-col gap-2">
          {selectedRegion.missions.map(mission => {
            const completed = isMissionCompleted(mission.id);
            const locked = level < mission.levelRequired;
            const Icon = missionTypeIcons[mission.type] || Swords;
            const isActiveQuest = activeQuest?.missionId === mission.id;
            const hasActiveQuest = activeQuest && activeQuest.status !== 'completed' && activeQuest.status !== 'failed';

            return (
              <div key={mission.id}
                className={`p-3 border transition-all ${
                  isActiveQuest ? 'bg-primary/10 border-primary' :
                  completed ? 'bg-rarity-advanced/10 border-rarity-advanced/30' :
                  locked ? 'bg-game-slot/30 border-game-slot-border opacity-50' :
                  'bg-game-slot border-game-slot-border hover:border-primary'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    <span className="font-bold text-xs text-foreground">{mission.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-game-slot-border text-muted-foreground">
                      {mission.type}
                    </span>
                    <span className="text-[8px] text-muted-foreground">⏱ {mission.durationMinutes}m</span>
                  </div>
                  {completed && <span className="text-[9px] text-rarity-advanced font-bold">✓ COMPLETED</span>}
                  {locked && <span className="text-[9px] text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" /> LVL {mission.levelRequired}</span>}
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">{mission.description}</p>

                {mission.encounters && mission.encounters.length > 0 && (
                  <div className="flex gap-1 mb-2 flex-wrap">
                    {mission.encounters.slice(0, 3).map((e, i) => (
                      <span key={i} className="text-[8px] px-1 py-0.5 bg-destructive/20 text-destructive border border-destructive/30">
                        ⚔ {e.name}
                      </span>
                    ))}
                    {mission.encounters.length > 3 && (
                      <span className="text-[8px] text-muted-foreground">+{mission.encounters.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-[9px]">
                    <span className="text-accent">+{mission.xpReward} XP</span>
                    <span className="text-rarity-legendary">${mission.coinReward}</span>
                  </div>
                  {!completed && !locked && !isActiveQuest && !hasActiveQuest && (
                    <button
                      onClick={() => {
                        const started = startMission(mission.id);
                        if (started) {
                          // Switch to quests tab
                        }
                      }}
                      className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold hover:bg-accent hover:text-accent-foreground transition-all active:scale-95"
                    >
                      START QUEST
                    </button>
                  )}
                  {isActiveQuest && (
                    <span className="text-[10px] text-primary font-bold animate-pulse">🏇 IN PROGRESS</span>
                  )}
                  {hasActiveQuest && !isActiveQuest && !completed && !locked && (
                    <span className="text-[8px] text-muted-foreground">ON ANOTHER QUEST</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-game-panel border-2 border-game-slot p-4">
      <h2 className="font-display text-lg font-bold text-accent mb-3 text-center">🗺️ THE FRONTIER</h2>

      {/* Active quest banner on map */}
      {activeQuest && activeQuest.status !== 'completed' && activeQuest.status !== 'failed' && (
        <div className="mb-3 bg-primary/10 border border-primary p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">🏇</span>
            <span className="text-xs font-bold text-primary">
              Active: {mapRegions.flatMap(r => r.missions).find(m => m.id === activeQuest.missionId)?.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={Math.min(100, ((now - activeQuest.startTime) / (activeQuest.endTime - activeQuest.startTime)) * 100)} className="w-24 h-2" />
            <span className="text-[9px] text-muted-foreground">
              {Math.max(0, Math.ceil((activeQuest.endTime - now) / 60000))}m left
            </span>
          </div>
        </div>
      )}

      {/* Map area */}
      <div className="relative w-full h-[500px] bg-game-slot border-2 border-game-slot-border overflow-hidden"
           style={{
             background: `
               radial-gradient(ellipse at 30% 80%, hsl(30, 40%, 20%) 0%, transparent 50%),
               radial-gradient(ellipse at 70% 50%, hsl(20, 35%, 18%) 0%, transparent 40%),
               radial-gradient(ellipse at 20% 30%, hsl(25, 30%, 15%) 0%, transparent 35%),
               radial-gradient(ellipse at 80% 20%, hsl(15, 25%, 12%) 0%, transparent 45%),
               linear-gradient(180deg, hsl(25, 20%, 8%) 0%, hsl(30, 35%, 15%) 50%, hsl(25, 45%, 20%) 100%)
             `
           }}
      >
        {/* Terrain texture */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 20px, hsl(30, 20%, 25%) 20px, hsl(30, 20%, 25%) 21px),
              repeating-linear-gradient(-45deg, transparent, transparent 30px, hsl(25, 15%, 20%) 30px, hsl(25, 15%, 20%) 31px)
            `
          }}
        />

        {/* Trail lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M50,90 L28,82 L18,68 L12,50 L15,12" stroke="hsl(30, 30%, 25%)" strokeWidth="0.3" fill="none" strokeDasharray="1,1" />
          <path d="M50,90 L72,78 L82,65 L85,42 L80,22 L50,0" stroke="hsl(30, 30%, 25%)" strokeWidth="0.3" fill="none" strokeDasharray="1,1" />
          <path d="M28,82 L45,58 L60,48 L55,25 L50,8 L42,2" stroke="hsl(30, 30%, 25%)" strokeWidth="0.3" fill="none" strokeDasharray="1,1" />
          <path d="M18,68 L35,38 L20,30 L15,12" stroke="hsl(30, 30%, 25%)" strokeWidth="0.3" fill="none" strokeDasharray="1,1" />
          <path d="M60,48 L65,15 L75,5" stroke="hsl(30, 30%, 25%)" strokeWidth="0.3" fill="none" strokeDasharray="1,1" />
          <path d="M40,18 L30,5" stroke="hsl(30, 30%, 25%)" strokeWidth="0.3" fill="none" strokeDasharray="1,1" />
          <path d="M50,8 L60,2" stroke="hsl(30, 30%, 25%)" strokeWidth="0.3" fill="none" strokeDasharray="1,1" />
        </svg>

        {/* Active quest indicator on map */}
        {activeQuest && activeQuest.status !== 'completed' && activeQuest.status !== 'failed' && (() => {
          const questRegion = mapRegions.find(r => r.id === activeQuest.regionId);
          if (!questRegion) return null;
          return (
            <div className="absolute z-20 animate-pulse"
              style={{ left: `${questRegion.x}%`, top: `${questRegion.y}%`, transform: 'translate(-50%, -50%)' }}>
              <div className="w-10 h-10 rounded-full bg-primary/30 border-2 border-primary flex items-center justify-center">
                <span className="text-lg">🏇</span>
              </div>
            </div>
          );
        })()}

        {mapRegions.map(region => {
          const unlocked = level >= region.levelRequired;
          const completedCount = region.missions.filter(m => isMissionCompleted(m.id)).length;
          const allComplete = completedCount === region.missions.length;
          const isHovered = hoveredRegion === region.id;

          return (
            <button
              key={region.id}
              onClick={() => unlocked && setSelectedRegion(region.id)}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 ${
                unlocked ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
              disabled={!unlocked}
            >
              {unlocked && (
                <div className={`absolute inset-0 w-8 h-8 -translate-x-1 -translate-y-1 rounded-full ${
                  allComplete ? 'bg-rarity-advanced/30' : 'bg-accent/20'
                } blur-md group-hover:blur-lg transition-all`} />
              )}

              <div className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                !unlocked ? 'bg-game-slot-border border-game-slot-border' :
                allComplete ? 'bg-rarity-advanced border-rarity-advanced' :
                'bg-primary border-accent group-hover:scale-125'
              }`}>
                {unlocked ? (
                  <MapPin className="w-3 h-3 text-primary-foreground" />
                ) : (
                  <Lock className="w-3 h-3 text-muted-foreground" />
                )}
              </div>

              <div className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold tracking-wider transition-all ${
                !unlocked ? 'text-muted-foreground/50' :
                isHovered ? 'text-accent scale-110' : 'text-foreground'
              }`}>
                {region.name.toUpperCase()}
                {unlocked && <span className="block text-center text-[7px] text-muted-foreground">{completedCount}/{region.missions.length}</span>}
                {!unlocked && <span className="block text-center text-[7px] text-muted-foreground">LVL {region.levelRequired}</span>}
              </div>

              {isHovered && unlocked && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-game-slot border border-primary p-2 z-10 w-44">
                  <div className="text-[10px] font-bold text-accent mb-1">{region.name}</div>
                  <div className="text-[8px] text-muted-foreground mb-1">{region.terrain} • {region.dangerLevel} Danger</div>
                  <div className="text-[8px] text-foreground">{region.description}</div>
                  <div className="text-[8px] text-primary mt-1">{region.missions.length} missions</div>
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
