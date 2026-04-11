import { useGame } from '@/context/GameContext';
import { propertyDatabase } from '@/data/horseData';
import deedImg from '@/assets/items/deed.jpg';

export function PropertySection() {
  const { state, getPlayerLevel } = useGame();
  const { level } = getPlayerLevel();

  // Only show owned properties
  // For now, nothing is owned — show empty state with deed graphics
  const ownedProperties: string[] = []; // TODO: track in state

  return (
    <div className="flex-1 max-w-[700px]">
      <h2 className="font-display text-xl font-bold text-accent mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        📋 MY PROPERTY
      </h2>

      {ownedProperties.length === 0 ? (
        <div className="bg-game-slot/30 border-2 border-game-slot-border p-6 text-center">
          <img src={deedImg} alt="Land Deed" className="w-32 h-32 mx-auto mb-4 opacity-40 border-2 border-game-slot-border" loading="lazy" width={128} height={128} />
          <h3 className="font-display text-lg text-muted-foreground mb-2">No Properties Owned</h3>
          <p className="text-[10px] text-muted-foreground mb-4">
            Visit the <strong className="text-accent">Land Office</strong> in any town to purchase your first property.
            You may own <strong>one house</strong>, <strong>one farm</strong>, and <strong>one ranch</strong>.
          </p>
          <p className="text-[9px] text-muted-foreground">
            Properties require a <span className="text-accent">Land Deed</span> — an official document with your name, the parcel details, and the territorial seal.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ownedProperties.map(propId => {
            const prop = propertyDatabase.find(p => p.id === propId);
            if (!prop) return null;
            return (
              <div key={propId} className="bg-game-slot/40 border-2 border-accent/30 p-4 relative overflow-hidden">
                {/* Deed background */}
                <div className="absolute inset-0 opacity-10">
                  <img src={deedImg} alt="" className="w-full h-full object-cover" loading="lazy" width={512} height={512} />
                </div>
                <div className="relative z-10">
                  <h3 className="font-display text-lg text-accent font-bold">{prop.name}</h3>
                  <p className="text-[10px] text-foreground/70 mb-2">{prop.description}</p>
                  <div className="flex gap-4 text-[9px]">
                    <span className="text-primary">📍 Type: {prop.type}</span>
                    <span className="text-accent">$ Value: ${prop.cost}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
