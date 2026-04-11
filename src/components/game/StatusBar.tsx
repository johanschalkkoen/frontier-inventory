interface StatusBarProps {
  label: string;
  value: number;
  max: number;
  colorClass: string;
  icon?: string;
}

export function StatusBar({ label, value, max, colorClass, icon }: StatusBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const isLow = pct < 25;
  const isCritical = pct < 10;

  return (
    <div className="bg-game-slot/40 border border-game-slot-border p-1.5 rounded-sm">
      <div className="flex justify-between text-[9px] font-bold text-primary mb-0.5">
        <span className="flex items-center gap-1">
          {icon && <span className="text-xs">{icon}</span>}
          {label}
        </span>
        <span className={isCritical ? 'text-destructive animate-pulse' : isLow ? 'text-accent' : ''}>
          {Math.round(value)}/{max}
        </span>
      </div>
      <div className="h-3.5 bg-game-slot border border-game-slot-border rounded-sm overflow-hidden relative">
        <div className={`h-full transition-all duration-500 ${colorClass} ${isCritical ? 'animate-pulse' : ''}`}
          style={{ width: `${pct}%` }} />
        {/* Segment markers */}
        {[25, 50, 75].map(mark => (
          <div key={mark} className="absolute top-0 bottom-0 w-px bg-foreground/10"
            style={{ left: `${mark}%` }} />
        ))}
        {/* Shine effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-foreground/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
