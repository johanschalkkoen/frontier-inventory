import { useGame } from '@/context/GameContext';
import { archetypes } from '@/data/archetypes';
import { characters } from '@/data/characters';
import { STANDARD_STATS, SPECIAL_DESCRIPTIONS, SKILL_CATEGORIES, SKILL_ICONS, type PlayerSkills } from '@/data/gameData';

export function ProfileSection() {
  const { state, getCalculatedStats, getPlayerLevel } = useGame();
  const { level, currentXp, xpToNext } = getPlayerLevel();
  const stats = getCalculatedStats();
  const archetype = archetypes.find(a => a.id === state.archetypeId);
  const currentChar = characters.find(c => c.id === state.selectedCharacterId);
  const xpPct = xpToNext > 0 ? (currentXp / xpToNext) * 100 : 0;

  return (
    <div className="flex-1 max-w-[750px]">
      <h2 className="font-display text-xl font-bold text-accent mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        ▸ CHARACTER PROFILE
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
          <h3 className="font-display text-sm font-bold text-accent mb-2">◈ BACKSTORY — {archetype.name.toUpperCase()}</h3>
          <p className="text-foreground/80 text-xs leading-relaxed italic">"{archetype.backstory}"</p>
        </div>
      )}

      {/* S.P.E.C.I.A.L Attributes */}
      <div className="bg-game-slot/60 border-2 border-game-slot-border p-3 mb-4"
        style={{ borderImage: 'linear-gradient(180deg, hsl(var(--accent)/0.5), hsl(var(--primary)/0.3)) 1' }}>
        <h3 className="font-display text-sm font-bold text-accent mb-3">S · P · E · C · I · A · L</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(Object.keys(SPECIAL_DESCRIPTIONS) as (keyof typeof SPECIAL_DESCRIPTIONS)[]).map(key => (
            <div key={key} className="bg-game-slot/80 border border-game-slot-border p-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0">
                <span className="text-accent font-display font-bold text-lg">{SPECIAL_DESCRIPTIONS[key].icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-foreground uppercase">{key}</span>
                  <span className="text-accent font-bold text-base font-display">{state.special[key]}</span>
                </div>
                <p className="text-[8px] text-muted-foreground leading-tight mt-0.5">{SPECIAL_DESCRIPTIONS[key].desc}</p>
                {/* Stat bar */}
                <div className="h-1.5 bg-game-slot border border-game-slot-border/50 mt-1 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent to-primary transition-all" style={{ width: `${state.special[key] * 10}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vital Stats */}
      <div className="bg-game-slot/60 border-2 border-game-slot-border p-3 mb-4"
        style={{ borderImage: 'linear-gradient(180deg, hsl(var(--primary)/0.4), hsl(var(--accent)/0.2)) 1' }}>
        <h3 className="font-display text-sm font-bold text-primary mb-2">◈ VITAL STATS</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {([
            { key: 'health', label: 'Health', icon: '♥' },
            { key: 'energy', label: 'Energy', icon: '≡' },
            { key: 'hunger', label: 'Hunger', icon: '∞' },
            { key: 'thirst', label: 'Quench', icon: '◈' },
            { key: 'sleep', label: 'Sleep', icon: '◑' },
            { key: 'hygiene', label: 'Hygiene', icon: '◇' },
            { key: 'morale', label: 'Morale', icon: '★' },
          ] as { key: keyof typeof state.vitals; label: string; icon: string }[]).map(v => {
            const val = state.vitals[v.key];
            const isLow = val < 30;
            const isCritical = val < 10;
            return (
              <div key={v.key} className="bg-game-slot/80 border border-game-slot-border p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold text-foreground flex items-center gap-1">
                    <span className="font-display text-primary">{v.icon}</span> {v.label}
                  </span>
                  <span className={`text-sm font-bold font-display ${isCritical ? 'text-destructive' : isLow ? 'text-accent' : 'text-foreground'}`}>{Math.round(val)}</span>
                </div>
                <div className="h-2 bg-game-slot border border-game-slot-border/50 overflow-hidden">
                  <div className={`h-full transition-all ${isCritical ? 'bg-destructive' : isLow ? 'bg-accent' : 'bg-primary'}`}
                    style={{ width: `${val}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Western Justice & Reputation */}
      <div className="bg-game-slot/60 border-2 border-game-slot-border p-3 mb-4"
        style={{ borderImage: 'linear-gradient(135deg, hsl(0 60% 30%/0.4), hsl(var(--accent)/0.3)) 1' }}>
        <h3 className="font-display text-sm font-bold text-destructive mb-2">★ WESTERN JUSTICE & REPUTATION</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div className="bg-game-slot/80 border border-game-slot-border p-2 text-center">
            <span className="text-[8px] text-muted-foreground block">WANTED LEVEL</span>
            <span className="text-accent font-bold text-sm">{'★'.repeat(state.justice.wantedLevel)}{'☆'.repeat(5 - state.justice.wantedLevel)}</span>
          </div>
          <div className="bg-game-slot/80 border border-game-slot-border p-2 text-center">
            <span className="text-[8px] text-muted-foreground block">BOUNTY</span>
            <span className="text-destructive font-bold text-lg font-display">${state.justice.bounty.toLocaleString()}</span>
          </div>
          <div className="bg-game-slot/80 border border-game-slot-border p-2 text-center">
            <span className="text-[8px] text-muted-foreground block">LAWFULNESS</span>
            <span className="text-foreground font-bold text-xs">{state.justice.lawfulness}</span>
          </div>
          <div className="bg-game-slot/80 border border-game-slot-border p-2 text-center">
            <span className="text-[8px] text-muted-foreground block">INFAMY</span>
            <span className="text-foreground font-bold text-sm">{state.justice.infamy}</span>
            <div className="h-1.5 bg-game-slot mt-1 overflow-hidden"><div className="h-full bg-destructive" style={{ width: `${state.justice.infamy}%` }} /></div>
          </div>
          <div className="bg-game-slot/80 border border-game-slot-border p-2 text-center">
            <span className="text-[8px] text-muted-foreground block">HONOR</span>
            <span className="text-foreground font-bold text-sm">{state.justice.honor}</span>
            <div className="h-1.5 bg-game-slot mt-1 overflow-hidden"><div className="h-full bg-primary" style={{ width: `${state.justice.honor}%` }} /></div>
          </div>
          <div className="bg-game-slot/80 border border-game-slot-border p-2 text-center">
            <span className="text-[8px] text-muted-foreground block">GUN REP</span>
            <span className="text-foreground font-bold text-sm">{state.justice.gunReputation}</span>
            <div className="h-1.5 bg-game-slot mt-1 overflow-hidden"><div className="h-full bg-accent" style={{ width: `${state.justice.gunReputation}%` }} /></div>
          </div>
        </div>
      </div>

      {/* Gameplay Stats */}
      <div className="bg-game-slot/60 border-2 border-game-slot-border p-3 mb-4"
        style={{ borderImage: 'linear-gradient(180deg, hsl(var(--primary)/0.3), hsl(var(--accent)/0.2)) 1' }}>
        <h3 className="font-display text-sm font-bold text-primary mb-2">◈ GAMEPLAY STATUS</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-game-slot/80 border border-game-slot-border p-2 text-center">
            <span className="text-[8px] text-muted-foreground block">BURDEN</span>
            <span className={`font-bold text-xs ${state.gameplay.burden === 'Heavy' ? 'text-destructive' : state.gameplay.burden === 'Medium' ? 'text-accent' : 'text-rarity-advanced'}`}>{state.gameplay.burden}</span>
          </div>
          <div className="bg-game-slot/80 border border-game-slot-border p-2 text-center">
            <span className="text-[8px] text-muted-foreground block">TEMPERATURE</span>
            <span className={`font-bold text-xs ${state.gameplay.temperatureStress === 'Hot' ? 'text-destructive' : state.gameplay.temperatureStress === 'Cold' ? 'text-blue-400' : 'text-foreground'}`}>{state.gameplay.temperatureStress}</span>
          </div>
          <div className="bg-game-slot/80 border border-game-slot-border p-2 text-center">
            <span className="text-[8px] text-muted-foreground block">INTOXICATION</span>
            <span className={`font-bold text-xs ${state.gameplay.intoxication !== 'Sober' ? 'text-accent' : 'text-foreground'}`}>{state.gameplay.intoxication}</span>
          </div>
          <div className="bg-game-slot/80 border border-game-slot-border p-2 text-center">
            <span className="text-[8px] text-muted-foreground block">PAIN</span>
            <span className={`font-bold text-xs ${state.gameplay.pain > 50 ? 'text-destructive' : state.gameplay.pain > 0 ? 'text-accent' : 'text-foreground'}`}>{state.gameplay.pain}</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-game-slot/60 border-2 border-game-slot-border p-3 mb-4"
        style={{ borderImage: 'linear-gradient(180deg, hsl(var(--primary)/0.4), hsl(var(--accent)/0.2)) 1' }}>
        <h3 className="font-display text-sm font-bold text-primary mb-3">◈ SKILLS</h3>
        {([
          { title: 'COMBAT', keys: SKILL_CATEGORIES.combat },
          { title: 'SURVIVAL & EXPLORATION', keys: SKILL_CATEGORIES.survival },
          { title: 'SOCIAL & CIVILIAN', keys: SKILL_CATEGORIES.social },
        ] as { title: string; keys: (keyof PlayerSkills)[] }[]).map(cat => (
          <div key={cat.title} className="mb-3">
            <span className="text-[9px] text-accent font-bold tracking-wider block mb-1.5">{cat.title}</span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
              {cat.keys.map(sk => {
                const val = state.skills[sk];
                return (
                  <div key={sk} className="bg-game-slot/80 border border-game-slot-border p-1.5 flex items-center gap-2">
                    <span className="text-primary font-display text-xs w-4 text-center">{SKILL_ICONS[sk]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-bold text-foreground uppercase truncate">{sk}</span>
                        <span className="text-[9px] font-bold text-accent">{val}%</span>
                      </div>
                      <div className="h-1.5 bg-game-slot border border-game-slot-border/50 overflow-hidden mt-0.5">
                        <div className="h-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Full Stats Table */}
      <div className="bg-game-slot/60 border-2 border-game-slot-border p-3"
        style={{ borderImage: 'linear-gradient(180deg, hsl(var(--primary)/0.4), hsl(var(--accent)/0.2)) 1' }}>
        <h3 className="font-display text-sm font-bold text-primary mb-2">◈ ATTRIBUTES & STATS</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(stats).map(([k, v]) => {
            const base = STANDARD_STATS[k] || 0;
            const diff = v - base;
            return (
              <div key={k} className="bg-game-slot/80 border border-game-slot-border p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-display text-primary">{getStatIcon(k)}</span>
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
    health: '♥', energy: '≡', thirst: '◈', sleep: '◑', hunger: '∞',
    defense: '⛊', damage: '⚔', speed: '≫', luck: '◆', charisma: '⊲',
    morale: '★', hygiene: '◇',
  };
  return icons[stat] || '▪';
}
