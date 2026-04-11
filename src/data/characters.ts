import maleDefault from '@/assets/male-character.jpg';
import femaleDefault from '@/assets/female-character.jpg';
import male1 from '@/assets/characters/male1.jpg';
import male2 from '@/assets/characters/male2.jpg';
import male3 from '@/assets/characters/male3.jpg';
import male4 from '@/assets/characters/male4.jpg';
import female1 from '@/assets/characters/female1.jpg';
import female2 from '@/assets/characters/female2.jpg';
import female3 from '@/assets/characters/female3.jpg';
import female4 from '@/assets/characters/female4.jpg';

export interface CharacterOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  img: string;
}

export const characters: CharacterOption[] = [
  { id: 'male-0', name: 'Gunslinger', gender: 'male', img: maleDefault },
  { id: 'male-1', name: 'Old Outlaw', gender: 'male', img: male1 },
  { id: 'male-2', name: 'Young Sheriff', gender: 'male', img: male2 },
  { id: 'male-3', name: 'Frontier Tracker', gender: 'male', img: male3 },
  { id: 'male-4', name: 'The Gambler', gender: 'male', img: male4 },
  { id: 'female-0', name: 'Bounty Hunter', gender: 'female', img: femaleDefault },
  { id: 'female-1', name: 'Saloon Rose', gender: 'female', img: female1 },
  { id: 'female-2', name: 'Spirit Walker', gender: 'female', img: female2 },
  { id: 'female-3', name: 'Shadow Bandit', gender: 'female', img: female3 },
  { id: 'female-4', name: 'Ranch Hand', gender: 'female', img: female4 },
];
