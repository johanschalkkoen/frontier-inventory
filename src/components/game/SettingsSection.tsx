import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SettingsSectionProps {
  onDeleteCharacter?: () => void;
}

function formatPlayTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

export function SettingsSection({ onDeleteCharacter }: SettingsSectionProps) {
  const { user, signOut } = useAuth();
  const { state } = useGame();
  const [deleteStep, setDeleteStep] = useState(0);

  const currentSessionTime = Math.floor((Date.now() - state.playTimeStart) / 1000);
  const totalTime = state.totalPlayTime + currentSessionTime;

  return (
    <div className="flex-1 max-w-[600px]">
      <h2 className="font-display text-xl font-bold text-accent mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        ⊕ SETTINGS
      </h2>

      {/* Account Info */}
      <div className="bg-game-slot/40 border-2 border-game-slot-border p-4 mb-4">
        <h3 className="font-display text-sm font-bold text-primary mb-2">⊷ ACCOUNT</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="text-foreground">{user?.email || 'Unknown'}</span>
          </div>
        </div>
        <button onClick={() => signOut()}
          className="mt-3 px-4 py-1.5 bg-secondary text-foreground text-xs font-bold border border-game-slot-border hover:bg-destructive/20 hover:border-destructive transition-colors">
          ▸ Sign Out
        </button>
      </div>

      {/* Play Time */}
      <div className="bg-game-slot/40 border-2 border-game-slot-border p-4 mb-4">
        <h3 className="font-display text-sm font-bold text-primary mb-2">◑ PLAY TIME</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center bg-game-slot/50 border border-game-slot-border p-2">
            <span className="text-[8px] text-muted-foreground block">THIS SESSION</span>
            <span className="text-accent font-bold text-sm">{formatPlayTime(currentSessionTime)}</span>
          </div>
          <div className="text-center bg-game-slot/50 border border-game-slot-border p-2">
            <span className="text-[8px] text-muted-foreground block">TOTAL PLAYED</span>
            <span className="text-accent font-bold text-sm">{formatPlayTime(totalTime)}</span>
          </div>
        </div>
      </div>

      {/* World Lore */}
      <div className="bg-game-slot/40 border-2 border-game-slot-border p-4 mb-4">
        <h3 className="font-display text-sm font-bold text-primary mb-2">≡ THE WORLD — 1885</h3>
        <p className="text-foreground/70 text-[10px] leading-relaxed">
          The year is 1885. The American frontier stretches from the dusty towns of Kansas to the wild peaks of Colorado and beyond.
          Outlaws roam the badlands, cattle drives cross the open plains, and fortunes are made and lost in gold rush camps.
          The railroad pushes westward, bringing civilization — and corruption — to untamed lands. Law is scarce and justice is often found at the end of a gun barrel.
          Your story begins in a small frontier town, where every stranger could be a friend or a threat.
        </p>
      </div>

      {/* Danger Zone */}
      <div className="bg-destructive/10 border-2 border-destructive/30 p-4">
        <h3 className="font-display text-sm font-bold text-destructive mb-2">⚠ DANGER ZONE</h3>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground font-bold text-xs hover:bg-destructive/80 transition-colors"
              onClick={() => setDeleteStep(0)}>
              <Trash2 className="w-4 h-4" /> Delete Character & Reset All Progress
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-game-container border-2 border-destructive/50">
            {deleteStep === 0 ? (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive font-display text-xl">⚠ Delete Character?</AlertDialogTitle>
                  <AlertDialogDescription className="text-foreground/80 space-y-2">
                    <p>This will <strong className="text-destructive">permanently destroy</strong> everything:</p>
                    <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                      <li>All items, equipment, and inventory</li>
                      <li>All progress, XP, and completed quests</li>
                      <li>All currency and wallet balance</li>
                      <li>Your character and archetype</li>
                    </ul>
                    <p className="text-xs text-destructive font-bold mt-2">THIS CANNOT BE UNDONE.</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-game-slot-border">Cancel</AlertDialogCancel>
                  <button onClick={() => setDeleteStep(1)}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
                    I understand, continue
                  </button>
                </AlertDialogFooter>
              </>
            ) : (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive font-display text-xl">⚠ Final Warning</AlertDialogTitle>
                  <AlertDialogDescription className="text-foreground/80">
                    <p>Are you <strong>absolutely sure</strong>? All data will be permanently erased.</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-game-slot-border">Keep my character</AlertDialogCancel>
                  <AlertDialogAction onClick={onDeleteCharacter}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Forever
                  </AlertDialogAction>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
