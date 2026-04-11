import { useGame } from '@/context/GameContext';
import { StatusBar } from './StatusBar';
import { EquipSlot } from './EquipSlot';
import { STANDARD_STATS, type SlotType } from '@/data/gameData';
import { characters } from '@/data/characters';
import { archetypes } from '@/data/archetypes';
import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const leftSlots: { type: SlotType; label: string; icon: string }[] = [
  { type: 'hat', label: 'Hat', icon: '🤠' },
  { type: 'bandana', label: 'Mask', icon: '🎭' },
  { type: 'shirt', label: 'Shirt', icon: '👔' },
  { type: 'outerwear', label: 'Duster', icon: '🧥' },
  { type: 'gloves', label: 'Gloves', icon: '🧤' },
  { type: 'pants', label: 'Pants', icon: '👖' },
  { type: 'boots', label: 'Boots', icon: '🥾' },
];
const rightSlots: { type: SlotType; label: string; icon: string }[] = [
  { type: 'sidearm', label: 'Pistol', icon: '⚔️' },
  { type: 'longarm', label: 'Rifle', icon: '🎯' },
  { type: 'knife', label: 'Blade', icon: '🗡️' },
  { type: 'gunbelt', label: 'Belt', icon: '🪢' },
  { type: 'rope', label: 'Lasso', icon: '🪢' },
  { type: 'canteen', label: 'Water', icon: '🫗' },
  { type: 'tobacco', label: 'Smoke', icon: '🚬' },
];
const accessorySlots: { type: SlotType; label: string; icon: string }[] = [
  { type: 'special', label: 'Misc', icon: '💎' },
];

interface CharacterSectionProps {
  onDeleteCharacter?: () => void;
}

