export interface Archetype {
  id: string;
  name: string;
  title: string;
  gender: 'male' | 'female';
  traits: string[];
  skills: string[];
  backstory: string;
  defaultPortrait: string; // maps to character portrait id
  bonusStats: Record<string, number>; // stat bonuses from archetype
}

export const archetypes: Archetype[] = [
  // Female Archetypes
  {
    id: 'elara',
    name: 'Elara Voss',
    title: 'Frontier Scout',
    gender: 'female',
    traits: ['Resourceful', 'Independent', 'Dry-Witted'],
    skills: ['Cartography & Navigation', 'Long-Range Marksmanship', 'Wilderness Survival'],
    backstory: `Born on a failing homestead in Kansas Territory to a surveyor father who taught her to read maps and navigate by stars before she could read books. When a raid killed her parents and younger brother during a harsh winter, 16-year-old Elara survived by hiding in the root cellar and later tracking the raiders for the local militia. She spent the next decade working as a paid scout for wagon trains, the Army, and mining companies, mapping uncharted trails through the Rockies and High Plains. Her dry wit hides deep grief and a fierce independence—she trusts few people but knows the land better than most alive.`,
    defaultPortrait: 'female-0',
    bonusStats: { speed: 8, luck: 3, damage: 5 },
  },
  {
    id: 'mira',
    name: 'Mira Calder',
    title: 'Saloon Owner & Broker',
    gender: 'female',
    traits: ['Charismatic', 'Calculating', 'Loyal'],
    skills: ['Persuasion & Negotiation', 'Reading People', 'Sleight-of-Hand'],
    backstory: `Mira grew up as the daughter of a traveling medicine show in Missouri. After her father was killed in a crooked card game in Dodge City, she used her charm and quick mind to survive by working as a dance-hall girl, then dealer, and eventually saved enough to buy out the struggling Silver Dollar Saloon. Behind the bar she listens to cowboys, outlaws, and lawmen alike, trading secrets for favors or gold. Her calculating nature comes from years of watching powerful men underestimate her.`,
    defaultPortrait: 'female-1',
    bonusStats: { charisma: 10, luck: 5, defense: 2 },
  },
  {
    id: 'lira',
    name: 'Lira Thorne',
    title: 'Horse Trainer & Rider',
    gender: 'female',
    traits: ['Bold', 'Hot-Headed', 'Empathetic'],
    skills: ['Horsemanship', 'Trick Riding & Roping', 'Hand-to-Hand Brawling'],
    backstory: `Lira was raised on a remote horse ranch in Texas by her Mexican vaquero grandfather after her mother died in childbirth and her father abandoned them. She learned to break wild mustangs before she could braid her own hair. When a rival rancher burned their spread and stole their best stock, Lira rode alone into the night, roped the leader, and dragged him back for the sheriff. Now she travels the frontier circuit as a trick rider and horse breaker.`,
    defaultPortrait: 'female-2',
    bonusStats: { speed: 10, energy: 5, health: 3 },
  },
  {
    id: 'selene',
    name: 'Selene Hart',
    title: 'Traveling Healer',
    gender: 'female',
    traits: ['Compassionate', 'Observant', 'Stubborn'],
    skills: ['Herbal Medicine & First Aid', 'Storytelling & Folklore', 'Stealth & Hiding'],
    backstory: `Selene was the quiet middle daughter of a strict preacher in a small Missouri town. After secretly learning herbal remedies from an old Native woman her father condemned as a witch, she was caught and nearly driven out. When a cholera outbreak killed her mother and sisters, Selene used her forbidden knowledge to save dozens of neighbors—only to be blamed for the ones who still died. She left with nothing but her mother's Bible and a satchel of dried plants.`,
    defaultPortrait: 'female-3',
    bonusStats: { health: 10, thirst: 5, energy: 3 },
  },

  // Male Archetypes
  {
    id: 'jace',
    name: 'Jace Harlan',
    title: 'Bounty Hunter',
    gender: 'male',
    traits: ['Stoic', 'Honorable', 'Cynical'],
    skills: ['Pistol Marksmanship & Quick-Draw', 'Investigation & Tracking', 'Intimidation'],
    backstory: `Jace once wore a badge in a booming silver-mining town in Colorado. He believed in the law until the mine owner paid off the judge and had Jace's younger sister murdered to silence her testimony about claim-jumping. After gunning down the responsible men in the street, Jace turned in his badge and became a bounty hunter—working only for posted rewards and his own code. Cynical about justice, he nevertheless refuses jobs that would hurt innocents.`,
    defaultPortrait: 'male-0',
    bonusStats: { damage: 8, defense: 5, speed: 3 },
  },
  {
    id: 'rafe',
    name: 'Rafe Langford',
    title: 'Gambler & Card Sharp',
    gender: 'male',
    traits: ['Charming', 'Opportunistic', 'Risk-Taker'],
    skills: ['Gambling & Probability', 'Deception & Bluffing', 'Knife Fighting'],
    backstory: `Rafe was the black sheep of a once-wealthy Southern family ruined by the Civil War. He learned cards from riverboat gamblers on the Mississippi and refined his craft in every boomtown from Kansas to California. Always one step ahead of angry losers and jealous husbands, he lives by his wits and a silver tongue. Deep down he knows his luck will run out eventually—he's already got a price on his head in two territories.`,
    defaultPortrait: 'male-1',
    bonusStats: { luck: 10, charisma: 5, speed: 3 },
  },
  {
    id: 'brody',
    name: 'Brody Kane',
    title: 'Cattle Drive Foreman',
    gender: 'male',
    traits: ['Loyal', 'Gruff', 'Protective'],
    skills: ['Leadership & Coordination', 'Heavy Labor & Wrestling', 'Shotgun & Rifle Handling'],
    backstory: `Brody grew up as the eldest son on a hardscrabble ranch in the Texas Panhandle. After losing his father and two brothers to attacks and cattle rustlers, he signed on with every major trail drive from Texas to Kansas. His gruff exterior and massive frame make him a natural leader who can break up fights or calm a stampede with a shout. He is fiercely protective of the men under his command and the cattle they drive.`,
    defaultPortrait: 'male-2',
    bonusStats: { health: 8, defense: 8, damage: 3 },
  },
  {
    id: 'finn',
    name: 'Finn Calderon',
    title: 'Tinkerer & Inventor',
    gender: 'male',
    traits: ['Curious', 'Absent-Minded', 'Optimistic'],
    skills: ['Mechanical Repair & Invention', 'Explosives & Traps', 'Lockpicking'],
    backstory: `Finn was born to Irish immigrant parents who ran a small gunsmith shop in St. Louis. Fascinated by machinery from childhood, he apprenticed with an eccentric German clockmaker and later worked on early steam engines for the railroads. A boiler explosion that killed his mentor left him with a slight limp and an unshakable curiosity. He now wanders the frontier in a battered wagon full of tools, fixing windmills, revolvers, and anything that clicks or bangs.`,
    defaultPortrait: 'male-3',
    bonusStats: { luck: 5, speed: 5, energy: 5, damage: 3 },
  },
];

// Trait point allocation system
export const TRAIT_CATEGORIES = ['Grit', 'Cunning', 'Endurance', 'Charm', 'Perception'] as const;
export type TraitCategory = typeof TRAIT_CATEGORIES[number];

export const TRAIT_STAT_MAP: Record<TraitCategory, Record<string, number>> = {
  Grit:       { damage: 2, health: 1 },
  Cunning:    { speed: 2, luck: 1 },
  Endurance:  { health: 2, defense: 1 },
  Charm:      { charisma: 2, luck: 1 },
  Perception: { speed: 1, damage: 1, luck: 1 },
};

export const TOTAL_TRAIT_POINTS = 10;
export const MAX_PER_TRAIT = 5;
