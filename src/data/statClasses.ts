// Five selectable stat class systems for character creation

export interface StatClassAttribute {
  key: string;
  name: string;
  desc: string;
  icon: string;
}

export interface StatClass {
  id: string;
  acronym: string;
  name: string;
  description: string;
  tone: string;
  attributes: StatClassAttribute[];
}

export const STAT_CLASSES: StatClass[] = [
  {
    id: 'grits',
    acronym: 'G.R.I.T.S.',
    name: 'GRITS',
    description: '"He\'s got real GRITS" — a Western-flavored system built on raw frontier guts.',
    tone: 'Classic cowboy tenacity',
    attributes: [
      { key: 'guts', name: 'Guts', desc: 'Raw courage under fire. Affects melee damage, intimidation, and resistance to fear and panic.', icon: 'G' },
      { key: 'resolve', name: 'Resolve', desc: 'Mental fortitude and willpower. Determines morale stability, pain tolerance, and dialogue conviction.', icon: 'R' },
      { key: 'instinct', name: 'Instinct', desc: 'Gut feeling and awareness. Affects gun accuracy, spotting ambushes, tracking, and reaction speed.', icon: 'I' },
      { key: 'toughness', name: 'Toughness', desc: 'Physical durability. Determines max health, disease resistance, and how fast survival stats drain.', icon: 'T' },
      { key: 'savvy', name: 'Savvy', desc: 'Street smarts and cunning. Improves crafting, barter prices, gambling, lockpicking, and social manipulation.', icon: 'S' },
    ],
  },
  {
    id: 'duster',
    acronym: 'D.U.S.T.E.R.',
    name: 'DUSTER',
    description: 'Named for the classic long cowboy coat — a system built on speed, grit, and endurance.',
    tone: 'Gunslinger mystique',
    attributes: [
      { key: 'draw', name: 'Draw', desc: 'Speed with a gun. Affects quick-draw duels, shooting speed, and first-strike advantage in combat.', icon: 'D' },
      { key: 'unflinching', name: 'Unflinching', desc: 'Nerve under pressure. Reduces panic, improves aim under fire, and steadies your hand in duels.', icon: 'U' },
      { key: 'survival', name: 'Survival', desc: 'Wilderness know-how. Affects tracking, foraging, weather reading, and travel endurance.', icon: 'S' },
      { key: 'tenacity', name: 'Tenacity', desc: 'Sheer stubbornness. Determines pain tolerance, max health recovery, and resistance to knockdown.', icon: 'T' },
      { key: 'endurance', name: 'Endurance', desc: 'Physical stamina and toughness. Max health, energy drain rate, and long-distance travel resilience.', icon: 'E' },
      { key: 'reckoning', name: 'Reckoning', desc: 'Reputation and presence. Affects intimidation, bounty hunter effectiveness, and how enemies react to you.', icon: 'R' },
    ],
  },
  {
    id: 'ranger',
    acronym: 'R.A.N.G.E.R.',
    name: 'RANGER',
    description: 'Perfect for the lawman or outlaw — a system built on precision, nerve, and reputation.',
    tone: 'Lawman / outlaw authority',
    attributes: [
      { key: 'reflexes', name: 'Reflexes', desc: 'Speed and coordination. Affects dodge chance, draw speed, riding skill, and movement in combat.', icon: 'R' },
      { key: 'aim', name: 'Aim', desc: 'Marksmanship precision. Crucial for gun accuracy at all ranges, critical hit chance, and headshot odds.', icon: 'A' },
      { key: 'nerve', name: 'Nerve', desc: 'Courage and composure. Determines morale in combat, resistance to intimidation, and bluff success.', icon: 'N' },
      { key: 'grit', name: 'Grit', desc: 'Raw toughness and resilience. Max health, wound recovery, and ability to keep fighting while injured.', icon: 'G' },
      { key: 'endurance_r', name: 'Endurance', desc: 'Stamina and survival. Energy pool, hunger/thirst drain rate, and resistance to extreme conditions.', icon: 'E' },
      { key: 'reputation', name: 'Reputation', desc: 'Your name precedes you. Affects trading prices, NPC reactions, companion loyalty, and faction standing.', icon: 'R' },
    ],
  },
  {
    id: 'cowboy',
    acronym: 'C.O.W.B.O.Y.',
    name: 'COWBOY',
    description: 'Fun and on-the-nose — a lighter system with a humorous cowboy flair.',
    tone: 'Lighthearted frontier fun',
    attributes: [
      { key: 'courage', name: 'Courage', desc: 'Bravery in the face of danger. Affects melee damage, morale stability, and ability to stand your ground.', icon: 'C' },
      { key: 'outdraw', name: 'Outdraw', desc: 'Speed on the trigger. Quick-draw duels, shooting speed, and first-strike combat advantage.', icon: 'O' },
      { key: 'wit', name: 'Wit', desc: 'Cleverness and charm. Improves dialogue options, gambling wins, barter deals, and social encounters.', icon: 'W' },
      { key: 'brawn', name: 'Brawn', desc: 'Physical strength and stamina. Max health, carry weight, melee power, and wrestling ability.', icon: 'B' },
      { key: 'orneriness', name: 'Orneriness', desc: 'Stubbornness and grit. Pain tolerance, resistance to knockdown, and determination to keep going.', icon: 'O' },
      { key: 'yeehaw', name: 'Yeehaw', desc: 'Pure frontier luck and spirit. Critical hit chance, rare loot finds, random positive events, and morale boosts.', icon: 'Y' },
    ],
  },
  {
    id: 'hatfir',
    acronym: 'H.A.T.F.I.R.',
    name: 'HATFIR',
    description: '"Hatfire" — sounds like a gunslinger nickname. A balanced system for any frontier role.',
    tone: 'Gunslinger legend',
    attributes: [
      { key: 'heart', name: 'Heart', desc: 'Inner courage and compassion. Affects morale, companion loyalty, honor gain, and dialogue sincerity.', icon: 'H' },
      { key: 'aim_h', name: 'Aim', desc: 'Shooting precision and hand-eye coordination. Gun accuracy, critical hits, and ranged combat effectiveness.', icon: 'A' },
      { key: 'toughness_h', name: 'Toughness', desc: 'Physical durability. Max health, wound resistance, and ability to survive harsh conditions.', icon: 'T' },
      { key: 'fortitude', name: 'Fortitude', desc: 'Mental and physical endurance. Stamina pool, hunger/thirst resistance, and long-journey survival.', icon: 'F' },
      { key: 'instinct_h', name: 'Instinct', desc: 'Natural awareness and gut feeling. Spotting ambushes, tracking, dodge chance, and danger sense.', icon: 'I' },
      { key: 'reputation_h', name: 'Reputation', desc: 'How the frontier knows you. Trading prices, faction standing, bounty hunter fear, and NPC reactions.', icon: 'R' },
    ],
  },
];

