import type { Rarity } from './gameData';

export interface Horse {
  id: string;
  name: string;
  breed: string;
  gender: 'male' | 'female';
  rarity: Rarity;
  level: number;
  traits: string[];
  skills: string[];
  value: number;
  stats: {
    speed: number;
    stamina: number;
    courage: number;
    bond: number;
  };
}

export interface HorseTackItem {
  id: string;
  name: string;
  rarity: Rarity;
  category: 'saddle' | 'bridle' | 'saddlebags' | 'blanket' | 'accessory' | 'care';
  value: number;
  description: string;
  statBonus: Partial<{ speed: number; stamina: number; courage: number; bond: number }>;
}

export interface Property {
  id: string;
  name: string;
  type: 'home' | 'farm' | 'ranch' | 'mine';
  description: string;
  cost: number;
  monthlyIncome: number;
  perks: string[];
  levelRequired: number;
}

// ========== HORSES (prices +70% from original) ==========
export const starterHorses: Horse[] = [
  {
    id: 'horse-starter-1', name: 'Lucky', breed: 'Mustang Mix', gender: 'male',
    rarity: 'basic', level: 1, traits: ['Hardy', 'Stubborn', 'Loyal'],
    skills: ['Trail Endurance', 'Sure-Footed', 'Basic Herding'],
    value: 0, stats: { speed: 3, stamina: 4, courage: 3, bond: 2 },
  },
  {
    id: 'horse-starter-2', name: 'Ironhide', breed: 'Morgan', gender: 'male',
    rarity: 'basic', level: 1, traits: ['Reliable', 'Gentle', 'Tough'],
    skills: ['Pulling Wagons', 'Steady Trail Riding', 'Beginner-Safe'],
    value: 0, stats: { speed: 2, stamina: 5, courage: 3, bond: 3 },
  },
];

