import { type GameItem, type Rarity } from '@/data/gameData';

const rarityBorderClass: Record<Rarity, string> = {
  legendary: 'border-rarity-legendary',
  epic: 'border-rarity-epic',
  rare: 'border-rarity-rare',
  advanced: 'border-rarity-advanced',
  basic: 'border-transparent',
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
      className={`w-full h-full cursor-pointer relative border ${rarityBorderClass[item.rarity]} hover:brightness-125 transition-all`}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img src={item.img} alt={item.name} className="w-full h-full object-cover" loading="lazy" width={64} height={64} />
      <div className="absolute bottom-0 w-full bg-game-slot/90 text-[7px] text-center text-foreground pointer-events-none py-px">
        {item.name}
      </div>
    </div>
  );
}
