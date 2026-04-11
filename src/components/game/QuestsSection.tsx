import { useState, useEffect } from 'react';
import { useGame, type ActiveQuest } from '@/context/GameContext';
import { mapRegions, type Mission } from '@/data/mapData';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { itemDatabase } from '@/data/gameData';

// Quest story details for richer narrative
const QUEST_STORIES: Record<string, { story: string; people: string; location: string }> = {
  'm1': { story: 'Two drunken ranch hands started throwing fists over a card game. The barkeep wants them out before they wreck the place.', people: '2 drunk cowboys', location: 'Silver Dollar Saloon, Dusty Gulch' },
  'm2': { story: 'Sheriff McCoy\'s prize stallion was stolen in the night. Fresh tracks head toward the canyon. He\'ll pay well for its return.', people: 'Sheriff McCoy, unknown thief', location: 'Dusty Gulch outskirts' },
  'm3': { story: 'A sealed letter from the territorial judge must reach the next town before sundown. Simple delivery — unless someone wants it intercepted.', people: 'Judge Harmon', location: 'Dusty Gulch to Coyote Flats' },
  'm3b': { story: 'Rats overrun the general store cellar, eating through flour sacks and grain. Mr. Henderson needs them cleared before he loses his stock.', people: 'Mr. Henderson, store owner', location: 'Henderson\'s General Store' },
  'm4': { story: 'A pack of coyotes has been killing livestock on the Jenkins ranch. Old Man Jenkins is desperate — his family depends on those cattle.', people: 'Old Man Jenkins, 6-8 coyotes', location: 'Jenkins Ranch, Coyote Flats' },
  'm5': { story: 'A supply wagon carrying medicine and tools must cross the open flats. Bandits have been raiding wagons on this route all month.', people: 'Wagon driver Pete, 3-5 bandits', location: 'Coyote Flats trail' },
  'm7': { story: 'Intelligence says a gang of outlaws has set up an ambush point in the narrow canyon pass. Travelers are being robbed daily.', people: '4-6 armed bandits', location: 'Red Mesa Canyon narrows' },
  'm9': { story: 'The Red Mesa Marauder has a $50 bounty. He\'s been robbing prospectors and killing those who resist. Last seen hiding deep in the canyon.', people: 'Red Mesa Marauder (armed & dangerous)', location: 'Red Mesa Canyon hideout' },
  'm16': { story: 'A high-stakes poker game in the back room of the Deadwood saloon. The house dealer is cheating miners out of their wages. Win the game and expose him.', people: '4 players, crooked dealer', location: 'Deadwood Gambling Hall' },
  'm17': { story: 'A notorious gunslinger named "Quick Draw" McGinley has challenged anyone brave enough to face him at dawn. The whole town will be watching.', people: 'Quick Draw McGinley', location: 'Main Street, Deadwood' },
  'm19': { story: 'A large bandit force is planning to overrun Fort Horizon to steal the armory. The garrison is undermanned and needs every gun they can get.', people: '15-20 bandits, fort garrison', location: 'Fort Horizon walls' },
  'm22': { story: 'An entire homestead of settlers vanished overnight from Ghost Valley. No bodies, no tracks, just abandoned belongings. Something unnatural is at work.', people: 'Missing settlers (12 people)', location: 'Ghost Valley settlement' },
  'm25': { story: 'Sheriff Blackwood runs Tombstone Ridge like his personal kingdom. He\'s extorting miners, framing innocents, and anyone who speaks up disappears.', people: 'Sheriff Blackwood, 6 deputies', location: 'Tombstone Ridge Sheriff\'s Office' },
  'm31': { story: 'The Scorpion Desert crossing is 40 miles of waterless hell. Men have died of thirst within sight of the other side. Only the prepared survive.', people: 'Solo journey', location: 'Scorpion Desert' },
  'm36': { story: 'El Diablo — the most wanted outlaw in three territories. He controls Devil\'s Crossing and taxes every traveler with blood or gold.', people: 'El Diablo and his gang (8-12)', location: 'Devil\'s Crossing bridge' },
  'm52': { story: 'The Union Pacific express carries $50,000 in gold bars. Whether you rob it or protect it depends on your conscience — and your gun hand.', people: 'Train crew, guards, potential gang', location: 'Iron Horse Junction railway' },
  'm55': { story: 'Tensions between settlers and Apache tribes have reached a breaking point. A peace council is the last hope before all-out war.', people: 'Chief Running Bear, settlers\' delegation', location: 'Apache Territory, sacred grounds' },
  'm58': { story: 'Vulture City was abandoned when the mine dried up. Now the deadliest outlaws in the West use it as their base. Nobody who enters comes back.', people: '20+ armed outlaws', location: 'Vulture City ruins' },
  'm63': { story: 'An ancient Spanish map, passed through generations, points to El Dorado — the legendary city of gold. Many have tried. None have returned.', people: 'Ancient guardians', location: 'Unknown — follow the Golden Trail' },
  'm65': { story: 'You\'ve come further than any soul alive. The final challenge awaits — become the greatest legend the frontier has ever known.', people: 'All enemies of the West', location: 'The End of the Trail' },
};

