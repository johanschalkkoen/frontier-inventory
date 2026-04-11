import { useState, useEffect } from 'react';

const GAME_START = new Date(1885, 2, 1); // March 1, 1885
const TIME_MULTIPLIER = 2;

function getGameTime() {
  const now = Date.now();
  const elapsed = now * TIME_MULTIPLIER;
  const gameDate = new Date(GAME_START.getTime() + (elapsed % (10 * 365.25 * 24 * 60 * 60 * 1000)));
  return gameDate;
}

function getSeason(month: number) {
  if (month >= 2 && month <= 4) return { name: 'Spring', icon: '🌱', effect: 'Cheap land deals, good grass' };
  if (month >= 5 && month <= 7) return { name: 'Summer', icon: '☀️', effect: 'Drought risk, higher feed cost' };
  if (month >= 8 && month <= 10) return { name: 'Fall', icon: '🍂', effect: 'Harvest & cattle sales (best income)' };
  return { name: 'Winter', icon: '❄️', effect: 'Blizzard events, higher upkeep' };
}

const WEATHER = ['Clear', 'Windy', 'Overcast', 'Storm', 'Fog'];

export function TimeSection() {
  const [gameTime, setGameTime] = useState(getGameTime);
  const [weather] = useState(() => WEATHER[Math.floor(Math.random() * WEATHER.length)]);

  useEffect(() => {
    const interval = setInterval(() => setGameTime(getGameTime()), 5000);
    return () => clearInterval(interval);
  }, []);

  const season = getSeason(gameTime.getMonth());
  const hours = gameTime.getHours();
  const isDaytime = hours >= 6 && hours < 20;
  const timeStr = gameTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = gameTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex-1 max-w-[600px]">
      <h2 className="font-display text-xl font-bold text-accent mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        🕐 TIME & WEATHER
      </h2>

      <div className="bg-game-slot/40 border-2 border-game-slot-border p-6 space-y-4">
        <div className="text-center">
          <span className="text-4xl">{isDaytime ? '☀️' : '🌙'}</span>
          <div className="text-accent font-display text-2xl font-bold mt-2">{timeStr}</div>
          <div className="text-foreground text-sm">{dateStr}</div>
          <div className="text-muted-foreground text-[10px] mt-1">2× speed: 1 real min = 2 game hours</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-game-slot/60 border border-game-slot-border p-3 text-center">
            <span className="text-2xl">{season.icon}</span>
            <div className="text-accent font-bold text-sm mt-1">{season.name}</div>
            <div className="text-muted-foreground text-[9px]">{season.effect}</div>
          </div>
          <div className="bg-game-slot/60 border border-game-slot-border p-3 text-center">
            <span className="text-2xl">{weather === 'Storm' ? '⛈️' : weather === 'Windy' ? '💨' : weather === 'Fog' ? '🌫️' : weather === 'Overcast' ? '☁️' : '🌤️'}</span>
            <div className="text-accent font-bold text-sm mt-1">{weather}</div>
            <div className="text-muted-foreground text-[9px]">Affects travel & stamina</div>
          </div>
        </div>
      </div>
    </div>
  );
}
