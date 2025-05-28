
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, User, LogOut, History, Settings } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <Volume2 className="h-8 w-8 text-purple-600 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ISPEECH
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={location.pathname === '/tts' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => navigate('/tts')} 
                    className="flex items-center gap-2"
                  >
                    <Volume2 className="h-4 w-4" />
                    TTS Generator
                  </Button>
                  <Button 
                    variant={location.pathname === '/history' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => navigate('/history')} 
                    className="flex items-center gap-2"
                  >
                    <History className="h-4 w-4" />
                    History
                  </Button>
                  <Button 
                    variant={location.pathname === '/settings' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => navigate('/settings')} 
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  Welcome, {user.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut} 
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')} 
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
