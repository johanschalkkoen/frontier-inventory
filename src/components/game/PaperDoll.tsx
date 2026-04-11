import { useGame } from '@/context/GameContext';
import { itemOverlays, slotPositions } from '@/data/overlays';
import { itemDatabase, type SlotType } from '@/data/gameData';
import maleBase from '@/assets/characters/male-base.png';
import femaleBase from '@/assets/characters/female-base.png';

const clothingSlots: SlotType[] = ['boots', 'pants', 'shirt', 'gunbelt', 'outerwear', 'bandana', 'gloves', 'hat', 'sidearm', 'longarm', 'knife', 'rope', 'canteen', 'tobacco', 'special'];

export function PaperDoll() {
  const { state } = useGame();
  const baseImg = state.gender === 'male' ? maleBase : femaleBase;

  // Get all equipped items
  const equippedItems = itemDatabase.filter(item => {
    const loc = state.itemLocations[item.id];
    return loc?.area === 'equipped';
  });

  return (
    <div className="relative w-[155px] h-[344px] bg-game-slot border-2 border-game-slot overflow-hidden">
      {/* Base character in underwear */}
      <img src={baseImg} alt="Character" className="w-full h-full object-contain" width={155} height={344} />

      {/* Layered equipment overlays */}
      {clothingSlots.map(slotType => {
        const equipped = equippedItems.find(item => {
          const loc = state.itemLocations[item.id];
          return loc?.slotType === slotType;
        });
        if (!equipped) return null;

        const overlay = itemOverlays[equipped.id];
        const pos = slotPositions[slotType];

        if (overlay) {
          // Render the transparent overlay at the correct position
          return (
            <img
              key={slotType}
              src={overlay}
              alt={equipped.name}
              className="absolute object-contain pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
                height: pos.height,
                zIndex: pos.zIndex,
              }}
              loading="lazy"
            />
          );
        }

        // Fallback: show the item icon as a small overlay
        return (
          <div
            key={slotType}
            className="absolute pointer-events-none"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
              height: pos.height,
              zIndex: pos.zIndex,
            }}
          >
            <img
              src={equipped.img}
              alt={equipped.name}
              className="w-full h-full object-contain opacity-80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
}
