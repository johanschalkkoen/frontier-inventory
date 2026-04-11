import { AuthProvider, useAuth } from '@/context/AuthContext';
import { GameProvider, useGame } from '@/context/GameContext';
import { TopMenuBar } from '@/components/game/TopMenuBar';
import { CharacterSection } from '@/components/game/CharacterSection';
import { InventoryBag } from '@/components/game/InventoryBag';
import { WorldMap } from '@/components/game/WorldMap';
import { LoginPage } from '@/pages/Login';
import { CharacterCreation } from '@/components/game/CharacterCreation';
import { ShopSection } from '@/components/game/ShopSection';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

function GameContent() {
  const { state, loaded } = useGame();

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-accent font-display text-xl animate-pulse">Loading your adventure...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex flex-col gap-5 p-6 bg-game-container border-4 border-game-slot shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-[1200px] w-full">
        <TopMenuBar />
        <div className="flex gap-6 items-start">
          {state.activeTab === 'CHARACTER' && (
            <>
              <CharacterSection />
              <div className="flex gap-4">
                <InventoryBag bagId="bag-left" title="Left Saddlebag" />
                <InventoryBag bagId="bag-right" title="Right Saddlebag" />
              </div>
            </>
          )}
          {state.activeTab === 'MAPS' && <WorldMap />}
          {state.activeTab === 'SHOP' && <ShopSection />}
        </div>
      </div>
    </div>
  );
}

function AuthGate() {
  const { user, loading } = useAuth();
  const [hasCharacter, setHasCharacter] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setHasCharacter(null);
      return;
    }
    // Check if user has a created character
    supabase
      .from('player_characters')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .then(({ data }) => {
        setHasCharacter(data && data.length > 0);
      });
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
          const { error } = await supabase.from('player_characters').insert({
            user_id: user.id,
            character_name: data.characterName,
            archetype_id: data.archetypeId,
            portrait_id: data.portraitId,
            trait_points: data.traitPoints,
            is_active: true,
          });
          if (!error) {
            setHasCharacter(true);
          }
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
