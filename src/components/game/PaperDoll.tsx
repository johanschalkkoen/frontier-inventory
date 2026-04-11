import { useGame } from '@/context/GameContext';
import { itemOverlays } from '@/data/overlays';
import { itemDatabase, type SlotType } from '@/data/gameData';
import baseMale from '@/assets/characters/base-male.png';
import baseFemale from '@/assets/characters/base-female.png';

const VISUAL_SLOTS: SlotType[] = ['boots', 'pants', 'shirt', 'gunbelt', 'outerwear', 'gloves', 'bandana', 'hat', 'sidearm', 'longarm'];

export function PaperDoll() {
  const { state } = useGame();
  const baseImg = state.gender === 'male' ? baseMale : baseFemale;

  // Gather equipped items that have overlays, sorted by z-index
  const equippedOverlays = VISUAL_SLOTS
    .map(slotType => {
      const item = itemDatabase.find(i => {
        const loc = state.itemLocations[i.id];
        return loc?.area === 'equipped' && loc.slotType === slotType;
      });
      if (!item) return null;
      const overlay = itemOverlays[item.id];
      if (!overlay) return null;
      return { id: item.id, ...overlay };
    })
    .filter(Boolean) as Array<{ id: string; img: string; top: string; left: string; width: string; height: string; zIndex: number }>;

  return (
    <div className="relative w-[155px] h-[344px] bg-game-slot border-2 border-game-slot overflow-hidden">
      {/* Base character sprite */}
      <img
        src={baseImg}
        alt="Character"
        className="w-full h-full object-cover"
        width={155}
        height={344}
      />

      {/* Equipment overlays layered on top */}
      {equippedOverlays.map(ov => (
        <img
          key={ov.id}
          src={ov.img}
          alt=""
          className="absolute pointer-events-none"
          style={{
            top: ov.top,
            left: ov.left,
            width: ov.width,
            height: ov.height,
            zIndex: ov.zIndex,
            objectFit: 'contain',
          }}
        />
      ))}
    </div>
  );
}
