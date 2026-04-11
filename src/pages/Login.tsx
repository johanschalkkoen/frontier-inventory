import { lovable } from '@/integrations/lovable';
import { useState } from 'react';

export function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setLoading(provider);
    setError(null);
    try {
      const result = await lovable.auth.signInWithOAuth(provider);
      if (result.error) {
        setError(result.error.message || 'Sign-in failed. Please try again.');
      }
    } catch (e) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-game-container border-4 border-game-slot shadow-[0_0_50px_rgba(0,0,0,0.8)] p-8">
        <h1 className="font-display text-3xl font-black text-accent tracking-wider text-center mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
          Frontier Legend
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Sign in to save your progress
        </p>

        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive-foreground text-sm p-3 mb-4 text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleOAuth('google')}
            disabled={!!loading}
            className="flex items-center justify-center gap-3 w-full py-3 bg-game-panel border-2 border-game-slot-border text-foreground font-bold text-sm hover:border-primary hover:bg-secondary transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading === 'google' ? 'Signing in...' : 'Continue with Google'}
          </button>

          <button
            onClick={() => handleOAuth('apple')}
            disabled={!!loading}
            className="flex items-center justify-center gap-3 w-full py-3 bg-game-panel border-2 border-game-slot-border text-foreground font-bold text-sm hover:border-primary hover:bg-secondary transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            {loading === 'apple' ? 'Signing in...' : 'Continue with Apple'}
          </button>
        </div>

        <p className="text-center text-muted-foreground text-[10px] mt-6">
          By signing in, your game progress will be saved automatically.
        </p>
      </div>
    </div>
  );
}
