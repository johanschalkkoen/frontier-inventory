interface StatusBarProps {
  label: string;
  value: number;
  max: number;
  colorClass: string;
  icon?: string;
}

const barGradients: Record<string, string> = {
  'bg-bar-health': 'linear-gradient(90deg, hsl(0 60% 30%), hsl(0 80% 45%), hsl(0 90% 50%))',
  'bg-bar-energy': 'linear-gradient(90deg, hsl(45 60% 25%), hsl(55 80% 40%), hsl(55 90% 45%))',
  'bg-bar-thirst': 'linear-gradient(90deg, hsl(200 60% 30%), hsl(210 80% 45%), hsl(215 90% 55%))',
  'bg-bar-sleep': 'linear-gradient(90deg, hsl(270 40% 25%), hsl(280 60% 40%), hsl(285 70% 45%))',
};

const barIcons: Record<string, string> = {
  'bg-bar-health': '❤️',
  'bg-bar-energy': '⚡',
  'bg-bar-thirst': '💧',
  'bg-bar-sleep': '🌙',
};

export function StatusBar({ label, value, max, colorClass, icon }: StatusBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const isLow = pct < 25;
  const isCritical = pct < 10;
  const gradient = barGradients[colorClass] || '';
  const displayIcon = icon || barIcons[colorClass] || '';

  return (
    <div className="bg-game-slot/50 border border-game-slot-border p-1.5 md:p-2 rounded-sm relative overflow-hidden"
      style={{ borderImage: `linear-gradient(135deg, ${isCritical ? 'hsl(0 80% 40%)' : isLow ? 'hsl(43 90% 55%)' : 'hsl(var(--primary)/0.3)'}, transparent) 1` }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, hsl(var(--primary)/0.1) 4px, hsl(var(--primary)/0.1) 5px)'
      }} />

      <div className="flex justify-between text-[8px] md:text-[9px] font-bold text-primary mb-0.5 relative z-10">
        <span className="flex items-center gap-1">
          {displayIcon && <span className="text-xs md:text-sm">{displayIcon}</span>}
          <span className="tracking-wider">{label}</span>
        </span>
        <span className={`font-display ${isCritical ? 'text-destructive animate-pulse' : isLow ? 'text-accent' : 'text-foreground'}`}>
          {Math.round(value)}/{max}
        </span>
      </div>
      <div className="h-4 md:h-5 bg-game-slot border border-game-slot-border rounded-sm overflow-hidden relative z-10"
        style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
        <div className={`h-full transition-all duration-700 ease-out ${isCritical ? 'animate-pulse' : ''}`}
          style={{
            width: `${pct}%`,
            background: gradient || undefined,
          }} />
        {/* Segment markers */}
        {[25, 50, 75].map(mark => (
          <div key={mark} className="absolute top-0 bottom-0 w-px bg-foreground/15"
            style={{ left: `${mark}%` }} />
        ))}
        {/* Shine */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-b from-foreground/15 to-transparent pointer-events-none" />
        {/* Value text inside bar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[7px] md:text-[8px] font-bold text-foreground/70 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            {Math.round(pct)}%
          </span>
        </div>
      </div>
    </div>
  );
}