export const horseDatabase: Horse[] = [
  ...starterHorses,
  // Basic
  { id: 'horse-3', name: 'Dusty', breed: 'Quarter Horse', gender: 'male', rarity: 'basic', level: 1, traits: ['Calm', 'Steady', 'Obedient'], skills: ['Trail Riding', 'Light Herding', 'Standing Calm'], value: 60, stats: { speed: 3, stamina: 4, courage: 2, bond: 3 } },
  { id: 'horse-4', name: 'Daisy', breed: 'Paint', gender: 'female', rarity: 'basic', level: 1, traits: ['Friendly', 'Curious', 'Easygoing'], skills: ['Basic Trail', 'Crowd Calm', 'Gentle Pace'], value: 68, stats: { speed: 3, stamina: 3, courage: 3, bond: 4 } },
  { id: 'horse-5', name: 'Copper', breed: 'Chestnut Mustang', gender: 'male', rarity: 'basic', level: 1, traits: ['Alert', 'Quick', 'Skittish'], skills: ['Fast Sprint', 'Danger Sense', 'Quick Recovery'], value: 85, stats: { speed: 5, stamina: 3, courage: 2, bond: 2 } },

  // Enhanced (+70%)
  { id: 'horse-6', name: 'Painted Lady', breed: 'Appaloosa', gender: 'female', rarity: 'advanced', level: 2, traits: ['Spirited', 'Clever', 'Flashy'], skills: ['Fast Sprint', 'Night Vision', 'Trick Riding'], value: 306, stats: { speed: 6, stamina: 4, courage: 4, bond: 3 } },
  { id: 'horse-7', name: 'Whiskey', breed: 'Quarter Horse', gender: 'female', rarity: 'advanced', level: 3, traits: ['Calm', 'Strong-Willed', 'Protective'], skills: ['Cattle Cutting', 'Roping', 'Heavy Load'], value: 544, stats: { speed: 4, stamina: 7, courage: 5, bond: 4 } },
  { id: 'horse-8', name: 'Thunderhoof', breed: 'Paint', gender: 'male', rarity: 'advanced', level: 3, traits: ['Bold', 'Loud', 'Playful'], skills: ['War Charges', 'Alert Whinny', 'Rodeo Tricks'], value: 493, stats: { speed: 5, stamina: 5, courage: 6, bond: 3 } },
  { id: 'horse-9', name: 'Ghost', breed: 'Mustang', gender: 'male', rarity: 'advanced', level: 2, traits: ['Wild', 'Independent', 'Fast Learner'], skills: ['Stealthy Movement', 'Escaping Danger', 'Foraging'], value: 238, stats: { speed: 7, stamina: 4, courage: 3, bond: 2 } },

  // Rare (+70%)
  { id: 'horse-10', name: 'Desert Rose', breed: 'Arabian', gender: 'female', rarity: 'rare', level: 4, traits: ['Elegant', 'Endurance', 'Proud'], skills: ['Long-Distance Travel', 'Jumping Obstacles', 'Quick Bonding'], value: 1105, stats: { speed: 7, stamina: 8, courage: 4, bond: 5 } },
  { id: 'horse-11', name: 'Storm', breed: 'Grulla', gender: 'female', rarity: 'rare', level: 3, traits: ['Brave', 'Weather-Proof', 'Bonded'], skills: ['Extreme Trail Riding', 'Storm Riding', 'Quick Recovery'], value: 782, stats: { speed: 5, stamina: 7, courage: 7, bond: 6 } },
  { id: 'horse-12', name: 'Shadow', breed: 'Buckskin', gender: 'male', rarity: 'rare', level: 4, traits: ['Stealthy', 'Tireless', 'Watchful'], skills: ['Night Scouting', 'Silent Movement', 'Predator Detection'], value: 1615, stats: { speed: 6, stamina: 8, courage: 6, bond: 5 } },

  // Epic (+70%)
  { id: 'horse-13', name: 'Gold Dust', breed: 'Palomino', gender: 'female', rarity: 'epic', level: 5, traits: ['Beautiful', 'Lucky', 'Attention-Loving'], skills: ['Crowd Pleasing', 'Gold Intuition', 'Long Gallops'], value: 2040, stats: { speed: 7, stamina: 7, courage: 5, bond: 8 } },
  { id: 'horse-14', name: 'Lightning', breed: 'Thoroughbred', gender: 'male', rarity: 'epic', level: 4, traits: ['Competitive', 'High-Strung', 'Graceful'], skills: ['Racing', 'Quick Acceleration', 'Show Jumping'], value: 1326, stats: { speed: 10, stamina: 5, courage: 4, bond: 4 } },
  { id: 'horse-15', name: 'Big John', breed: 'Draft Cross', gender: 'male', rarity: 'epic', level: 3, traits: ['Gentle Giant', 'Patient', 'Powerful'], skills: ['Pulling Plows', 'Carrying Heavy Riders', 'Crowd Calm'], value: 697, stats: { speed: 3, stamina: 10, courage: 6, bond: 7 } },

  // Legendary (+70%)
  { id: 'horse-16', name: 'Patchwork', breed: 'Chimera Pinto', gender: 'male', rarity: 'legendary', level: 5, traits: ['Curious', 'Quirky', 'Explosive Energy'], skills: ['Gadget Carrying', 'Jumping Fences', 'Learning Tricks Fast'], value: 3060, stats: { speed: 8, stamina: 8, courage: 7, bond: 9 } },
  { id: 'horse-17', name: 'Comanche', breed: 'War Horse', gender: 'male', rarity: 'legendary', level: 5, traits: ['Battle-Scarred', 'Fearless', 'Survivor'], skills: ['Never Panics in Gunfire', 'Heals Faster', 'Inspires Allies'], value: 5950, stats: { speed: 7, stamina: 9, courage: 10, bond: 8 } },
  { id: 'horse-18', name: 'Phantom', breed: 'White Mustang', gender: 'male', rarity: 'legendary', level: 5, traits: ['Ghostly', 'Silent', 'Untamed'], skills: ['Perfect Trail Sense', 'Predator Detection', 'Silent Movement'], value: 8500, stats: { speed: 10, stamina: 9, courage: 8, bond: 6 } },
];

