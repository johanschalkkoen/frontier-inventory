import { AuthProvider, useAuth } from '@/context/AuthContext';
import { GameProvider, useGame } from '@/context/GameContext';
import { TopMenuBar } from '@/components/game/TopMenuBar';
import { CharacterSection } from '@/components/game/CharacterSection';
import { InventoryBag } from '@/components/game/InventoryBag';
import { WorldMap } from '@/components/game/WorldMap';
import { LoginPage } from '@/pages/Login';

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
          {state.activeTab === 'SHOP' && (
            <div className="flex-1 bg-game-panel border-2 border-game-slot p-8 text-center">
              <h2 className="font-display text-xl font-bold text-accent mb-4">GENERAL STORE</h2>
              <p className="text-muted-foreground text-sm">Coming soon — buy and sell gear with your coins.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-accent font-display text-xl animate-pulse">Saddling up...</div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

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
