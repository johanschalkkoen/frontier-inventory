import coinImg from '@/assets/items/coin.jpg';
import hatImg from '@/assets/items/hat.jpg';
import hat2Img from '@/assets/items/hat2.jpg';
import sidearmImg from '@/assets/items/sidearm.jpg';
import derringerImg from '@/assets/items/derringer.jpg';
import longarmImg from '@/assets/items/longarm.jpg';
import shotgunImg from '@/assets/items/shotgun.jpg';
import saddleImg from '@/assets/items/saddle.jpg';
import bandanaImg from '@/assets/items/bandana.jpg';
import knifeImg from '@/assets/items/knife.jpg';
import canteenImg from '@/assets/items/canteen.jpg';
import bootsImg from '@/assets/items/boots.jpg';
import coatImg from '@/assets/items/coat.jpg';
import glovesImg from '@/assets/items/gloves.jpg';
import gunbeltImg from '@/assets/items/gunbelt.jpg';
import shirtImg from '@/assets/items/shirt.jpg';
import pantsImg from '@/assets/items/pants.jpg';
import ropeImg from '@/assets/items/rope.jpg';
import tobaccoImg from '@/assets/items/tobacco.jpg';
import whiskeyImg from '@/assets/items/whiskey.jpg';
import pocketwatchImg from '@/assets/items/pocketwatch.jpg';
import vestImg from '@/assets/items/vest.jpg';
import dynamiteImg from '@/assets/items/dynamite.jpg';

export type SlotType = 'hat' | 'bandana' | 'shirt' | 'outerwear' | 'gloves' | 'sidearm' | 'longarm' | 'gunbelt' | 'pants' | 'boots' | 'knife' | 'rope' | 'canteen' | 'tobacco' | 'special';
export type Rarity = 'basic' | 'advanced' | 'rare' | 'epic' | 'legendary';

export interface ItemStats {
  health?: number;
  energy?: number;
  thirst?: number;
  sleep?: number;
  defense?: number;
  damage?: number;
  speed?: number;
  luck?: number;
  charisma?: number;
}

export interface GameItem {
  id: string;
  type: SlotType;
  rarity: Rarity;
  name: string;
  img: string;
  stats: ItemStats;
  value: number;
  levelRequired: number;
}

export const STANDARD_STATS: Record<string, number> = {
  health: 100, energy: 100, thirst: 100, sleep: 100, defense: 0, damage: 5, speed: 10, luck: 5, charisma: 5
};