// ========== HORSE TACK (prices +70%) ==========
export const tackDatabase: HorseTackItem[] = [
  // Basic
  { id: 'tack-1', name: 'Standard Western Saddle', rarity: 'basic', category: 'saddle', value: 26, description: 'A reliable work saddle.', statBonus: { stamina: 1 } },
  { id: 'tack-2', name: 'Simple Bridle & Bit', rarity: 'basic', category: 'bridle', value: 14, description: 'Basic reins and snaffle bit.', statBonus: { bond: 1 } },
  { id: 'tack-3', name: 'Canvas Saddlebags', rarity: 'basic', category: 'saddlebags', value: 10, description: 'Simple pouches for supplies.', statBonus: {} },
  { id: 'tack-4', name: 'Wool Saddle Blanket', rarity: 'basic', category: 'blanket', value: 7, description: 'Keeps the horse comfortable.', statBonus: { stamina: 1 } },
  { id: 'tack-5', name: 'Halter & Lead Rope', rarity: 'basic', category: 'accessory', value: 5, description: 'For tying your horse.', statBonus: {} },
  { id: 'tack-6', name: 'Hoof Pick & Brush', rarity: 'basic', category: 'care', value: 4, description: 'Basic grooming tools.', statBonus: { bond: 1 } },

  // Enhanced
  { id: 'tack-7', name: 'Padded Trail Saddle', rarity: 'advanced', category: 'saddle', value: 94, description: 'Better cinch and padding for long rides.', statBonus: { stamina: 2, speed: 1 } },
  { id: 'tack-8', name: 'Quality Curb Bit & Reins', rarity: 'advanced', category: 'bridle', value: 51, description: 'Finer control and comfort.', statBonus: { bond: 2 } },
  { id: 'tack-9', name: 'Large Leather Saddlebags', rarity: 'advanced', category: 'saddlebags', value: 43, description: 'Room for rifle scabbard and supplies.', statBonus: { stamina: 1 } },
  { id: 'tack-10', name: 'Storm-Proof Oilskin Cover', rarity: 'advanced', category: 'blanket', value: 34, description: 'Protects horse and gear from rain.', statBonus: { courage: 1 } },
  { id: 'tack-11', name: 'Horse Medicine Kit', rarity: 'advanced', category: 'care', value: 20, description: 'Liniment and bandages for the horse.', statBonus: { stamina: 1, bond: 1 } },

  // Rare
  { id: 'tack-12', name: 'Hand-Tooled Leather Saddle', rarity: 'rare', category: 'saddle', value: 374, description: 'Beautiful craftsmanship with silver conchos.', statBonus: { stamina: 3, speed: 1, bond: 1 } },
  { id: 'tack-13', name: 'Custom-Fitted Bridle', rarity: 'rare', category: 'bridle', value: 204, description: 'Made to measure for your horse.', statBonus: { bond: 3, speed: 1 } },
  { id: 'tack-14', name: 'Reinforced Saddlebags', rarity: 'rare', category: 'saddlebags', value: 162, description: 'Lariat holder and hidden pockets.', statBonus: { stamina: 2 } },
  { id: 'tack-15', name: 'Navajo Wool Blanket', rarity: 'rare', category: 'blanket', value: 145, description: 'Traditional weave, excellent insulation.', statBonus: { stamina: 2, courage: 1 } },
  { id: 'tack-16', name: 'Farrier Tools & Hoof Boots', rarity: 'rare', category: 'care', value: 111, description: 'Professional horse care kit.', statBonus: { stamina: 2, bond: 2 } },

  // Epic
  { id: 'tack-17', name: 'Silver-Mounted Show Saddle', rarity: 'epic', category: 'saddle', value: 1105, description: 'Ornate saddle with hidden compartments and self-adjusting cinch.', statBonus: { stamina: 4, speed: 2, bond: 2 } },
  { id: 'tack-18', name: 'Platinum Bit & Silk Reins', rarity: 'epic', category: 'bridle', value: 680, description: 'Finest control, feather-light touch.', statBonus: { bond: 4, speed: 2 } },

  // Legendary
  { id: 'tack-19', name: "Comanche's Old Saddle", rarity: 'legendary', category: 'saddle', value: 3060, description: 'Never slips in rain. Extra sturdy. Legendary craftsmanship.', statBonus: { stamina: 5, speed: 3, courage: 3, bond: 2 } },
  { id: 'tack-20', name: 'Vaquero Masterwork Set', rarity: 'legendary', category: 'bridle', value: 2550, description: 'Heirloom tack that makes the horse quieter and more responsive.', statBonus: { bond: 5, speed: 3, courage: 2 } },
];

