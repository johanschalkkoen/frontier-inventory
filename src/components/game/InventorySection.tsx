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
        📦 INVENTORY
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-game-slot/50 border border-game-slot-border p-2 text-center">
          <span className="text-[8px] text-muted-foreground block">TOTAL ITEMS</span>
          <span className="text-accent font-bold text-lg">{ownedItems.length}</span>
        </div>
        <div className="bg-game-slot/50 border border-game-slot-border p-2 text-center">
          <span className="text-[8px] text-muted-foreground block">EQUIPPED</span>
          <span className="text-accent font-bold text-lg">{equippedCount}</span>
        </div>
        <div className="bg-game-slot/50 border border-game-slot-border p-2 text-center">
          <span className="text-[8px] text-muted-foreground block">TOTAL VALUE</span>
          <span className="text-accent font-bold text-lg">${totalValue}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <InventoryBag bagId="bag-left" title="Left Saddlebag" />
        <InventoryBag bagId="bag-right" title="Right Saddlebag" />
      </div>
    </div>
  );
}
