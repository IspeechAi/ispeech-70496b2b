
import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, User, LogOut, Settings as SettingsIcon, History as HistoryIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-blue-900/40">
      <nav className="border-b border-purple-500/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Volume2 className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  iSpeech
                </span>
              </Link>
              
              <div className="hidden md:flex ml-10 space-x-8">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/tts"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/tts') 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
                  }`}
                >
                  Voice Studio
                </Link>
                <Link
                  to="/about"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/about') 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
                  }`}
                >
                  About
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/history"
                    className="text-gray-300 hover:text-white p-2 rounded-md hover:bg-purple-500/10 transition-colors"
                  >
                    <HistoryIcon className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/settings"
                    className="text-gray-300 hover:text-white p-2 rounded-md hover:bg-purple-500/10 transition-colors"
                  >
                    <SettingsIcon className="h-5 w-5" />
                  </Link>
                  <Button
                    onClick={() => signOut()}
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-purple-500/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
