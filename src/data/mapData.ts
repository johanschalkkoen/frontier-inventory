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
}

export interface MissionRequirement {
  itemId?: string;
  itemName?: string;
  minLevel?: number;
}

export interface MissionEncounter {
  type: 'bandits' | 'outlaws' | 'wildlife' | 'natives' | 'weather' | 'terrain';
  name: string;
  difficulty: number; // 1-10, scaled to player level
  description: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  type: 'Combat' | 'Escort' | 'Delivery' | 'Investigation' | 'Bounty' | 'Survival' | 'Heist';
  xpReward: number;
  coinReward: number;
  levelRequired: number;
  completed: boolean;
  durationMinutes: number; // real-time minutes to complete
  requirements?: MissionRequirement[];
  encounters?: MissionEncounter[];
}

// Helper to generate encounters scaled to mission level
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
    { type: 'natives', name: 'Scout Patrol', difficulty: level, description: 'You\'ve been spotted by scouts.' },
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

export const mapRegions: MapRegion[] = [
  // === LEVELS 1-5: THE FRONTIER ===
  {
    id: 'dusty-gulch', name: 'Dusty Gulch', description: 'A quiet frontier town where every outlaw starts their journey.',
    levelRequired: 1, x: 50, y: 90, dangerLevel: 'Low', terrain: 'Town',
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
    missions: [
      { id: 'm4', name: 'Coyote Hunt', description: 'Clear out coyotes threatening the ranch.', type: 'Combat', xpReward: 80, coinReward: 20, levelRequired: 2, completed: false, durationMinutes: 2, encounters: genEncounters(2, 1) },
      { id: 'm5', name: 'Escort the Wagon', description: 'Guide a supply wagon safely through the flats.', type: 'Escort', xpReward: 100, coinReward: 25, levelRequired: 2, completed: false, durationMinutes: 3, requirements: [{ itemName: 'Sidearm' }] },
      { id: 'm6', name: 'Rustler\'s Trail', description: 'Investigate cattle rustlers operating nearby.', type: 'Investigation', xpReward: 90, coinReward: 18, levelRequired: 3, completed: false, durationMinutes: 2, encounters: genEncounters(3, 1) },
      { id: 'm6b', name: 'Prairie Dog Plague', description: 'Stop prairie dogs from ruining the crops.', type: 'Combat', xpReward: 60, coinReward: 12, levelRequired: 2, completed: false, durationMinutes: 1 },
    ],
  },
  {
    id: 'red-mesa-canyon', name: 'Red Mesa Canyon', description: 'A towering red rock canyon with ambush points.',
    levelRequired: 3, x: 72, y: 78, dangerLevel: 'Medium', terrain: 'Canyon',
    missions: [
      { id: 'm7', name: 'Canyon Ambush', description: 'Survive an ambush in the narrow pass.', type: 'Combat', xpReward: 120, coinReward: 30, levelRequired: 3, completed: false, durationMinutes: 3, encounters: genEncounters(3, 2) },
      { id: 'm8', name: 'Dynamite Delivery', description: 'Bring explosives to the mining camp.', type: 'Delivery', xpReward: 100, coinReward: 35, levelRequired: 3, completed: false, durationMinutes: 2, requirements: [{ itemName: 'Canteen' }] },
      { id: 'm9', name: 'Bounty: Red Mesa Marauder', description: 'Capture the outlaw hiding in the canyon.', type: 'Bounty', xpReward: 150, coinReward: 50, levelRequired: 4, completed: false, durationMinutes: 4, encounters: genEncounters(4, 2), requirements: [{ itemName: 'Sidearm' }] },
    ],
  },
  {
    id: 'silver-creek-mine', name: 'Silver Creek Mine', description: 'An abandoned silver mine rumored to be haunted.',
    levelRequired: 4, x: 18, y: 68, dangerLevel: 'Medium', terrain: 'Mine',
    missions: [
      { id: 'm10', name: 'Into the Dark', description: 'Explore the deepest shaft of the mine.', type: 'Investigation', xpReward: 140, coinReward: 40, levelRequired: 4, completed: false, durationMinutes: 3, requirements: [{ itemName: 'Lantern' }], encounters: genEncounters(4, 1) },
      { id: 'm11', name: 'Cave-In Rescue', description: 'Save trapped miners from a collapsed tunnel.', type: 'Escort', xpReward: 160, coinReward: 45, levelRequired: 4, completed: false, durationMinutes: 4, encounters: genEncounters(4, 2) },
      { id: 'm12', name: 'Silver Vein', description: 'Mine and transport a silver vein shipment.', type: 'Delivery', xpReward: 130, coinReward: 60, levelRequired: 5, completed: false, durationMinutes: 3 },
    ],
  },
  {
    id: 'rattlesnake-pass', name: 'Rattlesnake Pass', description: 'A treacherous mountain pass known for deadly serpents.',
    levelRequired: 5, x: 82, y: 65, dangerLevel: 'Medium', terrain: 'Mountain Pass',
    missions: [
      { id: 'm13', name: 'Serpent\'s Nest', description: 'Clear rattlesnakes from the mountain trail.', type: 'Combat', xpReward: 180, coinReward: 50, levelRequired: 5, completed: false, durationMinutes: 3, encounters: genEncounters(5, 2) },
      { id: 'm14', name: 'Stagecoach Guard', description: 'Protect a stagecoach through the pass.', type: 'Escort', xpReward: 200, coinReward: 60, levelRequired: 5, completed: false, durationMinutes: 4, requirements: [{ itemName: 'Longarm' }], encounters: genEncounters(5, 2) },
      { id: 'm15', name: 'Bounty: Snake-Eye Sam', description: 'Hunt a sharpshooter terrorizing travelers.', type: 'Bounty', xpReward: 250, coinReward: 80, levelRequired: 6, completed: false, durationMinutes: 5, encounters: genEncounters(6, 3) },
    ],
  },

  // === LEVELS 6-15: THE TERRITORIES ===
  {
    id: 'deadwood-saloon', name: 'Deadwood', description: 'The wildest saloon town in the West — gambling, duels, and danger.',
    levelRequired: 6, x: 45, y: 58, dangerLevel: 'Medium', terrain: 'Town',
    missions: [
      { id: 'm16', name: 'Poker Showdown', description: 'Win a high-stakes poker game against cheaters.', type: 'Investigation', xpReward: 200, coinReward: 100, levelRequired: 6, completed: false, durationMinutes: 3 },
      { id: 'm17', name: 'Duel at Dawn', description: 'Face a notorious gunslinger at high noon.', type: 'Combat', xpReward: 250, coinReward: 70, levelRequired: 6, completed: false, durationMinutes: 2, encounters: genEncounters(6, 1) },
      { id: 'm18', name: 'Whiskey Shipment', description: 'Deliver a wagon of whiskey barrels.', type: 'Delivery', xpReward: 180, coinReward: 55, levelRequired: 7, completed: false, durationMinutes: 3, encounters: genEncounters(7, 2) },
      { id: 'm18b', name: 'Saloon Saboteur', description: 'Find who\'s been poisoning the whiskey.', type: 'Investigation', xpReward: 220, coinReward: 65, levelRequired: 7, completed: false, durationMinutes: 3 },
    ],
  },
  {
    id: 'fort-horizon', name: 'Fort Horizon', description: 'A military outpost on the edge of hostile territory.',
    levelRequired: 8, x: 12, y: 50, dangerLevel: 'High', terrain: 'Fort',
    missions: [
      { id: 'm19', name: 'Fort Defense', description: 'Help defend the fort from a bandit siege.', type: 'Combat', xpReward: 300, coinReward: 90, levelRequired: 8, completed: false, durationMinutes: 5, encounters: genEncounters(8, 3) },
      { id: 'm20', name: 'Arms Deal', description: 'Deliver weapons to the fort commander.', type: 'Delivery', xpReward: 250, coinReward: 80, levelRequired: 8, completed: false, durationMinutes: 4, requirements: [{ itemName: 'Longarm' }] },
      { id: 'm21', name: 'Bounty: Iron Jack', description: 'Hunt a deserter hiding in the wilderness.', type: 'Bounty', xpReward: 350, coinReward: 120, levelRequired: 9, completed: false, durationMinutes: 5, encounters: genEncounters(9, 3) },
      { id: 'm21b', name: 'Scout Mission', description: 'Map enemy positions beyond the fort walls.', type: 'Investigation', xpReward: 280, coinReward: 75, levelRequired: 8, completed: false, durationMinutes: 4, encounters: genEncounters(8, 2) },
    ],
  },
  {
    id: 'ghost-valley', name: 'Ghost Valley', description: 'A fog-shrouded valley where settlers vanished without a trace.',
    levelRequired: 10, x: 60, y: 48, dangerLevel: 'High', terrain: 'Valley',
    missions: [
      { id: 'm22', name: 'The Vanished', description: 'Investigate the disappearance of settlers.', type: 'Investigation', xpReward: 350, coinReward: 100, levelRequired: 10, completed: false, durationMinutes: 5, encounters: genEncounters(10, 2) },
      { id: 'm23', name: 'Spirit Guide', description: 'Escort a medicine woman through the valley.', type: 'Escort', xpReward: 320, coinReward: 90, levelRequired: 10, completed: false, durationMinutes: 5, encounters: genEncounters(10, 3) },
      { id: 'm24', name: 'Ghost Riders', description: 'Fight phantom horsemen haunting travelers.', type: 'Combat', xpReward: 400, coinReward: 110, levelRequired: 11, completed: false, durationMinutes: 4, encounters: genEncounters(11, 3) },
    ],
  },
  {
    id: 'tombstone-ridge', name: 'Tombstone Ridge', description: 'A lawless mining town ruled by a corrupt sheriff.',
    levelRequired: 12, x: 85, y: 42, dangerLevel: 'High', terrain: 'Town',
    missions: [
      { id: 'm25', name: 'Corrupt Law', description: 'Expose the sheriff\'s criminal dealings.', type: 'Investigation', xpReward: 400, coinReward: 120, levelRequired: 12, completed: false, durationMinutes: 5, encounters: genEncounters(12, 2) },
      { id: 'm26', name: 'Jailbreak', description: 'Free wrongfully imprisoned townsfolk.', type: 'Combat', xpReward: 450, coinReward: 130, levelRequired: 12, completed: false, durationMinutes: 5, encounters: genEncounters(12, 3) },
      { id: 'm27', name: 'Bounty: Sheriff Blackwood', description: 'Bring the corrupt sheriff to justice.', type: 'Bounty', xpReward: 500, coinReward: 200, levelRequired: 13, completed: false, durationMinutes: 6, encounters: genEncounters(13, 3) },
    ],
  },
  {
    id: 'eagle-peak', name: 'Eagle Peak', description: 'The highest mountain — home to outlaws and golden eagles.',
    levelRequired: 14, x: 35, y: 38, dangerLevel: 'High', terrain: 'Mountain',
    missions: [
      { id: 'm28', name: 'Summit Assault', description: 'Storm the outlaw hideout at the peak.', type: 'Combat', xpReward: 500, coinReward: 150, levelRequired: 14, completed: false, durationMinutes: 6, encounters: genEncounters(14, 3) },
      { id: 'm29', name: 'Eagle\'s Nest', description: 'Retrieve a stolen artifact from the summit.', type: 'Investigation', xpReward: 450, coinReward: 140, levelRequired: 14, completed: false, durationMinutes: 5, encounters: genEncounters(14, 2) },
      { id: 'm30', name: 'Mountain Escort', description: 'Guide a gold shipment down the treacherous path.', type: 'Escort', xpReward: 550, coinReward: 180, levelRequired: 15, completed: false, durationMinutes: 6, encounters: genEncounters(15, 3) },
    ],
  },

  // === LEVELS 16-30: THE BADLANDS ===
  {
    id: 'scorpion-desert', name: 'Scorpion Desert', description: 'A merciless desert where only the toughest survive.',
    levelRequired: 16, x: 20, y: 30, dangerLevel: 'Extreme', terrain: 'Desert',
    missions: [
      { id: 'm31', name: 'Desert Crossing', description: 'Survive crossing the deadliest stretch of sand.', type: 'Survival', xpReward: 600, coinReward: 170, levelRequired: 16, completed: false, durationMinutes: 6, requirements: [{ itemName: 'Canteen' }], encounters: genEncounters(16, 3) },
      { id: 'm32', name: 'Oasis Rescue', description: 'Save a stranded caravan at the desert oasis.', type: 'Escort', xpReward: 550, coinReward: 160, levelRequired: 16, completed: false, durationMinutes: 5, encounters: genEncounters(16, 2) },
      { id: 'm33', name: 'Scorpion King', description: 'Hunt the legendary giant scorpion.', type: 'Bounty', xpReward: 700, coinReward: 250, levelRequired: 18, completed: false, durationMinutes: 7, encounters: genEncounters(18, 4) },
      { id: 'm33b', name: 'Mirage Runner', description: 'Find the hidden water source before dehydration.', type: 'Survival', xpReward: 500, coinReward: 140, levelRequired: 17, completed: false, durationMinutes: 5, encounters: genEncounters(17, 2) },
    ],
  },
  {
    id: 'devils-crossing', name: "Devil's Crossing", description: 'A cursed bridge over a bottomless gorge.',
    levelRequired: 20, x: 55, y: 25, dangerLevel: 'Extreme', terrain: 'Gorge',
    missions: [
      { id: 'm34', name: 'Bridge of No Return', description: 'Cross the bridge while under fire.', type: 'Combat', xpReward: 700, coinReward: 200, levelRequired: 20, completed: false, durationMinutes: 5, encounters: genEncounters(20, 3) },
      { id: 'm35', name: 'Toll Collector', description: 'Defeat the bandits demanding passage fees.', type: 'Combat', xpReward: 750, coinReward: 220, levelRequired: 20, completed: false, durationMinutes: 5, encounters: genEncounters(20, 3) },
      { id: 'm36', name: 'Bounty: El Diablo', description: 'Face the most wanted outlaw in the territory.', type: 'Bounty', xpReward: 1000, coinReward: 500, levelRequired: 22, completed: false, durationMinutes: 8, encounters: genEncounters(22, 4) },
    ],
  },
  {
    id: 'gold-rush-basin', name: 'Gold Rush Basin', description: 'The legendary gold fields — riches and ruin await.',
    levelRequired: 24, x: 80, y: 22, dangerLevel: 'Extreme', terrain: 'Basin',
    missions: [
      { id: 'm37', name: 'Gold Fever', description: 'Stake your claim in the richest gold field.', type: 'Investigation', xpReward: 800, coinReward: 300, levelRequired: 24, completed: false, durationMinutes: 6, encounters: genEncounters(24, 3) },
      { id: 'm38', name: 'The Big Robbery', description: 'Rob or defend the biggest gold shipment ever.', type: 'Heist', xpReward: 1000, coinReward: 500, levelRequired: 26, completed: false, durationMinutes: 8, encounters: genEncounters(26, 4) },
      { id: 'm39', name: 'Legend of the Basin', description: 'Uncover the ancient secret beneath the gold.', type: 'Investigation', xpReward: 1500, coinReward: 1000, levelRequired: 28, completed: false, durationMinutes: 10, encounters: genEncounters(28, 4) },
    ],
  },

  // === LEVELS 30-50: THE WILDS ===
  {
    id: 'black-river-ford', name: 'Black River Ford', description: 'A dangerous river crossing controlled by smugglers.',
    levelRequired: 30, x: 40, y: 18, dangerLevel: 'Extreme', terrain: 'River',
    missions: [
      { id: 'm40', name: 'River Pirates', description: 'Clear smugglers from the river crossing.', type: 'Combat', xpReward: 1200, coinReward: 400, levelRequired: 30, completed: false, durationMinutes: 7, encounters: genEncounters(30, 4) },
      { id: 'm41', name: 'Sunken Cargo', description: 'Dive for lost cargo in the river.', type: 'Investigation', xpReward: 1100, coinReward: 350, levelRequired: 30, completed: false, durationMinutes: 6, encounters: genEncounters(30, 3) },
      { id: 'm42', name: 'Bounty: The Ferryman', description: 'Capture the smuggler lord of the river.', type: 'Bounty', xpReward: 1500, coinReward: 600, levelRequired: 32, completed: false, durationMinutes: 8, encounters: genEncounters(32, 4) },
      { id: 'm42b', name: 'Flood Survivor', description: 'Rescue settlers from flash flooding.', type: 'Escort', xpReward: 1000, coinReward: 300, levelRequired: 31, completed: false, durationMinutes: 6, encounters: genEncounters(31, 3) },
    ],
  },
  {
    id: 'painted-canyon', name: 'Painted Canyon', description: 'Sacred canyon with ancient petroglyphs and hidden caves.',
    levelRequired: 35, x: 65, y: 15, dangerLevel: 'Extreme', terrain: 'Canyon',
    missions: [
      { id: 'm43', name: 'Sacred Ground', description: 'Navigate the sacred canyon without offending the spirits.', type: 'Survival', xpReward: 1400, coinReward: 450, levelRequired: 35, completed: false, durationMinutes: 8, encounters: genEncounters(35, 4) },
      { id: 'm44', name: 'Cave of Echoes', description: 'Explore the deepest caves for hidden treasure.', type: 'Investigation', xpReward: 1600, coinReward: 550, levelRequired: 36, completed: false, durationMinutes: 8, requirements: [{ itemName: 'Lantern' }], encounters: genEncounters(36, 4) },
      { id: 'm45', name: 'Ancient Guardian', description: 'Face the legendary guardian of the canyon.', type: 'Combat', xpReward: 2000, coinReward: 800, levelRequired: 38, completed: false, durationMinutes: 10, encounters: genEncounters(38, 5) },
    ],
  },
  {
    id: 'thunderhead-range', name: 'Thunderhead Range', description: 'Storm-lashed mountains where lightning strikes constantly.',
    levelRequired: 40, x: 15, y: 12, dangerLevel: 'Extreme', terrain: 'Mountain',
    missions: [
      { id: 'm46', name: 'Lightning Ridge', description: 'Cross the electrified ridge during a storm.', type: 'Survival', xpReward: 1800, coinReward: 600, levelRequired: 40, completed: false, durationMinutes: 8, encounters: genEncounters(40, 4) },
      { id: 'm47', name: 'Mountain Fortress', description: 'Assault a bandit fortress built into the peak.', type: 'Combat', xpReward: 2200, coinReward: 750, levelRequired: 42, completed: false, durationMinutes: 10, encounters: genEncounters(42, 5) },
      { id: 'm48', name: 'Bounty: Thunder Chief', description: 'Bring down the warlord of the mountains.', type: 'Bounty', xpReward: 2500, coinReward: 1000, levelRequired: 44, completed: false, durationMinutes: 12, encounters: genEncounters(44, 5) },
    ],
  },

  // === LEVELS 50-70: THE DEEP FRONTIER ===
  {
    id: 'bone-hollow', name: 'Bone Hollow', description: 'A cursed valley littered with bones of those who entered.',
    levelRequired: 50, x: 50, y: 8, dangerLevel: 'Deadly', terrain: 'Valley',
    missions: [
      { id: 'm49', name: 'Valley of Bones', description: 'Survive the cursed hollow for three days.', type: 'Survival', xpReward: 3000, coinReward: 1000, levelRequired: 50, completed: false, durationMinutes: 10, encounters: genEncounters(50, 5) },
      { id: 'm50', name: 'The Bone Collector', description: 'Track a serial killer who lures victims here.', type: 'Bounty', xpReward: 3500, coinReward: 1200, levelRequired: 52, completed: false, durationMinutes: 12, encounters: genEncounters(52, 5) },
      { id: 'm51', name: 'Buried Alive', description: 'Rescue prisoners buried in shallow graves.', type: 'Escort', xpReward: 2800, coinReward: 900, levelRequired: 51, completed: false, durationMinutes: 8, encounters: genEncounters(51, 4) },
    ],
  },
  {
    id: 'iron-horse-junction', name: 'Iron Horse Junction', description: 'A lawless railroad town at the end of the line.',
    levelRequired: 55, x: 30, y: 5, dangerLevel: 'Deadly', terrain: 'Town',
    missions: [
      { id: 'm52', name: 'Train Heist', description: 'Rob or protect the express train carrying gold.', type: 'Heist', xpReward: 4000, coinReward: 2000, levelRequired: 55, completed: false, durationMinutes: 10, encounters: genEncounters(55, 5) },
      { id: 'm53', name: 'Railroad Baron', description: 'Confront the corrupt railroad tycoon.', type: 'Investigation', xpReward: 3500, coinReward: 1500, levelRequired: 57, completed: false, durationMinutes: 8, encounters: genEncounters(57, 4) },
      { id: 'm54', name: 'Bounty: Dynamite Dan', description: 'Stop a bomber from destroying the rail bridge.', type: 'Bounty', xpReward: 4500, coinReward: 2000, levelRequired: 58, completed: false, durationMinutes: 12, encounters: genEncounters(58, 5) },
    ],
  },
  {
    id: 'apache-territory', name: 'Apache Territory', description: 'Vast untamed lands guarded by fierce warriors.',
    levelRequired: 60, x: 75, y: 5, dangerLevel: 'Deadly', terrain: 'Wilderness',
    missions: [
      { id: 'm55', name: 'Peace Talks', description: 'Negotiate a truce between settlers and tribes.', type: 'Escort', xpReward: 4500, coinReward: 1800, levelRequired: 60, completed: false, durationMinutes: 10, encounters: genEncounters(60, 5) },
      { id: 'm56', name: 'Sacred Hunt', description: 'Join a legendary buffalo hunt.', type: 'Combat', xpReward: 5000, coinReward: 2000, levelRequired: 62, completed: false, durationMinutes: 12, encounters: genEncounters(62, 5) },
      { id: 'm57', name: 'War Paint', description: 'Survive a full-scale frontier conflict.', type: 'Combat', xpReward: 6000, coinReward: 2500, levelRequired: 65, completed: false, durationMinutes: 15, encounters: genEncounters(65, 6) },
    ],
  },

  // === LEVELS 70-85: THE OUTLAW WASTES ===
  {
    id: 'vulture-city', name: 'Vulture City', description: 'An abandoned mining city overtaken by the deadliest outlaws.',
    levelRequired: 70, x: 42, y: 2, dangerLevel: 'Deadly', terrain: 'Ghost Town',
    missions: [
      { id: 'm58', name: 'City of the Dead', description: 'Clear the ghost city of its outlaw infestation.', type: 'Combat', xpReward: 7000, coinReward: 3000, levelRequired: 70, completed: false, durationMinutes: 12, encounters: genEncounters(70, 6) },
      { id: 'm59', name: 'The Underboss', description: 'Assassinate the crime lord running Vulture City.', type: 'Bounty', xpReward: 8000, coinReward: 4000, levelRequired: 75, completed: false, durationMinutes: 15, encounters: genEncounters(75, 6) },
      { id: 'm60', name: 'Hidden Vault', description: 'Break into the underground vault of stolen gold.', type: 'Heist', xpReward: 9000, coinReward: 5000, levelRequired: 78, completed: false, durationMinutes: 15, encounters: genEncounters(78, 6) },
    ],
  },
  {
    id: 'dragons-spine', name: "Dragon's Spine", description: 'A jagged mountain ridge where no sane person goes.',
    levelRequired: 80, x: 60, y: 2, dangerLevel: 'Deadly', terrain: 'Mountain',
    missions: [
      { id: 'm61', name: 'The Impossible Climb', description: 'Scale the deadliest mountain in the West.', type: 'Survival', xpReward: 10000, coinReward: 4000, levelRequired: 80, completed: false, durationMinutes: 15, encounters: genEncounters(80, 6) },
      { id: 'm62', name: 'Sky Fortress', description: 'Assault the mountain-top bandit fortress.', type: 'Combat', xpReward: 12000, coinReward: 5000, levelRequired: 85, completed: false, durationMinutes: 18, encounters: genEncounters(85, 7) },
    ],
  },

  // === LEVELS 85-100: ENDGAME ===
  {
    id: 'el-dorado', name: 'El Dorado', description: 'The legendary lost city of gold — if it even exists.',
    levelRequired: 90, x: 50, y: 0, dangerLevel: 'Deadly', terrain: 'Legendary',
    missions: [
      { id: 'm63', name: 'The Golden Trail', description: 'Follow the ancient map to El Dorado.', type: 'Investigation', xpReward: 15000, coinReward: 8000, levelRequired: 90, completed: false, durationMinutes: 20, encounters: genEncounters(90, 7) },
      { id: 'm64', name: 'Guardian of Gold', description: 'Defeat the ancient guardian protecting the city.', type: 'Combat', xpReward: 20000, coinReward: 10000, levelRequired: 95, completed: false, durationMinutes: 25, encounters: genEncounters(95, 8) },
      { id: 'm65', name: 'Legend of the West', description: 'The final challenge — become the greatest legend of the frontier.', type: 'Bounty', xpReward: 50000, coinReward: 25000, levelRequired: 100, completed: false, durationMinutes: 30, encounters: genEncounters(100, 10) },
    ],
  },
];

export function getXpForLevel(level: number): number {
  // Slower curve so reaching 100 requires serious grinding
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