function getQuestStory(missionId: string, mission: Mission) {
  const details = QUEST_STORIES[missionId];
  if (details) return details;
  return {
    story: mission.description,
    people: mission.type === 'Combat' ? 'Armed hostiles' : mission.type === 'Escort' ? 'Escort party' : 'Various frontier folk',
    location: 'The frontier',
  };
}

// Check if player has required items for a mission
function checkRequirements(mission: Mission, itemLocations: Record<string, any>): { met: boolean; missing: string[] } {
  if (!mission.requirements || mission.requirements.length === 0) return { met: true, missing: [] };
  const missing: string[] = [];
  for (const req of mission.requirements) {
    if (req.itemName) {
      const hasIt = itemDatabase.some(item => {
        const loc = itemLocations[item.id];
        if (!loc) return false;
        const nameMatch = item.name.toLowerCase().includes(req.itemName!.toLowerCase()) ||
          item.type.toLowerCase() === req.itemName!.toLowerCase();
        return nameMatch;
      });
      if (!hasIt) missing.push(req.itemName);
    }
  }
  // Check if combat missions require weapons
  if (mission.type === 'Combat' || mission.type === 'Bounty') {
    const hasWeapon = itemDatabase.some(item => {
      const loc = itemLocations[item.id];
      if (!loc) return false;
      return item.category === 'weapon' && (item.type === 'sidearm' || item.type === 'longarm' || item.type === 'knife');
    });
    if (!hasWeapon && !missing.includes('Weapon')) missing.push('Weapon (gun or knife)');
  }
  return { met: missing.length === 0, missing };
}

// Check if player has a horse for fast travel
function hasHorse(itemLocations: Record<string, any>): boolean {
  // Check if any horse-related items are owned (saddle counts as having a mount)
  return itemDatabase.some(item => {
    const loc = itemLocations[item.id];
    return loc && item.name.toLowerCase().includes('saddle');
  });
}

