import { useState, useEffect, useCallback } from 'react';
import { useGame, type ActiveQuest } from '@/context/GameContext';
import { mapRegions, type Mission } from '@/data/mapData';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export function QuestsSection() {
  const { state, isMissionCompleted, startMission, completeMission, processEncounter, getPlayerLevel, hasItem } = useGame();
  const { level } = getPlayerLevel();

  const allMissions = mapRegions.flatMap(r =>
    r.missions.map(m => ({ ...m, regionName: r.name, regionId: r.id }))
  );
  const activeMissions = allMissions.filter(m => !isMissionCompleted(m.id) && m.levelRequired <= level + 3);
  const completedMissions = allMissions.filter(m => isMissionCompleted(m.id));

  return (
    <div className="flex-1">
      <h2 className="font-display text-xl font-bold text-accent mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        📜 QUESTS & JOURNAL
      </h2>

      {/* Active quest display */}
      {state.activeQuest && state.activeQuest.status !== 'completed' && state.activeQuest.status !== 'failed' && (
        <ActiveQuestPanel quest={state.activeQuest} onProcess={processEncounter} onComplete={completeMission} />
      )}

      {state.activeQuest?.status === 'failed' && (
        <div className="bg-destructive/20 border border-destructive p-3 mb-4">
          <h3 className="text-destructive font-bold text-sm mb-1">⚠ QUEST FAILED</h3>
          <p className="text-muted-foreground text-xs mb-2">You were defeated and must retry this quest.</p>
          <div className="max-h-[100px] overflow-y-auto text-[9px] text-muted-foreground space-y-0.5">
            {state.activeQuest.log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
          <button onClick={() => startMission(state.activeQuest!.missionId)}
            className="mt-2 px-4 py-1.5 bg-accent text-accent-foreground font-bold text-xs">
            RETRY QUEST
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-game-slot/50 border border-game-slot-border p-2 text-center">
          <span className="text-[8px] text-muted-foreground block">AVAILABLE</span>
          <span className="text-accent font-bold text-lg">{activeMissions.length}</span>
        </div>
        <div className="bg-game-slot/50 border border-game-slot-border p-2 text-center">
          <span className="text-[8px] text-muted-foreground block">COMPLETED</span>
          <span className="text-rarity-advanced font-bold text-lg">{completedMissions.length}</span>
        </div>
      </div>

      <div className="bg-game-slot/30 border border-game-slot-border p-2 max-h-[400px] overflow-y-auto">
        <h3 className="text-primary font-bold text-[10px] mb-2">AVAILABLE QUESTS</h3>
        {activeMissions.length > 0 ? activeMissions.slice(0, 20).map(m => {
          const locked = level < m.levelRequired;
          const hasActiveQuest = state.activeQuest && state.activeQuest.status !== 'completed' && state.activeQuest.status !== 'failed';
          const hasRequirements = m.requirements && m.requirements.length > 0;

          return (
            <div key={m.id} className={`bg-game-slot/50 p-2 mb-1 border border-game-slot-border/30 ${locked ? 'opacity-40' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-foreground text-xs font-bold">{m.name}</span>
                  <span className="text-muted-foreground text-[9px] block">{m.regionName} · {m.description}</span>
                  <div className="flex gap-2 mt-0.5 flex-wrap">
                    <span className="text-[8px] text-primary">⏱ {m.durationMinutes}min</span>
                    <span className="text-[8px] text-primary">🎯 {m.type}</span>
                    {m.encounters && <span className="text-[8px] text-destructive/80">⚔ {m.encounters.length} encounters</span>}
                    {hasRequirements && (
                      <span className="text-[8px] text-accent">🔧 Requires items</span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="text-accent text-[9px] block">{m.xpReward} XP · ${m.coinReward}</span>
                  {locked ? (
                    <span className="text-[8px] text-muted-foreground">🔒 LVL {m.levelRequired}</span>
                  ) : hasActiveQuest ? (
                    <span className="text-[8px] text-muted-foreground">ON QUEST</span>
                  ) : (
                    <button onClick={() => {
                      const started = startMission(m.id);
                      if (started) toast.success(`Quest started: ${m.name}`);
                      else toast.error('Cannot start this quest right now.');
                    }}
                      className="text-[8px] bg-accent text-accent-foreground px-2 py-0.5 font-bold mt-0.5 hover:bg-primary transition-colors">
                      START QUEST
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="text-center text-muted-foreground text-[10px] py-8">All quests completed!</div>
        )}

        {completedMissions.length > 0 && (
          <>
            <h3 className="text-primary font-bold text-[10px] mt-3 mb-2">COMPLETED ({completedMissions.length})</h3>
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

function ActiveQuestPanel({ quest, onProcess, onComplete }: {
  quest: ActiveQuest;
  onProcess: () => 'success' | 'fail' | 'none';
  onComplete: (id: string) => void;
}) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const mission = (() => {
    for (const region of mapRegions) {
      const m = region.missions.find(m => m.id === quest.missionId);
      if (m) return m;
    }
    return null;
  })();

  if (!mission) return null;

  const elapsed = now - quest.startTime;
  const total = quest.endTime - quest.startTime;
  const progress = Math.min(100, (elapsed / total) * 100);
  const timeLeft = Math.max(0, quest.endTime - now);
  const minutesLeft = Math.floor(timeLeft / 60000);
  const secondsLeft = Math.floor((timeLeft % 60000) / 1000);

  // Check if an encounter should trigger
  const encounterInterval = total / (quest.encounters.length + 1);
  const expectedEncounters = Math.min(quest.encounters.length, Math.floor(elapsed / encounterInterval));
  const needsEncounter = quest.status === 'traveling' && quest.currentEncounterIndex < expectedEncounters;

  // Auto-trigger encounter state
  useEffect(() => {
    if (needsEncounter && quest.status === 'traveling') {
      // Set status to encounter - but we can't setState here directly
      // The parent should handle this
    }
  }, [needsEncounter, quest.status]);

  const isComplete = progress >= 100 && quest.currentEncounterIndex >= quest.encounters.length;
  const currentEncounter = quest.encounters[quest.currentEncounterIndex];
  const showEncounter = needsEncounter && currentEncounter;

  return (
    <div className="bg-game-slot border-2 border-primary p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm font-bold text-accent">🏇 ACTIVE QUEST: {mission.name}</h3>
        <span className="text-[10px] text-muted-foreground">{minutesLeft}:{secondsLeft.toString().padStart(2, '0')} remaining</span>
      </div>

      <Progress value={progress} className="h-3 mb-2" />

      <div className="flex items-center justify-between text-[9px] mb-2">
        <span className="text-muted-foreground">Encounters: {quest.currentEncounterIndex}/{quest.encounters.length}</span>
        <span className={`font-bold ${quest.status === 'traveling' ? 'text-accent' : quest.status === 'encounter' ? 'text-destructive' : 'text-rarity-advanced'}`}>
          {quest.status === 'traveling' ? '🏇 Traveling...' : quest.status === 'encounter' ? '⚔ In Combat!' : '✓ Complete'}
        </span>
      </div>

      {/* Encounter panel */}
      {showEncounter && (
        <div className="bg-destructive/10 border border-destructive/50 p-2 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-destructive font-bold text-xs">⚔ {currentEncounter.name}</span>
              <span className="text-muted-foreground text-[9px] block">{currentEncounter.description}</span>
              <span className="text-[8px] text-destructive/70">Danger: {'⚠'.repeat(Math.min(5, Math.ceil(currentEncounter.difficulty / 2)))}</span>
            </div>
            <button onClick={() => {
              const result = onProcess();
              if (result === 'success') toast.success('Encounter defeated!');
              else if (result === 'fail') toast.error('You were defeated!');
            }}
              className="px-3 py-1.5 bg-destructive text-destructive-foreground font-bold text-[10px] hover:bg-destructive/80 transition-colors">
              ⚔ FIGHT!
            </button>
          </div>
        </div>
      )}

      {isComplete && (
        <button onClick={() => onComplete(quest.missionId)}
          className="w-full py-2 bg-rarity-advanced text-accent-foreground font-bold text-sm hover:brightness-110 transition-all">
          ✓ CLAIM REWARDS: +{mission.xpReward} XP · ${mission.coinReward}
        </button>
      )}

      {/* Quest log */}
      <div className="mt-2 max-h-[80px] overflow-y-auto">
        {quest.log.map((l, i) => (
          <div key={i} className="text-[8px] text-muted-foreground">{l}</div>
        ))}
      </div>
    </div>
  );
}
