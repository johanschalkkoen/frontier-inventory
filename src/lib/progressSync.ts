import { supabase } from '@/integrations/supabase/client';
import type { SlotType } from '@/data/gameData';

interface ItemLocation {
  area: 'bag-left' | 'bag-right' | 'equipped';
  slotType?: SlotType;
}

interface SaveData {
  gender: string;
  selectedCharacterId: string;
  totalXp: number;
  walletAmount: number;
  completedMissions: string[];
  itemLocations: Record<string, ItemLocation>;
}

export async function loadProgress(userId: string): Promise<SaveData | null> {
  const { data, error } = await supabase
    .from('player_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return {
    gender: data.gender,
    selectedCharacterId: data.selected_character_id,
    totalXp: data.total_xp,
    walletAmount: Number(data.wallet_amount),
    completedMissions: data.completed_missions || [],
    itemLocations: (data.item_locations as unknown as Record<string, ItemLocation>) || {},
  };
}
    completedMissions: data.completed_missions || [],
    itemLocations: (data.item_locations as Record<string, ItemLocation>) || {},
  };
}

export async function saveProgress(userId: string, state: SaveData): Promise<void> {
  const { error } = await supabase
    .from('player_progress')
    .update({
      gender: state.gender,
      selected_character_id: state.selectedCharacterId,
      total_xp: state.totalXp,
      wallet_amount: state.walletAmount,
      completed_missions: state.completedMissions,
      item_locations: state.itemLocations as unknown as Record<string, unknown>,
    })
    .eq('user_id', userId);

  if (error) console.error('Failed to save progress:', error);
}
