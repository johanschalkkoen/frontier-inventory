import { useGame } from '@/context/GameContext';
import { archetypes } from '@/data/archetypes';
import { characters } from '@/data/characters';
import { STANDARD_STATS } from '@/data/gameData';

export function ProfileSection() {
  const { state, getCalculatedStats, getPlayerLevel } = useGame();
  const { level, currentXp, xpToNext } = getPlayerLevel();
  const stats = getCalculatedStats();
  const archetype = archetypes.find(a => a.id === state.archetypeId);
  const currentChar = characters.find(c => c.id === state.selectedCharacterId);
  const xpPct = xpToNext > 0 ? (currentXp / xpToNext) * 100 : 0;

  return (
    <div className="flex-1 max-w-[700px]">
      <h2 className="font-display text-xl font-bold text-accent mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        👤 CHARACTER PROFILE
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Portrait */}
        <div className="flex-shrink-0">
          {currentChar && (
            <div className="w-[140px] h-[200px] bg-game-slot overflow-hidden mx-auto"
              style={{
                border: '3px solid transparent',
                borderImage: 'linear-gradient(180deg, hsl(var(--accent)), hsl(var(--primary)/0.5)) 1',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
              }}>
              <img src={currentChar.img} alt={currentChar.name} className="w-full h-full object-cover" width={140} height={200} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="font-display text-2xl font-bold text-accent">{state.characterName}</h3>
          {archetype && (
            <>
              <p className="text-primary text-sm font-bold">{archetype.title}</p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {archetype.traits.map(t => (
                  <span key={t} className="text-[9px] px-2 py-0.5 bg-accent/10 text-accent border border-accent/30 font-bold">{t}</span>
                ))}
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {archetype.skills.map(s => (
                  <span key={s} className="text-[8px] px-1.5 py-0.5 bg-primary/20 text-primary border border-primary/30 font-bold">{s}</span>
                ))}
              </div>
            </>
          )}

          {/* Level & XP */}
          <div className="mt-3 bg-game-slot/50 p-2 border border-game-slot-border">
            <div className="flex justify-between items-center mb-1">
              <span className="text-accent font-display font-bold text-sm">LEVEL {level}</span>
              <span className="text-[9px] text-muted-foreground">{currentXp} / {xpToNext} XP</span>
            </div>
            <div className="h-3 bg-game-slot border border-game-slot-border rounded-sm overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500" style={{ width: `${xpPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Full Backstory */}
      {archetype && (
        <div className="bg-game-slot/40 border-2 border-game-slot-border p-4 mb-4"
          style={{ borderImage: 'linear-gradient(135deg, hsl(var(--accent)/0.4), hsl(var(--primary)/0.2)) 1' }}>
          <h3 className="font-display text-sm font-bold text-accent mb-2">📜 BACKSTORY — {archetype.name.toUpperCase()}</h3>
          <p className="text-foreground/80 text-xs leading-relaxed italic">"{archetype.backstory}"</p>
        </div>
      )}

      {/* Full Stats Table */}
      <div className="bg-game-slot/60 border-2 border-game-slot-border p-3"
        style={{ borderImage: 'linear-gradient(180deg, hsl(var(--primary)/0.4), hsl(var(--accent)/0.2)) 1' }}>
        <h3 className="font-display text-sm font-bold text-primary mb-2">📊 ATTRIBUTES & STATS</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(stats).map(([k, v]) => {
            const base = STANDARD_STATS[k] || 0;
            const diff = v - base;
            return (
              <div key={k} className="bg-game-slot/80 border border-game-slot-border p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getStatIcon(k)}</span>
                  <span className="text-[10px] font-bold text-foreground">{k.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-muted-foreground">{base}</span>
                  <span className="text-xs font-bold text-foreground">→</span>
                  <span className={`text-sm font-bold ${diff > 0 ? 'text-rarity-advanced' : diff < 0 ? 'text-destructive' : 'text-foreground'}`}>
                    {v}
                  </span>
                  {diff !== 0 && (
                    <span className={`text-[8px] ${diff > 0 ? 'text-rarity-advanced' : 'text-destructive'}`}>
                      ({diff > 0 ? '+' : ''}{diff})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getStatIcon(stat: string): string {
  const icons: Record<string, string> = {
    health: '❤️', energy: '⚡', thirst: '💧', sleep: '😴',
    defense: '🛡️', damage: '⚔️', speed: '🏃', luck: '🍀', charisma: '💬',
  };
  return icons[stat] || '📊';
}
