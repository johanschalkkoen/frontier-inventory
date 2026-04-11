import { useGame } from '@/context/GameContext';
import { ItemCard } from './ItemCard';
import { useState } from 'react';

interface InventoryBagProps {
  bagId: 'bag-left' | 'bag-right';
  title: string;
}

export function InventoryBag({ bagId, title }: InventoryBagProps) {
  const { getItemsInLocation, equipItem, getBagCount } = useGame();
  const items = getItemsInLocation(bagId);
  const count = getBagCount(bagId);

  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; value: number } | null>(null);

  const emptySlots = Array.from({ length: 20 - items.length });

  return (
    <div className="bg-game-panel p-3 border-2 border-game-slot shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
      <h2 className="text-primary text-xs border-b border-game-slot-border pb-1 mb-2 font-bold">
        {title} <span className="text-muted-foreground">{count}/20</span>
      </h2>
      <div className="grid grid-cols-4 gap-1.5" style={{ gridAutoRows: '64px' }}>
        {items.map(item => (
          <div key={item.id} className="w-16 h-16 bg-game-slot border border-game-slot-border">
            <ItemCard
              item={item}
              onDoubleClick={() => equipItem(item.id)}
              onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY, name: item.name, value: item.value })}
              onMouseLeave={() => setTooltip(null)}
            />
          </div>
        ))}
        {emptySlots.map((_, i) => (
          <div key={`empty-${i}`} className="w-16 h-16 bg-game-slot border border-game-slot-border" />
        ))}
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
