import { useGame } from '@/context/GameContext';
import { StatusBar } from './StatusBar';
import { EquipSlot } from './EquipSlot';
import { PaperDoll } from './PaperDoll';
import { STANDARD_STATS, type SlotType } from '@/data/gameData';
import { characters } from '@/data/characters';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const leftSlots: { type: SlotType; label: string }[] = [
  { type: 'hat', label: 'Hat' }, { type: 'bandana', label: 'Mask' },
  { type: 'shirt', label: 'Shirt' }, { type: 'outerwear', label: 'Coat' }, { type: 'gloves', label: 'Gloves' },
];
const rightSlots: { type: SlotType; label: string }[] = [
  { type: 'sidearm', label: 'Sidearm' }, { type: 'longarm', label: 'Longarm' },
  { type: 'gunbelt', label: 'Gunbelt' }, { type: 'pants', label: 'Pants' }, { type: 'boots', label: 'Boots' },
];
const accessorySlots: { type: SlotType; label: string }[] = [
  { type: 'knife', label: 'Knife' }, { type: 'rope', label: 'Rope' },
  { type: 'canteen', label: 'Water' }, { type: 'tobacco', label: 'Tobacco' }, { type: 'special', label: 'Misc' },
];

export function CharacterSection() {
  const { state, setGender, setSelectedCharacter, getCalculatedStats, getCoinTotal } = useGame();
  const stats = getCalculatedStats();
  const coinTotal = getCoinTotal();

  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; value: number } | null>(null);
  const onHover = (e: React.MouseEvent, name: string, value: number) => setTooltip({ x: e.clientX, y: e.clientY, name, value });
  const onLeave = () => setTooltip(null);

  const genderChars = characters.filter(c => c.gender === state.gender);
  const currentChar = characters.find(c => c.id === state.selectedCharacterId) || genderChars[0];
  const currentIdx = genderChars.findIndex(c => c.id === currentChar.id);

  const cycleChar = (dir: -1 | 1) => {
    const next = (currentIdx + dir + genderChars.length) % genderChars.length;
    setSelectedCharacter(genderChars[next].id);
  };

  const barConfigs = [
    { label: 'HEALTH', key: 'health', colorClass: 'bg-bar-health' },
    { label: 'ENERGY', key: 'energy', colorClass: 'bg-bar-energy' },
    { label: 'QUENCH', key: 'thirst', colorClass: 'bg-bar-thirst' },
    { label: 'SLEEP', key: 'sleep', colorClass: 'bg-bar-sleep' },
  ];

  return (
    <div className="w-[360px] flex-shrink-0">
      <h1 className="font-display text-2xl font-black text-accent tracking-wider text-center mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        Frontier Legend
      </h1>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {barConfigs.map(b => (
          <StatusBar key={b.key} label={b.label} value={stats[b.key]} max={100} colorClass={b.colorClass} />
        ))}
      </div>

      <div className="flex gap-1 mb-4">
        <button onClick={() => setGender('male')}
          className={`flex-1 py-2 text-[10px] font-bold border border-game-slot transition-all ${
            state.gender === 'male' ? 'bg-primary text-primary-foreground' : 'bg-game-slot-border text-foreground hover:bg-secondary'
          }`}>Gunslinger</button>
        <button onClick={() => setGender('female')}
          className={`flex-1 py-2 text-[10px] font-bold border border-game-slot transition-all ${
            state.gender === 'female' ? 'bg-primary text-primary-foreground' : 'bg-game-slot-border text-foreground hover:bg-secondary'
          }`}>Bounty Hunter</button>
      </div>

      <div className="flex gap-2.5 items-center justify-center">
        <div className="flex flex-col gap-2">
          {leftSlots.map(s => <EquipSlot key={s.type} slotType={s.type} label={s.label} onHover={onHover} onLeave={onLeave} />)}
        </div>

        {/* Paper Doll with character cycling */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <PaperDoll />
            <button onClick={() => cycleChar(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-game-slot/80 hover:bg-primary/80 p-0.5 transition-colors z-20">
              <ChevronLeft className="w-4 h-4 text-accent" />
            </button>
            <button onClick={() => cycleChar(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-game-slot/80 hover:bg-primary/80 p-0.5 transition-colors z-20">
              <ChevronRight className="w-4 h-4 text-accent" />
            </button>
          </div>
          <span className="text-[10px] text-accent font-bold tracking-wider">{currentChar.name.toUpperCase()}</span>
        </div>

        <div className="flex flex-col gap-2">
          {rightSlots.map(s => <EquipSlot key={s.type} slotType={s.type} label={s.label} onHover={onHover} onLeave={onLeave} />)}
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-2.5 p-2.5 bg-game-slot/30 rounded">
        {accessorySlots.map(s => <EquipSlot key={s.type} slotType={s.type} label={s.label} onHover={onHover} onLeave={onLeave} />)}
      </div>

      {/* Character thumbnails */}
      <div className="flex justify-center gap-2 mt-3">
        {genderChars.map(c => (
          <button key={c.id} onClick={() => setSelectedCharacter(c.id)}
            className={`w-10 h-10 border-2 overflow-hidden transition-all ${
              c.id === state.selectedCharacterId ? 'border-accent shadow-[0_0_8px_hsl(var(--game-gold)/0.5)]' : 'border-game-slot-border opacity-60 hover:opacity-100'
            }`}>
            <img src={c.img} alt={c.name} className="w-full h-full object-cover object-top" width={40} height={40} />
          </button>
        ))}
      </div>

      {/* Stats Panel */}
      <div className="mt-3 bg-game-slot p-2.5 border border-game-slot-border">
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
