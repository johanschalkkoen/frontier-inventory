import type { GameItem, Rarity } from '@/data/gameData';
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

export interface ShopItem extends Omit<GameItem, 'id'> {
  buyPrice: number;
  sellPrice: number;
  category: string;
}

export const shopInventory: ShopItem[] = [
  // HATS
  { type: 'hat', rarity: 'basic', name: 'Stetson', img: hatImg, stats: { defense: 5 }, value: 0, buyPrice: 25, sellPrice: 10, category: 'Hats' },
  { type: 'hat', rarity: 'epic', name: 'Black Gunslinger Hat', img: hat2Img, stats: { defense: 12, damage: 5 }, value: 0, buyPrice: 150, sellPrice: 60, category: 'Hats' },
  // BANDANAS
  { type: 'bandana', rarity: 'basic', name: 'Red Bandana', img: bandanaImg, stats: { defense: 2 }, value: 0, buyPrice: 10, sellPrice: 4, category: 'Clothing' },
  // SHIRTS
  { type: 'shirt', rarity: 'basic', name: 'Cotton Shirt', img: shirtImg, stats: { defense: 2 }, value: 0, buyPrice: 15, sellPrice: 6, category: 'Clothing' },
  { type: 'shirt', rarity: 'rare', name: 'Sheriff Vest', img: vestImg, stats: { defense: 10, health: 15 }, value: 0, buyPrice: 85, sellPrice: 35, category: 'Clothing' },
  // OUTERWEAR
  { type: 'outerwear', rarity: 'epic', name: 'Leather Duster', img: coatImg, stats: { defense: 18, speed: -3 }, value: 0, buyPrice: 200, sellPrice: 80, category: 'Clothing' },
  // GLOVES
  { type: 'gloves', rarity: 'advanced', name: 'Leather Gloves', img: glovesImg, stats: { damage: 3, defense: 3 }, value: 0, buyPrice: 35, sellPrice: 14, category: 'Clothing' },
  // PANTS
  { type: 'pants', rarity: 'basic', name: 'Denim Jeans', img: pantsImg, stats: { defense: 3 }, value: 0, buyPrice: 20, sellPrice: 8, category: 'Clothing' },
  // BOOTS
  { type: 'boots', rarity: 'advanced', name: 'Spurred Boots', img: bootsImg, stats: { speed: 8, defense: 4 }, value: 0, buyPrice: 55, sellPrice: 22, category: 'Clothing' },
  // GUNBELTS
  { type: 'gunbelt', rarity: 'rare', name: 'Bullet Belt', img: gunbeltImg, stats: { damage: 8, defense: 5 }, value: 0, buyPrice: 75, sellPrice: 30, category: 'Gear' },
  // SIDEARMS
  { type: 'sidearm', rarity: 'advanced', name: 'Derringer', img: derringerImg, stats: { damage: 15 }, value: 0, buyPrice: 40, sellPrice: 16, category: 'Weapons' },
  { type: 'sidearm', rarity: 'legendary', name: 'Colt Peacemaker', img: sidearmImg, stats: { damage: 45 }, value: 0, buyPrice: 350, sellPrice: 140, category: 'Weapons' },
  // LONGARMS
  { type: 'longarm', rarity: 'rare', name: 'Double-Barrel Shotgun', img: shotgunImg, stats: { damage: 40 }, value: 0, buyPrice: 120, sellPrice: 48, category: 'Weapons' },
  { type: 'longarm', rarity: 'epic', name: 'Winchester 1873', img: longarmImg, stats: { damage: 60 }, value: 0, buyPrice: 280, sellPrice: 112, category: 'Weapons' },
  // KNIVES
  { type: 'knife', rarity: 'rare', name: 'Bowie Knife', img: knifeImg, stats: { damage: 25 }, value: 0, buyPrice: 65, sellPrice: 26, category: 'Weapons' },
  // ACCESSORIES
  { type: 'rope', rarity: 'advanced', name: 'Lasso', img: ropeImg, stats: { speed: 5 }, value: 0, buyPrice: 30, sellPrice: 12, category: 'Gear' },
  { type: 'canteen', rarity: 'basic', name: 'Tin Canteen', img: canteenImg, stats: { thirst: 40 }, value: 0, buyPrice: 12, sellPrice: 5, category: 'Gear' },
  { type: 'tobacco', rarity: 'basic', name: 'Pipe & Tobacco', img: tobaccoImg, stats: { energy: 15, sleep: -10 }, value: 0, buyPrice: 8, sellPrice: 3, category: 'Consumables' },
  // SPECIALS
  { type: 'special', rarity: 'rare', name: 'Western Saddle', img: saddleImg, stats: { speed: 10 }, value: 0, buyPrice: 90, sellPrice: 36, category: 'Gear' },
  { type: 'special', rarity: 'epic', name: 'Dynamite', img: dynamiteImg, stats: { damage: 35 }, value: 0, buyPrice: 45, sellPrice: 18, category: 'Consumables' },
  { type: 'special', rarity: 'advanced', name: 'Whiskey Bottle', img: whiskeyImg, stats: { health: -10, energy: 25, damage: 5 }, value: 3.50, buyPrice: 5, sellPrice: 2, category: 'Consumables' },
  { type: 'special', rarity: 'legendary', name: 'Gold Pocket Watch', img: pocketwatchImg, stats: { speed: 5 }, value: 75.00, buyPrice: 300, sellPrice: 120, category: 'Valuables' },
];

export const shopCategories = ['All', 'Weapons', 'Clothing', 'Hats', 'Gear', 'Consumables', 'Valuables'];

export const rarityOrder: Record<Rarity, number> = {
  basic: 0, advanced: 1, rare: 2, epic: 3, legendary: 4,
};
