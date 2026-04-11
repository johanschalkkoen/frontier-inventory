import { useGame } from '@/context/GameContext';
import { StatusBar } from './StatusBar';
import { EquipSlot } from './EquipSlot';
import { InventoryBag } from './InventoryBag';
import { STANDARD_STATS, type SlotType } from '@/data/gameData';
import { characters } from '@/data/characters';
import { archetypes } from '@/data/archetypes';
import { STAT_CLASSES } from '@/data/statClasses';
import { useState } from 'react';
import { Plus } from 'lucide-react';

const leftSlots: { type: SlotType; label: string; icon: string }[] = [
  { type: 'hat', label: 'Hat', icon: '⌐' },
  { type: 'bandana', label: 'Bandana', icon: '≋' },
  { type: 'shirt', label: 'Shirt', icon: '⊤' },
  { type: 'outerwear', label: 'Duster', icon: '∩' },
  { type: 'gloves', label: 'Gloves', icon: '⊙' },
  { type: 'pants', label: 'Pants', icon: '∏' },
  { type: 'boots', label: 'Boots', icon: '⊥' },
];
const rightSlots: { type: SlotType; label: string; icon: string }[] = [
  { type: 'sidearm', label: 'Pistol', icon: '⌁' },
  { type: 'longarm', label: 'Rifle', icon: '╪' },
  { type: 'knife', label: 'Blade', icon: '†' },
  { type: 'gunbelt', label: 'Belt', icon: '⊶' },
  { type: 'rope', label: 'Lasso', icon: '◎' },
  { type: 'canteen', label: 'Water', icon: '◉' },
  { type: 'tobacco', label: 'Smoke', icon: '⊘' },
];

const pocketBeltSlots: { type: SlotType; label: string; icon: string }[] = [
  { type: 'pocket1', label: 'Pocket', icon: '◫' },
  { type: 'pocket2', label: 'Pocket', icon: '◫' },
  { type: 'pocket3', label: 'Pocket', icon: '◫' },
  { type: 'belt1', label: 'Belt', icon: '⊷' },
  { type: 'belt2', label: 'Belt', icon: '⊷' },
  { type: 'belt3', label: 'Belt', icon: '⊷' },
  { type: 'shovel', label: 'Shovel', icon: '⚒' },
  { type: 'special', label: 'Misc', icon: '⊞' },
];

const statIcons: Record<string, string> = {
  damage: '⚔', defense: '⛊', speed: '≫', luck: '◆', charisma: '⊲',
};

