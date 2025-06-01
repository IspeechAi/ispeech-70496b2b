
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Mic2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      clearAuth();
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md border-b border-purple-500/20 shadow-lg shadow-purple-500/10">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Animated Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-300 animate-pulse"></div>
              <div className="relative p-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transform group-hover:scale-110 transition-transform duration-300">
                <Mic2 className="h-6 w-6 text-white animate-bounce" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-cyan-400 transition-all duration-500">
                iSPEECH
              </h1>
              <span className="text-xs text-gray-400 -mt-1">AI Voice Platform</span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full border border-purple-500/30">
                  <User className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-gray-300">{user.email}</span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-purple-600/30 border border-transparent hover:border-purple-500/50 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-purple-600/30 border border-transparent hover:border-purple-500/50 transition-all duration-300"
                >
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                >
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
