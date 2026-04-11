import { useGame } from '@/context/GameContext';
import { InventoryBag } from './InventoryBag';
import { itemDatabase } from '@/data/gameData';
import { horseDatabase, tackDatabase, propertyDatabase, propertyAddOns } from '@/data/horseData';

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

      {/* All Assets */}
      <div className="space-y-3">
        <AssetSection title="⌂ PROPERTIES & LAND" items={propertyDatabase.map(p => ({
          name: p.name, detail: p.type, cost: p.cost, owned: false,
        }))} />
        <AssetSection title="⚒ RANCH ADD-ONS" items={propertyAddOns.map(a => ({
          name: `${a.icon} ${a.name}`, detail: a.benefits.slice(0, 40) + '...', cost: a.cost, owned: false,
        }))} />
        <AssetSection title="⊳ HORSES" items={horseDatabase.map(h => ({
          name: h.name, detail: `${h.breed} · ${h.rarity}`, cost: h.value, owned: h.value === 0,
        }))} />
        <AssetSection title="∿ TACK & GEAR" items={tackDatabase.map(t => ({
          name: t.name, detail: t.category, cost: t.value, owned: false,
        }))} />
      </div>
    </div>
  );
}

function AssetSection({ title, items }: {
  title: string;
  items: { name: string; detail: string; cost: number; owned: boolean }[];
}) {
  return (
    <div className="bg-game-slot/30 border-2 border-game-slot-border p-2"
      style={{ borderImage: 'linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--accent)/0.1)) 1' }}>
      <h3 className="font-display text-[10px] font-bold text-primary mb-2">{title}</h3>
      <div className="space-y-1 max-h-[140px] overflow-y-auto">
        {items.map((item, i) => (
          <div key={i} className={`flex items-center justify-between text-[9px] px-2 py-1.5 border transition-all
            ${item.owned
              ? 'bg-rarity-advanced/10 border-rarity-advanced/30'
              : 'bg-game-slot/40 border-game-slot-border/20 hover:bg-game-slot/60'
            }`}>
            <div>
              <span className={`font-bold ${item.owned ? 'text-rarity-advanced' : 'text-foreground'}`}>
                {item.owned && '✓ '}{item.name}
              </span>
              <span className="text-muted-foreground ml-1">({item.detail})</span>
            </div>
            <span className={item.owned ? 'text-rarity-advanced font-bold' : 'text-muted-foreground'}>
              {item.owned ? 'OWNED' : item.cost > 0 ? `$${item.cost}` : 'FREE'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
