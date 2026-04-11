import { type SlotType } from '@/data/gameData';
import { useGame } from '@/context/GameContext';
import { ItemCard } from './ItemCard';

interface EquipSlotProps {
  slotType: SlotType;
  label: string;
  icon: string;
  onHover?: (e: React.MouseEvent, name: string, value: number) => void;
  onLeave?: () => void;
}

export function EquipSlot({ slotType, label, icon, onHover, onLeave }: EquipSlotProps) {
  const { getEquippedItem, unequipItem } = useGame();
  const item = getEquippedItem(slotType);

  return (
    <div className="group relative">
      <div className={`w-[60px] h-[60px] rounded-lg border-2 flex items-center justify-center relative overflow-hidden transition-all duration-200
        ${item
          ? 'border-primary/60 bg-game-slot shadow-[inset_0_0_12px_rgba(0,0,0,0.4),0_0_8px_hsl(var(--primary)/0.2)]'
          : 'border-game-slot-border/50 bg-game-slot/60 hover:border-primary/30 hover:bg-game-slot/80'
        }`}>
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/30 rounded-tl-sm" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/30 rounded-tr-sm" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/30 rounded-bl-sm" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/30 rounded-br-sm" />

        {item ? (
          <ItemCard
            item={item}
            onDoubleClick={() => unequipItem(item.id)}
            onMouseEnter={e => onHover?.(e, item.name, item.value)}
            onMouseLeave={onLeave}
          />
        ) : (
          <div className="flex flex-col items-center gap-0.5 opacity-40">
            <span className="text-base">{icon}</span>
            <span className="text-[7px] text-muted-foreground font-bold tracking-wider uppercase">{label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
