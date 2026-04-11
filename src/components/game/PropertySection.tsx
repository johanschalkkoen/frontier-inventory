import { useGame } from '@/context/GameContext';
import { propertyDatabase, propertyAddOns, type PropertyAddOn } from '@/data/horseData';
import { toast } from 'sonner';

export function PropertySection() {
  const { state, getPlayerLevel } = useGame();
  const { level } = getPlayerLevel();

  return (
    <div className="flex-1">
      <h2 className="font-display text-xl font-bold text-accent mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        🏠 PROPERTY
      </h2>

      <div className="mb-4 bg-game-slot/30 border border-game-slot-border p-3">
        <h3 className="font-display text-sm text-primary font-bold mb-2">AVAILABLE LAND & HOMES</h3>
        <div className="space-y-2 max-h-[250px] overflow-y-auto">
          {propertyDatabase.filter(p => p.levelRequired <= level + 3).map(p => (
            <div key={p.id} className="flex items-center justify-between bg-game-slot/50 p-2 border border-game-slot-border/50">
              <div>
                <span className="text-foreground text-xs font-bold">{p.name}</span>
                <span className="text-muted-foreground text-[9px] block">{p.description} · Lvl {p.levelRequired}+</span>
                {p.monthlyUpkeep > 0 && <span className="text-[8px] text-destructive/70">Upkeep: ${p.monthlyUpkeep}/mo</span>}
              </div>
              <div className="text-right">
                <span className="text-accent font-bold text-sm">${p.cost}</span>
                <button
                  disabled={state.walletAmount < p.cost}
                  onClick={() => toast.info('Property purchasing coming soon!')}
                  className="block text-[8px] bg-accent text-accent-foreground px-2 py-0.5 mt-0.5 font-bold disabled:opacity-40">
                  BUY
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-game-slot/30 border border-game-slot-border p-3">
        <h3 className="font-display text-sm text-primary font-bold mb-2">RANCH ADD-ONS</h3>
        <div className="space-y-2 max-h-[250px] overflow-y-auto">
          {propertyAddOns.map(a => (
            <div key={a.id} className="flex items-center justify-between bg-game-slot/50 p-2 border border-game-slot-border/50">
              <div className="flex-1">
                <span className="text-foreground text-xs font-bold">{a.icon} {a.name}</span>
                <span className="text-muted-foreground text-[9px] block">{a.benefits}</span>
                <span className="text-[8px] text-destructive/70">Upkeep: ${a.monthlyUpkeep}/mo</span>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <span className="text-accent font-bold text-sm">${a.cost}</span>
                <button
                  disabled={state.walletAmount < a.cost}
                  onClick={() => toast.info('Add-on purchasing coming soon!')}
                  className="block text-[8px] bg-accent text-accent-foreground px-2 py-0.5 mt-0.5 font-bold disabled:opacity-40">
                  BUILD
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
