// Overlay images mapped to item IDs for the paper doll system
import hatStetson from '@/assets/overlays/hat-stetson.png';
import hatBlack from '@/assets/overlays/hat-black.png';
import shirtCotton from '@/assets/overlays/shirt-cotton.png';
import shirtVest from '@/assets/overlays/shirt-vest.png';
import coatDuster from '@/assets/overlays/coat-duster.png';
import pantsDenim from '@/assets/overlays/pants-denim.png';
import bootsSpurred from '@/assets/overlays/boots-spurred.png';
import bandanaRed from '@/assets/overlays/bandana-red.png';
import glovesLeather from '@/assets/overlays/gloves-leather.png';
import gunbeltBullet from '@/assets/overlays/gunbelt-bullet.png';

import type { SlotType } from '@/data/gameData';

export interface OverlayPosition {
  top: string;
  left: string;
  width: string;
  height: string;
  zIndex: number;
}

// Position mapping for each slot type on the paper doll
export const slotPositions: Record<SlotType, OverlayPosition> = {
  hat:       { top: '-8%',  left: '15%', width: '70%', height: '25%', zIndex: 10 },
  bandana:   { top: '15%', left: '20%', width: '60%', height: '18%', zIndex: 9 },
  shirt:     { top: '22%', left: '10%', width: '80%', height: '30%', zIndex: 5 },
  outerwear: { top: '18%', left: '5%',  width: '90%', height: '50%', zIndex: 7 },
  gloves:    { top: '42%', left: '5%',  width: '90%', height: '20%', zIndex: 8 },
  gunbelt:   { top: '45%', left: '10%', width: '80%', height: '12%', zIndex: 6 },
  pants:     { top: '48%', left: '15%', width: '70%', height: '35%', zIndex: 4 },
  boots:     { top: '78%', left: '18%', width: '64%', height: '22%', zIndex: 3 },
  sidearm:   { top: '38%', left: '60%', width: '35%', height: '20%', zIndex: 11 },
  longarm:   { top: '20%', left: '65%', width: '30%', height: '45%', zIndex: 11 },
  knife:     { top: '50%', left: '0%',  width: '25%', height: '18%', zIndex: 11 },
  rope:      { top: '35%', left: '0%',  width: '28%', height: '15%', zIndex: 11 },
  canteen:   { top: '30%', left: '70%', width: '25%', height: '15%', zIndex: 11 },
  tobacco:   { top: '42%', left: '72%', width: '22%', height: '12%', zIndex: 11 },
  special:   { top: '55%', left: '70%', width: '25%', height: '15%', zIndex: 11 },
};

// Map item IDs to their overlay images
export const itemOverlays: Record<string, string> = {
  'item-3': hatStetson,       // Stetson
  'item-10': hatBlack,        // Black Gunslinger Hat
  'item-13': shirtCotton,     // Cotton Shirt
  'item-14': shirtVest,       // Sheriff Vest
  'item-15': coatDuster,      // Leather Duster
  'item-16': pantsDenim,      // Denim Jeans
  'item-17': bootsSpurred,    // Spurred Boots
  'item-7': bandanaRed,       // Red Bandana
  'item-18': glovesLeather,   // Leather Gloves
  'item-19': gunbeltBullet,   // Bullet Belt
};