export function CharacterSection({ onDeleteCharacter }: CharacterSectionProps) {
  const { state, getCalculatedStats, getCoinTotal, getPlayerLevel } = useGame();
  const stats = getCalculatedStats();
  const coinTotal = getCoinTotal();
  const { level, currentXp, xpToNext } = getPlayerLevel();

  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; value: number } | null>(null);
  const onHover = (e: React.MouseEvent, name: string, value: number) => setTooltip({ x: e.clientX, y: e.clientY, name, value });
  const onLeave = () => setTooltip(null);

  const currentChar = characters.find(c => c.id === state.selectedCharacterId);
  const xpPct = xpToNext > 0 ? (currentXp / xpToNext) * 100 : 0;
  const archetype = archetypes.find(a => a.id === state.archetypeId);

  const [deleteStep, setDeleteStep] = useState(0);
  const [showBackstory, setShowBackstory] = useState(false);

  return (
    <div className="w-[400px] flex-shrink-0">
      {/* Character Name & Delete */}
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex-1" />
        <h1 className="font-display text-2xl font-black text-accent tracking-wider text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
          {state.characterName || 'Frontier Legend'}
        </h1>
        <div className="flex-1 flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="p-1.5 rounded hover:bg-destructive/20 transition-colors group"
                title="Delete Character"
                onClick={() => setDeleteStep(0)}
              >
                <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-game-container border-2 border-destructive/50">
              {deleteStep === 0 ? (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive font-display text-xl">⚠️ Delete Character?</AlertDialogTitle>
                    <AlertDialogDescription className="text-foreground/80 space-y-2">
                      <p>You are about to <strong className="text-destructive">permanently delete</strong> your character <strong className="text-accent">{state.characterName}</strong>.</p>
                      <p className="text-sm text-destructive/80 font-bold">This will destroy:</p>
                      <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                        <li>All equipped items and inventory</li>
                        <li>All progress, XP, and completed missions</li>
                        <li>All currency and wallet balance</li>
                        <li>Your character portrait and archetype</li>
                      </ul>
                      <p className="text-xs text-destructive font-bold mt-2">THIS CANNOT BE UNDONE.</p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-game-slot-border">Cancel</AlertDialogCancel>
                    <button
                      onClick={() => setDeleteStep(1)}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
                    >
                      I understand, continue
                    </button>
                  </AlertDialogFooter>
                </>
              ) : (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive font-display text-xl">🔥 Final Warning</AlertDialogTitle>
                    <AlertDialogDescription className="text-foreground/80">
                      <p>Are you <strong>absolutely sure</strong>? Nothing will bring <strong className="text-accent">{state.characterName}</strong> back.</p>
                      <p className="text-destructive font-bold text-sm mt-2">All data will be permanently erased.</p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-game-slot-border">Keep my character</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDeleteCharacter}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Forever
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </>
              )}
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {archetype && (
        <p className="text-center text-muted-foreground text-[10px] mb-1">{archetype.title} — {archetype.traits.join(' · ')}</p>
      )}

      {/* Level & XP Bar */}
      <div className="mb-3 bg-game-slot/50 p-2 border-2 border-game-slot-border" style={{ borderImage: 'linear-gradient(135deg, hsl(var(--primary)/0.5), hsl(var(--accent)/0.3)) 1' }}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-accent font-display font-bold text-sm">LEVEL {level}</span>
          <span className="text-[9px] text-muted-foreground">{currentXp} / {xpToNext} XP</span>
        </div>
        <div className="h-3 bg-game-slot border border-game-slot-border rounded-sm overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
            style={{ width: `${xpPct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { label: 'HEALTH', key: 'health', colorClass: 'bg-bar-health' },
          { label: 'ENERGY', key: 'energy', colorClass: 'bg-bar-energy' },
          { label: 'QUENCH', key: 'thirst', colorClass: 'bg-bar-thirst' },
          { label: 'SLEEP', key: 'sleep', colorClass: 'bg-bar-sleep' },
        ].map(b => (
          <StatusBar key={b.key} label={b.label} value={stats[b.key]} max={100} colorClass={b.colorClass} />
        ))}
      </div>

      {/* Equipment layout */}
      <div className="flex gap-3 items-center justify-center">
        {/* Left equip column */}
        <div className="flex flex-col gap-2">
          {leftSlots.map(s => <EquipSlot key={s.type} slotType={s.type} label={s.label} icon={s.icon} onHover={onHover} onLeave={onLeave} />)}
        </div>

        {/* Character portrait */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-[155px] h-[344px] bg-game-slot overflow-hidden"
            style={{
              border: '3px solid transparent',
              borderImage: 'linear-gradient(180deg, hsl(var(--accent)), hsl(var(--primary)/0.5), hsl(var(--accent)/0.3)) 1',
              boxShadow: '0 0 25px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.4), 0 0 15px hsl(var(--accent)/0.15)',
            }}>
            {currentChar && (
              <img src={currentChar.img} alt={currentChar.name}
                   className="w-full h-full object-cover" width={155} height={344} />
            )}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none" />
            {/* Corner ornaments */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-3 h-3`} style={{
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--accent)), transparent)',
                opacity: 0.6,
              }} />
            ))}
          </div>
          {currentChar && (
            <span className="text-[10px] text-accent font-bold tracking-wider">{currentChar.name.toUpperCase()}</span>
          )}
        </div>

        {/* Right equip column */}
        <div className="flex flex-col gap-2">
          {rightSlots.map(s => <EquipSlot key={s.type} slotType={s.type} label={s.label} icon={s.icon} onHover={onHover} onLeave={onLeave} />)}
        </div>
      </div>

      {/* Accessories row */}
      <div className="flex justify-center gap-2 mt-3 p-3 bg-game-slot/20 border border-game-slot-border/30"
        style={{ borderImage: 'linear-gradient(90deg, transparent, hsl(var(--primary)/0.3), transparent) 1' }}>
        {accessorySlots.map(s => <EquipSlot key={s.type} slotType={s.type} label={s.label} icon={s.icon} onHover={onHover} onLeave={onLeave} />)}
      </div>

      {/* Backstory Section */}
      {archetype && (
        <div className="mt-3 border-2 border-game-slot-border overflow-hidden" style={{ borderImage: 'linear-gradient(135deg, hsl(var(--accent)/0.4), hsl(var(--primary)/0.2)) 1' }}>
          <button
            onClick={() => setShowBackstory(!showBackstory)}
            className="w-full flex items-center justify-between p-2.5 bg-game-slot/60 hover:bg-game-slot/80 transition-colors"
          >
            <span className="font-display text-xs font-bold text-primary tracking-wider">📜 BACKSTORY — {archetype.name.toUpperCase()}</span>
            {showBackstory ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {showBackstory && (
            <div className="p-3 bg-game-slot/30 animate-fade-in">
              <div className="flex gap-2 mb-2 flex-wrap">
                {archetype.skills.map(s => (
                  <span key={s} className="text-[8px] px-1.5 py-0.5 bg-primary/20 text-primary border border-primary/30 font-bold">{s}</span>
                ))}
              </div>
              <p className="text-foreground/80 text-xs leading-relaxed italic">
                "{archetype.backstory}"
              </p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {archetype.traits.map(t => (
                  <span key={t} className="text-[9px] px-2 py-0.5 bg-accent/10 text-accent border border-accent/30 font-bold">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Panel */}
      <div className="mt-3 bg-game-slot p-2.5 border-2 border-game-slot-border" style={{ borderImage: 'linear-gradient(180deg, hsl(var(--primary)/0.4), hsl(var(--accent)/0.2)) 1' }}>
        <div className="grid grid-cols-[2fr_1fr_1fr] text-[9px] text-primary border-b border-game-slot-border mb-1 pb-1">
          <span>Attribute</span><span>Base</span><span>Total</span>
        </div>
        {Object.entries(stats).map(([k, v]) => {
          const base = STANDARD_STATS[k] || 0;
          return (
            <div key={k} className="grid grid-cols-[2fr_1fr_1fr] text-[10px] py-0.5">
              <span>{k.toUpperCase()}</span>
              <span>{base}</span>
              <span className={v > base ? 'text-rarity-advanced font-bold' : v < base ? 'text-destructive font-bold' : ''}>{v}</span>
            </div>
          );
        })}
        <div className="mt-2.5 pt-2 border-t border-game-slot-border flex justify-between text-accent font-bold text-xs">
          <span>POCKET COINS:</span>
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
  );
}
