import coinImg from '@/assets/items/coin.jpg';
import shovelImg from '@/assets/items/shovel.jpg';
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

// Equipment slots (wearable)
export type SlotType = 'hat' | 'bandana' | 'shirt' | 'outerwear' | 'gloves' | 'sidearm' | 'longarm' | 'gunbelt' | 'pants' | 'boots' | 'knife' | 'rope' | 'canteen' | 'tobacco' | 'special' | 'shovel' | 'pocket1' | 'pocket2' | 'pocket3' | 'belt1' | 'belt2' | 'belt3' | 'belt4' | 'belt5';
export type Rarity = 'basic' | 'advanced' | 'rare' | 'epic' | 'legendary';

// Shop categories for organizing items
export type ItemCategory = 'clothing' | 'weapon' | 'ammo' | 'food' | 'drink' | 'edc' | 'medicine' | 'luxury' | 'valuable';

// SPECIAL attributes (Fallout-style)
export interface SpecialStats {
  strength: number;
  perception: number;
  endurance: number;
  charisma: number;
  intelligence: number;
  agility: number;
  luck: number;
}

// Vital / Survival Stats
export interface VitalStats {
  health: number;
  energy: number;
  hunger: number;
  thirst: number;
  sleep: number;
  hygiene: number; // 0-100
  morale: number; // 0-100
}

// Western Justice & Reputation
export interface JusticeStats {
  wantedLevel: number; // 0-5 stars
  bounty: number; // dollars
  lawfulness: 'Lawman' | 'Honest' | 'Neutral' | 'Outlaw' | 'Bandit';
  infamy: number; // 0-100
  honor: number; // 0-100
  gunReputation: number; // 0-100
}

// Gameplay stats
export interface GameplayStats {
  burden: 'Light' | 'Medium' | 'Heavy';
  temperatureStress: 'Hot' | 'Normal' | 'Cold';
  intoxication: 'Sober' | 'Tipsy' | 'Drunk' | 'Blackout';
  pain: number; // 0-100
}

// Skills
export interface PlayerSkills {
  pistols: number;
  rifles: number;
  shotguns: number;
  melee: number;
  unarmed: number;
  throwing: number;
  survival: number;
  horsemanship: number;
  sneak: number;
  lockpicking: number;
  firstAid: number;
  speech: number;
  barter: number;
  gambling: number;
  repair: number;
  crafting: number;
}

export const DEFAULT_SPECIAL: SpecialStats = {
  strength: 5, perception: 5, endurance: 5, charisma: 5, intelligence: 5, agility: 5, luck: 5,
};

export const DEFAULT_VITALS: VitalStats = {
  health: 100, energy: 100, hunger: 100, thirst: 100, sleep: 100, hygiene: 80, morale: 75,
};

export const DEFAULT_JUSTICE: JusticeStats = {
  wantedLevel: 0, bounty: 0, lawfulness: 'Neutral', infamy: 0, honor: 50, gunReputation: 0,
};

export const DEFAULT_GAMEPLAY: GameplayStats = {
  burden: 'Light', temperatureStress: 'Normal', intoxication: 'Sober', pain: 0,
};

export const DEFAULT_SKILLS: PlayerSkills = {
  pistols: 10, rifles: 10, shotguns: 5, melee: 10, unarmed: 15, throwing: 5,
  survival: 10, horsemanship: 10, sneak: 5, lockpicking: 5, firstAid: 10,
  speech: 10, barter: 10, gambling: 5, repair: 5, crafting: 5,
};

export const SPECIAL_DESCRIPTIONS: Record<keyof SpecialStats, { icon: string; desc: string }> = {
  strength: { icon: 'S', desc: 'Physical power. Melee damage, carry weight, intimidation.' },
  perception: { icon: 'P', desc: 'Awareness. Gun accuracy, spotting ambushes, tracking.' },
  endurance: { icon: 'E', desc: 'Toughness. Max health, resistance, survival drain rate.' },
  charisma: { icon: 'C', desc: 'Personality. Dialogue, trading prices, companions.' },
  intelligence: { icon: 'I', desc: 'Knowledge. Crafting, repair, medicine, skill learning.' },
  agility: { icon: 'A', desc: 'Speed & coordination. Draw speed, dodge, stealth, riding.' },
  luck: { icon: 'L', desc: 'Fortune. Critical hits, rare loot, gambling wins.' },
};

export const SKILL_CATEGORIES = {
  combat: ['pistols', 'rifles', 'shotguns', 'melee', 'unarmed', 'throwing'] as (keyof PlayerSkills)[],
  survival: ['survival', 'horsemanship', 'sneak', 'lockpicking', 'firstAid'] as (keyof PlayerSkills)[],
  social: ['speech', 'barter', 'gambling', 'repair', 'crafting'] as (keyof PlayerSkills)[],
};

