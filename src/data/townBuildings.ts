export type BuildingCategory = 'law' | 'shop' | 'saloon' | 'lodging' | 'service';

export interface TownBuilding {
  id: string;
  name: string;
  category: BuildingCategory;
  description: string;
  hooks: string[];
  linkedCharacters?: string[]; // archetype IDs
}

export const townBuildings: TownBuilding[] = [
  // Law & Order
  { id: 'sheriff-office', name: "Sheriff's Office", category: 'law', description: 'Small wooden building with desk, wanted posters, rifle rack, and potbelly stove.', hooks: ['Post bounties', 'Report crimes', 'Collect rewards'], linkedCharacters: ['jace'] },
  { id: 'jail', name: 'Jail / Calaboose', category: 'law', description: 'Stone or heavy timber cells with iron bars, sometimes a basement lockup or outdoor gallows.', hooks: ['Breakouts', 'Prisoner interrogations', 'Overnight stays after bar fights'] },
  { id: 'marshal-office', name: "U.S. Marshal's Office", category: 'law', description: 'More official than the local sheriff; handles federal crimes and inter-territory fugitives.', hooks: ['Federal bounties', 'Territory-wide warrants'] },

  // Shops & Mercantile
  { id: 'general-store', name: 'General Store', category: 'shop', description: 'The heart of town. Sells food, tools, clothing, ammo, horse tack, patent medicines, fabric, candy.', hooks: ['Buy Basic/Enhanced supplies', 'Gossip from owner', 'Stock refreshes with tier system'] },
  { id: 'livery-stable', name: 'Livery Stable & Corral', category: 'shop', description: 'Barns for boarding horses, feed sales, basic grooming.', hooks: ['Buy/sell horses', 'Stable your mount', 'Hire guides'], linkedCharacters: ['lira'] },
  { id: 'blacksmith', name: 'Blacksmith / Farrier', category: 'shop', description: 'Forge, anvil, horseshoes, tool repairs, occasional gun or wagon fixes.', hooks: ['Repair tack', 'Shoe horses', 'Custom upgrades to Rare tack'], linkedCharacters: ['finn'] },
  { id: 'gunsmith', name: 'Gun Shop', category: 'shop', description: 'Sells revolvers, rifles, ammo. Repairs and custom engraving.', hooks: ['Buy weapons', 'Custom engraving', 'Ammo restocking'], linkedCharacters: ['rafe', 'jace'] },
  { id: 'feed-grain', name: 'Feed & Grain Store', category: 'shop', description: 'Sells hay, oats, salt blocks for livestock.', hooks: ['Reduce horse upkeep costs'] },
  { id: 'assay-office', name: 'Assay Office', category: 'shop', description: 'Tests ore samples for gold/silver content.', hooks: ['Sell mined claims', 'Investigate claim-jumping'], linkedCharacters: ['elara'] },
  { id: 'dry-goods', name: 'Dry Goods Store', category: 'shop', description: 'Specializes in clothing, fabric, household items.', hooks: ['Buy clothing upgrades'] },
  { id: 'land-office', name: 'Land Office', category: 'shop', description: 'Sells or registers homestead and farm claims.', hooks: ['Buy homes and farms'], linkedCharacters: ['elara'] },

  // Saloons & Entertainment
  { id: 'cowboy-saloon', name: 'Cowboy Saloon', category: 'saloon', description: 'Basic bar with whiskey, beer, spittoons, simple gambling. Long narrow building with swinging doors.', hooks: ['Gather intel', 'Play cards', 'Start brawls'], linkedCharacters: ['mira'] },
  { id: 'gambling-hall', name: 'Gambling Hall', category: 'saloon', description: 'Fancy faro tables, poker, roulette. Upstairs rooms for private games.', hooks: ['High-stakes scenarios', 'Win/lose big'], linkedCharacters: ['rafe'] },
  { id: 'dance-hall', name: 'Dance Hall Saloon', category: 'saloon', description: 'Music, dancing, sometimes a small stage.', hooks: ['Social encounters', 'Information from staff'], linkedCharacters: ['mira'] },
  { id: 'restaurant-saloon', name: 'Chop House', category: 'saloon', description: 'Serves meals (steak, beans, coffee) alongside drinks.', hooks: ['Recover health', 'Meet travelers', 'Overhear plots'] },

  // Hotels & Lodging
  { id: 'frontier-hotel', name: 'Frontier Hotel', category: 'lodging', description: '2-story building with rooms upstairs, sometimes a dining room. Basic to mid-range.', hooks: ['Rent rooms for rest', 'Store gear safely', 'Hide from trouble'] },
  { id: 'grand-hotel', name: 'Grand Hotel', category: 'lodging', description: 'Fancier with veranda, chandeliers, restaurant.', hooks: ['Meet wealthy NPCs', 'Host important meetings'] },
  { id: 'rooming-house', name: 'Rooming House', category: 'lodging', description: 'Cheaper, shared rooms for cowboys and workers.', hooks: ['Cheap overnight stay'] },

  // Essential Services
  { id: 'bank', name: 'Bank', category: 'service', description: 'Stone or brick building with safe. Holds deposits and loans.', hooks: ['Store cash', 'Bank robberies', 'Loans for farms/horses'] },
  { id: 'undertaker', name: 'Undertaker', category: 'service', description: 'Coffins, embalming, cemetery plots.', hooks: ['Body identification', 'Ghost town ties'] },
  { id: 'barber', name: 'Barber Shop / Bath House', category: 'service', description: 'Haircuts, shaves, hot baths.', hooks: ['Restore reputation', 'Overhear rumors'] },
  { id: 'doctor', name: "Doctor's Office", category: 'service', description: 'Basic medicine, surgery, herbal remedies.', hooks: ['Healing after fights', 'Buy medicine'], linkedCharacters: ['selene'] },
  { id: 'telegraph', name: 'Telegraph Office', category: 'service', description: 'Sends and receives messages.', hooks: ['Urgent news', 'Bounty updates', 'Plot hooks'] },
  { id: 'church', name: 'Church', category: 'service', description: 'Simple wooden building for services and town meetings.', hooks: ['Town meetings', 'Sanctuary'] },
  { id: 'stagecoach', name: 'Stagecoach Office', category: 'service', description: 'Tickets, cargo shipping, relay point.', hooks: ['Fast travel between towns', 'Escort missions'] },
  { id: 'railroad', name: 'Railroad Depot', category: 'service', description: 'Trains, passengers, cargo.', hooks: ['Travel to distant maps', 'Train robbery scenarios'] },
  { id: 'brothel', name: 'Parlor House', category: 'service', description: 'Companionship and information.', hooks: ['Information gathering', 'Social intrigue'] },
  { id: 'schoolhouse', name: 'Schoolhouse', category: 'service', description: 'One-room building for children.', hooks: ['Community events', 'Teacher rescue scenarios'] },
];

export function generateTownBuildings(townSize: 'small' | 'medium' | 'large'): TownBuilding[] {
  const counts = { small: 8, medium: 12, large: 18 };
  const count = counts[townSize];
  const essentials = townBuildings.filter(b => ['general-store', 'livery-stable', 'cowboy-saloon', 'sheriff-office'].includes(b.id));
  const rest = townBuildings.filter(b => !essentials.find(e => e.id === b.id));
  const shuffled = [...rest].sort(() => Math.random() - 0.5);
  return [...essentials, ...shuffled.slice(0, count - essentials.length)];
}
