import townMap from '@/assets/maps/town.jpg';
import canyonMap from '@/assets/maps/canyon.jpg';
import goldmineMap from '@/assets/maps/goldmine.jpg';
import ranchMap from '@/assets/maps/ranch.jpg';
import banditMap from '@/assets/maps/bandit-hideout.jpg';

export interface GameMap {
  id: string;
  name: string;
  description: string;
  img: string;
  level: string;
  enemies: string[];
  loot: string[];
}

export const gameMaps: GameMap[] = [
  {
    id: 'map-1',
    name: 'Dusty Gulch Town',
    description: 'The frontier town with a saloon, sheriff office, and general store. A good place to start your journey.',
    img: townMap,
    level: 'Lv. 1-5',
    enemies: ['Drunk Cowboys', 'Pickpockets', 'Bar Brawlers'],
    loot: ['Copper Cents', 'Whiskey', 'Cotton Shirts'],
  },
  {
    id: 'map-2',
    name: 'Rattlesnake Canyon',
    description: 'A treacherous desert canyon with winding trails. Watch out for ambushes at the river crossing.',
    img: canyonMap,
    level: 'Lv. 5-15',
    enemies: ['Rattlesnakes', 'Coyotes', 'Desert Bandits'],
    loot: ['Silver Dollars', 'Bowie Knives', 'Canteens'],
  },
  {
    id: 'map-3',
    name: "Prospector's Gold Mine",
    description: 'An abandoned gold mine rich with treasure but crawling with dangers deep underground.',
    img: goldmineMap,
    level: 'Lv. 10-25',
    enemies: ['Cave Bats', 'Claim Jumpers', 'Dynamite Goblins'],
    loot: ['Gold Coins', 'Dynamite', 'Pocket Watches'],
  },
  {
    id: 'map-4',
    name: 'Big Sky Ranch',
    description: 'Rolling prairies with cattle and a homestead. Rustlers have been spotted in the area.',
    img: ranchMap,
    level: 'Lv. 8-20',
    enemies: ['Cattle Rustlers', 'Wild Stallions', 'Coyote Packs'],
    loot: ['Lasso', 'Saddles', 'Spurred Boots'],
  },
  {
    id: 'map-5',
    name: "Blackjaw's Hideout",
    description: 'The notorious bandit stronghold hidden deep in the badlands. Only the bravest dare enter.',
    img: banditMap,
    level: 'Lv. 20-40',
    enemies: ['Outlaw Sharpshooters', 'Bandit Chief', 'Dynamite Thugs'],
    loot: ['Colt Peacemakers', 'Leather Dusters', 'Gold Pocket Watches'],
  },
];
