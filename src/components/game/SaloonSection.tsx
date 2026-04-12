import { useGame } from '@/context/GameContext';
import { toast } from 'sonner';
import { itemDatabase } from '@/data/gameData';

interface SaloonItem {
  name: string;
  icon: string;
  cost: number;
  effects: { vital: 'health' | 'energy' | 'thirst' | 'hunger' | 'morale' | 'sleep'; amount: number }[];
  desc: string;
}

const SALOON_MENU: SaloonItem[] = [
  { name: 'Glass of Water', icon: '◈', cost: 0, effects: [{ vital: 'thirst', amount: 30 }], desc: 'Free from the barrel. Quenches thirst.' },
  { name: 'Beer', icon: '◉', cost: 1, effects: [{ vital: 'thirst', amount: 15 }, { vital: 'morale', amount: 15 }, { vital: 'energy', amount: 5 }], desc: 'Warm beer. Raises morale.' },
  { name: 'Whiskey Shot', icon: '◉', cost: 2, effects: [{ vital: 'morale', amount: 25 }, { vital: 'energy', amount: 10 }, { vital: 'health', amount: -5 }], desc: 'Burns going down. Big morale boost.' },
  { name: 'Sarsaparilla', icon: '◉', cost: 2, effects: [{ vital: 'thirst', amount: 25 }, { vital: 'morale', amount: 10 }, { vital: 'energy', amount: 8 }], desc: 'Sweet soda water. Refreshing.' },
  { name: 'Steak & Potatoes', icon: '∞', cost: 5, effects: [{ vital: 'hunger', amount: 60 }, { vital: 'energy', amount: 30 }, { vital: 'health', amount: 15 }, { vital: 'morale', amount: 10 }], desc: 'A proper meal. Fills you up good.' },
  { name: 'Beans & Cornbread', icon: '∞', cost: 2, effects: [{ vital: 'hunger', amount: 40 }, { vital: 'energy', amount: 15 }], desc: 'Simple but filling frontier fare.' },
  { name: 'Bacon & Eggs', icon: '∞', cost: 3, effects: [{ vital: 'hunger', amount: 45 }, { vital: 'energy', amount: 20 }, { vital: 'health', amount: 5 }], desc: 'A hearty breakfast any time of day.' },
  { name: 'Apple Pie', icon: '∞', cost: 2, effects: [{ vital: 'hunger', amount: 20 }, { vital: 'morale', amount: 20 }], desc: 'Fresh baked. Lifts the spirits.' },
  { name: 'Cigar', icon: '⊘', cost: 1, effects: [{ vital: 'morale', amount: 12 }, { vital: 'energy', amount: 5 }], desc: 'A fine smoke to relax by.' },
  { name: 'Fine Brandy', icon: '◉', cost: 8, effects: [{ vital: 'morale', amount: 35 }, { vital: 'energy', amount: 15 }, { vital: 'health', amount: -8 }], desc: 'Imported from back East. The good stuff.' },
];

