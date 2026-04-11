import { toast } from 'sonner';

export function RestSection() {
  return (
    <div className="flex-1 max-w-[600px]">
      <h2 className="font-display text-xl font-bold text-accent mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        🏕️ REST & CAMP
      </h2>

      <div className="space-y-3">
        <div className="bg-game-slot/40 border border-game-slot-border p-4">
          <h3 className="text-primary font-display font-bold text-sm mb-2">⛺ MAKE CAMP</h3>
          <p className="text-muted-foreground text-[10px] mb-3">
            Set up camp on the trail. Advances time by 8 hours. Restores some energy and sleep.
          </p>
          <button
            onClick={() => toast.success('You rested at camp. (+30 Sleep, +20 Energy)')}
            className="px-4 py-2 bg-accent text-accent-foreground font-display font-bold text-sm hover:bg-primary transition-colors">
            REST (8 hrs)
          </button>
        </div>

        <div className="bg-game-slot/40 border border-game-slot-border p-4">
          <h3 className="text-primary font-display font-bold text-sm mb-2">🛏️ SLEEP AT PROPERTY</h3>
          <p className="text-muted-foreground text-[10px] mb-3">
            Sleep at your owned property for a full night. Fully restores sleep and energy. Requires owned home.
          </p>
          <button
            onClick={() => toast.info('You need to own a property first!')}
            className="px-4 py-2 bg-game-slot text-foreground font-display font-bold text-sm border border-game-slot-border hover:border-primary transition-colors">
            SLEEP (12 hrs)
          </button>
        </div>

        <div className="bg-game-slot/40 border border-game-slot-border p-4">
          <h3 className="text-primary font-display font-bold text-sm mb-2">🍖 COOK A MEAL</h3>
          <p className="text-muted-foreground text-[10px] mb-3">
            Use food supplies from inventory to cook. Restores health and energy based on ingredients.
          </p>
          <button
            onClick={() => toast.info('Cooking system coming soon!')}
            className="px-4 py-2 bg-game-slot text-foreground font-display font-bold text-sm border border-game-slot-border hover:border-primary transition-colors">
            COOK
          </button>
        </div>
      </div>
    </div>
  );
}
