import { useState } from 'react';
import { gameMaps, type GameMap } from '@/data/maps';
import { MapPin, Skull, Gift } from 'lucide-react';

export function MapsPanel() {
  const [selectedMap, setSelectedMap] = useState<GameMap>(gameMaps[0]);

  return (
    <div className="flex-1 flex gap-4">
      {/* Map list */}
      <div className="w-48 flex flex-col gap-2">
        <h2 className="font-display text-sm font-black text-accent tracking-wider flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4" />
          LOCATIONS
        </h2>
        {gameMaps.map(map => (
          <button
            key={map.id}
            onClick={() => setSelectedMap(map)}
            className={`text-left p-2 border transition-all ${
              selectedMap.id === map.id
                ? 'bg-primary/20 border-primary shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]'
                : 'bg-game-slot border-game-slot-border hover:border-primary'
            }`}
          >
            <div className="text-[10px] font-bold text-foreground">{map.name}</div>
            <div className="text-[8px] text-accent font-bold">{map.level}</div>
          </button>
        ))}
      </div>

      {/* Selected map detail */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="bg-game-panel border-2 border-game-slot overflow-hidden">
          <img
            src={selectedMap.img}
            alt={selectedMap.name}
            className="w-full h-[300px] object-cover"
            loading="lazy"
            width={600}
            height={300}
          />
        </div>
        <div className="bg-game-panel p-3 border border-game-slot-border">
          <h3 className="font-display text-lg font-bold text-accent mb-1">{selectedMap.name}</h3>
          <span className="text-[9px] bg-primary/30 px-2 py-0.5 text-accent font-bold tracking-wider">
            {selectedMap.level}
          </span>
          <p className="text-xs text-foreground mt-2 leading-relaxed">{selectedMap.description}</p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-1 text-[9px] text-destructive font-bold mb-1">
                <Skull className="w-3 h-3" /> ENEMIES
              </div>
              {selectedMap.enemies.map((e, i) => (
                <div key={i} className="text-[10px] text-foreground py-0.5">• {e}</div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-[9px] text-accent font-bold mb-1">
                <Gift className="w-3 h-3" /> LOOT
              </div>
              {selectedMap.loot.map((l, i) => (
                <div key={i} className="text-[10px] text-foreground py-0.5">• {l}</div>
              ))}
            </div>
          </div>

          <button className="mt-3 w-full py-2 bg-primary text-primary-foreground font-display font-bold text-xs tracking-widest hover:brightness-110 transition-all border border-accent">
            TRAVEL HERE
          </button>
        </div>
      </div>
    </div>
  );
}