export const SKILL_ICONS: Record<keyof PlayerSkills, string> = {
  pistols: '⌁', rifles: '╪', shotguns: '⊞', melee: '†', unarmed: '∎', throwing: '◇',
  survival: '◈', horsemanship: '⊳', sneak: '◌', lockpicking: '⊷', firstAid: '✚',
  speech: '⊲', barter: '$', gambling: '◆', repair: '⊕', crafting: '⊞',
};

export interface ItemStats {
  health?: number;
  energy?: number;
  thirst?: number;
  sleep?: number;
  hunger?: number;
  defense?: number;
  damage?: number;
  speed?: number;
  luck?: number;
  charisma?: number;
  morale?: number;
  hygiene?: number;
}

export interface GameItem {
  id: string;
  type: SlotType;
  rarity: Rarity;
  category: ItemCategory;
  name: string;
  img: string;
  stats: ItemStats;
  value: number;
  levelRequired: number;
  consumable?: boolean;
  stackable?: boolean;
  pocketable?: boolean; // can go in pocket slots
  beltable?: boolean; // can go in belt slots
}

export const STANDARD_STATS: Record<string, number> = {
  health: 100, energy: 100, thirst: 100, sleep: 100, hunger: 100,
  defense: 0, damage: 5, speed: 10, luck: 5, charisma: 5,
  morale: 75, hygiene: 80,
};

