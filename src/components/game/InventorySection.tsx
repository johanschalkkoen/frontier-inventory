import { useGame } from '@/context/GameContext';
import { InventoryBag } from './InventoryBag';
import { itemDatabase } from '@/data/gameData';

export function InventorySection() {
  const { state } = useGame();

  const ownedItems = itemDatabase.filter(i => state.itemLocations[i.id]);
  const equippedCount = ownedItems.filter(i => state.itemLocations[i.id]?.area === 'equipped').length;
  const totalValue = ownedItems.reduce((sum, i) => sum + i.value, 0);

  return (
    <div className="flex-1">
      <h2 className="font-display text-xl font-bold text-accent mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        ⊞ INVENTORY
      </h2>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'TOTAL ITEMS', value: ownedItems.length, color: 'text-accent' },
          { label: 'EQUIPPED', value: equippedCount, color: 'text-accent' },
          { label: 'TOTAL VALUE', value: `$${totalValue}`, color: 'text-accent' },
        ].map(s => (
          <div key={s.label} className="bg-game-slot/50 border-2 border-game-slot-border p-2 text-center"
            style={{ borderImage: 'linear-gradient(135deg, hsl(var(--primary)/0.3), hsl(var(--accent)/0.2)) 1' }}>
            <span className="text-[8px] text-muted-foreground block">{s.label}</span>
            <span className={`${s.color} font-bold text-lg`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Saddlebags */}
      <div className="flex gap-4 mb-4">
        <InventoryBag bagId="bag-left" title="Left Saddlebag" />
        <InventoryBag bagId="bag-right" title="Right Saddlebag" />
      </div>
    </div>
  );
}
