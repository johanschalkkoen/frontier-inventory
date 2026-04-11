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
      <div className={`w-[62px] h-[62px] rounded-lg border-2 flex items-center justify-center relative overflow-hidden transition-all duration-200
        ${item
          ? 'border-primary/70 bg-game-slot shadow-[inset_0_0_15px_rgba(0,0,0,0.5),0_0_10px_hsl(var(--primary)/0.25)]'
          : 'border-game-slot-border/40 bg-gradient-to-b from-game-slot/70 to-game-slot/40 hover:border-primary/40 hover:shadow-[0_0_8px_hsl(var(--primary)/0.15)]'
        }`}>
        {/* Western-style corner rivets */}
        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, hsl(var(--primary)), hsl(var(--primary)/0.4))' }} />
        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, hsl(var(--primary)), hsl(var(--primary)/0.4))' }} />
        <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, hsl(var(--primary)), hsl(var(--primary)/0.4))' }} />
        <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, hsl(var(--primary)), hsl(var(--primary)/0.4))' }} />

        {/* Leather texture bg */}
        {!item && <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, hsl(var(--primary)/0.1) 2px, hsl(var(--primary)/0.1) 4px)' }} />}

        {item ? (
          <ItemCard
            item={item}
            onDoubleClick={() => unequipItem(item.id)}
            onMouseEnter={e => onHover?.(e, item.name, item.value)}
            onMouseLeave={onLeave}
          />
        ) : (
          <div className="flex flex-col items-center gap-0.5 opacity-50 group-hover:opacity-70 transition-opacity">
            <span className="text-base drop-shadow-sm">{icon}</span>
            <span className="text-[6px] text-muted-foreground font-bold tracking-wider uppercase">{label}</span>
          </div>
        )}

        {/* Equipped glow ring */}
        {item && <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_6px_hsl(var(--accent)/0.3)] pointer-events-none" />}
      </div>
    </div>
  );
}