export function QuestsSection() {
  const { state, isMissionCompleted, startMission, completeMission, processEncounter, getPlayerLevel, abortQuest, useHealItem } = useGame();
  const { level } = getPlayerLevel();

  const allMissions = mapRegions.flatMap(r =>
    r.missions.map(m => ({ ...m, regionName: r.name, regionId: r.id }))
  );
  const activeMissions = allMissions.filter(m => !isMissionCompleted(m.id) && m.levelRequired <= level + 3);
  const completedMissions = allMissions.filter(m => isMissionCompleted(m.id));
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);

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

      <div className="bg-game-slot/30 border border-game-slot-border p-2 max-h-[500px] overflow-y-auto">
        <h3 className="text-primary font-bold text-[10px] mb-2">AVAILABLE QUESTS</h3>
        {activeMissions.length > 0 ? activeMissions.slice(0, 20).map(m => {
          const locked = level < m.levelRequired;
          const hasActiveQuest = state.activeQuest && state.activeQuest.status !== 'completed' && state.activeQuest.status !== 'failed';
          const reqCheck = checkRequirements(m, state.itemLocations);
          const story = getQuestStory(m.id, m);
          const isExpanded = expandedQuest === m.id;
          const playerHasHorse = hasHorse(state.itemLocations);
          const travelTime = playerHasHorse ? Math.ceil(m.durationMinutes * 0.6) : Math.ceil(m.durationMinutes * 1.5);

          return (
            <div key={m.id} className={`bg-game-slot/50 p-2 mb-1.5 border border-game-slot-border/30 transition-all cursor-pointer hover:border-primary/50 ${locked ? 'opacity-40' : ''}`}
              onClick={() => setExpandedQuest(isExpanded ? null : m.id)}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-foreground text-xs font-bold">{m.name}</span>
                  <span className="text-muted-foreground text-[9px] block">{m.regionName}</span>
                  <div className="flex gap-2 mt-0.5 flex-wrap">
                    <span className="text-[8px] text-primary">🎯 {m.type}</span>
                    <span className="text-[8px] text-primary">⏱ {travelTime}min {playerHasHorse ? '🐴' : '🚶'}</span>
                    {m.encounters && <span className="text-[8px] text-destructive/80">⚔ {m.encounters.length} encounters</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="text-accent text-[9px] block">{m.xpReward} XP · ${m.coinReward}</span>
                  {locked ? (
                    <span className="text-[8px] text-muted-foreground">🔒 LVL {m.levelRequired}</span>
                  ) : hasActiveQuest ? (
                    <span className="text-[8px] text-muted-foreground">ON QUEST</span>
                  ) : !reqCheck.met ? (
                    <span className="text-[8px] text-destructive">⚠ MISSING ITEMS</span>
                  ) : (
                    <button onClick={(e) => {
                      e.stopPropagation();
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

              {/* Expanded quest details */}
              {isExpanded && !locked && (
                <div className="mt-2 pt-2 border-t border-game-slot-border/50 animate-fade-in">
                  <div className="mb-2">
                    <span className="text-[9px] text-primary font-bold">📖 STORY:</span>
                    <p className="text-[10px] text-foreground/80 mt-0.5 leading-relaxed">{story.story}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <span className="text-[8px] text-primary font-bold">👥 INVOLVED:</span>
                      <p className="text-[9px] text-muted-foreground">{story.people}</p>
                    </div>
                    <div>
                      <span className="text-[8px] text-primary font-bold">📍 LOCATION:</span>
                      <p className="text-[9px] text-muted-foreground">{story.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-1 flex-wrap">
                    <span className="text-[8px] text-muted-foreground">
                      🚶 Walk: {Math.ceil(m.durationMinutes * 1.5)}min
                    </span>
                    <span className="text-[8px] text-accent">
                      🐴 Ride: {Math.ceil(m.durationMinutes * 0.6)}min
                    </span>
                  </div>
                  {m.requirements && m.requirements.length > 0 && (
                    <div className="mb-1">
                      <span className="text-[8px] text-primary font-bold">📋 REQUIRES:</span>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {m.requirements.map((req, i) => (
                          <span key={i} className="text-[8px] px-1.5 py-0.5 bg-game-slot-border/50 text-foreground">{req.itemName}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(m.type === 'Combat' || m.type === 'Bounty') && (
                    <div className="text-[8px] text-destructive/80 mt-1">
                      ⚔ Combat mission — requires a weapon (gun or knife)
                    </div>
                  )}
                  {!reqCheck.met && (
                    <div className="mt-1 p-1.5 bg-destructive/10 border border-destructive/30">
                      <span className="text-[8px] text-destructive font-bold">⚠ CANNOT START — Missing:</span>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {reqCheck.missing.map((m, i) => (
                          <span key={i} className="text-[8px] text-destructive">{m}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {!playerHasHorse && (
                    <div className="mt-1 text-[8px] text-accent/70">
                      🚶 No horse — you'll travel on foot (slower travel time)
                    </div>
                  )}
                </div>
              )}
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
  const { state, processEncounter, completeMission, abortQuest, useHealItem, getEquippedItem, equipItem } = useGame();
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
  const story = getQuestStory(quest.missionId, mission);

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

  // Can fist fight for bar brawl type missions
  const isBrawl = mission.name.toLowerCase().includes('brawl') || mission.description.toLowerCase().includes('fist');

  return (
    <div className="border-2 border-primary p-4 mb-4 animate-fade-in" style={{ background: 'linear-gradient(180deg, hsl(30 20% 12%) 0%, hsl(25 30% 8%) 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
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

      {/* Story brief */}
      <div className="text-[9px] text-foreground/60 mb-2 italic">📍 {story.location} — {story.people}</div>

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
              {isBrawl && !equippedSidearm && !equippedLongarm ? '👊 BRAWL' : '⚔ FIGHT'}
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
          {!equippedSidearm && !equippedLongarm && (
            isBrawl
              ? <span className="text-[9px] text-accent">👊 Bare fists</span>
              : <span className="text-[9px] text-destructive">⚠ No weapon equipped!</span>
          )}
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
