import { useGame } from '@/context/GameContext';
import { InventoryBag } from './InventoryBag';
import { itemDatabase } from '@/data/gameData';
import { horseDatabase, tackDatabase, propertyDatabase, propertyAddOns } from '@/data/horseData';

export function InventorySection() {
  const { state, hasItem } = useGame();

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

      <div className="flex gap-4 mb-4">
        <InventoryBag bagId="bag-left" title="Left Saddlebag" />
        <InventoryBag bagId="bag-right" title="Right Saddlebag" />
      </div>

      {/* All Assets Overview */}
      <div className="space-y-3">
        {/* Properties */}
        <div className="bg-game-slot/30 border border-game-slot-border p-2">
          <h3 className="font-display text-[10px] font-bold text-primary mb-2">🏚️ PROPERTIES & LAND</h3>
          <div className="space-y-1 max-h-[150px] overflow-y-auto">
            {propertyDatabase.map(p => (
              <div key={p.id} className="flex items-center justify-between text-[9px] px-2 py-1 bg-game-slot/40 border border-game-slot-border/20">
                <div>
                  <span className="text-foreground font-bold">{p.name}</span>
                  <span className="text-muted-foreground ml-1">({p.type})</span>
                </div>
                <span className="text-muted-foreground">Not Owned · ${p.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ranch Add-Ons */}
        <div className="bg-game-slot/30 border border-game-slot-border p-2">
          <h3 className="font-display text-[10px] font-bold text-primary mb-2">🔧 RANCH ADD-ONS</h3>
          <div className="space-y-1 max-h-[120px] overflow-y-auto">
            {propertyAddOns.map(a => (
              <div key={a.id} className="flex items-center justify-between text-[9px] px-2 py-1 bg-game-slot/40 border border-game-slot-border/20">
                <span className="text-foreground font-bold">{a.icon} {a.name}</span>
                <span className="text-muted-foreground">Not Built · ${a.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Horses */}
        <div className="bg-game-slot/30 border border-game-slot-border p-2">
          <h3 className="font-display text-[10px] font-bold text-primary mb-2">🐴 HORSES</h3>
          <div className="space-y-1 max-h-[150px] overflow-y-auto">
            {horseDatabase.map(h => (
              <div key={h.id} className="flex items-center justify-between text-[9px] px-2 py-1 bg-game-slot/40 border border-game-slot-border/20">
                <div>
                  <span className="text-foreground font-bold">{h.name}</span>
                  <span className="text-muted-foreground ml-1">{h.breed} · {h.rarity}</span>
                </div>
                <span className="text-muted-foreground">{h.value === 0 ? 'Starter' : `Not Owned · $${h.value}`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tack */}
        <div className="bg-game-slot/30 border border-game-slot-border p-2">
          <h3 className="font-display text-[10px] font-bold text-primary mb-2">🪶 TACK & HORSE GEAR</h3>
          <div className="space-y-1 max-h-[120px] overflow-y-auto">
            {tackDatabase.map(t => (
              <div key={t.id} className="flex items-center justify-between text-[9px] px-2 py-1 bg-game-slot/40 border border-game-slot-border/20">
                <span className="text-foreground font-bold">{t.name}</span>
                <span className="text-muted-foreground">Not Owned · ${t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
