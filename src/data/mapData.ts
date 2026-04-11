export interface MapRegion {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  x: number; // percentage position on map
  y: number;
  missions: Mission[];
  dangerLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  terrain: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  type: 'Combat' | 'Escort' | 'Delivery' | 'Investigation' | 'Bounty';
  xpReward: number;
  coinReward: number;
  levelRequired: number;
  completed: boolean;
}

export const mapRegions: MapRegion[] = [
  {
    id: 'dusty-gulch', name: 'Dusty Gulch', description: 'A quiet frontier town where every outlaw starts their journey.',
    levelRequired: 1, x: 50, y: 82, dangerLevel: 'Low', terrain: 'Town',
    missions: [
      { id: 'm1', name: 'Bar Brawl', description: 'Break up a fight at the saloon.', type: 'Combat', xpReward: 50, coinReward: 10, levelRequired: 1, completed: false },
      { id: 'm2', name: 'Missing Horse', description: 'Track down the sheriff\'s stolen stallion.', type: 'Investigation', xpReward: 75, coinReward: 15, levelRequired: 1, completed: false },
      { id: 'm3', name: 'Mail Run', description: 'Deliver a letter to the next town.', type: 'Delivery', xpReward: 40, coinReward: 8, levelRequired: 1, completed: false },
    ],
  },
  {
    id: 'coyote-flats', name: 'Coyote Flats', description: 'Dusty plains crawling with bandits and coyotes.',
    levelRequired: 2, x: 30, y: 72, dangerLevel: 'Low', terrain: 'Plains',
    missions: [
      { id: 'm4', name: 'Coyote Hunt', description: 'Clear out coyotes threatening the ranch.', type: 'Combat', xpReward: 80, coinReward: 20, levelRequired: 2, completed: false },
      { id: 'm5', name: 'Escort the Wagon', description: 'Guide a supply wagon safely through the flats.', type: 'Escort', xpReward: 100, coinReward: 25, levelRequired: 2, completed: false },
      { id: 'm6', name: 'Rustler\'s Trail', description: 'Investigate cattle rustlers operating nearby.', type: 'Investigation', xpReward: 90, coinReward: 18, levelRequired: 3, completed: false },
    ],
  },
  {
    id: 'red-mesa-canyon', name: 'Red Mesa Canyon', description: 'A towering red rock canyon with ambush points.',
    levelRequired: 3, x: 68, y: 65, dangerLevel: 'Medium', terrain: 'Canyon',
    missions: [
      { id: 'm7', name: 'Canyon Ambush', description: 'Survive an ambush in the narrow pass.', type: 'Combat', xpReward: 120, coinReward: 30, levelRequired: 3, completed: false },
      { id: 'm8', name: 'Dynamite Delivery', description: 'Bring explosives to the mining camp.', type: 'Delivery', xpReward: 100, coinReward: 35, levelRequired: 3, completed: false },
      { id: 'm9', name: 'Bounty: Red Mesa Marauder', description: 'Capture the outlaw hiding in the canyon.', type: 'Bounty', xpReward: 150, coinReward: 50, levelRequired: 4, completed: false },
    ],
  },
  {
    id: 'silver-creek-mine', name: 'Silver Creek Mine', description: 'An abandoned silver mine rumored to be haunted.',
    levelRequired: 4, x: 22, y: 55, dangerLevel: 'Medium', terrain: 'Mine',
    missions: [
      { id: 'm10', name: 'Into the Dark', description: 'Explore the deepest shaft of the mine.', type: 'Investigation', xpReward: 140, coinReward: 40, levelRequired: 4, completed: false },
      { id: 'm11', name: 'Cave-In Rescue', description: 'Save trapped miners from a collapsed tunnel.', type: 'Escort', xpReward: 160, coinReward: 45, levelRequired: 4, completed: false },
      { id: 'm12', name: 'Silver Vein', description: 'Mine and transport a silver vein shipment.', type: 'Delivery', xpReward: 130, coinReward: 60, levelRequired: 5, completed: false },
    ],
  },
  {
    id: 'rattlesnake-pass', name: 'Rattlesnake Pass', description: 'A treacherous mountain pass known for deadly serpents.',
    levelRequired: 5, x: 75, y: 50, dangerLevel: 'Medium', terrain: 'Mountain Pass',
    missions: [
      { id: 'm13', name: 'Serpent\'s Nest', description: 'Clear rattlesnakes from the mountain trail.', type: 'Combat', xpReward: 180, coinReward: 50, levelRequired: 5, completed: false },
      { id: 'm14', name: 'Stagecoach Guard', description: 'Protect a stagecoach through the pass.', type: 'Escort', xpReward: 200, coinReward: 60, levelRequired: 5, completed: false },
      { id: 'm15', name: 'Bounty: Snake-Eye Sam', description: 'Hunt a sharpshooter terrorizing travelers.', type: 'Bounty', xpReward: 250, coinReward: 80, levelRequired: 6, completed: false },
    ],
  },
  {
    id: 'deadwood-saloon', name: 'Deadwood Saloon', description: 'The wildest saloon in the West — gambling, duels, and danger.',
    levelRequired: 6, x: 45, y: 45, dangerLevel: 'Medium', terrain: 'Town',
    missions: [
      { id: 'm16', name: 'Poker Showdown', description: 'Win a high-stakes poker game against cheaters.', type: 'Investigation', xpReward: 200, coinReward: 100, levelRequired: 6, completed: false },
      { id: 'm17', name: 'Duel at Dawn', description: 'Face a notorious gunslinger at high noon.', type: 'Combat', xpReward: 250, coinReward: 70, levelRequired: 6, completed: false },
      { id: 'm18', name: 'Whiskey Shipment', description: 'Deliver a wagon of whiskey barrels.', type: 'Delivery', xpReward: 180, coinReward: 55, levelRequired: 7, completed: false },
    ],
  },
  {
    id: 'fort-horizon', name: 'Fort Horizon', description: 'A military outpost on the edge of hostile territory.',
    levelRequired: 7, x: 15, y: 38, dangerLevel: 'High', terrain: 'Fort',
    missions: [
      { id: 'm19', name: 'Fort Defense', description: 'Help defend the fort from a bandit siege.', type: 'Combat', xpReward: 300, coinReward: 90, levelRequired: 7, completed: false },
      { id: 'm20', name: 'Arms Deal', description: 'Deliver weapons to the fort commander.', type: 'Delivery', xpReward: 250, coinReward: 80, levelRequired: 7, completed: false },
      { id: 'm21', name: 'Bounty: Iron Jack', description: 'Hunt a deserter hiding in the wilderness.', type: 'Bounty', xpReward: 350, coinReward: 120, levelRequired: 8, completed: false },
    ],
  },
  {
    id: 'ghost-valley', name: 'Ghost Valley', description: 'A fog-shrouded valley where settlers vanished without a trace.',
    levelRequired: 8, x: 60, y: 35, dangerLevel: 'High', terrain: 'Valley',
    missions: [
      { id: 'm22', name: 'The Vanished', description: 'Investigate the disappearance of settlers.', type: 'Investigation', xpReward: 350, coinReward: 100, levelRequired: 8, completed: false },
      { id: 'm23', name: 'Spirit Guide', description: 'Escort a medicine woman through the valley.', type: 'Escort', xpReward: 320, coinReward: 90, levelRequired: 8, completed: false },
      { id: 'm24', name: 'Ghost Riders', description: 'Fight phantom horsemen haunting travelers.', type: 'Combat', xpReward: 400, coinReward: 110, levelRequired: 9, completed: false },
    ],
  },
  {
    id: 'tombstone-ridge', name: 'Tombstone Ridge', description: 'A lawless mining town ruled by a corrupt sheriff.',
    levelRequired: 9, x: 82, y: 30, dangerLevel: 'High', terrain: 'Town',
    missions: [
      { id: 'm25', name: 'Corrupt Law', description: 'Expose the sheriff\'s criminal dealings.', type: 'Investigation', xpReward: 400, coinReward: 120, levelRequired: 9, completed: false },
      { id: 'm26', name: 'Jailbreak', description: 'Free wrongfully imprisoned townsfolk.', type: 'Combat', xpReward: 450, coinReward: 130, levelRequired: 9, completed: false },
      { id: 'm27', name: 'Bounty: Sheriff Blackwood', description: 'Bring the corrupt sheriff to justice.', type: 'Bounty', xpReward: 500, coinReward: 200, levelRequired: 10, completed: false },
    ],
  },
  {
    id: 'eagle-peak', name: 'Eagle Peak', description: 'The highest mountain in the territory, home to outlaws.',
    levelRequired: 10, x: 35, y: 22, dangerLevel: 'High', terrain: 'Mountain',
    missions: [
      { id: 'm28', name: 'Summit Assault', description: 'Storm the outlaw hideout at the peak.', type: 'Combat', xpReward: 500, coinReward: 150, levelRequired: 10, completed: false },
      { id: 'm29', name: 'Eagle\'s Nest', description: 'Retrieve a stolen artifact from the summit.', type: 'Investigation', xpReward: 450, coinReward: 140, levelRequired: 10, completed: false },
      { id: 'm30', name: 'Mountain Escort', description: 'Guide a gold shipment down the treacherous path.', type: 'Escort', xpReward: 550, coinReward: 180, levelRequired: 11, completed: false },
    ],
  },
  {
    id: 'scorpion-desert', name: 'Scorpion Desert', description: 'A merciless desert where only the toughest survive.',
    levelRequired: 11, x: 20, y: 15, dangerLevel: 'Extreme', terrain: 'Desert',
    missions: [
      { id: 'm31', name: 'Desert Crossing', description: 'Survive crossing the deadliest stretch of sand.', type: 'Combat', xpReward: 600, coinReward: 170, levelRequired: 11, completed: false },
      { id: 'm32', name: 'Oasis Rescue', description: 'Save a stranded caravan at the desert oasis.', type: 'Escort', xpReward: 550, coinReward: 160, levelRequired: 11, completed: false },
      { id: 'm33', name: 'Scorpion King', description: 'Hunt the legendary giant scorpion.', type: 'Bounty', xpReward: 700, coinReward: 250, levelRequired: 12, completed: false },
    ],
  },
  {
    id: 'devils-crossing', name: "Devil's Crossing", description: 'A cursed bridge over a bottomless gorge.',
    levelRequired: 12, x: 55, y: 10, dangerLevel: 'Extreme', terrain: 'Gorge',
    missions: [
      { id: 'm34', name: 'Bridge of No Return', description: 'Cross the bridge while under fire.', type: 'Combat', xpReward: 700, coinReward: 200, levelRequired: 12, completed: false },
      { id: 'm35', name: 'Toll Collector', description: 'Defeat the bandits demanding passage fees.', type: 'Combat', xpReward: 750, coinReward: 220, levelRequired: 12, completed: false },
      { id: 'm36', name: 'Bounty: El Diablo', description: 'Face the most wanted outlaw in the territory.', type: 'Bounty', xpReward: 1000, coinReward: 500, levelRequired: 13, completed: false },
    ],
  },
  {
    id: 'gold-rush-basin', name: 'Gold Rush Basin', description: 'The legendary gold fields — riches and ruin await.',
    levelRequired: 13, x: 80, y: 8, dangerLevel: 'Extreme', terrain: 'Basin',
    missions: [
      { id: 'm37', name: 'Gold Fever', description: 'Stake your claim in the richest gold field.', type: 'Investigation', xpReward: 800, coinReward: 300, levelRequired: 13, completed: false },
      { id: 'm38', name: 'The Final Heist', description: 'Rob or defend the biggest gold shipment ever.', type: 'Combat', xpReward: 1000, coinReward: 500, levelRequired: 14, completed: false },
      { id: 'm39', name: 'Legend of the Basin', description: 'Uncover the ancient secret buried beneath the gold.', type: 'Investigation', xpReward: 1500, coinReward: 1000, levelRequired: 15, completed: false },
    ],
  },
];

export function getXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getLevelFromXp(totalXp: number): { level: number; currentXp: number; xpToNext: number } {
  let level = 1;
  let remaining = totalXp;
  while (true) {
    const needed = getXpForLevel(level);
    if (remaining < needed) return { level, currentXp: remaining, xpToNext: needed };
    remaining -= needed;
    level++;
  }
}
