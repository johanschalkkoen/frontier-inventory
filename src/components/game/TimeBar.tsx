import { useState, useEffect } from 'react';

const GAME_START = new Date(1885, 2, 1);
const TIME_MULTIPLIER = 2;

function getGameTime() {
  const now = Date.now();
  const elapsed = now * TIME_MULTIPLIER;
  const gameDate = new Date(GAME_START.getTime() + (elapsed % (10 * 365.25 * 24 * 60 * 60 * 1000)));
  return gameDate;
}

function getSeason(month: number) {
  if (month >= 2 && month <= 4) return { name: 'Spring', icon: '🌱' };
  if (month >= 5 && month <= 7) return { name: 'Summer', icon: '☀️' };
  if (month >= 8 && month <= 10) return { name: 'Fall', icon: '🍂' };
  return { name: 'Winter', icon: '❄️' };
}

const WEATHER_LIST = [
  { name: 'Clear', icon: '🌤️' },
  { name: 'Windy', icon: '💨' },
  { name: 'Overcast', icon: '☁️' },
  { name: 'Storm', icon: '⛈️' },
  { name: 'Fog', icon: '🌫️' },
];

export function TimeBar() {
  const [gameTime, setGameTime] = useState(getGameTime);
  const [weather] = useState(() => WEATHER_LIST[Math.floor(Math.random() * WEATHER_LIST.length)]);

  useEffect(() => {
    const interval = setInterval(() => setGameTime(getGameTime()), 5000);
    return () => clearInterval(interval);
  }, []);

  const season = getSeason(gameTime.getMonth());
  const hours = gameTime.getHours();
  const isDaytime = hours >= 6 && hours < 20;
  const timeStr = gameTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = gameTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Day/night gradient
  const bgGradient = isDaytime
    ? 'linear-gradient(90deg, hsl(35 40% 18%) 0%, hsl(40 50% 22%) 30%, hsl(35 45% 20%) 70%, hsl(30 35% 16%) 100%)'
    : 'linear-gradient(90deg, hsl(220 30% 8%) 0%, hsl(230 25% 12%) 30%, hsl(220 30% 10%) 70%, hsl(215 25% 7%) 100%)';

  return (
    <div className="relative flex items-center justify-between px-4 py-1.5 border border-game-slot-border/50"
      style={{ background: bgGradient }}>
      {/* Day/night indicator */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{isDaytime ? '☀️' : '🌙'}</span>
        <span className="text-accent font-display font-bold text-sm">{timeStr}</span>
        <span className="text-muted-foreground text-[9px]">{dateStr}</span>
      </div>

      {/* Season */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{season.icon}</span>
        <span className="text-foreground text-[10px] font-bold">{season.name}</span>
      </div>

      {/* Weather */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{weather.icon}</span>
        <span className="text-foreground text-[10px] font-bold">{weather.name}</span>
      </div>

      {/* 2x speed indicator */}
      <span className="text-muted-foreground/50 text-[8px]">2× SPEED</span>

      {/* Subtle stars for nighttime */}
      {!isDaytime && (
        <>
          <div className="absolute top-0.5 left-[20%] w-0.5 h-0.5 bg-foreground/30 rounded-full animate-pulse" />
          <div className="absolute top-1 left-[45%] w-0.5 h-0.5 bg-foreground/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-0.5 left-[70%] w-0.5 h-0.5 bg-foreground/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        </>
      )}
    </div>
  );
}
