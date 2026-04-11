import { useState, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { itemDatabase, type GameItem, type Rarity, type ItemCategory } from '@/data/gameData';
import { horseDatabase, tackDatabase, propertyDatabase, shopConfigs } from '@/data/horseData';
import horseImg from '@/assets/items/horse.jpg';
import tackImg from '@/assets/items/saddle-tack.jpg';
import cabinImg from '@/assets/items/cabin.jpg';
import { toast } from 'sonner';

const RARITY_COLORS: Record<Rarity, string> = {
  basic: 'text-rarity-basic border-rarity-basic',
  advanced: 'text-rarity-advanced border-rarity-advanced',
  rare: 'text-rarity-rare border-rarity-rare',
  epic: 'text-rarity-epic border-rarity-epic',
  legendary: 'text-rarity-legendary border-rarity-legendary',
};

const MAIN_TABS = ['Buy', 'Sell'] as const;
type MainTab = typeof MAIN_TABS[number];

const BUY_CATEGORIES: { key: ItemCategory | 'horses' | 'tack' | 'properties'; label: string; icon: string }[] = [
  { key: 'clothing', label: 'Apparel', icon: '⌐' },
  { key: 'weapon', label: 'Weapons', icon: '⌁' },
  { key: 'ammo', label: 'Ammo', icon: '•' },
  { key: 'food', label: 'Provisions', icon: '≡' },
  { key: 'drink', label: 'Drinks', icon: '◉' },
  { key: 'edc', label: 'Trail Gear', icon: '⊞' },
  { key: 'medicine', label: 'Medicine', icon: '+' },
  { key: 'luxury', label: 'Luxury', icon: '✦' },
  { key: 'horses', label: 'Horses', icon: '⊳' },
  { key: 'tack', label: 'Tack', icon: '∿' },
  { key: 'properties', label: 'Land', icon: '⌂' },
];

const SHOP_FILTERS = [
  { key: 'all', label: 'All Shops', icon: '🏪' },
  { key: 'shop-general', label: 'General Store', icon: '🏪' },
  { key: 'shop-livery', label: 'Livery Stable', icon: '🐴' },
  { key: 'shop-saddle', label: 'Saddle Shop', icon: '🪶' },
  { key: 'shop-auction', label: 'Auction House', icon: '🔔' },
];

export function ShopSection() {
  const { state, getPlayerLevel, buyItem, sellItem, hasItem } = useGame();
  const { level } = getPlayerLevel();
  const [mainTab, setMainTab] = useState<MainTab>('Buy');
  const [buyCategory, setBuyCategory] = useState<string>('clothing');
  const [selectedShop, setSelectedShop] = useState('shop-general');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const shop = shopConfigs.find(s => s.id === selectedShop) || shopConfigs[0];

  const filteredItems = useMemo(() => {
    if (mainTab === 'Sell') {
      return itemDatabase.filter(i => hasItem(i.id));
    }
    return itemDatabase.filter(i => i.category === buyCategory && i.levelRequired <= level + 3);
  }, [buyCategory, level, mainTab, hasItem]);

  const filteredHorses = useMemo(() => horseDatabase.filter(h => h.level <= level + 2), [level]);
  const filteredProperties = propertyDatabase.filter(p => p.levelRequired <= level + 3);

  const handleBuy = (item: GameItem) => {
    const price = Math.round(item.value * shop.priceMultiplier);
    const success = buyItem(item.id, price);
    if (success) toast.success(`Bought ${item.name} for $${price}!`);
    else if (state.walletAmount < price) toast.error('Not enough funds, partner!');
    else toast.error('Already owned or saddlebags full!');
  };

  const handleSell = (item: GameItem) => {
    const sellPrice = Math.round(item.value * shop.sellBackRate);
    const success = sellItem(item.id, sellPrice);
    if (success) toast.success(`Sold ${item.name} for $${sellPrice}!`);
    else toast.error('Cannot sell this item!');
  };

  return (
    <div className="flex-1 flex gap-4">
      <div className="w-[320px] flex-shrink-0">
        <h2 className="font-display text-xl font-bold text-accent mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
          🏪 {shop.name.toUpperCase()}
        </h2>

        {/* Shop selector */}
        <div className="flex flex-wrap gap-1 mb-2">
          {SHOP_FILTERS.filter(f => f.key !== 'all').map(f => (
            <button key={f.key} onClick={() => { setSelectedShop(f.key); setSelectedItem(null); }}
              className={`px-2 py-1.5 text-[9px] font-bold border transition-all ${
                f.key === selectedShop
                  ? 'border-accent bg-accent/20 text-accent'
                  : 'border-game-slot-border bg-game-slot/30 text-muted-foreground hover:text-foreground hover:border-primary/50'
              }`}>
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Buy/Sell toggle */}
        <div className="flex gap-1 mb-2">
          {MAIN_TABS.map(tab => (
            <button key={tab} onClick={() => { setMainTab(tab); setSelectedItem(null); }}
              className={`flex-1 py-2 text-xs font-bold border transition-all ${
                tab === mainTab
                  ? tab === 'Sell' ? 'bg-destructive text-destructive-foreground border-destructive' : 'bg-primary text-primary-foreground border-accent'
                  : 'bg-game-slot-border text-foreground border-game-slot hover:bg-secondary'
              }`}>
              {tab === 'Sell' ? '💰 SELL ITEMS' : '🛒 BUY GOODS'}
            </button>
          ))}
        </div>

        {/* Category tabs */}
        {mainTab === 'Buy' && (
          <div className="flex flex-wrap gap-1 mb-2">
            {BUY_CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => { setBuyCategory(cat.key); setSelectedItem(null); }}
                className={`px-2 py-1 text-[9px] font-bold border transition-all ${
                  cat.key === buyCategory ? 'border-accent bg-accent/20 text-accent' : 'border-game-slot-border/50 bg-game-slot/20 text-muted-foreground hover:text-foreground'
                }`}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Item list */}
        <div className="bg-game-slot/30 border border-game-slot-border p-1 max-h-[350px] overflow-y-auto">
          {mainTab === 'Buy' && buyCategory !== 'horses' && buyCategory !== 'tack' && buyCategory !== 'properties' && (
            filteredItems.length > 0 ? filteredItems.map(item => (
              <ShopListItem key={item.id} name={item.name} rarity={item.rarity}
                price={Math.round(item.value * shop.priceMultiplier)}
                selected={selectedItem === item.id} onClick={() => setSelectedItem(item.id)}
                img={item.img} owned={hasItem(item.id)} />
            )) : <EmptyList />
          )}
          {mainTab === 'Buy' && buyCategory === 'horses' && filteredHorses.map(h => (
            <ShopListItem key={h.id} name={`${h.name} (${h.breed})`} rarity={h.rarity}
              price={Math.round(h.value * shop.priceMultiplier)}
              selected={selectedItem === h.id} onClick={() => setSelectedItem(h.id)} img={horseImg} />
          ))}
          {mainTab === 'Buy' && buyCategory === 'tack' && tackDatabase.map(t => (
            <ShopListItem key={t.id} name={t.name} rarity={t.rarity}
              price={Math.round(t.value * shop.priceMultiplier)}
              selected={selectedItem === t.id} onClick={() => setSelectedItem(t.id)} img={tackImg} />
          ))}
          {mainTab === 'Buy' && buyCategory === 'properties' && filteredProperties.map(p => (
            <ShopListItem key={p.id} name={p.name}
              rarity={p.levelRequired >= 8 ? 'epic' : p.levelRequired >= 5 ? 'rare' : 'advanced'}
              price={p.cost} selected={selectedItem === p.id} onClick={() => setSelectedItem(p.id)} img={cabinImg} />
          ))}
          {mainTab === 'Sell' && (
            filteredItems.length > 0 ? filteredItems.map(item => (
              <ShopListItem key={item.id} name={item.name} rarity={item.rarity}
                price={Math.round(item.value * shop.sellBackRate)}
                selected={selectedItem === item.id} onClick={() => setSelectedItem(item.id)}
                img={item.img} isSell />
            )) : <div className="text-center text-muted-foreground text-[10px] py-8">No items to sell</div>
          )}
        </div>

        <div className="mt-2 flex justify-between text-xs text-accent font-bold bg-game-slot p-2 border border-game-slot-border">
          <span>💰 WALLET:</span>
          <span>${state.walletAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="mt-1 text-[8px] text-muted-foreground">
          Sell rate: {Math.round(shop.sellBackRate * 100)}% · Markup: ×{shop.priceMultiplier}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 bg-game-slot border border-game-slot-border p-4 min-h-[400px]">
        {selectedItem ? (
          mainTab === 'Sell' ? (
            <ItemDetail item={itemDatabase.find(i => i.id === selectedItem)} mode="sell" sellRate={shop.sellBackRate} onAction={handleSell} wallet={state.walletAmount} owned={true} />
          ) : buyCategory === 'horses' ? (
            <HorseDetail itemId={selectedItem} priceMultiplier={shop.priceMultiplier} wallet={state.walletAmount} />
          ) : buyCategory === 'tack' ? (
            <TackDetail itemId={selectedItem} priceMultiplier={shop.priceMultiplier} wallet={state.walletAmount} />
          ) : buyCategory === 'properties' ? (
            <PropertyDetail itemId={selectedItem} playerLevel={level} wallet={state.walletAmount} />
          ) : (
            <ItemDetail item={itemDatabase.find(i => i.id === selectedItem)} mode="buy" priceMultiplier={shop.priceMultiplier} onAction={handleBuy} wallet={state.walletAmount} owned={hasItem(selectedItem)} />
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <span className="text-4xl mb-3">🏪</span>
            <p className="text-sm font-display">Select an item to inspect</p>
            <p className="text-[10px] mt-1">Browse the shelves, partner</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyList() {
  return <div className="text-center text-muted-foreground text-[10px] py-8">Nothing at your level yet, partner</div>;
}

function ShopListItem({ name, rarity, price, selected, onClick, img, owned, isSell }: {
  name: string; rarity: Rarity; price: number; selected: boolean; onClick: () => void; img: string; owned?: boolean; isSell?: boolean;
}) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2 p-2 text-left transition-all border-b border-game-slot-border/30 ${
        selected ? 'bg-accent/10 border-l-2 border-l-accent' : 'hover:bg-game-slot-border/50'
      } ${owned && !isSell ? 'opacity-40' : ''}`}>
      <div className={`w-9 h-9 border overflow-hidden flex-shrink-0 ${RARITY_COLORS[rarity]}`}>
        <img src={img} alt={name} className="w-full h-full object-cover" loading="lazy" width={36} height={36} />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-[10px] font-bold block truncate ${RARITY_COLORS[rarity].split(' ')[0]}`}>
          {name} {owned && !isSell && '✓'}
        </span>
        <span className="text-[9px] text-muted-foreground">
          {isSell ? `Sell: $${price}` : price > 0 ? `$${price}` : 'FREE'}
        </span>
      </div>
    </button>
  );
}

function ItemDetail({ item, mode, priceMultiplier = 1, sellRate = 0.5, onAction, wallet, owned }: {
  item?: GameItem; mode: 'buy' | 'sell'; priceMultiplier?: number; sellRate?: number; onAction: (item: GameItem) => void; wallet: number; owned: boolean;
}) {
  if (!item) return null;
  const price = mode === 'sell' ? Math.round(item.value * sellRate) : Math.round(item.value * priceMultiplier);
  const canAfford = wallet >= price || price === 0;

  return (
    <div className="animate-fade-in">
      <div className="flex gap-4 mb-4">
        <div className={`w-20 h-20 border-2 overflow-hidden ${RARITY_COLORS[item.rarity]}`}>
          <img src={item.img} alt={item.name} className="w-full h-full object-cover" width={80} height={80} />
        </div>
        <div>
          <h3 className={`font-display font-bold text-lg ${RARITY_COLORS[item.rarity].split(' ')[0]}`}>{item.name}</h3>
          <p className="text-muted-foreground text-[10px]">
            {item.type.toUpperCase()} · {item.category.toUpperCase()} · Lvl {item.levelRequired}+
          </p>
          <div className="flex gap-2 items-center mt-1">
            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 border ${RARITY_COLORS[item.rarity]}`}>{item.rarity}</span>
            {item.consumable && <span className="text-[8px] bg-secondary px-1 py-0.5 text-muted-foreground">CONSUMABLE</span>}
            {item.stackable && <span className="text-[8px] bg-secondary px-1 py-0.5 text-muted-foreground">STACKABLE</span>}
          </div>
        </div>
      </div>

      {Object.keys(item.stats).length > 0 && (
        <div className="mb-4">
          <span className="text-[9px] text-primary font-bold block mb-1">EFFECTS:</span>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(item.stats).map(([k, v]) => v ? (
              <div key={k} className="bg-game-slot-border/50 p-2 text-center">
                <span className="text-[8px] text-muted-foreground block">{k.toUpperCase()}</span>
                <span className={`font-bold text-sm ${(v as number) > 0 ? 'text-rarity-advanced' : 'text-destructive'}`}>
                  {(v as number) > 0 ? '+' : ''}{v}
                </span>
              </div>
            ) : null)}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-game-slot-border pt-3">
        <div>
          {mode === 'sell' && <span className="text-muted-foreground text-[9px] block">SELL VALUE</span>}
          <span className="text-accent font-bold text-xl">${price}</span>
        </div>
        {mode === 'sell' ? (
          <button onClick={() => onAction(item)}
            className="px-6 py-2.5 bg-destructive text-destructive-foreground font-display font-bold text-sm hover:bg-destructive/80 transition-all active:scale-95">
            💰 SELL
          </button>
        ) : owned ? (
          <span className="text-rarity-advanced font-bold text-sm border border-rarity-advanced px-3 py-1.5">✓ OWNED</span>
        ) : (
          <button onClick={() => onAction(item)} disabled={!canAfford}
            className="px-6 py-2.5 bg-accent text-accent-foreground font-display font-bold text-sm hover:bg-primary transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
            {!canAfford ? '💸 CANT AFFORD' : price === 0 ? '🤝 CLAIM' : '🛒 BUY'}
          </button>
        )}
      </div>
    </div>
  );
}

function HorseDetail({ itemId, priceMultiplier, wallet }: { itemId: string; priceMultiplier: number; wallet: number }) {
  const horse = horseDatabase.find(h => h.id === itemId);
  if (!horse) return null;
  const price = Math.round(horse.value * priceMultiplier);

  return (
    <div className="animate-fade-in">
      <div className="flex gap-4 mb-3">
        <div className={`w-24 h-24 border-2 overflow-hidden ${RARITY_COLORS[horse.rarity]}`}>
          <img src={horseImg} alt={horse.name} className="w-full h-full object-cover" width={96} height={96} />
        </div>
        <div>
          <h3 className={`font-display font-bold text-lg ${RARITY_COLORS[horse.rarity].split(' ')[0]}`}>{horse.name}</h3>
          <p className="text-muted-foreground text-xs">{horse.breed} · Lvl {horse.level} · {horse.gender === 'male' ? '♂ Stallion' : '♀ Mare'}</p>
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 border ${RARITY_COLORS[horse.rarity]}`}>{horse.rarity}</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {Object.entries(horse.stats).map(([k, v]) => (
          <div key={k} className="bg-game-slot-border/50 p-2 text-center">
            <span className="text-[8px] text-muted-foreground block">{k.toUpperCase()}</span>
            <span className="text-accent font-bold text-sm">{v}</span>
          </div>
        ))}
      </div>
      <div className="mb-2">
        <span className="text-[9px] text-primary font-bold">TRAITS:</span>
        <div className="flex gap-1 mt-0.5 flex-wrap">
          {horse.traits.map(t => <span key={t} className="text-[9px] bg-secondary px-1.5 py-0.5 text-foreground">{t}</span>)}
        </div>
      </div>
      <div className="mb-3">
        <span className="text-[9px] text-primary font-bold">SKILLS:</span>
        <div className="flex gap-1 mt-0.5 flex-wrap">
          {horse.skills.map(s => <span key={s} className="text-[9px] bg-game-slot-border px-1.5 py-0.5 text-foreground">{s}</span>)}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-game-slot-border pt-3">
        <span className="text-accent font-bold text-xl">{price > 0 ? `$${price}` : 'FREE'}</span>
        <button disabled={wallet < price && price > 0}
          className="px-6 py-2.5 bg-accent text-accent-foreground font-display font-bold text-sm hover:bg-primary transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => toast.info('Horse stable system coming soon!')}>
          {wallet < price && price > 0 ? '💸 CANT AFFORD' : price === 0 ? '🤝 CLAIM' : '🐴 BUY'}
        </button>
      </div>
    </div>
  );
}

function TackDetail({ itemId, priceMultiplier, wallet }: { itemId: string; priceMultiplier: number; wallet: number }) {
  const tack = tackDatabase.find(t => t.id === itemId);
  if (!tack) return null;
  const price = Math.round(tack.value * priceMultiplier);

  return (
    <div className="animate-fade-in">
      <div className="flex gap-4 mb-3">
        <div className={`w-20 h-20 border-2 overflow-hidden ${RARITY_COLORS[tack.rarity]}`}>
          <img src={tackImg} alt={tack.name} className="w-full h-full object-cover" width={80} height={80} />
        </div>
        <div>
          <h3 className={`font-display font-bold text-base ${RARITY_COLORS[tack.rarity].split(' ')[0]}`}>{tack.name}</h3>
          <p className="text-muted-foreground text-[10px]">{tack.category.toUpperCase()}</p>
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 border ${RARITY_COLORS[tack.rarity]}`}>{tack.rarity}</span>
        </div>
      </div>
      <p className="text-foreground text-xs mb-3">{tack.description}</p>
      {Object.keys(tack.statBonus).length > 0 && (
        <div className="mb-3">
          <span className="text-[9px] text-primary font-bold">HORSE BONUSES:</span>
          <div className="flex gap-2 mt-0.5 flex-wrap">
            {Object.entries(tack.statBonus).map(([k, v]) => v ? <span key={k} className="text-[9px] text-rarity-advanced font-bold">+{v} {k.toUpperCase()}</span> : null)}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-game-slot-border pt-3">
        <span className="text-accent font-bold text-xl">${price}</span>
        <button disabled={wallet < price}
          className="px-6 py-2.5 bg-accent text-accent-foreground font-display font-bold text-sm hover:bg-primary transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => toast.info('Tack system coming soon!')}>
          {wallet < price ? '💸 CANT AFFORD' : '🪶 BUY'}
        </button>
      </div>
    </div>
  );
}

function PropertyDetail({ itemId, playerLevel, wallet }: { itemId: string; playerLevel: number; wallet: number }) {
  const prop = propertyDatabase.find(p => p.id === itemId);
  if (!prop) return null;
  const canBuy = wallet >= prop.cost && playerLevel >= prop.levelRequired;

  return (
    <div className="animate-fade-in">
      <div className="flex gap-4 mb-3">
        <div className="w-24 h-24 border-2 border-accent overflow-hidden">
          <img src={cabinImg} alt={prop.name} className="w-full h-full object-cover" width={96} height={96} />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-accent">{prop.name}</h3>
          <p className="text-muted-foreground text-[10px]">{prop.type.toUpperCase()} · Lvl {prop.levelRequired}+</p>
        </div>
      </div>
      <p className="text-foreground text-xs mb-3">{prop.description}</p>
      {prop.monthlyIncome > 0 && (
        <div className="mb-2 text-rarity-advanced text-[10px] font-bold">💰 Monthly Income: ${prop.monthlyIncome}</div>
      )}
      <div className="mb-3">
        <span className="text-[9px] text-primary font-bold">PERKS:</span>
        <div className="flex gap-1 mt-0.5 flex-wrap">
          {prop.perks.map(p => <span key={p} className="text-[9px] bg-secondary px-1.5 py-0.5 text-foreground">{p}</span>)}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-game-slot-border pt-3">
        <span className="text-accent font-bold text-xl">${prop.cost}</span>
        <button disabled={!canBuy}
          className="px-6 py-2.5 bg-accent text-accent-foreground font-display font-bold text-sm hover:bg-primary transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => canBuy && toast.info('Property system coming soon!')}>
          {playerLevel < prop.levelRequired ? `🔒 NEED LVL ${prop.levelRequired}` : !canBuy ? '💸 CANT AFFORD' : '🏚️ BUY'}
        </button>
      </div>
    </div>
  );
}