// ========== PROPERTIES (prices +70%) ==========
export const propertyDatabase: Property[] = [
  { id: 'prop-1', name: 'Sod House', type: 'home', description: 'Cheap prairie home dug into a hillside. Cool in summer, warm in winter.', cost: 136, monthlyIncome: 0, perks: ['Hidden', 'Weather-Proof', 'Free Shelter'], levelRequired: 2 },
  { id: 'prop-2', name: 'Log Cabin', type: 'home', description: 'Classic frontier cabin with fireplace and a small barn attached.', cost: 374, monthlyIncome: 0, perks: ['Durable', 'Fireplace', 'Small Barn'], levelRequired: 3 },
  { id: 'prop-3', name: 'Adobe House', type: 'home', description: 'Southwest-style mud brick home with a courtyard.', cost: 306, monthlyIncome: 0, perks: ['Cool Interior', 'Fire-Resistant', 'Courtyard'], levelRequired: 3 },
  { id: 'prop-4', name: 'Frame House', type: 'home', description: 'Wooden town house with windows and a porch, near shops.', cost: 765, monthlyIncome: 0, perks: ['Windows', 'Porch', 'Near Shops'], levelRequired: 5 },
  { id: 'prop-5', name: 'Ranch House', type: 'home', description: 'Single-story with veranda and bunkhouse for guests.', cost: 1105, monthlyIncome: 0, perks: ['Large Porch', 'Bunkhouse', 'Corral'], levelRequired: 7 },
  { id: 'prop-6', name: 'Homestead Claim', type: 'farm', description: '160-acre plot with a small cabin. Good for crops and livestock.', cost: 510, monthlyIncome: 15, perks: ['160 Acres', 'Small Cabin', 'Garden Plot'], levelRequired: 4 },
  { id: 'prop-7', name: 'Cattle Ranch', type: 'ranch', description: '500+ acres with bunkhouse and corral for serious ranching.', cost: 2040, monthlyIncome: 80, perks: ['500+ Acres', 'Bunkhouse', 'Large Corral'], levelRequired: 8 },
  { id: 'prop-8', name: 'Horse Breeding Farm', type: 'farm', description: 'Pastures and training corral for breeding and selling horses.', cost: 1615, monthlyIncome: 60, perks: ['Pastures', 'Training Corral', 'Foal Sales'], levelRequired: 7 },
  { id: 'prop-9', name: 'Mining Claim & Cabin', type: 'mine', description: 'Small mine with living quarters. Chance of striking silver.', cost: 1275, monthlyIncome: 40, perks: ['Mine Shaft', 'Cabin', 'Silver Chance'], levelRequired: 6 },
  { id: 'prop-10', name: 'River Valley Farm', type: 'farm', description: 'Fertile land with irrigation. The most productive farm type.', cost: 3060, monthlyIncome: 120, perks: ['Irrigation', 'Fertile Soil', 'River Access'], levelRequired: 10 },
];

// ========== SHOP SYSTEM ==========
export type ShopType = 'general' | 'livery' | 'saddle_shop' | 'auction';

export interface ShopConfig {
  id: string;
  name: string;
  type: ShopType;
  description: string;
  tierChances: Record<Rarity, number>;
  stockCount: { min: number; max: number };
  priceMultiplier: number;
  sellBackRate: number;
}

export const shopConfigs: ShopConfig[] = [
  { id: 'shop-general', name: 'Frontier General Store', type: 'general', description: 'Basic supplies and occasional tack. Limited stock.', tierChances: { basic: 70, advanced: 20, rare: 8, epic: 1, legendary: 1 }, stockCount: { min: 4, max: 6 }, priceMultiplier: 1.0, sellBackRate: 0.4 },
  { id: 'shop-livery', name: 'Town Livery Stable', type: 'livery', description: 'Horses, tack, and boarding. Better selection.', tierChances: { basic: 60, advanced: 25, rare: 12, epic: 2, legendary: 1 }, stockCount: { min: 5, max: 8 }, priceMultiplier: 1.0, sellBackRate: 0.5 },
  { id: 'shop-saddle', name: 'Cattle Town Saddle Shop', type: 'saddle_shop', description: 'Premium tack and gear. Connections to bigger suppliers.', tierChances: { basic: 40, advanced: 30, rare: 20, epic: 8, legendary: 2 }, stockCount: { min: 6, max: 10 }, priceMultiplier: 1.1, sellBackRate: 0.55 },
  { id: 'shop-auction', name: 'Traveling Auction', type: 'auction', description: 'Rare event. Higher tier items but inflated prices.', tierChances: { basic: 20, advanced: 30, rare: 30, epic: 15, legendary: 5 }, stockCount: { min: 3, max: 6 }, priceMultiplier: 1.4, sellBackRate: 0.6 },
];

export function rollRarity(chances: Record<Rarity, number>): Rarity {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const [rarity, chance] of Object.entries(chances)) {
    cumulative += chance;
    if (roll < cumulative) return rarity as Rarity;
  }
  return 'basic';
}