// Maps stat class attributes to game mechanics
export function getStatClassBonuses(classId: string, values: Record<string, number>): Record<string, number> {
  const bonuses: Record<string, number> = {};
  
  // Each class maps its attributes to base game stats differently
  switch (classId) {
    case 'grits':
      bonuses.damage = ((values.guts || 5) - 5) * 3;
      bonuses.health = ((values.toughness || 5) - 5) * 20;
      bonuses.speed = ((values.instinct || 5) - 5) * 3;
      bonuses.luck = ((values.savvy || 5) - 5) * 3;
      bonuses.charisma = ((values.savvy || 5) - 5) * 2;
      bonuses.defense = ((values.toughness || 5) - 5) * 2;
      bonuses.energy = ((values.resolve || 5) - 5) * 10;
      bonuses.morale = ((values.resolve || 5) - 5) * 5;
      break;
    case 'duster':
      bonuses.speed = ((values.draw || 5) - 5) * 4;
      bonuses.damage = ((values.reckoning || 5) - 5) * 3;
      bonuses.health = ((values.endurance || 5) - 5) * 20;
      bonuses.defense = ((values.tenacity || 5) - 5) * 3;
      bonuses.luck = ((values.survival || 5) - 5) * 2;
      bonuses.energy = ((values.endurance || 5) - 5) * 10;
      bonuses.charisma = ((values.reckoning || 5) - 5) * 2;
      bonuses.morale = ((values.unflinching || 5) - 5) * 5;
      break;
    case 'ranger':
      bonuses.speed = ((values.reflexes || 5) - 5) * 3;
      bonuses.damage = ((values.aim || 5) - 5) * 4;
      bonuses.health = ((values.grit || 5) - 5) * 20;
      bonuses.energy = ((values.endurance_r || 5) - 5) * 10;
      bonuses.defense = ((values.grit || 5) - 5) * 2;
      bonuses.charisma = ((values.reputation || 5) - 5) * 3;
      bonuses.luck = ((values.nerve || 5) - 5) * 2;
      bonuses.morale = ((values.nerve || 5) - 5) * 5;
      break;
    case 'cowboy':
      bonuses.damage = ((values.courage || 5) - 5) * 3;
      bonuses.speed = ((values.outdraw || 5) - 5) * 4;
      bonuses.charisma = ((values.wit || 5) - 5) * 3;
      bonuses.health = ((values.brawn || 5) - 5) * 20;
      bonuses.defense = ((values.orneriness || 5) - 5) * 3;
      bonuses.luck = ((values.yeehaw || 5) - 5) * 4;
      bonuses.energy = ((values.brawn || 5) - 5) * 10;
      bonuses.morale = ((values.courage || 5) - 5) * 5;
      break;
    case 'hatfir':
      bonuses.morale = ((values.heart || 5) - 5) * 5;
      bonuses.damage = ((values.aim_h || 5) - 5) * 4;
      bonuses.health = ((values.toughness_h || 5) - 5) * 20;
      bonuses.energy = ((values.fortitude || 5) - 5) * 10;
      bonuses.speed = ((values.instinct_h || 5) - 5) * 3;
      bonuses.charisma = ((values.reputation_h || 5) - 5) * 3;
      bonuses.defense = ((values.toughness_h || 5) - 5) * 2;
      bonuses.luck = ((values.instinct_h || 5) - 5) * 2;
      break;
  }
  
  return bonuses;
}

