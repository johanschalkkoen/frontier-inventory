import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { shopInventory, shopCategories, type ShopItem } from '@/data/shopData';
import { type Rarity } from '@/data/gameData';
import { ShoppingCart, ArrowLeftRight } from 'lucide-react';

const rarityColors: Record<Rarity, string> = {
  basic: 'border-rarity-basic',
  advanced: 'border-rarity-advanced',
  rare: 'border-rarity-rare',
  epic: 'border-rarity-epic',
  legendary: 'border-rarity-legendary',
};

const rarityTextColors: Record<Rarity, string> = {
  basic: 'text-foreground',
  advanced: 'text-rarity-advanced',
  rare: 'text-rarity-rare',
  epic: 'text-rarity-epic',
  legendary: 'text-rarity-legendary',
};

export function ShopPanel() {
  const { state, equipItem } = useGame();
  const [category, setCategory] = useState('All');
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');

  const filtered = category === 'All'
    ? shopInventory
    : shopInventory.filter(i => i.category === category);

  const handleBuy = (item: ShopItem) => {
    if (state.walletAmount < item.buyPrice) return;
    // For demo: add to inventory via equipItem system
    // In a full game you'd add a new item instance
    alert(`Purchased ${item.name} for $${item.buyPrice}!`);
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-black text-accent tracking-wider flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          GENERAL STORE
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setMode('buy')}
            className={`px-3 py-1 text-[10px] font-bold border border-game-slot-border transition-all ${
              mode === 'buy' ? 'bg-primary text-primary-foreground' : 'bg-game-slot text-foreground'
            }`}
          >BUY</button>
          <button
            onClick={() => setMode('sell')}
            className={`px-3 py-1 text-[10px] font-bold border border-game-slot-border transition-all ${
              mode === 'sell' ? 'bg-primary text-primary-foreground' : 'bg-game-slot text-foreground'
            }`}
          >SELL</button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-1 flex-wrap">
        {shopCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 text-[9px] font-bold tracking-wider border transition-all ${
              category === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-game-slot text-foreground border-game-slot-border hover:border-primary'
            }`}
          >{cat.toUpperCase()}</button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto pr-1">
        {filtered.map((item, idx) => (
          <div key={idx} className={`flex items-center gap-3 bg-game-panel p-2 border ${rarityColors[item.rarity]} hover:brightness-110 transition-all`}>
            <div className="w-12 h-12 flex-shrink-0 bg-game-slot border border-game-slot-border overflow-hidden">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover" loading="lazy" width={48} height={48} />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-bold ${rarityTextColors[item.rarity]}`}>{item.name}</div>
              <div className="text-[8px] text-muted-foreground uppercase tracking-wider">{item.type} • {item.rarity}</div>
              <div className="text-[9px] text-foreground mt-0.5">
                {Object.entries(item.stats).map(([k, v]) => (
                  <span key={k} className={`mr-2 ${(v as number) > 0 ? 'text-rarity-advanced' : 'text-destructive'}`}>
                    {(v as number) > 0 ? '+' : ''}{v as number} {k}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-accent font-bold text-sm">
                ${mode === 'buy' ? item.buyPrice : item.sellPrice}
              </span>
              <button
                onClick={() => mode === 'buy' ? handleBuy(item) : null}
                className={`px-2 py-0.5 text-[9px] font-bold border transition-all ${
                  mode === 'buy'
                    ? state.walletAmount >= item.buyPrice
                      ? 'bg-rarity-advanced/20 border-rarity-advanced text-rarity-advanced hover:bg-rarity-advanced/40'
                      : 'bg-game-slot border-game-slot-border text-muted-foreground cursor-not-allowed'
                    : 'bg-accent/20 border-accent text-accent hover:bg-accent/40'
                }`}
              >
                <ArrowLeftRight className="w-3 h-3 inline mr-1" />
                {mode === 'buy' ? 'BUY' : 'SELL'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
