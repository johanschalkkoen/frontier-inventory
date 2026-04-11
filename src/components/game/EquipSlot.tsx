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
      <div className={`w-[62px] h-[62px] flex items-center justify-center relative overflow-hidden transition-all duration-200
        ${item
          ? 'bg-game-slot shadow-[inset_0_0_15px_rgba(0,0,0,0.5),0_0_12px_hsl(var(--primary)/0.3)]'
          : 'bg-gradient-to-b from-game-slot/70 to-game-slot/40 hover:shadow-[0_0_10px_hsl(var(--primary)/0.2)]'
        }`}
        style={{
          border: item ? '2px solid transparent' : '2px solid transparent',
          borderImage: item
            ? 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--primary)/0.6), hsl(var(--accent)/0.4)) 1'
            : 'linear-gradient(135deg, hsl(var(--primary)/0.25), hsl(var(--primary)/0.1)) 1',
        }}>
        {/* Corner rivets */}
        {['top-0.5 left-0.5', 'top-0.5 right-0.5', 'bottom-0.5 left-0.5', 'bottom-0.5 right-0.5'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-1.5 h-1.5 rounded-full`}
            style={{ background: `radial-gradient(circle at 30% 30%, ${item ? 'hsl(var(--accent))' : 'hsl(var(--primary)/0.4)'}, transparent)` }} />
        ))}

        {/* Leather texture */}
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

        {/* Glow */}
        {item && <div className="absolute inset-0 shadow-[inset_0_0_8px_hsl(var(--accent)/0.3)] pointer-events-none" />}
      </div>
    </div>
  );
}
