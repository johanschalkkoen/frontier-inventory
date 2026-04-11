import { useState, useEffect } from 'react';

const GAME_START = new Date(1885, 2, 1);
// 1 real minute = ~6 game hours → 4 full day/night cycles per real day
const TIME_MULTIPLIER = 360;

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
  const [weather, setWeather] = useState(() => WEATHER_LIST[Math.floor(Math.random() * WEATHER_LIST.length)]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(getGameTime());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Change weather periodically
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      setWeather(WEATHER_LIST[Math.floor(Math.random() * WEATHER_LIST.length)]);
    }, 120000);
    return () => clearInterval(weatherInterval);
  }, []);

  const season = getSeason(gameTime.getMonth());
  const hours = gameTime.getHours();
  const isDaytime = hours >= 6 && hours < 20;
  const timeStr = gameTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = gameTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const bgGradient = isDaytime
    ? 'linear-gradient(90deg, hsl(35 40% 18%) 0%, hsl(40 50% 22%) 30%, hsl(35 45% 20%) 70%, hsl(30 35% 16%) 100%)'
    : 'linear-gradient(90deg, hsl(220 30% 8%) 0%, hsl(230 25% 12%) 30%, hsl(220 30% 10%) 70%, hsl(215 25% 7%) 100%)';

  return (
    <div className="relative" style={{
      border: '3px solid transparent',
      borderImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cpath d='M0 10 Q5 0 10 10 Q15 20 20 10' fill='none' stroke='%23b8860b' stroke-width='2'/%3E%3C/svg%3E") 10 stretch`,
      padding: '2px',
    }}>
      <div className="relative flex items-center justify-between px-3 md:px-4 py-1.5 border border-accent/30"
        style={{ background: bgGradient }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{isDaytime ? '☀️' : '🌙'}</span>
          <span className="text-accent font-display font-bold text-xs md:text-sm">{timeStr}</span>
          <span className="text-muted-foreground text-[8px] md:text-[9px]">{dateStr}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-sm">{season.icon}</span>
          <span className="text-foreground text-[9px] md:text-[10px] font-bold">{season.name}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-sm">{weather.icon}</span>
          <span className="text-foreground text-[9px] md:text-[10px] font-bold">{weather.name}</span>
        </div>

        {!isDaytime && (
          <>
            <div className="absolute top-0.5 left-[20%] w-0.5 h-0.5 bg-foreground/30 rounded-full animate-pulse" />
            <div className="absolute top-1 left-[45%] w-0.5 h-0.5 bg-foreground/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-0.5 left-[70%] w-0.5 h-0.5 bg-foreground/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </>
        )}
      </div>
    </div>
  );
}
