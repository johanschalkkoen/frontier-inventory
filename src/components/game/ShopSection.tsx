import { useState, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { horseDatabase, tackDatabase, propertyDatabase, shopConfigs, rollRarity, type Horse, type HorseTackItem, type Property } from '@/data/horseData';
import type { Rarity } from '@/data/gameData';
import horseImg from '@/assets/items/horse.jpg';
import tackImg from '@/assets/items/saddle-tack.jpg';
import cabinImg from '@/assets/items/cabin.jpg';

const RARITY_COLORS: Record<Rarity, string> = {
  basic: 'text-rarity-basic border-rarity-basic',
  advanced: 'text-rarity-advanced border-rarity-advanced',
  rare: 'text-rarity-rare border-rarity-rare',
  epic: 'text-rarity-epic border-rarity-epic',
  legendary: 'text-rarity-legendary border-rarity-legendary',
};

const TAB_OPTIONS = ['Horses', 'Tack & Gear', 'Properties'] as const;
type ShopTab = typeof TAB_OPTIONS[number];

export function ShopSection() {
  const { state, getPlayerLevel } = useGame();
  const { level } = getPlayerLevel();
  const [activeTab, setActiveTab] = useState<ShopTab>('Horses');
  const [selectedShop, setSelectedShop] = useState(shopConfigs[0].id);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const shop = shopConfigs.find(s => s.id === selectedShop)!;

  // Filter items by shop rarity distribution
  const filteredHorses = useMemo(() => {
    return horseDatabase.filter(h => h.level <= level + 2);
  }, [level]);

  const filteredTack = tackDatabase;
  const filteredProperties = propertyDatabase.filter(p => p.levelRequired <= level + 3);

  return (
    <div className="flex-1 flex gap-4">
      {/* Left: Shop selector + tabs */}
      <div className="w-[280px] flex-shrink-0">
        <h2 className="font-display text-xl font-bold text-accent mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
          GENERAL STORE
        </h2>

        {/* Shop type selector */}
        <div className="mb-3">
          <label className="text-[9px] text-muted-foreground mb-1 block">SHOP TYPE</label>
          <div className="flex flex-col gap-1">
            {shopConfigs.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedShop(s.id)}
                className={`text-left px-2 py-1.5 text-[10px] border transition-all ${
                  s.id === selectedShop
                    ? 'border-accent bg-game-slot text-accent'
                    : 'border-game-slot-border bg-game-slot/30 text-foreground hover:border-primary'
                }`}
              >
                <span className="font-bold">{s.name}</span>
                <span className="block text-muted-foreground text-[8px]">{s.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 mb-3">
          {TAB_OPTIONS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedItem(null); }}
              className={`flex-1 py-1.5 text-[9px] font-bold border transition-all ${
                tab === activeTab
                  ? 'bg-primary text-primary-foreground border-accent'
                  : 'bg-game-slot-border text-foreground border-game-slot hover:bg-secondary'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Item list */}
        <div className="bg-game-slot/30 border border-game-slot-border p-1 max-h-[420px] overflow-y-auto">
          {activeTab === 'Horses' && filteredHorses.map(h => (
            <ShopListItem
              key={h.id}
              name={`${h.name} (${h.breed})`}
              rarity={h.rarity}
              price={Math.round(h.value * shop.priceMultiplier)}
              selected={selectedItem === h.id}
              onClick={() => setSelectedItem(h.id)}
              img={horseImg}
            />
          ))}
          {activeTab === 'Tack & Gear' && filteredTack.map(t => (
            <ShopListItem
              key={t.id}
              name={t.name}
              rarity={t.rarity}
              price={Math.round(t.value * shop.priceMultiplier)}
              selected={selectedItem === t.id}
              onClick={() => setSelectedItem(t.id)}
              img={tackImg}
            />
          ))}
          {activeTab === 'Properties' && filteredProperties.map(p => (
            <ShopListItem
              key={p.id}
              name={p.name}
              rarity={p.levelRequired >= 8 ? 'epic' : p.levelRequired >= 5 ? 'rare' : 'advanced'}
              price={p.cost}
              selected={selectedItem === p.id}
              onClick={() => setSelectedItem(p.id)}
              img={cabinImg}
            />
          ))}
        </div>

        <div className="mt-2 flex justify-between text-xs text-accent font-bold bg-game-slot p-2 border border-game-slot-border">
          <span>YOUR WALLET:</span>
          <span>${state.walletAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Right: Item detail */}
      <div className="flex-1 bg-game-slot border border-game-slot-border p-4">
        {selectedItem ? (
          <ItemDetail
            itemId={selectedItem}
            tab={activeTab}
            priceMultiplier={shop.priceMultiplier}
            playerLevel={level}
            wallet={state.walletAmount}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">Select an item to view details</p>
            <p className="text-[10px] mt-1">Browse {activeTab.toLowerCase()} in the list</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ShopListItem({ name, rarity, price, selected, onClick, img }: {
  name: string; rarity: Rarity; price: number; selected: boolean; onClick: () => void; img: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 p-1.5 text-left transition-all border-b border-game-slot-border/30 ${
        selected ? 'bg-game-slot-border' : 'hover:bg-game-slot-border/50'
      }`}
    >
      <div className={`w-8 h-8 border overflow-hidden flex-shrink-0 ${RARITY_COLORS[rarity]}`}>
        <img src={img} alt={name} className="w-full h-full object-cover" loading="lazy" width={32} height={32} />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-[10px] font-bold block truncate ${RARITY_COLORS[rarity].split(' ')[0]}`}>{name}</span>
        <span className="text-[9px] text-muted-foreground">{price > 0 ? `$${price}` : 'FREE'}</span>
      </div>
    </button>
  );
}

function ItemDetail({ itemId, tab, priceMultiplier, playerLevel, wallet }: {
  itemId: string; tab: ShopTab; priceMultiplier: number; playerLevel: number; wallet: number;
}) {
  if (tab === 'Horses') {
    const horse = horseDatabase.find(h => h.id === itemId);
    if (!horse) return null;
    const price = Math.round(horse.value * priceMultiplier);
    const canAfford = wallet >= price || price === 0;

    return (
      <div>
        <div className="flex gap-4 mb-3">
          <div className={`w-24 h-24 border-2 overflow-hidden ${RARITY_COLORS[horse.rarity]}`}>
            <img src={horseImg} alt={horse.name} className="w-full h-full object-cover" width={96} height={96} />
          </div>
          <div>
            <h3 className={`font-display font-bold text-lg ${RARITY_COLORS[horse.rarity].split(' ')[0]}`}>{horse.name}</h3>
            <p className="text-muted-foreground text-xs">{horse.breed} · Level {horse.level} · {horse.gender === 'male' ? '♂' : '♀'}</p>
            <span className={`text-[9px] font-bold uppercase ${RARITY_COLORS[horse.rarity].split(' ')[0]}`}>{horse.rarity}</span>
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
            {horse.traits.map(t => (
              <span key={t} className="text-[9px] bg-secondary px-1.5 py-0.5 text-foreground">{t}</span>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <span className="text-[9px] text-primary font-bold">SKILLS:</span>
          <div className="flex gap-1 mt-0.5 flex-wrap">
            {horse.skills.map(s => (
              <span key={s} className="text-[9px] bg-game-slot-border px-1.5 py-0.5 text-foreground">{s}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-game-slot-border pt-3">
          <span className="text-accent font-bold text-lg">{price > 0 ? `$${price}` : 'FREE'}</span>
          <button
            disabled={!canAfford}
            className="px-6 py-2 bg-accent text-accent-foreground font-display font-bold text-sm hover:bg-primary transition-colors disabled:opacity-40"
          >
            {price === 0 ? 'CLAIM' : 'BUY'}
          </button>
        </div>
      </div>
    );
  }

  if (tab === 'Tack & Gear') {
    const tack = tackDatabase.find(t => t.id === itemId);
    if (!tack) return null;
    const price = Math.round(tack.value * priceMultiplier);

    return (
      <div>
        <div className="flex gap-4 mb-3">
          <div className={`w-20 h-20 border-2 overflow-hidden ${RARITY_COLORS[tack.rarity]}`}>
            <img src={tackImg} alt={tack.name} className="w-full h-full object-cover" width={80} height={80} />
          </div>
          <div>
            <h3 className={`font-display font-bold text-base ${RARITY_COLORS[tack.rarity].split(' ')[0]}`}>{tack.name}</h3>
            <p className="text-muted-foreground text-[10px]">{tack.category.toUpperCase()}</p>
            <span className={`text-[9px] font-bold uppercase ${RARITY_COLORS[tack.rarity].split(' ')[0]}`}>{tack.rarity}</span>
          </div>
        </div>
        <p className="text-foreground text-xs mb-3">{tack.description}</p>

        {Object.keys(tack.statBonus).length > 0 && (
          <div className="mb-3">
            <span className="text-[9px] text-primary font-bold">HORSE STAT BONUSES:</span>
            <div className="flex gap-2 mt-0.5 flex-wrap">
              {Object.entries(tack.statBonus).map(([k, v]) => (
                v ? <span key={k} className="text-[9px] text-rarity-advanced font-bold">+{v} {k.toUpperCase()}</span> : null
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-game-slot-border pt-3">
          <span className="text-accent font-bold text-lg">${price}</span>
          <button
            disabled={wallet < price}
            className="px-6 py-2 bg-accent text-accent-foreground font-display font-bold text-sm hover:bg-primary transition-colors disabled:opacity-40"
          >
            BUY
          </button>
        </div>
      </div>
    );
  }

  if (tab === 'Properties') {
    const prop = propertyDatabase.find(p => p.id === itemId);
    if (!prop) return null;
    const canBuy = wallet >= prop.cost && playerLevel >= prop.levelRequired;

    return (
      <div>
        <div className="flex gap-4 mb-3">
          <div className="w-24 h-24 border-2 border-accent overflow-hidden">
            <img src={cabinImg} alt={prop.name} className="w-full h-full object-cover" width={96} height={96} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-accent">{prop.name}</h3>
            <p className="text-muted-foreground text-[10px]">{prop.type.toUpperCase()} · Level {prop.levelRequired}+</p>
          </div>
        </div>
        <p className="text-foreground text-xs mb-3">{prop.description}</p>

        {prop.monthlyIncome > 0 && (
          <div className="mb-2 text-rarity-advanced text-[10px] font-bold">
            💰 Monthly Income: ${prop.monthlyIncome}
          </div>
        )}

        <div className="mb-3">
          <span className="text-[9px] text-primary font-bold">PERKS:</span>
          <div className="flex gap-1 mt-0.5 flex-wrap">
            {prop.perks.map(p => (
              <span key={p} className="text-[9px] bg-secondary px-1.5 py-0.5 text-foreground">{p}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-game-slot-border pt-3">
          <span className="text-accent font-bold text-lg">${prop.cost}</span>
          <button
            disabled={!canBuy}
            className="px-6 py-2 bg-accent text-accent-foreground font-display font-bold text-sm hover:bg-primary transition-colors disabled:opacity-40"
          >
            {playerLevel < prop.levelRequired ? `NEED LVL ${prop.levelRequired}` : 'BUY'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