export const itemDatabase: GameItem[] = [
  // =================== CLOTHING & APPAREL ===================
  // Hats
  { id: 'item-3', type: 'hat', rarity: 'basic', category: 'clothing', name: 'Stetson', img: hatImg, stats: { defense: 5 }, value: 12, levelRequired: 1 },
  { id: 'item-30', type: 'hat', rarity: 'rare', category: 'clothing', name: 'Cavalry Kepi', img: hatImg, stats: { defense: 8, charisma: 5 }, value: 153, levelRequired: 4 },
  { id: 'item-10', type: 'hat', rarity: 'epic', category: 'clothing', name: 'Black Gunslinger Hat', img: hat2Img, stats: { defense: 12, damage: 5, charisma: 8 }, value: 340, levelRequired: 6 },
  { id: 'item-31', type: 'hat', rarity: 'legendary', category: 'clothing', name: 'Golden Crown Hat', img: hat2Img, stats: { defense: 20, charisma: 15, luck: 10 }, value: 1020, levelRequired: 12 },
  { id: 'item-60', type: 'hat', rarity: 'advanced', category: 'clothing', name: 'Boss of Plains Hat', img: hatImg, stats: { defense: 6, charisma: 3 }, value: 42, levelRequired: 2 },

  // Bandanas/Masks
  { id: 'item-7', type: 'bandana', rarity: 'basic', category: 'clothing', name: 'Red Bandana', img: bandanaImg, stats: { defense: 2, charisma: -5 }, value: 3, levelRequired: 1 },
  { id: 'item-61', type: 'bandana', rarity: 'basic', category: 'clothing', name: 'Wild Rag', img: bandanaImg, stats: { defense: 2, energy: 3 }, value: 5, levelRequired: 1 },
  { id: 'item-43', type: 'bandana', rarity: 'rare', category: 'clothing', name: 'Black Outlaw Mask', img: bandanaImg, stats: { defense: 5, charisma: -8, luck: 10 }, value: 85, levelRequired: 4 },
  { id: 'item-44', type: 'bandana', rarity: 'epic', category: 'clothing', name: 'Spirit Mask', img: bandanaImg, stats: { defense: 10, luck: 15, charisma: 5 }, value: 340, levelRequired: 9 },

  // Shirts & Vests
  { id: 'item-13', type: 'shirt', rarity: 'basic', category: 'clothing', name: 'Cotton Work Shirt', img: shirtImg, stats: { defense: 2 }, value: 5, levelRequired: 1 },
  { id: 'item-62', type: 'shirt', rarity: 'basic', category: 'clothing', name: 'Wool Henley', img: shirtImg, stats: { defense: 3, energy: 2 }, value: 8, levelRequired: 1 },
  { id: 'item-63', type: 'shirt', rarity: 'advanced', category: 'clothing', name: 'Vest with Pockets', img: vestImg, stats: { defense: 5, luck: 3 }, value: 34, levelRequired: 2 },
  { id: 'item-14', type: 'shirt', rarity: 'rare', category: 'clothing', name: 'Sheriff Vest', img: vestImg, stats: { defense: 10, health: 15, charisma: 10 }, value: 204, levelRequired: 5 },
  { id: 'item-35', type: 'shirt', rarity: 'epic', category: 'clothing', name: 'Reinforced Leather Shirt', img: shirtImg, stats: { defense: 15, health: 20 }, value: 340, levelRequired: 7 },

  // Outerwear
  { id: 'item-64', type: 'outerwear', rarity: 'basic', category: 'clothing', name: 'Oilskin Slicker', img: coatImg, stats: { defense: 4, energy: 3 }, value: 14, levelRequired: 1 },
  { id: 'item-65', type: 'outerwear', rarity: 'advanced', category: 'clothing', name: 'Wool Duster', img: coatImg, stats: { defense: 8, speed: -1 }, value: 51, levelRequired: 3 },
  { id: 'item-15', type: 'outerwear', rarity: 'epic', category: 'clothing', name: 'Leather Duster', img: coatImg, stats: { defense: 18, speed: -3, charisma: 5 }, value: 425, levelRequired: 7 },
  { id: 'item-40', type: 'outerwear', rarity: 'legendary', category: 'clothing', name: "Marshal's Longcoat", img: coatImg, stats: { defense: 25, charisma: 15, health: 20 }, value: 935, levelRequired: 13 },

  // Pants & Chaps
  { id: 'item-16', type: 'pants', rarity: 'basic', category: 'clothing', name: 'Denim Jeans', img: pantsImg, stats: { defense: 3 }, value: 7, levelRequired: 1 },
  { id: 'item-66', type: 'pants', rarity: 'basic', category: 'clothing', name: 'Canvas Trousers', img: pantsImg, stats: { defense: 2, speed: 1 }, value: 6, levelRequired: 1 },
  { id: 'item-36', type: 'pants', rarity: 'rare', category: 'clothing', name: 'Chaps', img: pantsImg, stats: { defense: 8, speed: 3 }, value: 136, levelRequired: 5 },
  { id: 'item-37', type: 'pants', rarity: 'epic', category: 'clothing', name: 'Armored Trousers', img: pantsImg, stats: { defense: 14, speed: -2 }, value: 306, levelRequired: 8 },
  { id: 'item-67', type: 'pants', rarity: 'advanced', category: 'clothing', name: 'Wool Trousers', img: pantsImg, stats: { defense: 5, charisma: 3 }, value: 26, levelRequired: 2 },

  // Boots
  { id: 'item-68', type: 'boots', rarity: 'basic', category: 'clothing', name: 'Work Boots', img: bootsImg, stats: { speed: 3, defense: 2 }, value: 10, levelRequired: 1 },
  { id: 'item-17', type: 'boots', rarity: 'advanced', category: 'clothing', name: 'Spurred Boots', img: bootsImg, stats: { speed: 8, defense: 4 }, value: 51, levelRequired: 3 },
  { id: 'item-38', type: 'boots', rarity: 'rare', category: 'clothing', name: 'Snakeskin Boots', img: bootsImg, stats: { speed: 12, luck: 5, defense: 3 }, value: 187, levelRequired: 6 },
  { id: 'item-39', type: 'boots', rarity: 'legendary', category: 'clothing', name: 'Ironclad Boots', img: bootsImg, stats: { defense: 15, speed: 5, damage: 5 }, value: 680, levelRequired: 11 },

  // Gloves
  { id: 'item-69', type: 'gloves', rarity: 'basic', category: 'clothing', name: 'Work Gloves', img: glovesImg, stats: { defense: 1 }, value: 4, levelRequired: 1 },
  { id: 'item-18', type: 'gloves', rarity: 'advanced', category: 'clothing', name: 'Leather Riding Gloves', img: glovesImg, stats: { damage: 3, defense: 3 }, value: 34, levelRequired: 2 },
  { id: 'item-41', type: 'gloves', rarity: 'rare', category: 'clothing', name: 'Gunfighter Gloves', img: glovesImg, stats: { damage: 8, speed: 5 }, value: 119, levelRequired: 5 },
  { id: 'item-42', type: 'gloves', rarity: 'legendary', category: 'clothing', name: 'Deadeye Gauntlets', img: glovesImg, stats: { damage: 15, speed: 8, luck: 10 }, value: 765, levelRequired: 11 },

  // =================== WEAPONS ===================
  // Sidearms (Handguns)
  { id: 'item-70', type: 'sidearm', rarity: 'basic', category: 'weapon', name: 'Percussion Revolver', img: sidearmImg, stats: { damage: 8, speed: 3 }, value: 22, levelRequired: 1 },
  { id: 'item-11', type: 'sidearm', rarity: 'advanced', category: 'weapon', name: 'Derringer', img: derringerImg, stats: { damage: 15, speed: 8 }, value: 28, levelRequired: 3, pocketable: true },
  { id: 'item-71', type: 'sidearm', rarity: 'advanced', category: 'weapon', name: 'Colt 1851 Navy', img: sidearmImg, stats: { damage: 18, speed: 5 }, value: 70, levelRequired: 3 },
  { id: 'item-200', type: 'sidearm', rarity: 'advanced', category: 'weapon', name: 'Colt 1860 Army', img: sidearmImg, stats: { damage: 20, speed: 4 }, value: 85, levelRequired: 4 },
  { id: 'item-201', type: 'sidearm', rarity: 'rare', category: 'weapon', name: 'Remington 1875', img: sidearmImg, stats: { damage: 28, speed: 4, luck: 2 }, value: 90, levelRequired: 5 },
  { id: 'item-32', type: 'sidearm', rarity: 'rare', category: 'weapon', name: 'Schofield Revolver', img: sidearmImg, stats: { damage: 30, speed: 3 }, value: 100, levelRequired: 6 },
  { id: 'item-202', type: 'sidearm', rarity: 'rare', category: 'weapon', name: 'Smith & Wesson Russian', img: sidearmImg, stats: { damage: 32, speed: 3, luck: 3 }, value: 110, levelRequired: 7 },
  { id: 'item-203', type: 'sidearm', rarity: 'basic', category: 'weapon', name: 'Colt Pocket Pistol', img: derringerImg, stats: { damage: 10, speed: 6 }, value: 30, levelRequired: 2, pocketable: true },
  { id: 'item-4', type: 'sidearm', rarity: 'epic', category: 'weapon', name: 'Colt Peacemaker (.45)', img: sidearmImg, stats: { damage: 45, speed: 5, charisma: 3 }, value: 120, levelRequired: 8 },
  { id: 'item-204', type: 'sidearm', rarity: 'legendary', category: 'weapon', name: 'Engraved Silver Peacemaker', img: sidearmImg, stats: { damage: 55, speed: 6, charisma: 8, luck: 5 }, value: 850, levelRequired: 15 },

  // Long Guns (Rifles & Shotguns)
  { id: 'item-72', type: 'longarm', rarity: 'basic', category: 'weapon', name: 'Springfield Trapdoor Carbine', img: longarmImg, stats: { damage: 18, speed: -4 }, value: 55, levelRequired: 1 },
  { id: 'item-205', type: 'longarm', rarity: 'basic', category: 'weapon', name: 'Single-Shot Carbine', img: longarmImg, stats: { damage: 15, speed: -3 }, value: 34, levelRequired: 1 },
  { id: 'item-206', type: 'longarm', rarity: 'advanced', category: 'weapon', name: 'Winchester 1866 Yellow Boy', img: longarmImg, stats: { damage: 28, speed: -3 }, value: 90, levelRequired: 3 },
  { id: 'item-73', type: 'longarm', rarity: 'advanced', category: 'weapon', name: 'Henry Rifle (1860)', img: longarmImg, stats: { damage: 35, speed: -3 }, value: 120, levelRequired: 4 },
  { id: 'item-12', type: 'longarm', rarity: 'rare', category: 'weapon', name: 'Double-Barrel Coach Gun', img: shotgunImg, stats: { damage: 40, speed: -3 }, value: 80, levelRequired: 5 },
  { id: 'item-74', type: 'longarm', rarity: 'rare', category: 'weapon', name: 'Sawed-Off Shotgun', img: shotgunImg, stats: { damage: 35, speed: 2 }, value: 75, levelRequired: 5 },
  { id: 'item-5', type: 'longarm', rarity: 'epic', category: 'weapon', name: 'Winchester 1873 (.44-40)', img: longarmImg, stats: { damage: 60, speed: -5, luck: 3 }, value: 130, levelRequired: 8 },
  { id: 'item-207', type: 'longarm', rarity: 'epic', category: 'weapon', name: 'Sharps Carbine', img: longarmImg, stats: { damage: 65, speed: -6, defense: 3 }, value: 145, levelRequired: 9 },
  { id: 'item-33', type: 'longarm', rarity: 'legendary', category: 'weapon', name: 'Sharps "Big Fifty" Buffalo Rifle', img: longarmImg, stats: { damage: 80, speed: -8, luck: 5 }, value: 160, levelRequired: 12 },

  // Melee & Backup
  { id: 'item-75', type: 'knife', rarity: 'basic', category: 'weapon', name: 'Folding Pocket Knife', img: knifeImg, stats: { damage: 6, speed: 2 }, value: 6, levelRequired: 1, pocketable: true },
  { id: 'item-76', type: 'knife', rarity: 'advanced', category: 'weapon', name: 'Sheath Knife', img: knifeImg, stats: { damage: 15, speed: 3 }, value: 18, levelRequired: 2, beltable: true },
  { id: 'item-208', type: 'knife', rarity: 'advanced', category: 'weapon', name: 'Arkansas Toothpick', img: knifeImg, stats: { damage: 18, speed: 4 }, value: 22, levelRequired: 3, beltable: true },
  { id: 'item-8', type: 'knife', rarity: 'rare', category: 'weapon', name: 'Bowie Knife', img: knifeImg, stats: { damage: 25, speed: 3 }, value: 20, levelRequired: 4, beltable: true },
  { id: 'item-209', type: 'knife', rarity: 'rare', category: 'weapon', name: 'Tomahawk', img: knifeImg, stats: { damage: 28, speed: 2, luck: 3 }, value: 15, levelRequired: 5, beltable: true },
  { id: 'item-210', type: 'knife', rarity: 'epic', category: 'weapon', name: 'Bullwhip', img: ropeImg, stats: { damage: 20, speed: 5, charisma: 5 }, value: 25, levelRequired: 5 },
  { id: 'item-34', type: 'knife', rarity: 'epic', category: 'weapon', name: 'Damascus Steel Blade', img: knifeImg, stats: { damage: 40, speed: 5 }, value: 425, levelRequired: 9 },

  // Gun Belts & Holsters
  { id: 'item-77', type: 'gunbelt', rarity: 'basic', category: 'weapon', name: 'Plain Leather Belt', img: gunbeltImg, stats: { damage: 2, defense: 1 }, value: 22, levelRequired: 1 },
  { id: 'item-211', type: 'gunbelt', rarity: 'advanced', category: 'weapon', name: 'Gun Belt & Holster', img: gunbeltImg, stats: { damage: 5, defense: 3 }, value: 35, levelRequired: 3 },
  { id: 'item-19', type: 'gunbelt', rarity: 'rare', category: 'weapon', name: 'Cartridge Belt (loops)', img: gunbeltImg, stats: { damage: 8, defense: 5 }, value: 40, levelRequired: 4 },
  { id: 'item-212', type: 'gunbelt', rarity: 'rare', category: 'weapon', name: 'Rifle Scabbard', img: gunbeltImg, stats: { damage: 5, speed: 3, defense: 2 }, value: 15, levelRequired: 4 },
  { id: 'item-45', type: 'gunbelt', rarity: 'epic', category: 'weapon', name: 'Desperado Belt', img: gunbeltImg, stats: { damage: 12, defense: 8, speed: 3 }, value: 374, levelRequired: 7 },
  { id: 'item-213', type: 'gunbelt', rarity: 'advanced', category: 'weapon', name: 'Ammo Bandolier', img: gunbeltImg, stats: { damage: 5, defense: 2 }, value: 18, levelRequired: 3 },
  { id: 'item-46', type: 'gunbelt', rarity: 'legendary', category: 'weapon', name: "Warlord's Bandolier", img: gunbeltImg, stats: { damage: 20, defense: 12, speed: 5 }, value: 1020, levelRequired: 13 },

  // Ammo (consumable/stackable)
  { id: 'item-80', type: 'special', rarity: 'basic', category: 'ammo', name: 'Revolver Cartridges (50)', img: sidearmImg, stats: { damage: 2 }, value: 8, levelRequired: 1, consumable: true, stackable: true, beltable: true },
  { id: 'item-81', type: 'special', rarity: 'basic', category: 'ammo', name: 'Rifle Rounds (50)', img: longarmImg, stats: { damage: 3 }, value: 10, levelRequired: 1, consumable: true, stackable: true, beltable: true },
  { id: 'item-82', type: 'special', rarity: 'basic', category: 'ammo', name: 'Shotgun Shells (25)', img: shotgunImg, stats: { damage: 4 }, value: 8, levelRequired: 1, consumable: true, stackable: true, beltable: true },
  { id: 'item-83', type: 'special', rarity: 'advanced', category: 'ammo', name: 'Silver Bullets (6)', img: sidearmImg, stats: { damage: 8, luck: 3 }, value: 26, levelRequired: 4, consumable: true, stackable: true, beltable: true },
  { id: 'item-84', type: 'special', rarity: 'rare', category: 'ammo', name: 'Explosive Rounds (4)', img: dynamiteImg, stats: { damage: 15 }, value: 68, levelRequired: 7, consumable: true, stackable: true },
  { id: 'item-214', type: 'special', rarity: 'basic', category: 'ammo', name: 'Gun Cleaning Kit', img: sidearmImg, stats: { damage: 3 }, value: 10, levelRequired: 1, pocketable: true },

  // =================== FOOD & DRINK ===================
  { id: 'item-90', type: 'special', rarity: 'basic', category: 'food', name: 'Beef Jerky', img: tobaccoImg, stats: { energy: 15, health: 5, hunger: 20 }, value: 2, levelRequired: 1, consumable: true, stackable: true, pocketable: true },
  { id: 'item-91', type: 'special', rarity: 'basic', category: 'food', name: 'Hardtack Biscuits', img: tobaccoImg, stats: { energy: 10, hunger: 15 }, value: 1, levelRequired: 1, consumable: true, stackable: true, pocketable: true },
  { id: 'item-92', type: 'special', rarity: 'basic', category: 'food', name: 'Dry Beans (1 lb)', img: tobaccoImg, stats: { energy: 20, health: 5, hunger: 25 }, value: 2, levelRequired: 1, consumable: true, stackable: true },
  { id: 'item-93', type: 'special', rarity: 'basic', category: 'food', name: 'Bacon / Salt Pork', img: tobaccoImg, stats: { energy: 25, health: 10, hunger: 30 }, value: 4, levelRequired: 1, consumable: true, stackable: true },
  { id: 'item-94', type: 'special', rarity: 'basic', category: 'food', name: 'Coffee (ground)', img: canteenImg, stats: { energy: 30, sleep: -15, morale: 10 }, value: 3, levelRequired: 1, consumable: true, stackable: true },
  { id: 'item-95', type: 'special', rarity: 'basic', category: 'food', name: 'Dried Fruit', img: tobaccoImg, stats: { energy: 12, health: 8, hunger: 15 }, value: 3, levelRequired: 1, consumable: true, stackable: true, pocketable: true },
  { id: 'item-96', type: 'special', rarity: 'advanced', category: 'food', name: 'Pemmican', img: tobaccoImg, stats: { energy: 35, health: 15, hunger: 40 }, value: 8, levelRequired: 2, consumable: true, stackable: true },
  { id: 'item-97', type: 'special', rarity: 'basic', category: 'food', name: 'Canned Peaches', img: canteenImg, stats: { energy: 18, health: 10, thirst: 5, hunger: 20 }, value: 4, levelRequired: 1, consumable: true, stackable: true },
  { id: 'item-98', type: 'special', rarity: 'basic', category: 'food', name: 'Flour & Cornmeal', img: tobaccoImg, stats: { energy: 15, hunger: 20 }, value: 3, levelRequired: 1, consumable: true, stackable: true },
  { id: 'item-99', type: 'special', rarity: 'advanced', category: 'food', name: 'Saloon Steak Dinner', img: tobaccoImg, stats: { energy: 50, health: 25, charisma: 3, hunger: 60, morale: 15 }, value: 14, levelRequired: 1, consumable: true },

  // Drinks
  { id: 'item-26', type: 'special', rarity: 'advanced', category: 'drink', name: 'Whiskey Bottle', img: whiskeyImg, stats: { health: -10, energy: 25, damage: 5, charisma: 8, morale: 20 }, value: 6, levelRequired: 1, consumable: true, stackable: true },
  { id: 'item-100', type: 'special', rarity: 'basic', category: 'drink', name: 'Beer (warm)', img: whiskeyImg, stats: { energy: 10, thirst: 15, charisma: 2, morale: 10 }, value: 2, levelRequired: 1, consumable: true, stackable: true },
  { id: 'item-101', type: 'special', rarity: 'basic', category: 'drink', name: 'Strong Black Coffee', img: canteenImg, stats: { energy: 30, sleep: -20, speed: 2, morale: 5 }, value: 1, levelRequired: 1, consumable: true, stackable: true },
  { id: 'item-102', type: 'special', rarity: 'advanced', category: 'drink', name: 'Sarsaparilla', img: canteenImg, stats: { thirst: 30, energy: 10, health: 5, morale: 8 }, value: 4, levelRequired: 1, consumable: true, stackable: true },
  { id: 'item-103', type: 'special', rarity: 'rare', category: 'drink', name: 'Fine Brandy', img: whiskeyImg, stats: { energy: 35, charisma: 12, health: -5, morale: 25 }, value: 34, levelRequired: 4, consumable: true },
  { id: 'item-104', type: 'special', rarity: 'basic', category: 'drink', name: 'Moonshine', img: whiskeyImg, stats: { damage: 8, charisma: 5, health: -15, energy: 20, morale: 15 }, value: 3, levelRequired: 1, consumable: true, stackable: true },

  // =================== EDC & SURVIVAL GEAR ===================
  { id: 'item-23', type: 'rope', rarity: 'advanced', category: 'edc', name: 'Lasso (40ft)', img: ropeImg, stats: { speed: 5, luck: 5 }, value: 26, levelRequired: 2 },
  { id: 'item-47', type: 'rope', rarity: 'rare', category: 'edc', name: 'Reinforced Lasso', img: ropeImg, stats: { speed: 8, luck: 8 }, value: 102, levelRequired: 5 },
  { id: 'item-9', type: 'canteen', rarity: 'basic', category: 'edc', name: 'Tin Canteen', img: canteenImg, stats: { thirst: 40 }, value: 4, levelRequired: 1, beltable: true },
  { id: 'item-48', type: 'canteen', rarity: 'rare', category: 'edc', name: 'Silver Canteen', img: canteenImg, stats: { thirst: 60, energy: 10 }, value: 85, levelRequired: 4, beltable: true },
  { id: 'item-49', type: 'canteen', rarity: 'epic', category: 'edc', name: 'Enchanted Flask', img: canteenImg, stats: { thirst: 80, health: 20, energy: 15 }, value: 340, levelRequired: 9, beltable: true },
  { id: 'item-24', type: 'tobacco', rarity: 'basic', category: 'edc', name: 'Pipe & Tobacco', img: tobaccoImg, stats: { energy: 15, sleep: -10, charisma: 3, morale: 10 }, value: 3, levelRequired: 1, pocketable: true },
  { id: 'item-50', type: 'tobacco', rarity: 'rare', category: 'edc', name: 'Fine Cigars', img: tobaccoImg, stats: { energy: 25, charisma: 10, sleep: -5, morale: 15 }, value: 9, levelRequired: 4, pocketable: true },

  { id: 'item-110', type: 'special', rarity: 'basic', category: 'edc', name: 'Bedroll & Tarp', img: saddleImg, stats: { sleep: 30, energy: 10 }, value: 8, levelRequired: 1 },
  { id: 'item-111', type: 'special', rarity: 'basic', category: 'edc', name: 'Match Safe & Flint', img: pocketwatchImg, stats: { luck: 2 }, value: 2, levelRequired: 1, pocketable: true },
  { id: 'item-112', type: 'special', rarity: 'basic', category: 'edc', name: 'Sewing Kit', img: pocketwatchImg, stats: {}, value: 2, levelRequired: 1, pocketable: true },
  { id: 'item-113', type: 'special', rarity: 'basic', category: 'edc', name: 'Whetstone', img: knifeImg, stats: { damage: 2 }, value: 2, levelRequired: 1, pocketable: true },
  { id: 'item-114', type: 'special', rarity: 'basic', category: 'edc', name: 'Soap, Comb & Towel', img: pocketwatchImg, stats: { charisma: 2, hygiene: 15 }, value: 2, levelRequired: 1, pocketable: true },
  { id: 'item-115', type: 'special', rarity: 'basic', category: 'edc', name: 'Tin Cup & Frying Pan', img: canteenImg, stats: { energy: 5 }, value: 4, levelRequired: 1 },
  { id: 'item-116', type: 'special', rarity: 'basic', category: 'edc', name: 'Piggin Strings (6)', img: ropeImg, stats: {}, value: 2, levelRequired: 1, beltable: true },
  { id: 'item-117', type: 'special', rarity: 'advanced', category: 'edc', name: 'Lantern', img: pocketwatchImg, stats: { luck: 3, speed: 2 }, value: 14, levelRequired: 2 },
  { id: 'item-118', type: 'special', rarity: 'advanced', category: 'edc', name: 'Compass', img: pocketwatchImg, stats: { luck: 5, speed: 3 }, value: 22, levelRequired: 2, pocketable: true },
  { id: 'item-119', type: 'special', rarity: 'basic', category: 'edc', name: 'Long Johns / Union Suit', img: shirtImg, stats: { defense: 1, energy: 3 }, value: 4, levelRequired: 1 },
  { id: 'item-120', type: 'special', rarity: 'basic', category: 'edc', name: 'Suspenders', img: pantsImg, stats: { defense: 1 }, value: 2, levelRequired: 1 },
  { id: 'item-121', type: 'special', rarity: 'advanced', category: 'edc', name: 'Gun Cleaning Kit', img: sidearmImg, stats: { damage: 3 }, value: 10, levelRequired: 2, pocketable: true },

  // =================== MEDICINE ===================
  { id: 'item-130', type: 'special', rarity: 'basic', category: 'medicine', name: 'Bandages & Liniment', img: canteenImg, stats: { health: 20 }, value: 4, levelRequired: 1, consumable: true, stackable: true, pocketable: true },
  { id: 'item-131', type: 'special', rarity: 'advanced', category: 'medicine', name: 'Herbal Remedy Kit', img: canteenImg, stats: { health: 35, energy: 10 }, value: 14, levelRequired: 2, consumable: true, stackable: true },
  { id: 'item-132', type: 'special', rarity: 'rare', category: 'medicine', name: 'Doctor\'s Medicine', img: canteenImg, stats: { health: 60, energy: 20 }, value: 51, levelRequired: 4, consumable: true },
  { id: 'item-133', type: 'special', rarity: 'epic', category: 'medicine', name: 'Snake Oil Elixir', img: whiskeyImg, stats: { health: 40, energy: 30, luck: 10, morale: 20 }, value: 136, levelRequired: 6, consumable: true },
  { id: 'item-134', type: 'special', rarity: 'advanced', category: 'medicine', name: 'Laudanum Tincture', img: whiskeyImg, stats: { health: 30, sleep: 25, speed: -5 }, value: 10, levelRequired: 2, consumable: true, stackable: true, pocketable: true },

  // =================== LUXURY & VALUABLES ===================
  { id: 'item-0', type: 'special', rarity: 'rare', category: 'valuable', name: 'Gold Coin', img: coinImg, stats: {}, value: 34, levelRequired: 1, pocketable: true },
  { id: 'item-1', type: 'special', rarity: 'advanced', category: 'valuable', name: 'Silver Dollar', img: coinImg, stats: {}, value: 9, levelRequired: 1, pocketable: true },
  { id: 'item-2', type: 'special', rarity: 'basic', category: 'valuable', name: 'Copper Cent', img: coinImg, stats: {}, value: 2, levelRequired: 1, pocketable: true },
  { id: 'item-20', type: 'special', rarity: 'legendary', category: 'valuable', name: 'Gold Pocket Watch', img: pocketwatchImg, stats: { speed: 5, luck: 10 }, value: 128, levelRequired: 8, pocketable: true },
  { id: 'item-51', type: 'special', rarity: 'epic', category: 'valuable', name: 'Ruby Ring', img: pocketwatchImg, stats: { luck: 15, charisma: 10 }, value: 255, levelRequired: 8, pocketable: true },
  { id: 'item-52', type: 'special', rarity: 'legendary', category: 'valuable', name: 'Crown Jewel', img: pocketwatchImg, stats: { luck: 25, charisma: 20 }, value: 850, levelRequired: 14, pocketable: true },

  { id: 'item-140', type: 'special', rarity: 'advanced', category: 'luxury', name: 'Harmonica', img: pocketwatchImg, stats: { charisma: 5, energy: 5, morale: 15 }, value: 8, levelRequired: 1, pocketable: true },
  { id: 'item-141', type: 'special', rarity: 'advanced', category: 'luxury', name: 'Playing Cards', img: pocketwatchImg, stats: { luck: 3, charisma: 3 }, value: 4, levelRequired: 1, pocketable: true },
  { id: 'item-142', type: 'special', rarity: 'basic', category: 'luxury', name: 'Dice Set', img: pocketwatchImg, stats: { luck: 2 }, value: 2, levelRequired: 1, pocketable: true },
  { id: 'item-143', type: 'special', rarity: 'rare', category: 'luxury', name: 'Silver Conchos (set)', img: coinImg, stats: { charisma: 8 }, value: 68, levelRequired: 4, beltable: true },
  { id: 'item-144', type: 'special', rarity: 'epic', category: 'luxury', name: 'Fancy Silver Spurs', img: bootsImg, stats: { charisma: 12, speed: 3 }, value: 170, levelRequired: 6 },
  { id: 'item-145', type: 'special', rarity: 'basic', category: 'luxury', name: 'Small Bible', img: pocketwatchImg, stats: { luck: 2, charisma: 1, morale: 10 }, value: 2, levelRequired: 1, pocketable: true },
  { id: 'item-146', type: 'special', rarity: 'advanced', category: 'luxury', name: 'Ammo Bandolier', img: gunbeltImg, stats: { damage: 5, defense: 2 }, value: 22, levelRequired: 3, beltable: true },

  // Saddle & Specials
  { id: 'item-6', type: 'special', rarity: 'rare', category: 'edc', name: 'Western Saddle', img: saddleImg, stats: { speed: 10 }, value: 119, levelRequired: 3 },
  { id: 'item-25', type: 'special', rarity: 'epic', category: 'weapon', name: 'Dynamite', img: dynamiteImg, stats: { damage: 35 }, value: 255, levelRequired: 6, consumable: true, beltable: true },

  // Shovel (main hand tool for digging)
  { id: 'item-300', type: 'shovel', rarity: 'basic', category: 'edc', name: 'Rusty Shovel', img: shovelImg, stats: { damage: 3, luck: 2 }, value: 8, levelRequired: 1 },
  { id: 'item-301', type: 'shovel', rarity: 'advanced', category: 'edc', name: 'Iron Shovel', img: shovelImg, stats: { damage: 5, luck: 5 }, value: 26, levelRequired: 3 },
  { id: 'item-302', type: 'shovel', rarity: 'rare', category: 'edc', name: 'Prospector\'s Spade', img: shovelImg, stats: { damage: 8, luck: 10 }, value: 85, levelRequired: 6 },
  { id: 'item-303', type: 'shovel', rarity: 'epic', category: 'edc', name: 'Gold Digger\'s Pick-Shovel', img: shovelImg, stats: { damage: 12, luck: 15 }, value: 255, levelRequired: 10 },
];
