export interface MapRegion {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  x: number;
  y: number;
  missions: Mission[];
  dangerLevel: 'Low' | 'Medium' | 'High' | 'Extreme' | 'Deadly';
  terrain: string;
  digSpots?: DigSpot[];
}

export interface DigSpot {
  id: string;
  name: string;
  x: number;
  y: number;
  levelRequired: number;
  lootTable: { itemId: string; chance: number }[];
  discovered?: boolean;
}

export interface MissionRequirement {
  itemId?: string;
  itemName?: string;
  minLevel?: number;
}

export interface MissionEncounter {
  type: 'bandits' | 'outlaws' | 'wildlife' | 'natives' | 'weather' | 'terrain';
  name: string;
  difficulty: number;
  description: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  type: 'Combat' | 'Escort' | 'Delivery' | 'Investigation' | 'Bounty' | 'Survival' | 'Heist';
  morality?: 'good' | 'bad' | 'neutral';
  xpReward: number;
  coinReward: number;
  levelRequired: number;
  completed: boolean;
  durationMinutes: number;
  requirements?: MissionRequirement[];
  encounters?: MissionEncounter[];
  lootHint?: string; // Possible loot description shown to player
}

function genEncounters(level: number, count: number): MissionEncounter[] {
  const pool: MissionEncounter[] = [
    { type: 'bandits', name: 'Highway Bandits', difficulty: level, description: 'Armed outlaws block your path!' },
    { type: 'bandits', name: 'Rustler Gang', difficulty: level, description: 'Cattle thieves ambush you near the trail.' },
    { type: 'outlaws', name: 'Wanted Fugitive', difficulty: level + 1, description: 'A dangerous outlaw crosses your path.' },
    { type: 'outlaws', name: 'Rogue Sheriff', difficulty: level, description: 'A corrupt lawman demands a bribe.' },
    { type: 'wildlife', name: 'Rattlesnake Nest', difficulty: Math.max(1, level - 1), description: 'Venomous snakes hidden in the rocks!' },
    { type: 'wildlife', name: 'Grizzly Bear', difficulty: level + 1, description: 'A massive bear blocks the trail.' },
    { type: 'wildlife', name: 'Wolf Pack', difficulty: level, description: 'Wolves stalking from the treeline.' },
    { type: 'wildlife', name: 'Mountain Lion', difficulty: level, description: 'A cougar pounces from above!' },
    { type: 'natives', name: 'Tribal Warriors', difficulty: level + 1, description: 'Warriors defend their territory.' },
    { type: 'weather', name: 'Dust Storm', difficulty: Math.max(1, level - 2), description: 'Blinding dust reduces visibility.' },
    { type: 'weather', name: 'Flash Flood', difficulty: level, description: 'Rising waters threaten the crossing!' },
    { type: 'weather', name: 'Blizzard', difficulty: level + 1, description: 'Freezing winds and heavy snow.' },
    { type: 'weather', name: 'Scorching Heat', difficulty: Math.max(1, level - 1), description: 'The sun beats down mercilessly.' },
    { type: 'terrain', name: 'Rockslide', difficulty: level, description: 'Loose rocks tumble from above!' },
    { type: 'terrain', name: 'Quicksand', difficulty: level - 1, description: 'The ground gives way beneath you.' },
    { type: 'terrain', name: 'Collapsed Bridge', difficulty: level, description: 'The bridge is out — find another way.' },
  ];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function genDigSpots(regionId: string, level: number, count: number): DigSpot[] {
  const spots: DigSpot[] = [];
  const lootByLevel = level < 10
    ? [{ itemId: 'item-2', chance: 0.5 }, { itemId: 'item-1', chance: 0.3 }, { itemId: 'item-0', chance: 0.1 }]
    : level < 30
    ? [{ itemId: 'item-1', chance: 0.4 }, { itemId: 'item-0', chance: 0.3 }, { itemId: 'item-20', chance: 0.1 }]
    : level < 60
    ? [{ itemId: 'item-0', chance: 0.4 }, { itemId: 'item-20', chance: 0.2 }, { itemId: 'item-51', chance: 0.1 }]
    : [{ itemId: 'item-0', chance: 0.3 }, { itemId: 'item-51', chance: 0.3 }, { itemId: 'item-52', chance: 0.15 }];
  for (let i = 0; i < count; i++) {
    spots.push({
      id: `dig-${regionId}-${i}`,
      name: ['Old Grave', 'Collapsed Mine', 'Under the Oak', 'Dry Creek Bed', 'Rocky Outcrop', 'Abandoned Camp', 'Coyote Den', 'Dusty Mound'][i % 8],
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
      levelRequired: level,
      lootTable: lootByLevel,
    });
  }
  return spots;
}

export const mapRegions: MapRegion[] = [
  // === LEVELS 1-5: THE FRONTIER (20 locations) ===
  {
    id: 'dusty-gulch', name: 'Dusty Gulch', description: 'A quiet frontier town where every outlaw starts their journey.',
    levelRequired: 1, x: 50, y: 90, dangerLevel: 'Low', terrain: 'Town',
    digSpots: genDigSpots('dusty-gulch', 1, 2),
    missions: [
      { id: 'm1', name: 'Bar Brawl', description: 'Break up a fight at the saloon.', type: 'Combat', xpReward: 50, coinReward: 10, levelRequired: 1, completed: false, durationMinutes: 1, encounters: [{ type: 'bandits', name: 'Drunk Cowboys', difficulty: 1, description: 'Rowdy drunks throw punches!' }] },
      { id: 'm2', name: 'Missing Horse', description: 'Track down the sheriff\'s stolen stallion.', type: 'Investigation', xpReward: 75, coinReward: 15, levelRequired: 1, completed: false, durationMinutes: 2, requirements: [{ itemName: 'Rope' }] },
      { id: 'm3', name: 'Mail Run', description: 'Deliver a letter to the next town.', type: 'Delivery', xpReward: 40, coinReward: 8, levelRequired: 1, completed: false, durationMinutes: 1 },
      { id: 'm3b', name: 'Rat Catcher', description: 'Clear vermin from the general store cellar.', type: 'Combat', xpReward: 30, coinReward: 5, levelRequired: 1, completed: false, durationMinutes: 1 },
    ],
  },
  {
    id: 'coyote-flats', name: 'Coyote Flats', description: 'Dusty plains crawling with bandits and coyotes.',
    levelRequired: 2, x: 28, y: 82, dangerLevel: 'Low', terrain: 'Plains',
    digSpots: genDigSpots('coyote-flats', 2, 2),
    missions: [
      { id: 'm4', name: 'Coyote Hunt', description: 'Clear out coyotes threatening the ranch.', type: 'Combat', xpReward: 80, coinReward: 20, levelRequired: 2, completed: false, durationMinutes: 2, encounters: genEncounters(2, 1) },
      { id: 'm5', name: 'Escort the Wagon', description: 'Guide a supply wagon safely through the flats.', type: 'Escort', xpReward: 100, coinReward: 25, levelRequired: 2, completed: false, durationMinutes: 3, requirements: [{ itemName: 'Sidearm' }] },
      { id: 'm6', name: 'Rustler\'s Trail', description: 'Investigate cattle rustlers operating nearby.', type: 'Investigation', xpReward: 90, coinReward: 18, levelRequired: 3, completed: false, durationMinutes: 2, encounters: genEncounters(3, 1) },
    ],
  },
  {
    id: 'red-mesa-canyon', name: 'Red Mesa Canyon', description: 'A towering red rock canyon with ambush points.',
    levelRequired: 3, x: 72, y: 78, dangerLevel: 'Medium', terrain: 'Canyon',
    digSpots: genDigSpots('red-mesa-canyon', 3, 3),
    missions: [
      { id: 'm7', name: 'Canyon Ambush', description: 'Survive an ambush in the narrow pass.', type: 'Combat', xpReward: 120, coinReward: 30, levelRequired: 3, completed: false, durationMinutes: 3, encounters: genEncounters(3, 2) },
      { id: 'm8', name: 'Dynamite Delivery', description: 'Bring explosives to the mining camp.', type: 'Delivery', xpReward: 100, coinReward: 35, levelRequired: 3, completed: false, durationMinutes: 2, requirements: [{ itemName: 'Canteen' }] },
      { id: 'm9', name: 'Bounty: Red Mesa Marauder', description: 'Capture the outlaw hiding in the canyon.', type: 'Bounty', xpReward: 150, coinReward: 50, levelRequired: 4, completed: false, durationMinutes: 4, encounters: genEncounters(4, 2), requirements: [{ itemName: 'Sidearm' }] },
    ],
  },
  {
    id: 'silver-creek-mine', name: 'Silver Creek Mine', description: 'An abandoned silver mine rumored to be haunted.',
    levelRequired: 4, x: 18, y: 68, dangerLevel: 'Medium', terrain: 'Mine',
    digSpots: genDigSpots('silver-creek-mine', 4, 3),
    missions: [
      { id: 'm10', name: 'Into the Dark', description: 'Explore the deepest shaft of the mine.', type: 'Investigation', xpReward: 140, coinReward: 40, levelRequired: 4, completed: false, durationMinutes: 3, requirements: [{ itemName: 'Lantern' }], encounters: genEncounters(4, 1) },
      { id: 'm11', name: 'Cave-In Rescue', description: 'Save trapped miners from a collapsed tunnel.', type: 'Escort', xpReward: 160, coinReward: 45, levelRequired: 4, completed: false, durationMinutes: 4, encounters: genEncounters(4, 2) },
      { id: 'm12', name: 'Silver Vein', description: 'Mine and transport a silver vein shipment.', type: 'Delivery', xpReward: 130, coinReward: 60, levelRequired: 5, completed: false, durationMinutes: 3 },
    ],
  },
  {
    id: 'rattlesnake-pass', name: 'Rattlesnake Pass', description: 'A treacherous mountain pass known for deadly serpents.',
    levelRequired: 5, x: 82, y: 65, dangerLevel: 'Medium', terrain: 'Mountain Pass',
    digSpots: genDigSpots('rattlesnake-pass', 5, 2),
    missions: [
      { id: 'm13', name: 'Serpent\'s Nest', description: 'Clear rattlesnakes from the mountain trail.', type: 'Combat', xpReward: 180, coinReward: 50, levelRequired: 5, completed: false, durationMinutes: 3, encounters: genEncounters(5, 2) },
      { id: 'm14', name: 'Stagecoach Guard', description: 'Protect a stagecoach through the pass.', type: 'Escort', xpReward: 200, coinReward: 60, levelRequired: 5, completed: false, durationMinutes: 4, requirements: [{ itemName: 'Longarm' }], encounters: genEncounters(5, 2) },
    ],
  },
  // New Frontier locations
  { id: 'broken-wheel', name: 'Broken Wheel', description: 'A waystation for weary travelers on the old trail.', levelRequired: 1, x: 38, y: 95, dangerLevel: 'Low', terrain: 'Waystation', digSpots: genDigSpots('broken-wheel', 1, 1), missions: [
    { id: 'mf1', name: 'Wheel Repair', description: 'Help fix a stranded wagon.', type: 'Delivery', xpReward: 30, coinReward: 8, levelRequired: 1, completed: false, durationMinutes: 1 },
  ]},
  { id: 'mud-creek', name: 'Mud Creek', description: 'A muddy river crossing popular with cattle drivers.', levelRequired: 1, x: 62, y: 93, dangerLevel: 'Low', terrain: 'Creek', digSpots: genDigSpots('mud-creek', 1, 2), missions: [
    { id: 'mf2', name: 'Cattle Crossing', description: 'Help drive cattle across the creek.', type: 'Escort', xpReward: 45, coinReward: 12, levelRequired: 1, completed: false, durationMinutes: 1 },
  ]},
  { id: 'sage-hill', name: 'Sage Hill', description: 'Rolling sagebrush hills with scattered homesteads.', levelRequired: 2, x: 15, y: 88, dangerLevel: 'Low', terrain: 'Hills', digSpots: genDigSpots('sage-hill', 2, 2), missions: [
    { id: 'mf3', name: 'Fence Mending', description: 'Help a rancher repair fence lines.', type: 'Delivery', xpReward: 55, coinReward: 14, levelRequired: 2, completed: false, durationMinutes: 1 },
  ]},
  { id: 'dry-creek-ranch', name: 'Dry Creek Ranch', description: 'A struggling cattle ranch needing hands.', levelRequired: 2, x: 85, y: 88, dangerLevel: 'Low', terrain: 'Ranch', digSpots: genDigSpots('dry-creek-ranch', 2, 1), missions: [
    { id: 'mf4', name: 'Branding Day', description: 'Help brand a herd of new calves.', type: 'Delivery', xpReward: 60, coinReward: 18, levelRequired: 2, completed: false, durationMinutes: 2 },
  ]},
  { id: 'cottonwood-springs', name: 'Cottonwood Springs', description: 'A natural spring oasis on the open prairie.', levelRequired: 3, x: 45, y: 85, dangerLevel: 'Low', terrain: 'Springs', digSpots: genDigSpots('cottonwood-springs', 3, 2), missions: [
    { id: 'mf5', name: 'Water Rights', description: 'Settle a dispute over the spring water.', type: 'Investigation', xpReward: 85, coinReward: 22, levelRequired: 3, completed: false, durationMinutes: 2 },
  ]},
  { id: 'jackrabbit-hollow', name: 'Jackrabbit Hollow', description: 'A shallow valley full of prairie wildlife.', levelRequired: 3, x: 55, y: 83, dangerLevel: 'Low', terrain: 'Valley', digSpots: genDigSpots('jackrabbit-hollow', 3, 2), missions: [
    { id: 'mf6', name: 'Rabbit Hunt', description: 'Thin out the jackrabbit population for farmers.', type: 'Combat', xpReward: 70, coinReward: 16, levelRequired: 3, completed: false, durationMinutes: 1 },
  ]},
  { id: 'old-mission', name: 'Old Mission', description: 'An abandoned Spanish mission with rumored treasure.', levelRequired: 4, x: 30, y: 75, dangerLevel: 'Medium', terrain: 'Ruins', digSpots: genDigSpots('old-mission', 4, 4), missions: [
    { id: 'mf7', name: 'Mission Secrets', description: 'Explore the ruins for hidden artifacts.', type: 'Investigation', xpReward: 130, coinReward: 45, levelRequired: 4, completed: false, durationMinutes: 3, encounters: genEncounters(4, 1) },
  ]},
  { id: 'buzzard-gulch', name: 'Buzzard Gulch', description: 'A narrow ravine where vultures circle endlessly.', levelRequired: 4, x: 68, y: 73, dangerLevel: 'Medium', terrain: 'Ravine', digSpots: genDigSpots('buzzard-gulch', 4, 2), missions: [
    { id: 'mf8', name: 'Gulch Bandits', description: 'Clear bandits using the gulch as a hideout.', type: 'Combat', xpReward: 140, coinReward: 38, levelRequired: 4, completed: false, durationMinutes: 3, encounters: genEncounters(4, 2) },
  ]},
  { id: 'prairie-dog-town', name: 'Prairie Dog Town', description: 'Flat grasslands riddled with burrows — treacherous on horseback.', levelRequired: 2, x: 40, y: 80, dangerLevel: 'Low', terrain: 'Grassland', digSpots: genDigSpots('prairie-dog-town', 2, 3), missions: [
    { id: 'mf9', name: 'Burrow Collapse', description: 'A horse broke its leg — find the medicine man.', type: 'Escort', xpReward: 65, coinReward: 15, levelRequired: 2, completed: false, durationMinutes: 2 },
  ]},
  { id: 'tumbleweed-crossing', name: 'Tumbleweed Crossing', description: 'An old crossroads where trails converge.', levelRequired: 3, x: 75, y: 85, dangerLevel: 'Low', terrain: 'Crossroads', digSpots: genDigSpots('tumbleweed-crossing', 3, 1), missions: [
    { id: 'mf10', name: 'Crossroads Drifter', description: 'A suspicious stranger offers you a deal.', type: 'Investigation', xpReward: 80, coinReward: 25, levelRequired: 3, completed: false, durationMinutes: 2 },
  ]},
  { id: 'lost-mule-flat', name: 'Lost Mule Flat', description: 'A barren stretch where pack mules wander loose.', levelRequired: 1, x: 22, y: 92, dangerLevel: 'Low', terrain: 'Flat', digSpots: genDigSpots('lost-mule-flat', 1, 1), missions: [
    { id: 'mf11', name: 'Mule Roundup', description: 'Catch the escaped pack mules.', type: 'Escort', xpReward: 35, coinReward: 10, levelRequired: 1, completed: false, durationMinutes: 1 },
  ]},
  { id: 'sunflower-meadow', name: 'Sunflower Meadow', description: 'Golden fields perfect for a homestead.', levelRequired: 2, x: 90, y: 80, dangerLevel: 'Low', terrain: 'Meadow', digSpots: genDigSpots('sunflower-meadow', 2, 2), missions: [
    { id: 'mf12', name: 'Homestead Defense', description: 'Help a family defend their land claim.', type: 'Combat', xpReward: 75, coinReward: 20, levelRequired: 2, completed: false, durationMinutes: 2, encounters: genEncounters(2, 1) },
  ]},
  { id: 'iron-bridge', name: 'Iron Bridge', description: 'The only bridge for miles — toll collectors demand payment.', levelRequired: 3, x: 10, y: 78, dangerLevel: 'Low', terrain: 'Bridge', missions: [
    { id: 'mf13', name: 'Bridge Toll', description: 'Deal with the toll collectors — pay or fight.', type: 'Combat', xpReward: 90, coinReward: 28, levelRequired: 3, completed: false, durationMinutes: 2, encounters: genEncounters(3, 1) },
  ]},
  { id: 'copper-canyon', name: 'Copper Canyon', description: 'Green-stained canyon walls rich with copper ore.', levelRequired: 5, x: 58, y: 70, dangerLevel: 'Medium', terrain: 'Canyon', digSpots: genDigSpots('copper-canyon', 5, 3), missions: [
    { id: 'mf14', name: 'Copper Strike', description: 'Stake a claim in the copper canyon.', type: 'Investigation', xpReward: 170, coinReward: 55, levelRequired: 5, completed: false, durationMinutes: 3 },
  ]},
  { id: 'whispering-pines', name: 'Whispering Pines', description: 'Dense pine forest with eerie wind sounds.', levelRequired: 4, x: 42, y: 72, dangerLevel: 'Medium', terrain: 'Forest', digSpots: genDigSpots('whispering-pines', 4, 2), missions: [
    { id: 'mf15', name: 'Forest Phantom', description: 'Investigate disappearances in the pine forest.', type: 'Investigation', xpReward: 125, coinReward: 35, levelRequired: 4, completed: false, durationMinutes: 3, encounters: genEncounters(4, 1) },
  ]},

  // === LEVELS 6-15: THE TERRITORIES (25 locations) ===
  {
    id: 'deadwood-saloon', name: 'Deadwood', description: 'The wildest saloon town in the West.',
    levelRequired: 6, x: 45, y: 58, dangerLevel: 'Medium', terrain: 'Town',
    digSpots: genDigSpots('deadwood-saloon', 6, 2),
    missions: [
      { id: 'm16', name: 'Poker Showdown', description: 'Win a high-stakes poker game against cheaters.', type: 'Investigation', xpReward: 200, coinReward: 100, levelRequired: 6, completed: false, durationMinutes: 3 },
      { id: 'm17', name: 'Duel at Dawn', description: 'Face a notorious gunslinger at high noon.', type: 'Combat', xpReward: 250, coinReward: 70, levelRequired: 6, completed: false, durationMinutes: 2, encounters: genEncounters(6, 1) },
      { id: 'm18', name: 'Whiskey Shipment', description: 'Deliver a wagon of whiskey barrels.', type: 'Delivery', xpReward: 180, coinReward: 55, levelRequired: 7, completed: false, durationMinutes: 3, encounters: genEncounters(7, 2) },
    ],
  },
  {
    id: 'fort-horizon', name: 'Fort Horizon', description: 'A military outpost on the edge of hostile territory.',
    levelRequired: 8, x: 12, y: 50, dangerLevel: 'High', terrain: 'Fort',
    missions: [
      { id: 'm19', name: 'Fort Defense', description: 'Help defend the fort from a bandit siege.', type: 'Combat', xpReward: 300, coinReward: 90, levelRequired: 8, completed: false, durationMinutes: 5, encounters: genEncounters(8, 3) },
      { id: 'm20', name: 'Arms Deal', description: 'Deliver weapons to the fort commander.', type: 'Delivery', xpReward: 250, coinReward: 80, levelRequired: 8, completed: false, durationMinutes: 4, requirements: [{ itemName: 'Longarm' }] },
      { id: 'm21', name: 'Bounty: Iron Jack', description: 'Hunt a deserter hiding in the wilderness.', type: 'Bounty', xpReward: 350, coinReward: 120, levelRequired: 9, completed: false, durationMinutes: 5, encounters: genEncounters(9, 3) },
    ],
  },
  {
    id: 'ghost-valley', name: 'Ghost Valley', description: 'A fog-shrouded valley where settlers vanished without a trace.',
    levelRequired: 10, x: 60, y: 48, dangerLevel: 'High', terrain: 'Valley',
    digSpots: genDigSpots('ghost-valley', 10, 3),
    missions: [
      { id: 'm22', name: 'The Vanished', description: 'Investigate the disappearance of settlers.', type: 'Investigation', xpReward: 350, coinReward: 100, levelRequired: 10, completed: false, durationMinutes: 5, encounters: genEncounters(10, 2) },
      { id: 'm23', name: 'Spirit Guide', description: 'Escort a medicine woman through the valley.', type: 'Escort', xpReward: 320, coinReward: 90, levelRequired: 10, completed: false, durationMinutes: 5, encounters: genEncounters(10, 3) },
    ],
  },
  {
    id: 'tombstone-ridge', name: 'Tombstone Ridge', description: 'A lawless mining town ruled by a corrupt sheriff.',
    levelRequired: 12, x: 85, y: 42, dangerLevel: 'High', terrain: 'Town',
    digSpots: genDigSpots('tombstone-ridge', 12, 2),
    missions: [
      { id: 'm25', name: 'Corrupt Law', description: 'Expose the sheriff\'s criminal dealings.', type: 'Investigation', xpReward: 400, coinReward: 120, levelRequired: 12, completed: false, durationMinutes: 5, encounters: genEncounters(12, 2) },
      { id: 'm26', name: 'Jailbreak', description: 'Free wrongfully imprisoned townsfolk.', type: 'Combat', xpReward: 450, coinReward: 130, levelRequired: 12, completed: false, durationMinutes: 5, encounters: genEncounters(12, 3) },
    ],
  },
  {
    id: 'eagle-peak', name: 'Eagle Peak', description: 'The highest mountain — home to outlaws and golden eagles.',
    levelRequired: 14, x: 35, y: 38, dangerLevel: 'High', terrain: 'Mountain',
    digSpots: genDigSpots('eagle-peak', 14, 2),
    missions: [
      { id: 'm28', name: 'Summit Assault', description: 'Storm the outlaw hideout at the peak.', type: 'Combat', xpReward: 500, coinReward: 150, levelRequired: 14, completed: false, durationMinutes: 6, encounters: genEncounters(14, 3) },
      { id: 'm30', name: 'Mountain Escort', description: 'Guide a gold shipment down the treacherous path.', type: 'Escort', xpReward: 550, coinReward: 180, levelRequired: 15, completed: false, durationMinutes: 6, encounters: genEncounters(15, 3) },
    ],
  },
  // New Territory locations
  { id: 'hangmans-bluff', name: "Hangman's Bluff", description: 'A cliff where outlaws were once hanged. Their ghosts still linger.', levelRequired: 6, x: 25, y: 60, dangerLevel: 'Medium', terrain: 'Bluff', digSpots: genDigSpots('hangmans-bluff', 6, 3), missions: [
    { id: 'mt1', name: 'Ghostly Noose', description: 'Investigate strange occurrences at the bluff.', type: 'Investigation', xpReward: 210, coinReward: 65, levelRequired: 6, completed: false, durationMinutes: 3, encounters: genEncounters(6, 1) },
  ]},
  { id: 'longhorn-crossing', name: 'Longhorn Crossing', description: 'Major cattle drive route — dusty, loud, and dangerous.', levelRequired: 7, x: 70, y: 55, dangerLevel: 'Medium', terrain: 'Trail', missions: [
    { id: 'mt2', name: 'Cattle Stampede', description: 'Stop a stampede before it reaches town.', type: 'Combat', xpReward: 230, coinReward: 75, levelRequired: 7, completed: false, durationMinutes: 3, encounters: genEncounters(7, 2) },
  ]},
  { id: 'whiskey-creek', name: 'Whiskey Creek', description: 'A creek town known for its moonshine and brawls.', levelRequired: 7, x: 55, y: 62, dangerLevel: 'Medium', terrain: 'Creek Town', digSpots: genDigSpots('whiskey-creek', 7, 2), missions: [
    { id: 'mt3', name: 'Moonshine Bust', description: 'Raid an illegal still operation.', type: 'Combat', xpReward: 240, coinReward: 80, levelRequired: 7, completed: false, durationMinutes: 3, encounters: genEncounters(7, 2) },
  ]},
  { id: 'devils-thumb', name: "Devil's Thumb", description: 'A towering rock formation used as a bandit lookout.', levelRequired: 8, x: 78, y: 52, dangerLevel: 'High', terrain: 'Rock Formation', digSpots: genDigSpots('devils-thumb', 8, 2), missions: [
    { id: 'mt4', name: 'Lookout Siege', description: 'Assault the bandit lookout atop the rock.', type: 'Combat', xpReward: 290, coinReward: 95, levelRequired: 8, completed: false, durationMinutes: 4, encounters: genEncounters(8, 2) },
  ]},
  { id: 'indian-wells', name: 'Indian Wells', description: 'Ancient wells sacred to the native peoples.', levelRequired: 9, x: 38, y: 52, dangerLevel: 'Medium', terrain: 'Wells', digSpots: genDigSpots('indian-wells', 9, 3), missions: [
    { id: 'mt5', name: 'Sacred Waters', description: 'Protect the wells from prospectors.', type: 'Escort', xpReward: 300, coinReward: 85, levelRequired: 9, completed: false, durationMinutes: 4 },
  ]},
  { id: 'prospectors-camp', name: "Prospector's Camp", description: 'A mining camp full of gold-fevered men.', levelRequired: 9, x: 18, y: 55, dangerLevel: 'Medium', terrain: 'Camp', digSpots: genDigSpots('prospectors-camp', 9, 4), missions: [
    { id: 'mt6', name: 'Claim Jumpers', description: 'Settle a violent dispute between miners.', type: 'Combat', xpReward: 280, coinReward: 90, levelRequired: 9, completed: false, durationMinutes: 3, encounters: genEncounters(9, 2) },
  ]},
  { id: 'willow-bend', name: 'Willow Bend', description: 'A peaceful riverside town hiding dark secrets.', levelRequired: 10, x: 50, y: 50, dangerLevel: 'Medium', terrain: 'River Town', digSpots: genDigSpots('willow-bend', 10, 2), missions: [
    { id: 'mt7', name: 'River Murder', description: 'A body was found in the river — investigate.', type: 'Investigation', xpReward: 330, coinReward: 100, levelRequired: 10, completed: false, durationMinutes: 4 },
  ]},
  { id: 'bone-dry-mesa', name: 'Bone Dry Mesa', description: 'A flat-topped mesa where nothing grows.', levelRequired: 11, x: 88, y: 48, dangerLevel: 'High', terrain: 'Mesa', digSpots: genDigSpots('bone-dry-mesa', 11, 3), missions: [
    { id: 'mt8', name: 'Mesa Standoff', description: 'Cornered bandits make their last stand.', type: 'Combat', xpReward: 370, coinReward: 110, levelRequired: 11, completed: false, durationMinutes: 4, encounters: genEncounters(11, 3) },
  ]},
  { id: 'timber-ridge', name: 'Timber Ridge', description: 'Dense forest and lumber camps in the high country.', levelRequired: 11, x: 8, y: 45, dangerLevel: 'High', terrain: 'Forest', digSpots: genDigSpots('timber-ridge', 11, 2), missions: [
    { id: 'mt9', name: 'Logger\'s Feud', description: 'Two lumber companies are at war.', type: 'Investigation', xpReward: 360, coinReward: 105, levelRequired: 11, completed: false, durationMinutes: 4, encounters: genEncounters(11, 2) },
  ]},
  { id: 'cactus-junction', name: 'Cactus Junction', description: 'A desert crossroads with a single cantina.', levelRequired: 13, x: 72, y: 45, dangerLevel: 'High', terrain: 'Desert Town', digSpots: genDigSpots('cactus-junction', 13, 2), missions: [
    { id: 'mt10', name: 'Cantina Shootout', description: 'A gunfight erupts in the only bar for miles.', type: 'Combat', xpReward: 420, coinReward: 125, levelRequired: 13, completed: false, durationMinutes: 3, encounters: genEncounters(13, 2) },
  ]},
  { id: 'bitter-springs', name: 'Bitter Springs', description: 'Alkali springs that taste of death — but vital for travelers.', levelRequired: 13, x: 28, y: 45, dangerLevel: 'High', terrain: 'Springs', missions: [
    { id: 'mt11', name: 'Poisoned Well', description: 'Someone poisoned the only water source.', type: 'Investigation', xpReward: 400, coinReward: 120, levelRequired: 13, completed: false, durationMinutes: 4 },
  ]},
  { id: 'gunsmoke-pass', name: 'Gunsmoke Pass', description: 'A narrow mountain pass thick with the smell of spent cartridges.', levelRequired: 14, x: 48, y: 42, dangerLevel: 'High', terrain: 'Pass', digSpots: genDigSpots('gunsmoke-pass', 14, 2), missions: [
    { id: 'mt12', name: 'Ambush Alley', description: 'Run the gauntlet through sniper-infested rocks.', type: 'Survival', xpReward: 480, coinReward: 145, levelRequired: 14, completed: false, durationMinutes: 5, encounters: genEncounters(14, 3) },
  ]},
  { id: 'boot-hill', name: 'Boot Hill', description: 'The famous cemetery — and the town that feeds it.', levelRequired: 15, x: 62, y: 40, dangerLevel: 'High', terrain: 'Cemetery', digSpots: genDigSpots('boot-hill', 15, 3), missions: [
    { id: 'mt13', name: 'Grave Robbers', description: 'Stop grave robbers from desecrating the dead.', type: 'Combat', xpReward: 500, coinReward: 155, levelRequired: 15, completed: false, durationMinutes: 4, encounters: genEncounters(15, 3) },
  ]},
  { id: 'dead-mans-curve', name: "Dead Man's Curve", description: 'A hairpin bend on a cliff road — many have fallen.', levelRequired: 7, x: 92, y: 58, dangerLevel: 'Medium', terrain: 'Cliff Road', missions: [
    { id: 'mt14', name: 'Cliff Edge', description: 'A wagon is stuck on the edge — one wrong move...', type: 'Escort', xpReward: 220, coinReward: 68, levelRequired: 7, completed: false, durationMinutes: 3 },
  ]},
  { id: 'pawnee-ford', name: 'Pawnee Ford', description: 'A shallow river crossing near old tribal grounds.', levelRequired: 8, x: 32, y: 48, dangerLevel: 'Medium', terrain: 'Ford', digSpots: genDigSpots('pawnee-ford', 8, 2), missions: [
    { id: 'mt15', name: 'River Ambush', description: 'Bandits hit travelers mid-crossing.', type: 'Combat', xpReward: 270, coinReward: 85, levelRequired: 8, completed: false, durationMinutes: 3, encounters: genEncounters(8, 2) },
  ]},

  // === LEVELS 16-30: THE BADLANDS (20 locations) ===
  {
    id: 'scorpion-desert', name: 'Scorpion Desert', description: 'A merciless desert where only the toughest survive.',
    levelRequired: 16, x: 20, y: 30, dangerLevel: 'Extreme', terrain: 'Desert',
    digSpots: genDigSpots('scorpion-desert', 16, 3),
    missions: [
      { id: 'm31', name: 'Desert Crossing', description: 'Survive crossing the deadliest stretch of sand.', type: 'Survival', xpReward: 600, coinReward: 170, levelRequired: 16, completed: false, durationMinutes: 6, requirements: [{ itemName: 'Canteen' }], encounters: genEncounters(16, 3) },
      { id: 'm32', name: 'Oasis Rescue', description: 'Save a stranded caravan at the desert oasis.', type: 'Escort', xpReward: 550, coinReward: 160, levelRequired: 16, completed: false, durationMinutes: 5, encounters: genEncounters(16, 2) },
    ],
  },
  {
    id: 'devils-crossing', name: "Devil's Crossing", description: 'A cursed bridge over a bottomless gorge.',
    levelRequired: 20, x: 55, y: 25, dangerLevel: 'Extreme', terrain: 'Gorge',
    digSpots: genDigSpots('devils-crossing', 20, 2),
    missions: [
      { id: 'm34', name: 'Bridge of No Return', description: 'Cross the bridge while under fire.', type: 'Combat', xpReward: 700, coinReward: 200, levelRequired: 20, completed: false, durationMinutes: 5, encounters: genEncounters(20, 3) },
      { id: 'm36', name: 'Bounty: El Diablo', description: 'Face the most wanted outlaw in the territory.', type: 'Bounty', xpReward: 1000, coinReward: 500, levelRequired: 22, completed: false, durationMinutes: 8, encounters: genEncounters(22, 4) },
    ],
  },
  {
    id: 'gold-rush-basin', name: 'Gold Rush Basin', description: 'The legendary gold fields — riches and ruin await.',
    levelRequired: 24, x: 80, y: 22, dangerLevel: 'Extreme', terrain: 'Basin',
    digSpots: genDigSpots('gold-rush-basin', 24, 5),
    missions: [
      { id: 'm37', name: 'Gold Fever', description: 'Stake your claim in the richest gold field.', type: 'Investigation', xpReward: 800, coinReward: 300, levelRequired: 24, completed: false, durationMinutes: 6, encounters: genEncounters(24, 3) },
      { id: 'm38', name: 'The Big Robbery', description: 'Rob or defend the biggest gold shipment ever.', type: 'Heist', xpReward: 1000, coinReward: 500, levelRequired: 26, completed: false, durationMinutes: 8, encounters: genEncounters(26, 4) },
    ],
  },
  // New Badlands
  { id: 'alkali-flat', name: 'Alkali Flat', description: 'Endless white salt flats shimmering with heat mirages.', levelRequired: 17, x: 35, y: 28, dangerLevel: 'Extreme', terrain: 'Salt Flat', digSpots: genDigSpots('alkali-flat', 17, 2), missions: [
    { id: 'mb1', name: 'Mirage Madness', description: 'Find the real camp among the mirages.', type: 'Survival', xpReward: 620, coinReward: 175, levelRequired: 17, completed: false, durationMinutes: 5, encounters: genEncounters(17, 2) },
  ]},
  { id: 'skull-rock', name: 'Skull Rock', description: 'A skull-shaped rock formation — a bandit landmark.', levelRequired: 18, x: 68, y: 30, dangerLevel: 'Extreme', terrain: 'Rock', digSpots: genDigSpots('skull-rock', 18, 3), missions: [
    { id: 'mb2', name: 'Skull Ambush', description: 'Walk into a trap — fight your way out.', type: 'Combat', xpReward: 650, coinReward: 190, levelRequired: 18, completed: false, durationMinutes: 5, encounters: genEncounters(18, 3) },
  ]},
  { id: 'sidewinder-gulch', name: 'Sidewinder Gulch', description: 'A winding gulch where sidewinder rattlers nest.', levelRequired: 18, x: 10, y: 35, dangerLevel: 'Extreme', terrain: 'Gulch', digSpots: genDigSpots('sidewinder-gulch', 18, 2), missions: [
    { id: 'mb3', name: 'Snake Pit', description: 'Navigate a canyon floor alive with serpents.', type: 'Survival', xpReward: 640, coinReward: 185, levelRequired: 18, completed: false, durationMinutes: 5, encounters: genEncounters(18, 2) },
  ]},
  { id: 'sunbaked-ruins', name: 'Sunbaked Ruins', description: 'Ancient pueblo ruins baking under the desert sun.', levelRequired: 19, x: 45, y: 28, dangerLevel: 'Extreme', terrain: 'Ruins', digSpots: genDigSpots('sunbaked-ruins', 19, 4), missions: [
    { id: 'mb4', name: 'Buried Temple', description: 'Explore the underground chambers.', type: 'Investigation', xpReward: 680, coinReward: 200, levelRequired: 19, completed: false, durationMinutes: 5, encounters: genEncounters(19, 2) },
  ]},
  { id: 'vulture-roost', name: 'Vulture Roost', description: 'A rocky outcrop where vultures wait for the dying.', levelRequired: 20, x: 88, y: 28, dangerLevel: 'Extreme', terrain: 'Outcrop', digSpots: genDigSpots('vulture-roost', 20, 2), missions: [
    { id: 'mb5', name: 'Dead Drop', description: 'Retrieve a hidden stash from the roost.', type: 'Investigation', xpReward: 720, coinReward: 210, levelRequired: 20, completed: false, durationMinutes: 4 },
  ]},
  { id: 'peyote-canyon', name: 'Peyote Canyon', description: 'A canyon where the air itself plays tricks on your mind.', levelRequired: 21, x: 30, y: 25, dangerLevel: 'Extreme', terrain: 'Canyon', digSpots: genDigSpots('peyote-canyon', 21, 3), missions: [
    { id: 'mb6', name: 'Vision Quest', description: 'Survive the hallucinogenic canyon.', type: 'Survival', xpReward: 750, coinReward: 220, levelRequired: 21, completed: false, durationMinutes: 6, encounters: genEncounters(21, 3) },
  ]},
  { id: 'outlaw-hideout', name: 'Outlaw Hideout', description: 'A cave system used by the worst criminals in the territory.', levelRequired: 22, x: 72, y: 25, dangerLevel: 'Extreme', terrain: 'Cave', digSpots: genDigSpots('outlaw-hideout', 22, 2), missions: [
    { id: 'mb7', name: 'Den of Thieves', description: 'Clear the cave of its dangerous inhabitants.', type: 'Combat', xpReward: 800, coinReward: 250, levelRequired: 22, completed: false, durationMinutes: 6, encounters: genEncounters(22, 4) },
  ]},
  { id: 'dry-lake-bed', name: 'Dry Lake Bed', description: 'A cracked lakebed that occasionally floods with deadly flash waters.', levelRequired: 23, x: 48, y: 23, dangerLevel: 'Extreme', terrain: 'Dry Lake', digSpots: genDigSpots('dry-lake-bed', 23, 3), missions: [
    { id: 'mb8', name: 'Flash Flood', description: 'Outrun a wall of water across the dry lake.', type: 'Survival', xpReward: 820, coinReward: 260, levelRequired: 23, completed: false, durationMinutes: 4, encounters: genEncounters(23, 2) },
  ]},
  { id: 'iron-canyon', name: 'Iron Canyon', description: 'Rust-red walls rich with iron ore — and bandits.', levelRequired: 25, x: 15, y: 25, dangerLevel: 'Extreme', terrain: 'Canyon', digSpots: genDigSpots('iron-canyon', 25, 3), missions: [
    { id: 'mb9', name: 'Iron Siege', description: 'Break through a fortified canyon checkpoint.', type: 'Combat', xpReward: 900, coinReward: 300, levelRequired: 25, completed: false, durationMinutes: 6, encounters: genEncounters(25, 4) },
  ]},
  { id: 'blood-mesa', name: 'Blood Mesa', description: 'Named for the red soil — or is it blood?', levelRequired: 27, x: 60, y: 22, dangerLevel: 'Extreme', terrain: 'Mesa', digSpots: genDigSpots('blood-mesa', 27, 3), missions: [
    { id: 'mb10', name: 'Red Massacre', description: 'Uncover the truth behind the mesa\'s name.', type: 'Investigation', xpReward: 950, coinReward: 320, levelRequired: 27, completed: false, durationMinutes: 6, encounters: genEncounters(27, 3) },
  ]},
  { id: 'mescalero-ridge', name: 'Mescalero Ridge', description: 'A ridge patrolled by Mescalero Apache scouts.', levelRequired: 28, x: 40, y: 22, dangerLevel: 'Extreme', terrain: 'Ridge', missions: [
    { id: 'mb11', name: 'Scout\'s Honor', description: 'Earn the trust of the Apache scouts.', type: 'Escort', xpReward: 980, coinReward: 330, levelRequired: 28, completed: false, durationMinutes: 6, encounters: genEncounters(28, 3) },
  ]},
  { id: 'petrified-forest', name: 'Petrified Forest', description: 'Ancient stone trees in an otherworldly landscape.', levelRequired: 29, x: 82, y: 20, dangerLevel: 'Extreme', terrain: 'Forest', digSpots: genDigSpots('petrified-forest', 29, 4), missions: [
    { id: 'mb12', name: 'Stone Secrets', description: 'Find artifacts among the petrified trees.', type: 'Investigation', xpReward: 1050, coinReward: 350, levelRequired: 29, completed: false, durationMinutes: 7, encounters: genEncounters(29, 3) },
  ]},

  // === LEVELS 30-50: THE WILDS (20 locations) ===
  {
    id: 'black-river-ford', name: 'Black River Ford', description: 'A dangerous river crossing controlled by smugglers.',
    levelRequired: 30, x: 40, y: 18, dangerLevel: 'Extreme', terrain: 'River',
    digSpots: genDigSpots('black-river-ford', 30, 3),
    missions: [
      { id: 'm40', name: 'River Pirates', description: 'Clear smugglers from the river crossing.', type: 'Combat', xpReward: 1200, coinReward: 400, levelRequired: 30, completed: false, durationMinutes: 7, encounters: genEncounters(30, 4) },
      { id: 'm42', name: 'Bounty: The Ferryman', description: 'Capture the smuggler lord of the river.', type: 'Bounty', xpReward: 1500, coinReward: 600, levelRequired: 32, completed: false, durationMinutes: 8, encounters: genEncounters(32, 4) },
    ],
  },
  {
    id: 'painted-canyon', name: 'Painted Canyon', description: 'Sacred canyon with ancient petroglyphs and hidden caves.',
    levelRequired: 35, x: 65, y: 15, dangerLevel: 'Extreme', terrain: 'Canyon',
    digSpots: genDigSpots('painted-canyon', 35, 4),
    missions: [
      { id: 'm43', name: 'Sacred Ground', description: 'Navigate the sacred canyon without offending the spirits.', type: 'Survival', xpReward: 1400, coinReward: 450, levelRequired: 35, completed: false, durationMinutes: 8, encounters: genEncounters(35, 4) },
      { id: 'm45', name: 'Ancient Guardian', description: 'Face the legendary guardian of the canyon.', type: 'Combat', xpReward: 2000, coinReward: 800, levelRequired: 38, completed: false, durationMinutes: 10, encounters: genEncounters(38, 5) },
    ],
  },
  {
    id: 'thunderhead-range', name: 'Thunderhead Range', description: 'Storm-lashed mountains where lightning strikes constantly.',
    levelRequired: 40, x: 15, y: 12, dangerLevel: 'Extreme', terrain: 'Mountain',
    digSpots: genDigSpots('thunderhead-range', 40, 3),
    missions: [
      { id: 'm46', name: 'Lightning Ridge', description: 'Cross the electrified ridge during a storm.', type: 'Survival', xpReward: 1800, coinReward: 600, levelRequired: 40, completed: false, durationMinutes: 8, encounters: genEncounters(40, 4) },
      { id: 'm48', name: 'Bounty: Thunder Chief', description: 'Bring down the warlord of the mountains.', type: 'Bounty', xpReward: 2500, coinReward: 1000, levelRequired: 44, completed: false, durationMinutes: 12, encounters: genEncounters(44, 5) },
    ],
  },
  // New Wilds
  { id: 'wolverine-creek', name: 'Wolverine Creek', description: 'A remote creek where wolverines and mountain men roam.', levelRequired: 31, x: 25, y: 18, dangerLevel: 'Extreme', terrain: 'Creek', digSpots: genDigSpots('wolverine-creek', 31, 3), missions: [
    { id: 'mw1', name: 'Trapper\'s Warning', description: 'A mountain man needs help defending his cabin.', type: 'Combat', xpReward: 1250, coinReward: 420, levelRequired: 31, completed: false, durationMinutes: 6, encounters: genEncounters(31, 3) },
  ]},
  { id: 'bear-tooth-pass', name: 'Bear Tooth Pass', description: 'A pass named for the massive bears that guard it.', levelRequired: 33, x: 50, y: 16, dangerLevel: 'Extreme', terrain: 'Pass', digSpots: genDigSpots('bear-tooth-pass', 33, 2), missions: [
    { id: 'mw2', name: 'Bear King', description: 'Face the legendary grizzly of the pass.', type: 'Combat', xpReward: 1350, coinReward: 460, levelRequired: 33, completed: false, durationMinutes: 7, encounters: genEncounters(33, 4) },
  ]},
  { id: 'medicine-wheel', name: 'Medicine Wheel', description: 'A sacred stone circle with mysterious powers.', levelRequired: 34, x: 75, y: 16, dangerLevel: 'Extreme', terrain: 'Sacred Site', digSpots: genDigSpots('medicine-wheel', 34, 3), missions: [
    { id: 'mw3', name: 'Spirit Walk', description: 'Undergo a spiritual trial at the medicine wheel.', type: 'Survival', xpReward: 1380, coinReward: 440, levelRequired: 34, completed: false, durationMinutes: 7, encounters: genEncounters(34, 3) },
  ]},
  { id: 'cascade-falls', name: 'Cascade Falls', description: 'Thundering waterfalls hiding caves behind them.', levelRequired: 36, x: 55, y: 14, dangerLevel: 'Extreme', terrain: 'Waterfall', digSpots: genDigSpots('cascade-falls', 36, 3), missions: [
    { id: 'mw4', name: 'Behind the Falls', description: 'Find the smugglers\' cave behind the waterfall.', type: 'Investigation', xpReward: 1500, coinReward: 500, levelRequired: 36, completed: false, durationMinutes: 7, encounters: genEncounters(36, 3) },
  ]},
  { id: 'frozen-lake', name: 'Frozen Lake', description: 'An alpine lake frozen most of the year.', levelRequired: 37, x: 30, y: 14, dangerLevel: 'Extreme', terrain: 'Lake', digSpots: genDigSpots('frozen-lake', 37, 2), missions: [
    { id: 'mw5', name: 'Ice Crossing', description: 'Cross the frozen lake before it cracks.', type: 'Survival', xpReward: 1550, coinReward: 520, levelRequired: 37, completed: false, durationMinutes: 6, encounters: genEncounters(37, 3) },
  ]},
  { id: 'wolf-den', name: 'Wolf Den', description: 'A network of caves where a massive wolf pack resides.', levelRequired: 39, x: 85, y: 14, dangerLevel: 'Extreme', terrain: 'Cave', digSpots: genDigSpots('wolf-den', 39, 2), missions: [
    { id: 'mw6', name: 'Alpha Hunt', description: 'Track the alpha wolf terrorizing settlements.', type: 'Bounty', xpReward: 1700, coinReward: 580, levelRequired: 39, completed: false, durationMinutes: 8, encounters: genEncounters(39, 4) },
  ]},
  { id: 'eagle-nest-cliff', name: 'Eagle Nest Cliff', description: 'Sheer cliffs where golden eagles nest and outlaws hide.', levelRequired: 41, x: 42, y: 12, dangerLevel: 'Extreme', terrain: 'Cliff', digSpots: genDigSpots('eagle-nest-cliff', 41, 2), missions: [
    { id: 'mw7', name: 'Cliff Hideout', description: 'Scale the cliff to reach an outlaw camp.', type: 'Combat', xpReward: 1900, coinReward: 620, levelRequired: 41, completed: false, durationMinutes: 8, encounters: genEncounters(41, 4) },
  ]},
  { id: 'windigo-hollow', name: 'Windigo Hollow', description: 'Locals say a terrifying creature stalks this hollow at night.', levelRequired: 43, x: 62, y: 12, dangerLevel: 'Extreme', terrain: 'Hollow', digSpots: genDigSpots('windigo-hollow', 43, 3), missions: [
    { id: 'mw8', name: 'Night Terror', description: 'Survive a night in the haunted hollow.', type: 'Survival', xpReward: 2100, coinReward: 700, levelRequired: 43, completed: false, durationMinutes: 8, encounters: genEncounters(43, 4) },
  ]},
  { id: 'devils-backbone', name: "Devil's Backbone", description: 'A razor-thin ridge with drops on both sides.', levelRequired: 45, x: 20, y: 10, dangerLevel: 'Extreme', terrain: 'Ridge', missions: [
    { id: 'mw9', name: 'Razor Walk', description: 'Cross the narrowest ridge in the territory.', type: 'Survival', xpReward: 2300, coinReward: 750, levelRequired: 45, completed: false, durationMinutes: 8, encounters: genEncounters(45, 4) },
  ]},
  { id: 'emerald-gorge', name: 'Emerald Gorge', description: 'A deep gorge with emerald-green water at the bottom.', levelRequired: 47, x: 78, y: 10, dangerLevel: 'Extreme', terrain: 'Gorge', digSpots: genDigSpots('emerald-gorge', 47, 4), missions: [
    { id: 'mw10', name: 'Gorge Treasure', description: 'Descend into the gorge for legendary treasure.', type: 'Investigation', xpReward: 2400, coinReward: 800, levelRequired: 47, completed: false, durationMinutes: 10, encounters: genEncounters(47, 5) },
  ]},
  { id: 'ghost-pine-forest', name: 'Ghost Pine Forest', description: 'Dead white pines stand like skeletons in the mist.', levelRequired: 48, x: 50, y: 10, dangerLevel: 'Extreme', terrain: 'Dead Forest', digSpots: genDigSpots('ghost-pine-forest', 48, 3), missions: [
    { id: 'mw11', name: 'Forest of the Dead', description: 'Navigate the eerie dead forest.', type: 'Survival', xpReward: 2500, coinReward: 850, levelRequired: 48, completed: false, durationMinutes: 9, encounters: genEncounters(48, 4) },
  ]},

  // === LEVELS 50-70: THE DEEP FRONTIER (15 locations) ===
  {
    id: 'bone-hollow', name: 'Bone Hollow', description: 'A cursed valley littered with bones of those who entered.',
    levelRequired: 50, x: 50, y: 8, dangerLevel: 'Deadly', terrain: 'Valley',
    digSpots: genDigSpots('bone-hollow', 50, 3),
    missions: [
      { id: 'm49', name: 'Valley of Bones', description: 'Survive the cursed hollow for three days.', type: 'Survival', xpReward: 3000, coinReward: 1000, levelRequired: 50, completed: false, durationMinutes: 10, encounters: genEncounters(50, 5) },
      { id: 'm50', name: 'The Bone Collector', description: 'Track a serial killer who lures victims here.', type: 'Bounty', xpReward: 3500, coinReward: 1200, levelRequired: 52, completed: false, durationMinutes: 12, encounters: genEncounters(52, 5) },
    ],
  },
  {
    id: 'iron-horse-junction', name: 'Iron Horse Junction', description: 'A lawless railroad town at the end of the line.',
    levelRequired: 55, x: 30, y: 5, dangerLevel: 'Deadly', terrain: 'Town',
    missions: [
      { id: 'm52', name: 'Train Heist', description: 'Rob or protect the express train carrying gold.', type: 'Heist', xpReward: 4000, coinReward: 2000, levelRequired: 55, completed: false, durationMinutes: 10, encounters: genEncounters(55, 5) },
      { id: 'm54', name: 'Bounty: Dynamite Dan', description: 'Stop a bomber from destroying the rail bridge.', type: 'Bounty', xpReward: 4500, coinReward: 2000, levelRequired: 58, completed: false, durationMinutes: 12, encounters: genEncounters(58, 5) },
    ],
  },
  {
    id: 'apache-territory', name: 'Apache Territory', description: 'Vast untamed lands guarded by fierce warriors.',
    levelRequired: 60, x: 75, y: 5, dangerLevel: 'Deadly', terrain: 'Wilderness',
    digSpots: genDigSpots('apache-territory', 60, 3),
    missions: [
      { id: 'm55', name: 'Peace Talks', description: 'Negotiate a truce between settlers and tribes.', type: 'Escort', xpReward: 4500, coinReward: 1800, levelRequired: 60, completed: false, durationMinutes: 10, encounters: genEncounters(60, 5) },
      { id: 'm57', name: 'War Paint', description: 'Survive a full-scale frontier conflict.', type: 'Combat', xpReward: 6000, coinReward: 2500, levelRequired: 65, completed: false, durationMinutes: 15, encounters: genEncounters(65, 6) },
    ],
  },
  // New Deep Frontier
  { id: 'hangmans-tree', name: "Hangman's Tree", description: 'A lone dead tree where vigilantes hang outlaws.', levelRequired: 51, x: 38, y: 8, dangerLevel: 'Deadly', terrain: 'Landmark', digSpots: genDigSpots('hangmans-tree', 51, 2), missions: [
    { id: 'md1', name: 'Vigilante Justice', description: 'Decide the fate of a captured outlaw.', type: 'Investigation', xpReward: 3100, coinReward: 1050, levelRequired: 51, completed: false, durationMinutes: 8 },
  ]},
  { id: 'sulfur-springs', name: 'Sulfur Springs', description: 'Bubbling hot springs that stink of brimstone.', levelRequired: 53, x: 62, y: 7, dangerLevel: 'Deadly', terrain: 'Hot Springs', digSpots: genDigSpots('sulfur-springs', 53, 2), missions: [
    { id: 'md2', name: 'Brimstone Ambush', description: 'Fight in the stinking sulfur mists.', type: 'Combat', xpReward: 3300, coinReward: 1100, levelRequired: 53, completed: false, durationMinutes: 8, encounters: genEncounters(53, 4) },
  ]},
  { id: 'deadfall-canyon', name: 'Deadfall Canyon', description: 'A canyon where rockslides are constant.', levelRequired: 56, x: 18, y: 6, dangerLevel: 'Deadly', terrain: 'Canyon', digSpots: genDigSpots('deadfall-canyon', 56, 3), missions: [
    { id: 'md3', name: 'Rock Slide Gauntlet', description: 'Run the canyon while dodging falling rocks.', type: 'Survival', xpReward: 3800, coinReward: 1400, levelRequired: 56, completed: false, durationMinutes: 8, encounters: genEncounters(56, 4) },
  ]},
  { id: 'comanche-trail', name: 'Comanche Trail', description: 'An ancient trail through hostile territory.', levelRequired: 58, x: 45, y: 6, dangerLevel: 'Deadly', terrain: 'Trail', missions: [
    { id: 'md4', name: 'Trail of Tears', description: 'Escort refugees through dangerous territory.', type: 'Escort', xpReward: 4200, coinReward: 1600, levelRequired: 58, completed: false, durationMinutes: 10, encounters: genEncounters(58, 5) },
  ]},
  { id: 'ghost-dance-plateau', name: 'Ghost Dance Plateau', description: 'A high plateau where spirits are said to dance.', levelRequired: 61, x: 85, y: 6, dangerLevel: 'Deadly', terrain: 'Plateau', digSpots: genDigSpots('ghost-dance-plateau', 61, 3), missions: [
    { id: 'md5', name: 'Spirit Dance', description: 'Witness the ghost dance and survive.', type: 'Survival', xpReward: 4800, coinReward: 1900, levelRequired: 61, completed: false, durationMinutes: 10, encounters: genEncounters(61, 5) },
  ]},
  { id: 'canyon-diablo', name: 'Canyon Diablo', description: 'The devil\'s own canyon — no law, no mercy.', levelRequired: 63, x: 55, y: 5, dangerLevel: 'Deadly', terrain: 'Canyon', digSpots: genDigSpots('canyon-diablo', 63, 3), missions: [
    { id: 'md6', name: 'Devil\'s Gateway', description: 'Assault the outlaws fortified in the canyon.', type: 'Combat', xpReward: 5200, coinReward: 2100, levelRequired: 63, completed: false, durationMinutes: 12, encounters: genEncounters(63, 5) },
  ]},
  { id: 'buffalo-wallow', name: 'Buffalo Wallow', description: 'Once teeming with buffalo — now a graveyard.', levelRequired: 64, x: 68, y: 6, dangerLevel: 'Deadly', terrain: 'Plains', digSpots: genDigSpots('buffalo-wallow', 64, 3), missions: [
    { id: 'md7', name: 'Last Buffalo', description: 'Protect the last buffalo herd from hunters.', type: 'Escort', xpReward: 5400, coinReward: 2200, levelRequired: 64, completed: false, durationMinutes: 10, encounters: genEncounters(64, 5) },
  ]},
  { id: 'widows-peak', name: "Widow's Peak", description: 'A lonely peak where widows mourned their dead.', levelRequired: 66, x: 25, y: 5, dangerLevel: 'Deadly', terrain: 'Peak', digSpots: genDigSpots('widows-peak', 66, 2), missions: [
    { id: 'md8', name: 'Peak Siege', description: 'Hold the peak against waves of attackers.', type: 'Combat', xpReward: 5600, coinReward: 2300, levelRequired: 66, completed: false, durationMinutes: 12, encounters: genEncounters(66, 6) },
  ]},
  { id: 'lost-dutchman-mine', name: 'Lost Dutchman Mine', description: 'The legendary lost gold mine — many seek it, few return.', levelRequired: 68, x: 40, y: 4, dangerLevel: 'Deadly', terrain: 'Mine', digSpots: genDigSpots('lost-dutchman-mine', 68, 5), missions: [
    { id: 'md9', name: 'The Lost Mine', description: 'Find the legendary Lost Dutchman Mine.', type: 'Investigation', xpReward: 6000, coinReward: 3000, levelRequired: 68, completed: false, durationMinutes: 15, encounters: genEncounters(68, 6) },
  ]},

  // === LEVELS 70-85: THE OUTLAW WASTES (10 locations) ===
  {
    id: 'vulture-city', name: 'Vulture City', description: 'An abandoned mining city overtaken by the deadliest outlaws.',
    levelRequired: 70, x: 42, y: 2, dangerLevel: 'Deadly', terrain: 'Ghost Town',
    digSpots: genDigSpots('vulture-city', 70, 4),
    missions: [
      { id: 'm58', name: 'City of the Dead', description: 'Clear the ghost city of its outlaw infestation.', type: 'Combat', xpReward: 7000, coinReward: 3000, levelRequired: 70, completed: false, durationMinutes: 12, encounters: genEncounters(70, 6) },
      { id: 'm60', name: 'Hidden Vault', description: 'Break into the underground vault of stolen gold.', type: 'Heist', xpReward: 9000, coinReward: 5000, levelRequired: 78, completed: false, durationMinutes: 15, encounters: genEncounters(78, 6) },
    ],
  },
  {
    id: 'dragons-spine', name: "Dragon's Spine", description: 'A jagged mountain ridge where no sane person goes.',
    levelRequired: 80, x: 60, y: 2, dangerLevel: 'Deadly', terrain: 'Mountain',
    digSpots: genDigSpots('dragons-spine', 80, 3),
    missions: [
      { id: 'm61', name: 'The Impossible Climb', description: 'Scale the deadliest mountain in the West.', type: 'Survival', xpReward: 10000, coinReward: 4000, levelRequired: 80, completed: false, durationMinutes: 15, encounters: genEncounters(80, 6) },
      { id: 'm62', name: 'Sky Fortress', description: 'Assault the mountain-top bandit fortress.', type: 'Combat', xpReward: 12000, coinReward: 5000, levelRequired: 85, completed: false, durationMinutes: 18, encounters: genEncounters(85, 7) },
    ],
  },
  // New Outlaw Wastes
  { id: 'death-valley', name: 'Death Valley', description: 'The hottest, driest, lowest point — pure death.', levelRequired: 72, x: 30, y: 3, dangerLevel: 'Deadly', terrain: 'Valley', digSpots: genDigSpots('death-valley', 72, 3), missions: [
    { id: 'mo1', name: 'Valley of Death', description: 'Cross Death Valley with minimal supplies.', type: 'Survival', xpReward: 7500, coinReward: 3200, levelRequired: 72, completed: false, durationMinutes: 12, encounters: genEncounters(72, 5) },
  ]},
  { id: 'tombstone-mine', name: 'Tombstone Silver Mine', description: 'The richest silver mine ever found — and the most dangerous.', levelRequired: 74, x: 52, y: 3, dangerLevel: 'Deadly', terrain: 'Mine', digSpots: genDigSpots('tombstone-mine', 74, 4), missions: [
    { id: 'mo2', name: 'Silver King', description: 'Claim the richest vein in the territory.', type: 'Investigation', xpReward: 8000, coinReward: 3500, levelRequired: 74, completed: false, durationMinutes: 12, encounters: genEncounters(74, 5) },
  ]},
  { id: 'outlaws-rest', name: "Outlaw's Rest", description: 'A hidden valley where the worst outlaws retire.', levelRequired: 76, x: 70, y: 3, dangerLevel: 'Deadly', terrain: 'Hidden Valley', digSpots: genDigSpots('outlaws-rest', 76, 3), missions: [
    { id: 'mo3', name: 'Retirement Plan', description: 'Find and raid the outlaws\' retirement stash.', type: 'Heist', xpReward: 8500, coinReward: 4000, levelRequired: 76, completed: false, durationMinutes: 15, encounters: genEncounters(76, 6) },
  ]},
  { id: 'hellgate-pass', name: 'Hellgate Pass', description: 'The last pass before the end of civilization.', levelRequired: 82, x: 48, y: 1, dangerLevel: 'Deadly', terrain: 'Pass', missions: [
    { id: 'mo4', name: 'Gates of Hell', description: 'Fight through the most dangerous pass alive.', type: 'Combat', xpReward: 11000, coinReward: 4500, levelRequired: 82, completed: false, durationMinutes: 15, encounters: genEncounters(82, 7) },
  ]},
  { id: 'deadwood-gulch', name: 'Deadwood Gulch', description: 'Not the town — a gulch so deadly it shares the name.', levelRequired: 83, x: 35, y: 2, dangerLevel: 'Deadly', terrain: 'Gulch', digSpots: genDigSpots('deadwood-gulch', 83, 3), missions: [
    { id: 'mo5', name: 'Gulch of No Return', description: 'Enter the gulch from which none return.', type: 'Survival', xpReward: 11500, coinReward: 4800, levelRequired: 83, completed: false, durationMinutes: 15, encounters: genEncounters(83, 7) },
  ]},

  // === LEVELS 85-100: ENDGAME (5 locations) ===
  {
    id: 'el-dorado', name: 'El Dorado', description: 'The legendary lost city of gold — if it even exists.',
    levelRequired: 90, x: 50, y: 0, dangerLevel: 'Deadly', terrain: 'Legendary',
    digSpots: genDigSpots('el-dorado', 90, 5),
    missions: [
      { id: 'm63', name: 'The Golden Trail', description: 'Follow the ancient map to El Dorado.', type: 'Investigation', xpReward: 15000, coinReward: 8000, levelRequired: 90, completed: false, durationMinutes: 20, encounters: genEncounters(90, 7) },
      { id: 'm64', name: 'Guardian of Gold', description: 'Defeat the ancient guardian protecting the city.', type: 'Combat', xpReward: 20000, coinReward: 10000, levelRequired: 95, completed: false, durationMinutes: 25, encounters: genEncounters(95, 8) },
      { id: 'm65', name: 'Legend of the West', description: 'The final challenge — become the greatest legend of the frontier.', type: 'Bounty', xpReward: 50000, coinReward: 25000, levelRequired: 100, completed: false, durationMinutes: 30, encounters: genEncounters(100, 10) },
    ],
  },
  { id: 'city-of-gold', name: 'City of Gold', description: 'The inner sanctum of El Dorado — pure legend.', levelRequired: 95, x: 55, y: 0, dangerLevel: 'Deadly', terrain: 'Legendary', digSpots: genDigSpots('city-of-gold', 95, 5), missions: [
    { id: 'me1', name: 'Golden Throne', description: 'Claim the golden throne of the ancient city.', type: 'Combat', xpReward: 25000, coinReward: 12000, levelRequired: 95, completed: false, durationMinutes: 20, encounters: genEncounters(95, 8) },
  ]},
  { id: 'forgotten-temple', name: 'Forgotten Temple', description: 'An Aztec temple hidden deep in the mountains.', levelRequired: 92, x: 45, y: 0, dangerLevel: 'Deadly', terrain: 'Temple', digSpots: genDigSpots('forgotten-temple', 92, 4), missions: [
    { id: 'me2', name: 'Temple Trials', description: 'Survive the ancient temple\'s deadly traps.', type: 'Survival', xpReward: 18000, coinReward: 9000, levelRequired: 92, completed: false, durationMinutes: 20, encounters: genEncounters(92, 7) },
  ]},
  { id: 'final-frontier', name: 'The Final Frontier', description: 'Beyond here — no map exists. The true unknown.', levelRequired: 98, x: 50, y: 0, dangerLevel: 'Deadly', terrain: 'Unknown', digSpots: genDigSpots('final-frontier', 98, 5), missions: [
    { id: 'me3', name: 'Into the Unknown', description: 'The ultimate test — venture where no one has gone.', type: 'Survival', xpReward: 40000, coinReward: 20000, levelRequired: 98, completed: false, durationMinutes: 30, encounters: genEncounters(98, 10) },
  ]},
];

export function getXpForLevel(level: number): number {
  if (level <= 10) return Math.floor(100 * Math.pow(1.4, level - 1));
  if (level <= 30) return Math.floor(200 * Math.pow(1.25, level - 1));
  if (level <= 60) return Math.floor(300 * Math.pow(1.18, level - 1));
  return Math.floor(500 * Math.pow(1.12, level - 1));
}

export function getLevelFromXp(totalXp: number): { level: number; currentXp: number; xpToNext: number } {
  let level = 1;
  let remaining = totalXp;
  while (level < 100) {
    const needed = getXpForLevel(level);
    if (remaining < needed) return { level, currentXp: remaining, xpToNext: needed };
    remaining -= needed;
    level++;
  }
  return { level: 100, currentXp: remaining, xpToNext: 0 };
}
