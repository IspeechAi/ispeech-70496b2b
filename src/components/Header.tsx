
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useUserCredits } from '@/hooks/useUserCredits';
import { LogOut, Coins } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuthStore();
  const { credits, loading } = useUserCredits();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) return null;

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">iSpeech</h1>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
            <Coins className="h-4 w-4 text-yellow-400" />
            <span className="text-white font-medium">
              {loading ? '...' : credits} credits
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-white/80 text-sm">{user.email}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
