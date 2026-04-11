import { useGame } from '@/context/GameContext';
import { mapRegions } from '@/data/mapData';
import { useState } from 'react';
import { MapPin, Lock, ChevronLeft, Swords, Shield, Truck, Search, Target } from 'lucide-react';

const missionTypeIcons: Record<string, typeof Swords> = {
  Combat: Swords,
  Escort: Shield,
  Delivery: Truck,
  Investigation: Search,
  Bounty: Target,
};

const dangerColors: Record<string, string> = {
  Low: 'text-rarity-advanced',
  Medium: 'text-accent',
  High: 'text-rarity-epic',
  Extreme: 'text-destructive',
};

export function WorldMap() {
  const { state, getPlayerLevel, completeMission, isMissionCompleted, setSelectedRegion } = useGame();
  const { level } = getPlayerLevel();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const selectedRegion = mapRegions.find(r => r.id === state.selectedRegionId);

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

            return (
              <div key={mission.id}
                className={`p-3 border transition-all ${
                  completed ? 'bg-rarity-advanced/10 border-rarity-advanced/30' :
                  locked ? 'bg-game-slot/30 border-game-slot-border opacity-50' :
                  'bg-game-slot border-game-slot-border hover:border-primary'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    <span className="font-bold text-xs text-foreground">{mission.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-game-slot-border text-muted-foreground rounded">
                      {mission.type}
                    </span>
                  </div>
                  {completed && <span className="text-[9px] text-rarity-advanced font-bold">✓ COMPLETED</span>}
                  {locked && <span className="text-[9px] text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" /> LVL {mission.levelRequired}</span>}
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">{mission.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-[9px]">
                    <span className="text-accent">+{mission.xpReward} XP</span>
                    <span className="text-rarity-legendary">${mission.coinReward}</span>
                  </div>
                  {!completed && !locked && (
                    <button
                      onClick={() => completeMission(mission.id)}
                      className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      START MISSION
                    </button>
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
      <h2 className="font-display text-lg font-bold text-accent mb-3 text-center">THE FRONTIER</h2>

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
        {/* Terrain texture overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 20px, hsl(30, 20%, 25%) 20px, hsl(30, 20%, 25%) 21px),
              repeating-linear-gradient(-45deg, transparent, transparent 30px, hsl(25, 15%, 20%) 30px, hsl(25, 15%, 20%) 31px)
            `
          }}
        />

        {/* Trail lines connecting regions */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M50,82 L30,72 L22,55 L15,38 L20,15" stroke="hsl(30, 30%, 25%)" strokeWidth="0.3" fill="none" strokeDasharray="1,1" />
          <path d="M50,82 L68,65 L75,50 L82,30 L80,8" stroke="hsl(30, 30%, 25%)" strokeWidth="0.3" fill="none" strokeDasharray="1,1" />
          <path d="M30,72 L45,45 L60,35 L55,10" stroke="hsl(30, 30%, 25%)" strokeWidth="0.3" fill="none" strokeDasharray="1,1" />
          <path d="M22,55 L35,22" stroke="hsl(30, 30%, 25%)" strokeWidth="0.3" fill="none" strokeDasharray="1,1" />
        </svg>

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
              {/* Pin glow */}
              {unlocked && (
                <div className={`absolute inset-0 w-8 h-8 -translate-x-1 -translate-y-1 rounded-full ${
                  allComplete ? 'bg-rarity-advanced/30' : 'bg-accent/20'
                } blur-md group-hover:blur-lg transition-all`} />
              )}

              {/* Pin icon */}
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

              {/* Label */}
              <div className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold tracking-wider transition-all ${
                !unlocked ? 'text-muted-foreground/50' :
                isHovered ? 'text-accent scale-110' : 'text-foreground'
              }`}>
                {region.name.toUpperCase()}
                {unlocked && <span className="block text-center text-[7px] text-muted-foreground">{completedCount}/{region.missions.length}</span>}
                {!unlocked && <span className="block text-center text-[7px] text-muted-foreground">LVL {region.levelRequired}</span>}
              </div>

              {/* Hover tooltip */}
              {isHovered && unlocked && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-game-slot border border-primary p-2 z-10 w-40">
                  <div className="text-[10px] font-bold text-accent mb-1">{region.name}</div>
                  <div className="text-[8px] text-muted-foreground mb-1">{region.terrain} • {region.dangerLevel} Danger</div>
                  <div className="text-[8px] text-foreground">{region.description}</div>
                </div>
              )}
            </button>
          );
        })}

        {/* Compass rose */}
        <div className="absolute bottom-3 right-3 text-accent/30 font-display text-[10px] font-bold">
          <div className="text-center">N</div>
          <div className="flex gap-3"><span>W</span><span>✦</span><span>E</span></div>
          <div className="text-center">S</div>
        </div>
      </div>

      {/* Map legend */}
      <div className="flex justify-center gap-4 mt-3 text-[9px] text-muted-foreground">
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Available</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rarity-advanced" /> Completed</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-game-slot-border" /> Locked</span>
      </div>
    </div>
  );
}
