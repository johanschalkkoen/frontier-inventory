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
}

export interface GameItem {
  id: string;
  type: SlotType;
  rarity: Rarity;
  name: string;
  img: string;
  stats: ItemStats;
  value: number;
}

export const STANDARD_STATS: Record<string, number> = {
  health: 100, energy: 100, thirst: 100, sleep: 100, defense: 0, damage: 5, speed: 10
};

export const itemDatabase: GameItem[] = [
  // Coins & Valuables
  { id: 'item-0', type: 'special', rarity: 'rare', name: 'Gold Coin', img: coinImg, stats: {}, value: 20.00 },
  { id: 'item-1', type: 'special', rarity: 'advanced', name: 'Silver Dollar', img: coinImg, stats: {}, value: 5.00 },
  { id: 'item-2', type: 'special', rarity: 'basic', name: 'Copper Cent', img: coinImg, stats: {}, value: 1.00 },
  { id: 'item-20', type: 'special', rarity: 'legendary', name: 'Gold Pocket Watch', img: pocketwatchImg, stats: { speed: 5 }, value: 75.00 },
  { id: 'item-21', type: 'special', rarity: 'rare', name: 'Gold Coin', img: coinImg, stats: {}, value: 20.00 },
  { id: 'item-22', type: 'special', rarity: 'advanced', name: 'Silver Dollar', img: coinImg, stats: {}, value: 5.00 },

  // Hats
  { id: 'item-3', type: 'hat', rarity: 'basic', name: 'Stetson', img: hatImg, stats: { defense: 5 }, value: 0 },
  { id: 'item-10', type: 'hat', rarity: 'epic', name: 'Black Gunslinger Hat', img: hat2Img, stats: { defense: 12, damage: 5 }, value: 0 },

  // Sidearms
  { id: 'item-4', type: 'sidearm', rarity: 'legendary', name: 'Colt Peacemaker', img: sidearmImg, stats: { damage: 45 }, value: 0 },
  { id: 'item-11', type: 'sidearm', rarity: 'advanced', name: 'Derringer', img: derringerImg, stats: { damage: 15 }, value: 0 },

  // Longarms
  { id: 'item-5', type: 'longarm', rarity: 'epic', name: 'Winchester 1873', img: longarmImg, stats: { damage: 60 }, value: 0 },
  { id: 'item-12', type: 'longarm', rarity: 'rare', name: 'Double-Barrel Shotgun', img: shotgunImg, stats: { damage: 40 }, value: 0 },

  // Clothing
  { id: 'item-13', type: 'shirt', rarity: 'basic', name: 'Cotton Shirt', img: shirtImg, stats: { defense: 2 }, value: 0 },
  { id: 'item-14', type: 'shirt', rarity: 'rare', name: 'Sheriff Vest', img: vestImg, stats: { defense: 10, health: 15 }, value: 0 },
  { id: 'item-15', type: 'outerwear', rarity: 'epic', name: 'Leather Duster', img: coatImg, stats: { defense: 18, speed: -3 }, value: 0 },
  { id: 'item-16', type: 'pants', rarity: 'basic', name: 'Denim Jeans', img: pantsImg, stats: { defense: 3 }, value: 0 },
  { id: 'item-17', type: 'boots', rarity: 'advanced', name: 'Spurred Boots', img: bootsImg, stats: { speed: 8, defense: 4 }, value: 0 },
  { id: 'item-7', type: 'bandana', rarity: 'basic', name: 'Red Bandana', img: bandanaImg, stats: { defense: 2 }, value: 0 },

  // Gear
  { id: 'item-18', type: 'gloves', rarity: 'advanced', name: 'Leather Gloves', img: glovesImg, stats: { damage: 3, defense: 3 }, value: 0 },
  { id: 'item-19', type: 'gunbelt', rarity: 'rare', name: 'Bullet Belt', img: gunbeltImg, stats: { damage: 8, defense: 5 }, value: 0 },

  // Accessories
  { id: 'item-8', type: 'knife', rarity: 'rare', name: 'Bowie Knife', img: knifeImg, stats: { damage: 25 }, value: 0 },
  { id: 'item-23', type: 'rope', rarity: 'advanced', name: 'Lasso', img: ropeImg, stats: { speed: 5 }, value: 0 },
  { id: 'item-9', type: 'canteen', rarity: 'basic', name: 'Tin Canteen', img: canteenImg, stats: { thirst: 40 }, value: 0 },
  { id: 'item-24', type: 'tobacco', rarity: 'basic', name: 'Pipe & Tobacco', img: tobaccoImg, stats: { energy: 15, sleep: -10 }, value: 0 },

  // Specials
  { id: 'item-6', type: 'special', rarity: 'rare', name: 'Western Saddle', img: saddleImg, stats: { speed: 10 }, value: 0 },
  { id: 'item-25', type: 'special', rarity: 'epic', name: 'Dynamite', img: dynamiteImg, stats: { damage: 35 }, value: 0 },
  { id: 'item-26', type: 'special', rarity: 'advanced', name: 'Whiskey Bottle', img: whiskeyImg, stats: { health: -10, energy: 25, damage: 5 }, value: 3.50 },
];
