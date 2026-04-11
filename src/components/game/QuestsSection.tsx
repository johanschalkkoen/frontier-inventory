import { useState, useEffect } from 'react';
import { useGame, type ActiveQuest } from '@/context/GameContext';
import { mapRegions, type Mission } from '@/data/mapData';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { itemDatabase } from '@/data/gameData';

export function QuestsSection() {
  const { state, isMissionCompleted, startMission, completeMission, processEncounter, getPlayerLevel, abortQuest, useHealItem } = useGame();
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
        <ActiveQuestPanel />
      )}

      {state.activeQuest?.status === 'failed' && (
        <div className="bg-destructive/20 border-2 border-destructive p-4 mb-4" style={{ backgroundImage: 'linear-gradient(135deg, hsl(0 60% 10%) 0%, hsl(0 40% 15%) 100%)' }}>
          <h3 className="text-destructive font-bold text-sm mb-1">💀 QUEST FAILED</h3>
          <p className="text-muted-foreground text-xs mb-2">You were defeated and must retry this quest.</p>
          <div className="max-h-[100px] overflow-y-auto text-[9px] text-muted-foreground space-y-0.5 mb-2">
            {state.activeQuest.log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
          <button onClick={() => startMission(state.activeQuest!.missionId)}
            className="px-4 py-1.5 bg-accent text-accent-foreground font-bold text-xs hover:bg-primary transition-colors">
            🔄 RETRY QUEST
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

function ActiveQuestPanel() {
  const { state, processEncounter, completeMission, abortQuest, useHealItem, getEquippedItem, getItemsInLocation, equipItem } = useGame();
  const quest = state.activeQuest!;
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

  const elapsed = now - quest.startTime;
  const total = quest.endTime - quest.startTime;
  const progress = mission ? Math.min(100, (elapsed / total) * 100) : 0;
  const timeLeft = Math.max(0, quest.endTime - now);
  const minutesLeft = Math.floor(timeLeft / 60000);
  const secondsLeft = Math.floor((timeLeft % 60000) / 1000);

  const encounterInterval = total / (quest.encounters.length + 1);
  const expectedEncounters = Math.min(quest.encounters.length, Math.floor(elapsed / encounterInterval));
  const needsEncounter = quest.status === 'traveling' && quest.currentEncounterIndex < expectedEncounters;

  if (!mission) return null;

  const isComplete = progress >= 100 && quest.currentEncounterIndex >= quest.encounters.length;
  const currentEncounter = quest.encounters[quest.currentEncounterIndex];
  const showEncounter = needsEncounter && currentEncounter;

  // Find heal items in inventory
  const healItems = itemDatabase.filter(item => {
    const loc = state.itemLocations[item.id];
    if (!loc || loc.area === 'equipped') return false;
    return item.category === 'food' || item.category === 'drink' || item.category === 'medicine';
  });

  // Find weapons in inventory for switching
  const weaponItems = itemDatabase.filter(item => {
    const loc = state.itemLocations[item.id];
    if (!loc) return false;
    return item.type === 'sidearm' || item.type === 'longarm' || item.type === 'knife';
  });

  const equippedSidearm = getEquippedItem('sidearm');
  const equippedLongarm = getEquippedItem('longarm');

  return (
    <div className="border-2 border-primary p-4 mb-4 animate-fade-in" style={{ background: 'linear-gradient(180deg, hsl(30 20% 12%) 0%, hsl(25 30% 8%) 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-sm font-bold text-accent">🏇 ACTIVE QUEST: {mission.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{minutesLeft}:{secondsLeft.toString().padStart(2, '0')}</span>
          <button onClick={() => {
            if (confirm('Abort this quest? You will lose all progress.')) {
              abortQuest();
              toast.info('Quest aborted.');
            }
          }} className="px-2 py-0.5 bg-destructive/80 text-destructive-foreground text-[9px] font-bold hover:bg-destructive transition-colors">
            ✕ ABORT
          </button>
        </div>
      </div>

      <Progress value={progress} className="h-3 mb-2" />

      <div className="flex items-center justify-between text-[9px] mb-3">
        <span className="text-muted-foreground">Encounters: {quest.currentEncounterIndex}/{quest.encounters.length}</span>
        <span className={`font-bold ${quest.status === 'traveling' ? 'text-accent' : quest.status === 'encounter' ? 'text-destructive' : 'text-rarity-advanced'}`}>
          {quest.status === 'traveling' ? '🏇 Traveling...' : quest.status === 'encounter' ? '⚔ In Combat!' : '✓ Complete'}
        </span>
      </div>

      {/* Encounter panel with action buttons */}
      {showEncounter && (
        <div className="border-2 border-destructive/50 p-3 mb-3 animate-scale-in" style={{ background: 'linear-gradient(135deg, hsl(0 50% 10%) 0%, hsl(20 40% 12%) 100%)' }}>
          <div className="mb-2">
            <span className="text-destructive font-bold text-sm">⚔ {currentEncounter.name}</span>
            <span className="text-muted-foreground text-[9px] block mt-0.5">{currentEncounter.description}</span>
            <span className="text-[8px] text-destructive/70">Danger: {'💀'.repeat(Math.min(5, Math.ceil(currentEncounter.difficulty / 2)))}</span>
          </div>

          {/* Combat action buttons */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <button onClick={() => {
              const result = processEncounter('fight');
              if (result === 'success') toast.success('Victory! Enemy defeated!');
              else if (result === 'fail') toast.error('You were defeated!');
            }}
              className="py-2 bg-destructive text-destructive-foreground font-bold text-[10px] hover:brightness-110 transition-all border border-destructive/50 active:scale-95">
              ⚔ FIGHT
            </button>
            <button onClick={() => {
              const result = processEncounter('evade');
              if (result === 'success') toast.success('You slipped away!');
              else if (result === 'fail') toast.error('Failed to evade!');
            }}
              className="py-2 bg-accent text-accent-foreground font-bold text-[10px] hover:brightness-110 transition-all border border-accent/50 active:scale-95">
              🏃 EVADE
            </button>
            <button onClick={() => {
              const result = processEncounter('flee');
              if (result === 'success') toast.success('You fled successfully!');
              else if (result === 'fail') toast.error('Could not escape!');
            }}
              className="py-2 bg-primary text-primary-foreground font-bold text-[10px] hover:brightness-110 transition-all border border-primary/50 active:scale-95">
              🐎 FLEE
            </button>
          </div>
        </div>
      )}

      {/* Mid-quest toolbar: weapons & healing */}
      <div className="border border-game-slot-border bg-game-slot/40 p-2 mb-2">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[8px] text-muted-foreground font-bold">EQUIPPED:</span>
          {equippedSidearm && <span className="text-[9px] text-accent">🔫 {equippedSidearm.name}</span>}
          {equippedLongarm && <span className="text-[9px] text-accent">🪶 {equippedLongarm.name}</span>}
          {!equippedSidearm && !equippedLongarm && <span className="text-[9px] text-destructive">⚠ No weapon equipped!</span>}
        </div>

        <div className="flex gap-1 flex-wrap">
          {/* Weapon switch buttons */}
          {weaponItems.filter(w => {
            const loc = state.itemLocations[w.id];
            return loc && loc.area !== 'equipped';
          }).slice(0, 4).map(w => (
            <button key={w.id} onClick={() => {
              equipItem(w.id);
              toast.success(`Switched to ${w.name}`);
            }}
              className="px-2 py-1 bg-game-slot border border-game-slot-border text-[8px] text-foreground hover:border-primary transition-colors">
              🔄 {w.name}
            </button>
          ))}

          {/* Heal items */}
          {healItems.slice(0, 4).map(item => (
            <button key={item.id} onClick={() => {
              useHealItem(item.id);
              toast.success(`Used ${item.name}`);
            }}
              className="px-2 py-1 bg-rarity-advanced/20 border border-rarity-advanced/30 text-[8px] text-rarity-advanced hover:bg-rarity-advanced/30 transition-colors">
              ❤️ {item.name}
            </button>
          ))}
        </div>
      </div>

      {isComplete && (
        <button onClick={() => completeMission(quest.missionId)}
          className="w-full py-2.5 bg-rarity-advanced text-accent-foreground font-bold text-sm hover:brightness-110 transition-all active:scale-[0.98]">
          ✓ CLAIM REWARDS: +{mission.xpReward} XP · ${mission.coinReward}
        </button>
      )}

      {/* Quest log */}
      <div className="mt-2 max-h-[80px] overflow-y-auto border-t border-game-slot-border pt-1">
        {quest.log.map((l, i) => (
          <div key={i} className="text-[8px] text-muted-foreground">{l}</div>
        ))}
      </div>
    </div>
  );
}
