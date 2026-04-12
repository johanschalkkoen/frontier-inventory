import { useGame } from '@/context/GameContext';
import { toast } from 'sonner';
import { itemDatabase } from '@/data/gameData';

const BATH_COST = 5;
const BED_COST = 3;

export function HotelSection() {
  const { state, restoreVital, spendMoney, refillCanteen, hasItem } = useGame();

  const hasBedroll = hasItem('item-bedroll');

  const handleBath = () => {
    if (spendMoney(BATH_COST)) {
      restoreVital('hygiene', 60);
      restoreVital('morale', 10);
      toast.success(`Took a hot bath. (-$${BATH_COST}, +60 Hygiene, +10 Morale)`);
    } else {
      toast.error('Not enough money for a bath, partner.');
    }
  };

  const handleBed = () => {
    if (spendMoney(BED_COST)) {
      restoreVital('sleep', 70);
      restoreVital('energy', 40);
      restoreVital('health', 20);
      toast.success(`Slept in a hotel bed. (-$${BED_COST}, +70 Sleep, +40 Energy, +20 Health)`);
    } else {
      toast.error('Not enough money for a bed.');
    }
  };

  const handleBedroll = () => {
    restoreVital('sleep', 30);
    restoreVital('energy', 15);
    toast.success('Used your bedroll on the floor. (+30 Sleep, +15 Energy)');
  };

  const handleFreeWater = () => {
    restoreVital('thirst', 40);
    toast.success('Drank fresh water at the hotel. (+40 Quench)');
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

  // Food & drink items from inventory
  const foodItems = itemDatabase.filter(i => {
    const loc = state.itemLocations[i.id];
    return loc && (i.category === 'food' || i.category === 'drink') && i.consumable;
  });

  return (
    <div className="flex-1 max-w-[700px]">
      <h2 className="font-display text-xl font-bold text-accent mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        ⌂ FRONTIER HOTEL
      </h2>
      <p className="text-muted-foreground text-[10px] mb-4 italic">
        "A warm bed, a hot bath, and clean water — the simple luxuries of frontier life."
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Bath */}
        <div className="bg-game-slot/40 border-2 border-game-slot-border p-4">
          <h3 className="text-primary font-display font-bold text-sm mb-1">◇ HOT BATH</h3>
          <p className="text-muted-foreground text-[9px] mb-2">
            Scrub off the trail dust. +60 Hygiene, +10 Morale.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-accent font-bold text-sm">${BATH_COST}</span>
            <button onClick={handleBath}
              className="px-4 py-1.5 bg-accent text-accent-foreground font-bold text-xs hover:bg-primary transition-colors">
              TAKE BATH
            </button>
          </div>
          <div className="mt-2 text-[8px] text-muted-foreground">
            Hygiene: {Math.round(state.vitals.hygiene)}%
          </div>
        </div>

        {/* Bed */}
        <div className="bg-game-slot/40 border-2 border-game-slot-border p-4">
          <h3 className="text-primary font-display font-bold text-sm mb-1">◑ HOTEL BED</h3>
          <p className="text-muted-foreground text-[9px] mb-2">
            A proper bed for the night. +70 Sleep, +40 Energy, +20 Health.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-accent font-bold text-sm">${BED_COST}</span>
            <button onClick={handleBed}
              className="px-4 py-1.5 bg-accent text-accent-foreground font-bold text-xs hover:bg-primary transition-colors">
              RENT BED
            </button>
          </div>
          <div className="mt-2 text-[8px] text-muted-foreground">
            Sleep: {Math.round(state.vitals.sleep)}% · Energy: {Math.round(state.vitals.energy)}%
          </div>
        </div>

        {/* Bedroll */}
        <div className="bg-game-slot/40 border-2 border-game-slot-border p-4">
          <h3 className="text-primary font-display font-bold text-sm mb-1">≡ BEDROLL</h3>
          <p className="text-muted-foreground text-[9px] mb-2">
            Sleep on the floor with your bedroll. Free but less effective. +30 Sleep, +15 Energy.
          </p>
          <button onClick={handleBedroll} disabled={!hasBedroll}
            className="px-4 py-1.5 bg-primary/30 text-foreground font-bold text-xs border border-primary/50 hover:bg-primary/50 transition-colors disabled:opacity-40">
            {hasBedroll ? 'USE BEDROLL (FREE)' : 'NO BEDROLL'}
          </button>
        </div>

        {/* Free Water */}
        <div className="bg-game-slot/40 border-2 border-game-slot-border p-4">
          <h3 className="text-primary font-display font-bold text-sm mb-1">◈ FREE WATER</h3>
          <p className="text-muted-foreground text-[9px] mb-2">
            Drink fresh water from the hotel well. +40 Quench. Always free.
          </p>
          <div className="flex gap-2">
            <button onClick={handleFreeWater}
              className="px-4 py-1.5 bg-accent text-accent-foreground font-bold text-xs hover:bg-primary transition-colors">
              DRINK WATER
            </button>
            <button onClick={handleRefillCanteen}
              className="px-3 py-1.5 bg-primary/30 text-foreground font-bold text-xs border border-primary/50 hover:bg-primary/50 transition-colors">
              REFILL CANTEEN
            </button>
          </div>
        </div>
      </div>

      {/* Vitals overview */}
      <div className="mt-4 bg-game-slot/30 border border-game-slot-border p-3">
        <h3 className="text-primary font-display font-bold text-[10px] mb-2">YOUR CONDITION</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'HEALTH', value: state.vitals.health, color: 'text-bar-health' },
            { label: 'ENERGY', value: state.vitals.energy, color: 'text-bar-energy' },
            { label: 'SLEEP', value: state.vitals.sleep, color: 'text-bar-sleep' },
            { label: 'HYGIENE', value: state.vitals.hygiene, color: 'text-bar-thirst' },
          ].map(v => (
            <div key={v.label} className="bg-game-slot/50 border border-game-slot-border p-1.5">
              <span className="text-[7px] text-muted-foreground block">{v.label}</span>
              <span className={`font-bold text-sm ${v.color}`}>{Math.round(v.value)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