export const itemDatabase: GameItem[] = [
  // Coins & Valuables (prices +70%)
  { id: 'item-0', type: 'special', rarity: 'rare', name: 'Gold Coin', img: coinImg, stats: {}, value: 34, levelRequired: 1 },
  { id: 'item-1', type: 'special', rarity: 'advanced', name: 'Silver Dollar', img: coinImg, stats: {}, value: 9, levelRequired: 1 },
  { id: 'item-2', type: 'special', rarity: 'basic', name: 'Copper Cent', img: coinImg, stats: {}, value: 2, levelRequired: 1 },
  { id: 'item-20', type: 'special', rarity: 'legendary', name: 'Gold Pocket Watch', img: pocketwatchImg, stats: { speed: 5, luck: 10 }, value: 128, levelRequired: 8 },
  { id: 'item-21', type: 'special', rarity: 'rare', name: 'Gold Coin', img: coinImg, stats: {}, value: 34, levelRequired: 1 },
  { id: 'item-22', type: 'special', rarity: 'advanced', name: 'Silver Dollar', img: coinImg, stats: {}, value: 9, levelRequired: 1 },

  // Hats
  { id: 'item-3', type: 'hat', rarity: 'basic', name: 'Stetson', img: hatImg, stats: { defense: 5 }, value: 12, levelRequired: 1 },
  { id: 'item-10', type: 'hat', rarity: 'epic', name: 'Black Gunslinger Hat', img: hat2Img, stats: { defense: 12, damage: 5, charisma: 8 }, value: 340, levelRequired: 6 },

  // Sidearms
  { id: 'item-4', type: 'sidearm', rarity: 'legendary', name: 'Colt Peacemaker', img: sidearmImg, stats: { damage: 45, speed: 5 }, value: 850, levelRequired: 10 },
  { id: 'item-11', type: 'sidearm', rarity: 'advanced', name: 'Derringer', img: derringerImg, stats: { damage: 15, speed: 8 }, value: 68, levelRequired: 3 },

  // Longarms
  { id: 'item-5', type: 'longarm', rarity: 'epic', name: 'Winchester 1873', img: longarmImg, stats: { damage: 60, speed: -5 }, value: 510, levelRequired: 8 },
  { id: 'item-12', type: 'longarm', rarity: 'rare', name: 'Double-Barrel Shotgun', img: shotgunImg, stats: { damage: 40, speed: -3 }, value: 255, levelRequired: 5 },

  // Clothing
  { id: 'item-13', type: 'shirt', rarity: 'basic', name: 'Cotton Shirt', img: shirtImg, stats: { defense: 2 }, value: 5, levelRequired: 1 },
  { id: 'item-14', type: 'shirt', rarity: 'rare', name: 'Sheriff Vest', img: vestImg, stats: { defense: 10, health: 15, charisma: 10 }, value: 204, levelRequired: 5 },
  { id: 'item-15', type: 'outerwear', rarity: 'epic', name: 'Leather Duster', img: coatImg, stats: { defense: 18, speed: -3, charisma: 5 }, value: 425, levelRequired: 7 },
  { id: 'item-16', type: 'pants', rarity: 'basic', name: 'Denim Jeans', img: pantsImg, stats: { defense: 3 }, value: 7, levelRequired: 1 },
  { id: 'item-17', type: 'boots', rarity: 'advanced', name: 'Spurred Boots', img: bootsImg, stats: { speed: 8, defense: 4 }, value: 51, levelRequired: 3 },
  { id: 'item-7', type: 'bandana', rarity: 'basic', name: 'Red Bandana', img: bandanaImg, stats: { defense: 2, charisma: -5 }, value: 3, levelRequired: 1 },

  // Gear
  { id: 'item-18', type: 'gloves', rarity: 'advanced', name: 'Leather Gloves', img: glovesImg, stats: { damage: 3, defense: 3 }, value: 34, levelRequired: 2 },
  { id: 'item-19', type: 'gunbelt', rarity: 'rare', name: 'Bullet Belt', img: gunbeltImg, stats: { damage: 8, defense: 5 }, value: 136, levelRequired: 4 },

  // Accessories
  { id: 'item-8', type: 'knife', rarity: 'rare', name: 'Bowie Knife', img: knifeImg, stats: { damage: 25, speed: 3 }, value: 170, levelRequired: 4 },
  { id: 'item-23', type: 'rope', rarity: 'advanced', name: 'Lasso', img: ropeImg, stats: { speed: 5, luck: 5 }, value: 26, levelRequired: 2 },
  { id: 'item-9', type: 'canteen', rarity: 'basic', name: 'Tin Canteen', img: canteenImg, stats: { thirst: 40 }, value: 4, levelRequired: 1 },
  { id: 'item-24', type: 'tobacco', rarity: 'basic', name: 'Pipe & Tobacco', img: tobaccoImg, stats: { energy: 15, sleep: -10, charisma: 3 }, value: 3, levelRequired: 1 },

  // Specials
  { id: 'item-6', type: 'special', rarity: 'rare', name: 'Western Saddle', img: saddleImg, stats: { speed: 10 }, value: 119, levelRequired: 3 },
  { id: 'item-25', type: 'special', rarity: 'epic', name: 'Dynamite', img: dynamiteImg, stats: { damage: 35 }, value: 255, levelRequired: 6 },
  { id: 'item-26', type: 'special', rarity: 'advanced', name: 'Whiskey Bottle', img: whiskeyImg, stats: { health: -10, energy: 25, damage: 5, charisma: 8 }, value: 6, levelRequired: 1 },

  // More hats
  { id: 'item-30', type: 'hat', rarity: 'rare', name: 'Cavalry Kepi', img: hatImg, stats: { defense: 8, charisma: 5 }, value: 153, levelRequired: 4 },
  { id: 'item-31', type: 'hat', rarity: 'legendary', name: 'Golden Crown Hat', img: hat2Img, stats: { defense: 20, charisma: 15, luck: 10 }, value: 1020, levelRequired: 12 },

  // More weapons
  { id: 'item-32', type: 'sidearm', rarity: 'rare', name: 'Schofield Revolver', img: sidearmImg, stats: { damage: 30, speed: 3 }, value: 272, levelRequired: 6 },
  { id: 'item-33', type: 'longarm', rarity: 'legendary', name: 'Sharps Buffalo Rifle', img: longarmImg, stats: { damage: 80, speed: -8, luck: 5 }, value: 1190, levelRequired: 12 },
  { id: 'item-34', type: 'knife', rarity: 'epic', name: 'Damascus Steel Blade', img: knifeImg, stats: { damage: 40, speed: 5 }, value: 425, levelRequired: 9 },

  // More clothing
  { id: 'item-35', type: 'shirt', rarity: 'epic', name: 'Reinforced Leather Shirt', img: shirtImg, stats: { defense: 15, health: 20 }, value: 340, levelRequired: 7 },
  { id: 'item-36', type: 'pants', rarity: 'rare', name: 'Chaps', img: pantsImg, stats: { defense: 8, speed: 3 }, value: 136, levelRequired: 5 },
  { id: 'item-37', type: 'pants', rarity: 'epic', name: 'Armored Trousers', img: pantsImg, stats: { defense: 14, speed: -2 }, value: 306, levelRequired: 8 },
  { id: 'item-38', type: 'boots', rarity: 'rare', name: 'Snakeskin Boots', img: bootsImg, stats: { speed: 12, luck: 5, defense: 3 }, value: 187, levelRequired: 6 },
  { id: 'item-39', type: 'boots', rarity: 'legendary', name: 'Ironclad Boots', img: bootsImg, stats: { defense: 15, speed: 5, damage: 5 }, value: 680, levelRequired: 11 },
  { id: 'item-40', type: 'outerwear', rarity: 'legendary', name: "Marshal's Longcoat", img: coatImg, stats: { defense: 25, charisma: 15, health: 20 }, value: 935, levelRequired: 13 },
  { id: 'item-41', type: 'gloves', rarity: 'rare', name: 'Gunfighter Gloves', img: glovesImg, stats: { damage: 8, speed: 5 }, value: 119, levelRequired: 5 },
  { id: 'item-42', type: 'gloves', rarity: 'legendary', name: 'Deadeye Gauntlets', img: glovesImg, stats: { damage: 15, speed: 8, luck: 10 }, value: 765, levelRequired: 11 },
  { id: 'item-43', type: 'bandana', rarity: 'rare', name: 'Black Outlaw Mask', img: bandanaImg, stats: { defense: 5, charisma: -8, luck: 10 }, value: 85, levelRequired: 4 },
  { id: 'item-44', type: 'bandana', rarity: 'epic', name: 'Spirit Mask', img: bandanaImg, stats: { defense: 10, luck: 15, charisma: 5 }, value: 340, levelRequired: 9 },

  // More gear
  { id: 'item-45', type: 'gunbelt', rarity: 'epic', name: 'Desperado Belt', img: gunbeltImg, stats: { damage: 12, defense: 8, speed: 3 }, value: 374, levelRequired: 7 },
  { id: 'item-46', type: 'gunbelt', rarity: 'legendary', name: "Warlord's Bandolier", img: gunbeltImg, stats: { damage: 20, defense: 12, speed: 5 }, value: 1020, levelRequired: 13 },
  { id: 'item-47', type: 'rope', rarity: 'rare', name: 'Reinforced Lasso', img: ropeImg, stats: { speed: 8, luck: 8 }, value: 102, levelRequired: 5 },
  { id: 'item-48', type: 'canteen', rarity: 'rare', name: 'Silver Canteen', img: canteenImg, stats: { thirst: 60, energy: 10 }, value: 85, levelRequired: 4 },
  { id: 'item-49', type: 'canteen', rarity: 'epic', name: 'Enchanted Flask', img: canteenImg, stats: { thirst: 80, health: 20, energy: 15 }, value: 340, levelRequired: 9 },
  { id: 'item-50', type: 'tobacco', rarity: 'rare', name: 'Fine Cigars', img: tobaccoImg, stats: { energy: 25, charisma: 10, sleep: -5 }, value: 9, levelRequired: 4 },

  // More valuables
  { id: 'item-51', type: 'special', rarity: 'epic', name: 'Ruby Ring', img: pocketwatchImg, stats: { luck: 15, charisma: 10 }, value: 255, levelRequired: 8 },
  { id: 'item-52', type: 'special', rarity: 'legendary', name: 'Crown Jewel', img: pocketwatchImg, stats: { luck: 25, charisma: 20 }, value: 850, levelRequired: 14 },
];