// Random Western name generator
const MALE_FIRST = ['Silas', 'Wyatt', 'Cole', 'Jesse', 'Hank', 'Clay', 'Virgil', 'Boone', 'Cal', 'Dutch', 'Eli', 'Flint', 'Gideon', 'Ike', 'Jack', 'Kit', 'Levi', 'Morgan', 'Nate', 'Red', 'Sam', 'Tanner', 'Wade', 'Zeke', 'Amos', 'Buck', 'Clem', 'Deacon', 'Enos', 'Frank', 'Grady', 'Homer', 'Jasper', 'Knox', 'Luther', 'Merle', 'Obie', 'Pecos', 'Quill', 'Rufus', 'Slade', 'Travis', 'Ulysses', 'Vernon', 'Wes'];
const FEMALE_FIRST = ['Ada', 'Belle', 'Clara', 'Dolly', 'Elsa', 'Faye', 'Ginny', 'Hattie', 'Ivy', 'Josie', 'Kate', 'Lottie', 'Mae', 'Nell', 'Opal', 'Pearl', 'Ruby', 'Sadie', 'Tess', 'Violet', 'Willa', 'Abigail', 'Bonnie', 'Calamity', 'Daisy', 'Estella', 'Flora', 'Georgia', 'Hope', 'Irene', 'June', 'Kitty', 'Lily', 'Martha', 'Nora', 'Olive', 'Patience', 'Quinn', 'Rose', 'Stella', 'Temperance', 'Uma', 'Vera', 'Winnie'];
const LAST_NAMES = ['Whitaker', 'Harlan', 'McCoy', 'Calloway', 'Blackwood', 'Sterling', 'Hollister', 'Cain', 'Dalton', 'Earp', 'Graves', 'Hawkins', 'Kincaid', 'Langford', 'McBride', 'Nash', 'O\'Brien', 'Pike', 'Reno', 'Stone', 'Tucker', 'Vance', 'Walker', 'York', 'Boone', 'Cross', 'Drake', 'Finch', 'Hart', 'Kane', 'Lane', 'Marsh', 'Page', 'Reed', 'Sloan', 'Thorne', 'Ward', 'Barnes', 'Cole', 'Dixon', 'Ford', 'Grant', 'Hayes', 'Jensen', 'Logan', 'Monroe', 'Porter', 'Shaw', 'Webb'];
const NICKNAMES = ['Ghost', 'Copper', 'Dust', 'Iron', 'Shadow', 'Ace', 'Snake', 'Wolf', 'Hawk', 'Bear', 'Viper', 'Spur', 'Bones', 'Grizzly', 'Coyote', 'Rattler', 'Gunsmoke', 'Hellfire', 'Sidewinder', 'Thunderbolt'];

export function generateRandomName(gender: 'male' | 'female'): string {
  const firsts = gender === 'male' ? MALE_FIRST : FEMALE_FIRST;
  const first = firsts[Math.floor(Math.random() * firsts.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  // 30% chance of a nickname
  if (Math.random() < 0.3) {
    const nick = NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)];
    return `${first} "${nick}" ${last}`;
  }
  return `${first} ${last}`;
}

// Starting equipment for new characters
export const STARTER_EQUIPMENT: Record<string, string> = {
  'item-70': 'equipped',    // Percussion Revolver (basic sidearm)
  'item-205': 'equipped',   // Single-Shot Carbine (basic longarm)
  'item-3': 'equipped',     // Stetson (basic hat)
  'item-68': 'equipped',    // Work Boots
  'item-77': 'equipped',    // Plain Leather Belt
  'item-16': 'equipped',    // Denim Jeans
  'item-13': 'equipped',    // Cotton Work Shirt
  'item-80': 'bag-left',    // Revolver Cartridges (ammo)
  'item-81': 'bag-left',    // Rifle Rounds (ammo)
};

// Build the initial itemLocations from starter equipment
export function getStarterItemLocations(): Record<string, { area: string; slotType?: string }> {
  const locs: Record<string, { area: string; slotType?: string }> = {};
  // Import item data to get slot types
  const equipMap: Record<string, string> = {
    'item-70': 'sidearm',
    'item-205': 'longarm',
    'item-3': 'hat',
    'item-68': 'boots',
    'item-77': 'gunbelt',
    'item-16': 'pants',
    'item-13': 'shirt',
  };
  
  for (const [itemId, location] of Object.entries(STARTER_EQUIPMENT)) {
    if (location === 'equipped' && equipMap[itemId]) {
      locs[itemId] = { area: 'equipped', slotType: equipMap[itemId] };
    } else {
      locs[itemId] = { area: location };
    }
  }
  return locs;
}
