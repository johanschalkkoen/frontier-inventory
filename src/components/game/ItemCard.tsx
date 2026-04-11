import { type GameItem, type Rarity } from '@/data/gameData';

const rarityBorderColors: Record<Rarity, string> = {
  legendary: 'hsl(45, 100%, 50%)',
  epic: 'hsl(280, 80%, 60%)',
  rare: 'hsl(210, 80%, 55%)',
  advanced: 'hsl(120, 60%, 45%)',
  basic: 'hsl(30, 20%, 35%)',
};

const rarityGlow: Record<Rarity, string> = {
  legendary: '0 0 8px hsl(45, 100%, 50%, 0.5)',
  epic: '0 0 6px hsl(280, 80%, 60%, 0.4)',
  rare: '0 0 5px hsl(210, 80%, 55%, 0.3)',
  advanced: '0 0 4px hsl(120, 60%, 45%, 0.2)',
  basic: 'none',
};

interface ItemCardProps {
  item: GameItem;
  onDoubleClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}

export function ItemCard({ item, onDoubleClick, onMouseEnter, onMouseLeave }: ItemCardProps) {
  return (
    <div
      className="w-full h-full cursor-pointer relative hover:brightness-125 transition-all"
      style={{
        border: `2px solid ${rarityBorderColors[item.rarity]}`,
        boxShadow: rarityGlow[item.rarity],
      }}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img src={item.img} alt={item.name} className="w-full h-full object-cover" loading="lazy" width={64} height={64} />
      {/* Rarity corner indicator */}
      <div className="absolute top-0 right-0 w-0 h-0"
        style={{
          borderTop: `8px solid ${rarityBorderColors[item.rarity]}`,
          borderLeft: '8px solid transparent',
        }} />
      <div className="absolute bottom-0 w-full bg-game-slot/90 text-[7px] text-center text-foreground pointer-events-none py-px">
        {item.name}
      </div>
    </div>
  );
}