export function CharacterSection() {
  const { state, getCalculatedStats, getCoinTotal, getPlayerLevel, setActiveTab, spendStatPoint } = useGame();
  const stats = getCalculatedStats();
  const coinTotal = getCoinTotal();
  const { level, currentXp, xpToNext } = getPlayerLevel();

  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; value: number } | null>(null);
  const onHover = (e: React.MouseEvent, name: string, value: number) => setTooltip({ x: e.clientX, y: e.clientY, name, value });
  const onLeave = () => setTooltip(null);

  const currentChar = characters.find(c => c.id === state.selectedCharacterId);
  const xpPct = xpToNext > 0 ? (currentXp / xpToNext) * 100 : 0;
  const archetype = archetypes.find(a => a.id === state.archetypeId);
  const statClass = STAT_CLASSES.find(sc => sc.id === state.statClassId);

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {/* Left: Character equipment */}
      <div className="w-full lg:w-[420px] flex-shrink-0">
        {/* Character Name & Profile Button */}
        <div className="flex items-center justify-center gap-3 mb-1">
          <h1 className="font-display text-lg md:text-2xl font-black text-accent tracking-wider text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
            {state.characterName || 'Frontier Legend'}
          </h1>
          <button onClick={() => setActiveTab('PROFILE')}
            className="px-2 py-0.5 bg-primary/20 border border-primary text-primary text-[9px] font-bold hover:bg-primary/40 transition-colors">
            ▸ Profile
          </button>
        </div>

        {archetype && (
          <p className="text-center text-muted-foreground text-[9px] md:text-[10px] mb-1">{archetype.title} — {archetype.traits.join(' · ')}</p>
        )}

        {/* Level & XP */}
        <div className="mb-3 bg-game-slot/50 p-2 border-2 border-game-slot-border"
          style={{ borderImage: 'linear-gradient(135deg, hsl(var(--accent)/0.5), hsl(var(--primary)/0.3)) 1' }}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-accent font-display font-bold text-sm">★ LEVEL {level}</span>
            <span className="text-[9px] text-muted-foreground">{currentXp} / {xpToNext} XP</span>
          </div>
          <div className="h-4 bg-game-slot border border-game-slot-border rounded-sm overflow-hidden relative"
            style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
            <div className="h-full transition-all duration-700" style={{
              width: `${xpPct}%`,
              background: 'linear-gradient(90deg, hsl(30 47% 35%), hsl(43 90% 55%), hsl(30 47% 53%))',
            }} />
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-b from-foreground/15 to-transparent pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[7px] font-bold text-foreground/70 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{Math.round(xpPct)}%</span>
            </div>
          </div>
          {state.unspentStatPoints > 0 && (
            <div className="mt-1 text-center">
              <span className="text-[9px] text-accent font-bold animate-pulse">★ {state.unspentStatPoints} stat point{state.unspentStatPoints > 1 ? 's' : ''} available!</span>
            </div>
          )}
        </div>

        {/* Vital Status Bars */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <StatusBar label="HEALTH" value={state.vitals.health} max={100} colorClass="bg-bar-health" icon="♥" />
          <StatusBar label="ENERGY" value={state.vitals.energy} max={100} colorClass="bg-bar-energy" icon="≡" />
          <StatusBar label="QUENCH" value={state.vitals.thirst} max={100} colorClass="bg-bar-thirst" icon="◈" />
          <StatusBar label="SLEEP" value={state.vitals.sleep} max={100} colorClass="bg-bar-sleep" icon="◑" />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <StatusBar label="HUNGER" value={state.vitals.hunger} max={100} colorClass="bg-bar-energy" icon="∞" />
          <StatusBar label="MORALE" value={state.vitals.morale} max={100} colorClass="bg-bar-health" icon="★" />
          <StatusBar label="HYGIENE" value={state.vitals.hygiene} max={100} colorClass="bg-bar-thirst" icon="◇" />
        </div>

        {/* Equipment layout */}
        <div className="flex gap-1.5 md:gap-3 items-center justify-center">
          <div className="flex flex-col gap-1 md:gap-2">
            {leftSlots.map(s => <EquipSlot key={s.type} slotType={s.type} label={s.label} icon={s.icon} onHover={onHover} onLeave={onLeave} />)}
          </div>

          {/* Character portrait */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-[100px] md:w-[155px] h-[230px] md:h-[344px] bg-game-slot overflow-hidden"
              style={{
                border: '3px solid transparent',
                borderImage: 'linear-gradient(180deg, hsl(var(--accent)), hsl(var(--primary)/0.5), hsl(var(--accent)/0.3)) 1',
                boxShadow: '0 0 25px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.4), 0 0 15px hsl(var(--accent)/0.15)',
              }}>
              {currentChar && (
                <img src={currentChar.img} alt={currentChar.name} className="w-full h-full object-cover" width={155} height={344} />
              )}
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none" />
              {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-3 h-3`} style={{
                  background: 'radial-gradient(circle at 50% 50%, hsl(var(--accent)), transparent)',
                  opacity: 0.6,
                }} />
              ))}
            </div>
            {currentChar && (
              <span className="text-[9px] md:text-[10px] text-accent font-bold tracking-wider">{currentChar.name.toUpperCase()}</span>
            )}
          </div>

          <div className="flex flex-col gap-1 md:gap-2">
            {rightSlots.map(s => <EquipSlot key={s.type} slotType={s.type} label={s.label} icon={s.icon} onHover={onHover} onLeave={onLeave} />)}
          </div>
        </div>

        {/* Pockets & Belt section */}
        <div className="mt-3 p-2 bg-game-slot/30 border-2 border-game-slot-border"
          style={{ borderImage: 'linear-gradient(90deg, hsl(var(--accent)/0.3), hsl(var(--primary)/0.4), hsl(var(--accent)/0.3)) 1' }}>
          <div className="text-[8px] text-primary font-bold tracking-wider mb-1.5 text-center">POCKETS · BELT · TOOLS</div>
          <div className="flex justify-center gap-1.5 flex-wrap">
            {pocketBeltSlots.map(s => <EquipSlot key={s.type} slotType={s.type} label={s.label} icon={s.icon} onHover={onHover} onLeave={onLeave} />)}
          </div>
        </div>

        {/* Stat Class Display */}
        {statClass && (
          <div className="mt-3 bg-game-slot/60 p-2 md:p-3 border-2 border-game-slot-border"
            style={{ borderImage: 'linear-gradient(180deg, hsl(var(--accent)/0.5), hsl(var(--primary)/0.3)) 1' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] text-accent font-display font-bold tracking-widest">{statClass.acronym}</span>
              {state.unspentStatPoints > 0 && (
                <span className="text-[8px] text-accent font-bold animate-pulse">+{state.unspentStatPoints} pts</span>
              )}
            </div>
            <div className={`grid gap-1 ${statClass.attributes.length <= 5 ? 'grid-cols-5' : 'grid-cols-3 md:grid-cols-6'}`}>
              {statClass.attributes.map(attr => (
                <div key={attr.key} className="bg-game-slot/80 border border-game-slot-border p-1 text-center group relative"
                  title={attr.desc}>
                  <span className="text-accent font-display font-bold text-sm block">{attr.icon}</span>
                  <span className="text-foreground font-bold text-base font-display">{state.statClassValues[attr.key] || 1}</span>
                  <span className="text-[5px] text-muted-foreground block">{attr.name.slice(0, 4).toUpperCase()}</span>
                  {state.unspentStatPoints > 0 && (state.statClassValues[attr.key] || 1) < 10 && (
                    <button onClick={() => spendStatPoint(attr.key)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-3 bg-game-slot/60 p-2 md:p-3 border-2 border-game-slot-border"
          style={{ borderImage: 'linear-gradient(180deg, hsl(var(--accent)/0.4), hsl(var(--primary)/0.2)) 1' }}>
          <div className="grid grid-cols-5 gap-1 md:gap-1.5">
            {['damage', 'defense', 'speed', 'luck', 'charisma'].map(k => {
              const val = stats[k] || 0;
              const base = STANDARD_STATS[k] || 0;
              const isAbove = val > base;
              return (
                <div key={k} className="bg-game-slot/80 border border-game-slot-border p-1 md:p-1.5 text-center relative overflow-hidden"
                  style={{ borderImage: isAbove ? 'linear-gradient(135deg, hsl(120 50% 45% / 0.4), transparent) 1' : undefined }}>
                  <span className="text-xs md:text-sm block mb-0.5 font-display text-primary">{statIcons[k] || '▪'}</span>
                  <span className="text-[6px] md:text-[7px] text-muted-foreground block">{k.toUpperCase()}</span>
                  <span className={`text-sm md:text-base font-bold font-display ${isAbove ? 'text-rarity-advanced' : 'text-foreground'}`}>
                    {val}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Western Justice quick view */}
          <div className="mt-2 pt-2 border-t border-game-slot-border grid grid-cols-3 gap-1.5">
            <div className="text-center">
              <span className="text-[7px] text-muted-foreground block">WANTED</span>
              <span className="text-accent font-bold text-xs">{'★'.repeat(state.justice.wantedLevel)}{'☆'.repeat(5 - state.justice.wantedLevel)}</span>
            </div>
            <div className="text-center">
              <span className="text-[7px] text-muted-foreground block">HONOR</span>
              <span className="text-foreground font-bold text-xs">{state.justice.honor}</span>
            </div>
            <div className="text-center">
              <span className="text-[7px] text-muted-foreground block">BOUNTY</span>
              <span className="text-destructive font-bold text-xs">${state.justice.bounty}</span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-game-slot-border flex justify-between text-accent font-bold text-xs">
            <span>$ WALLET:</span>
            <span>${coinTotal.toFixed(2)}</span>
          </div>
        </div>

        {tooltip && (
          <div className="fixed z-50 bg-game-slot text-foreground p-2.5 border border-primary text-[11px] pointer-events-none"
               style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}>
            <strong>{tooltip.name}</strong>
            {tooltip.value > 0 && <><br /><span className="text-accent">${tooltip.value.toFixed(2)}</span></>}
          </div>
        )}
      </div>

      {/* Right: Saddlebags */}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        <InventoryBag bagId="bag-left" title="Left Saddlebag" />
        <InventoryBag bagId="bag-right" title="Right Saddlebag" />
      </div>
    </div>
  );
}
