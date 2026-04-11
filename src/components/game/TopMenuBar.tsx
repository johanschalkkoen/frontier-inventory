import { useGame } from '@/context/GameContext';
import { UserBadge } from './UserBadge';
import moneybagImg from '@/assets/moneybag.jpg';

const tabs = [
  { icon: '🪶', label: 'CHARACTER' },
  { icon: '🗺️', label: 'MAPS' },
  { icon: '⚖️', label: 'SHOP' },
];

export function TopMenuBar() {
  const { state, setActiveTab } = useGame();

  return (
    <nav className="relative flex items-center bg-game-panel border-2 border-game-slot h-[75px] px-8 shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
         style={{ borderBottomWidth: '4px', borderBottomColor: 'hsl(16, 25%, 47%)' }}>
      {/* Rivets */}
      {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-2 h-2 rounded-full shadow-sm`}
             style={{ background: 'radial-gradient(circle at 30% 30%, #ffd700, #b8860b)', border: '1px solid hsl(16, 25%, 22%)' }} />
      ))}

      <div className="flex gap-4 h-full items-center">
        {tabs.map(tab => (
          <button key={tab.label} onClick={() => setActiveTab(tab.label)}
            className={`h-[50px] px-6 flex items-center rounded transition-all duration-200 ${
              state.activeTab === tab.label
                ? 'bg-gradient-to-b from-game-container to-game-slot border border-primary shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]'
                : 'border border-transparent hover:border-border'
            }`}>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm">{tab.icon}</span>
              <span className={`font-display text-[11px] font-black tracking-[2px] ${
                state.activeTab === tab.label ? 'text-accent drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]' : 'text-muted-foreground'
              }`}>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-4 bg-game-slot px-5 py-2 border-2 border-game-slot-border rounded-lg">
        <div className="w-[45px] h-[45px] border-2 border-primary -rotate-3 overflow-hidden">
          <img src={moneybagImg} alt="Bag" className="w-full h-full object-cover" width={45} height={45} />
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-muted-foreground font-bold tracking-wider">WALLET</span>
          <span className="text-accent text-xl font-bold">${state.walletAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </nav>
  );
}
