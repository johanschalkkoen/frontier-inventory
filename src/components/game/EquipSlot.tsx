import { type SlotType } from '@/data/gameData';
import { useGame } from '@/context/GameContext';
import { ItemCard } from './ItemCard';

interface EquipSlotProps {
  slotType: SlotType;
  label: string;
  onHover?: (e: React.MouseEvent, name: string, value: number) => void;
  onLeave?: () => void;
}

export function EquipSlot({ slotType, label, onHover, onLeave }: EquipSlotProps) {
  const { getEquippedItem, unequipItem } = useGame();
  const item = getEquippedItem(slotType);

  return (
    <div className="w-16 h-16 bg-game-slot border border-game-slot-border flex items-center justify-center relative">
      {item ? (
        <ItemCard
          item={item}
          onDoubleClick={() => unequipItem(item.id)}
          onMouseEnter={e => onHover?.(e, item.name, item.value)}
          onMouseLeave={onLeave}
        />
      ) : (
        <span className="text-[8px] text-muted-foreground text-center">{label}</span>
      )}
    </div>
  );
}
