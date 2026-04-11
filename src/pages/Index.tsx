import { GameProvider, useGame } from '@/context/GameContext';
import { TopMenuBar } from '@/components/game/TopMenuBar';
import { CharacterSection } from '@/components/game/CharacterSection';
import { InventoryBag } from '@/components/game/InventoryBag';
import { ShopPanel } from '@/components/game/ShopPanel';
import { MapsPanel } from '@/components/game/MapsPanel';

function GameContent() {
  const { state } = useGame();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex flex-col gap-5 p-6 bg-game-container border-4 border-game-slot shadow-[0_0_50px_rgba(0,0,0,0.8)]">
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
          {state.activeTab === 'MAPS' && <MapsPanel />}
          {state.activeTab === 'SHOP' && <ShopPanel />}
        </div>
      </div>
    </div>
  );
}

const Index = () => (
  <GameProvider>
    <GameContent />
  </GameProvider>
);

export default Index;