export function SaloonSection() {
  const { state, restoreVital, spendMoney, refillCanteen } = useGame();

  const handleOrder = (item: SaloonItem) => {
    if (item.cost > 0 && !spendMoney(item.cost)) {
      toast.error("Can't afford that, partner.");
      return;
    }
    for (const effect of item.effects) {
      restoreVital(effect.vital, effect.amount);
    }
    const effectStr = item.effects.map(e => `${e.amount > 0 ? '+' : ''}${e.amount} ${e.vital}`).join(', ');
    toast.success(`${item.name}${item.cost > 0 ? ` (-$${item.cost})` : ''}: ${effectStr}`);
  };

  const handleRefillCanteen = () => {
    const hasCanteen = itemDatabase.some(i => {
      return state.itemLocations[i.id] && i.type === 'canteen';
    });
    if (hasCanteen) {
      refillCanteen();
      toast.success('Refilled your canteen with fresh water.');
    } else {
      toast.error("You don't have a canteen to refill.");
    }
  };

  return (
    <div className="flex-1 max-w-[700px]">
      <h2 className="font-display text-xl font-bold text-accent mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        ◉ FRONTIER SALOON
      </h2>
      <p className="text-muted-foreground text-[10px] mb-4 italic">
        "Step up to the bar, stranger. What'll it be?"
      </p>

      <div className="flex items-center justify-between mb-3 bg-game-slot/40 border border-game-slot-border p-2">
        <span className="text-accent font-bold text-xs">$ WALLET: ${state.walletAmount.toFixed(2)}</span>
        <button onClick={handleRefillCanteen}
          className="px-3 py-1 bg-primary/30 text-foreground font-bold text-[9px] border border-primary/50 hover:bg-primary/50 transition-colors">
          ◈ REFILL CANTEEN (FREE)
        </button>
      </div>

      {/* Drinks */}
      <div className="mb-4">
        <h3 className="text-primary font-display font-bold text-[10px] mb-2">DRINKS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {SALOON_MENU.filter(i => ['Glass of Water', 'Beer', 'Whiskey Shot', 'Sarsaparilla', 'Fine Brandy'].includes(i.name)).map(item => (
            <SaloonMenuItem key={item.name} item={item} onOrder={handleOrder} wallet={state.walletAmount} />
          ))}
        </div>
      </div>

      {/* Food */}
      <div className="mb-4">
        <h3 className="text-primary font-display font-bold text-[10px] mb-2">FOOD</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {SALOON_MENU.filter(i => ['Steak & Potatoes', 'Beans & Cornbread', 'Bacon & Eggs', 'Apple Pie'].includes(i.name)).map(item => (
            <SaloonMenuItem key={item.name} item={item} onOrder={handleOrder} wallet={state.walletAmount} />
          ))}
        </div>
      </div>

      {/* Smokes */}
      <div className="mb-4">
        <h3 className="text-primary font-display font-bold text-[10px] mb-2">TOBACCO</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {SALOON_MENU.filter(i => i.name === 'Cigar').map(item => (
            <SaloonMenuItem key={item.name} item={item} onOrder={handleOrder} wallet={state.walletAmount} />
          ))}
        </div>
      </div>

      {/* Vitals */}
      <div className="bg-game-slot/30 border border-game-slot-border p-3">
        <h3 className="text-primary font-display font-bold text-[10px] mb-2">YOUR CONDITION</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'HUNGER', value: state.vitals.hunger },
            { label: 'QUENCH', value: state.vitals.thirst },
            { label: 'ENERGY', value: state.vitals.energy },
            { label: 'MORALE', value: state.vitals.morale },
          ].map(v => (
            <div key={v.label} className="bg-game-slot/50 border border-game-slot-border p-1.5">
              <span className="text-[7px] text-muted-foreground block">{v.label}</span>
              <span className="font-bold text-sm text-accent">{Math.round(v.value)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SaloonMenuItem({ item, onOrder, wallet }: { item: SaloonItem; onOrder: (i: SaloonItem) => void; wallet: number }) {
  const canAfford = item.cost === 0 || wallet >= item.cost;
  return (
    <div className="bg-game-slot/40 border border-game-slot-border p-2.5 flex items-center justify-between gap-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-primary font-display text-sm">{item.icon}</span>
          <span className="text-foreground font-bold text-xs">{item.name}</span>
        </div>
        <p className="text-muted-foreground text-[8px] mt-0.5">{item.desc}</p>
        <div className="flex gap-1 mt-0.5 flex-wrap">
          {item.effects.map((e, i) => (
            <span key={i} className={`text-[7px] ${e.amount > 0 ? 'text-rarity-advanced' : 'text-destructive'}`}>
              {e.amount > 0 ? '+' : ''}{e.amount} {e.vital}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-accent font-bold text-xs">{item.cost > 0 ? `$${item.cost}` : 'FREE'}</span>
        <button onClick={() => onOrder(item)} disabled={!canAfford}
          className="px-3 py-1 bg-accent text-accent-foreground font-bold text-[8px] hover:bg-primary transition-colors disabled:opacity-40">
          ORDER
        </button>
      </div>
    </div>
  );
}
