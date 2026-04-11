import hatStetson from '@/assets/overlays/hat-stetson.png';
import hatBlack from '@/assets/overlays/hat-black.png';
import bandanaRed from '@/assets/overlays/bandana-red.png';
import shirtCotton from '@/assets/overlays/shirt-cotton.png';
import shirtVest from '@/assets/overlays/shirt-vest.png';
import coatDuster from '@/assets/overlays/coat-duster.png';
import glovesLeather from '@/assets/overlays/gloves-leather.png';
import pantsDenim from '@/assets/overlays/pants-denim.png';
import bootsSpurred from '@/assets/overlays/boots-spurred.png';
import gunbeltBullet from '@/assets/overlays/gunbelt-bullet.png';
import sidearmColt from '@/assets/overlays/sidearm-colt.png';
import sidearmDerringer from '@/assets/overlays/sidearm-derringer.png';
import longarmWinchester from '@/assets/overlays/longarm-winchester.png';
import longarmShotgun from '@/assets/overlays/longarm-shotgun.png';

import type { SlotType } from './gameData';

export interface OverlayConfig {
  img: string;
  /** CSS positioning within the sprite box (percentage-based) */
  top: string;
  left: string;
  width: string;
  height: string;
  zIndex: number;
}

/** Z-index layering order for slot types (like Diablo paper doll) */
const SLOT_Z: Record<SlotType, number> = {
  boots: 1,
  pants: 2,
  shirt: 3,
  gunbelt: 4,
  outerwear: 5,
  gloves: 6,
  bandana: 7,
  hat: 8,
  sidearm: 9,
  longarm: 10,
  knife: 0,
  rope: 0,
  canteen: 0,
  tobacco: 0,
  special: 0,
};

/** Maps item IDs to their overlay positioning on the character sprite */
export const itemOverlays: Record<string, OverlayConfig> = {
  // Hats
  'item-3': { img: hatStetson, top: '-2%', left: '15%', width: '70%', height: '22%', zIndex: SLOT_Z.hat },
  'item-10': { img: hatBlack, top: '-2%', left: '15%', width: '70%', height: '22%', zIndex: SLOT_Z.hat },
  // Bandana
  'item-7': { img: bandanaRed, top: '16%', left: '22%', width: '56%', height: '16%', zIndex: SLOT_Z.bandana },
  // Shirts
  'item-13': { img: shirtCotton, top: '22%', left: '10%', width: '80%', height: '30%', zIndex: SLOT_Z.shirt },
  'item-14': { img: shirtVest, top: '22%', left: '10%', width: '80%', height: '30%', zIndex: SLOT_Z.shirt },
  // Outerwear
  'item-15': { img: coatDuster, top: '20%', left: '8%', width: '84%', height: '55%', zIndex: SLOT_Z.outerwear },
  // Gloves
  'item-18': { img: glovesLeather, top: '42%', left: '5%', width: '90%', height: '20%', zIndex: SLOT_Z.gloves },
  // Pants
  'item-16': { img: pantsDenim, top: '48%', left: '18%', width: '64%', height: '30%', zIndex: SLOT_Z.pants },
  // Boots
  'item-17': { img: bootsSpurred, top: '72%', left: '15%', width: '70%', height: '28%', zIndex: SLOT_Z.boots },
  // Gunbelt
  'item-19': { img: gunbeltBullet, top: '42%', left: '10%', width: '80%', height: '25%', zIndex: SLOT_Z.gunbelt },
  // Sidearms
  'item-4': { img: sidearmColt, top: '38%', left: '55%', width: '42%', height: '20%', zIndex: SLOT_Z.sidearm },
  'item-11': { img: sidearmDerringer, top: '40%', left: '58%', width: '35%', height: '16%', zIndex: SLOT_Z.sidearm },
  // Longarms
  'item-5': { img: longarmWinchester, top: '10%', left: '-10%', width: '70%', height: '75%', zIndex: SLOT_Z.longarm },
  'item-12': { img: longarmShotgun, top: '10%', left: '-10%', width: '70%', height: '75%', zIndex: SLOT_Z.longarm },
};
