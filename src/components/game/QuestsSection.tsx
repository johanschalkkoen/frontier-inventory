import { useGame } from '@/context/GameContext';
import { mapRegions } from '@/data/mapData';

export function QuestsSection() {
  const { state, isMissionCompleted, completeMission } = useGame();

  const allMissions = mapRegions.flatMap(r =>
    r.missions.map(m => ({ ...m, regionName: r.name }))
  );
  const activeMissions = allMissions.filter(m => !isMissionCompleted(m.id));
  const completedMissions = allMissions.filter(m => isMissionCompleted(m.id));

  return (
    <div className="flex-1">
      <h2 className="font-display text-xl font-bold text-accent mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        📜 QUESTS & JOURNAL
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-game-slot/50 border border-game-slot-border p-2 text-center">
          <span className="text-[8px] text-muted-foreground block">ACTIVE</span>
          <span className="text-accent font-bold text-lg">{activeMissions.length}</span>
        </div>
        <div className="bg-game-slot/50 border border-game-slot-border p-2 text-center">
          <span className="text-[8px] text-muted-foreground block">COMPLETED</span>
          <span className="text-rarity-advanced font-bold text-lg">{completedMissions.length}</span>
        </div>
      </div>

      <div className="bg-game-slot/30 border border-game-slot-border p-2 max-h-[400px] overflow-y-auto">
        <h3 className="text-primary font-bold text-[10px] mb-2">AVAILABLE QUESTS</h3>
        {activeMissions.length > 0 ? activeMissions.slice(0, 15).map(m => (
          <div key={m.id} className="flex items-center justify-between bg-game-slot/50 p-2 mb-1 border border-game-slot-border/30">
            <div>
              <span className="text-foreground text-xs font-bold">{m.name}</span>
              <span className="text-muted-foreground text-[9px] block">{m.regionName} · {m.description}</span>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <span className="text-accent text-[9px] block">{m.xpReward} XP · ${m.coinReward}</span>
              <button onClick={() => completeMission(m.id)}
                className="text-[8px] bg-accent text-accent-foreground px-2 py-0.5 font-bold mt-0.5">
                COMPLETE
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center text-muted-foreground text-[10px] py-8">All quests completed!</div>
        )}

        {completedMissions.length > 0 && (
          <>
            <h3 className="text-primary font-bold text-[10px] mt-3 mb-2">COMPLETED</h3>
            {completedMissions.slice(0, 10).map(m => (
              <div key={m.id} className="bg-game-slot/30 p-2 mb-1 border border-game-slot-border/20 opacity-60">
                <span className="text-rarity-advanced text-xs">✓ {m.name}</span>
                <span className="text-muted-foreground text-[9px] block">{m.regionName}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
