import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

export function UserBadge() {
  const { profile, signOut, user } = useAuth();

  if (!user) return null;

  const name = profile?.display_name || user.email || 'Outlaw';
  const avatar = profile?.avatar_url;

  return (
    <div className="flex items-center gap-2">
      {avatar ? (
        <img src={avatar} alt={name} className="w-7 h-7 rounded-full border border-primary" width={28} height={28} />
      ) : (
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="text-foreground text-[10px] font-bold max-w-[80px] truncate">{name}</span>
      <button onClick={signOut} className="text-muted-foreground hover:text-destructive transition-colors" title="Sign out">
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
