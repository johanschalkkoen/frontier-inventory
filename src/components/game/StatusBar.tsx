interface StatusBarProps {
  label: string;
  value: number;
  max: number;
  colorClass: string;
}

export function StatusBar({ label, value, max, colorClass }: StatusBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-[9px] font-bold text-primary mb-0.5">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-2.5 bg-game-slot border border-game-slot-border">
        <div className={`h-full transition-all duration-400 ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
