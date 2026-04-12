import { AuthProvider, useAuth } from '@/context/AuthContext';
import { GameProvider, useGame } from '@/context/GameContext';
import { TopMenuBar } from '@/components/game/TopMenuBar';
import { TimeBar } from '@/components/game/TimeBar';
import { CharacterSection } from '@/components/game/CharacterSection';
import { WorldMap } from '@/components/game/WorldMap';
import { LoginPage } from '@/pages/Login';
import { CharacterCreation } from '@/components/game/CharacterCreation';
import { ShopSection } from '@/components/game/ShopSection';
import { QuestsSection } from '@/components/game/QuestsSection';
import { ProfileSection } from '@/components/game/ProfileSection';
import { SettingsSection } from '@/components/game/SettingsSection';
import { InventorySection } from '@/components/game/InventorySection';
import { HotelSection } from '@/components/game/HotelSection';
import { SaloonSection } from '@/components/game/SaloonSection';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { getStarterItemLocations } from '@/data/statClasses';

function GameContent() {
  const { state, loaded } = useGame();
  const { user } = useAuth();

  const handleDeleteCharacter = async () => {
    if (!user) return;
    await supabase.from('player_characters').delete().eq('user_id', user.id);
    await supabase.from('player_progress').update({
      gender: 'male',
      selected_character_id: 'male-0',
      total_xp: 0,
      wallet_amount: 0,
      completed_missions: [],
      item_locations: {},
    }).eq('user_id', user.id);
    window.location.reload();
  };

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-accent font-display text-xl animate-pulse">Loading your adventure...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-1 md:p-4">
      <div className="flex flex-col gap-2 md:gap-5 p-2 md:p-6 bg-game-container border-2 md:border-4 border-game-slot shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-[1200px] w-full">
        <TopMenuBar />
        <TimeBar />
        <div className="flex gap-2 md:gap-6 items-start overflow-x-auto">
          {state.activeTab === 'CHARACTER' && <CharacterSection />}
          {state.activeTab === 'MAPS' && <WorldMap />}
          {state.activeTab === 'SHOP' && <ShopSection />}
          {state.activeTab === 'HOTEL' && <HotelSection />}
          {state.activeTab === 'SALOON' && <SaloonSection />}
          {state.activeTab === 'QUESTS' && <QuestsSection />}
          {state.activeTab === 'INVENTORY' && <InventorySection />}
          {state.activeTab === 'PROFILE' && <ProfileSection />}
          {state.activeTab === 'SETTINGS' && (
            <SettingsSection onDeleteCharacter={handleDeleteCharacter} />
          )}
        </div>
      </div>
    </div>
  );
}

function AuthGate() {
  const { user, loading } = useAuth();
  const [hasCharacter, setHasCharacter] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) { setHasCharacter(null); return; }
    supabase
      .from('player_characters')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .then(({ data }) => { setHasCharacter(data && data.length > 0); });
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-accent font-display text-xl animate-pulse">Saddling up...</div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  if (hasCharacter === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-accent font-display text-xl animate-pulse">Loading your adventure...</div>
      </div>
    );
  }

  if (!hasCharacter) {
    return (
      <CharacterCreation
        onComplete={async (data) => {
          const starterItems = getStarterItemLocations();

          await supabase.from('player_progress').update({
            gender: data.archetypeId.startsWith('f') ? 'female' : 'male',
            selected_character_id: data.portraitId,
            total_xp: 0,
            wallet_amount: 25,
            completed_missions: [],
            item_locations: starterItems,
          }).eq('user_id', user.id);

          const { error } = await supabase.from('player_characters').insert({
            user_id: user.id,
            character_name: data.characterName,
            archetype_id: data.archetypeId,
            portrait_id: data.portraitId,
            trait_points: data.traitPoints,
            skill_points: {
              statClassId: data.statClassId,
              statClassValues: data.statClassValues,
            },
            is_active: true,
          });
          if (!error) setHasCharacter(true);
        }}
      />
    );
  }

  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

const Index = () => (
  <AuthProvider>
    <AuthGate />
  </AuthProvider>
);

export default Index;
