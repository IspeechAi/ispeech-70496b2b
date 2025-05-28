
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Volume2, 
  Upload, 
  RefreshCw, 
  History, 
  Key, 
  Settings, 
  Sliders,
  Menu,
  X,
  Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Voices',
      href: '/tts',
      icon: Volume2,
      description: 'Text to Speech'
    },
    {
      title: 'Voice Cloning',
      href: '/settings?tab=voice-cloning',
      icon: Upload,
      description: 'Clone Custom Voices'
    },
    {
      title: 'Voice Changer',
      href: '/settings?tab=voice-changer',
      icon: RefreshCw,
      description: 'Transform Audio Files'
    },
    {
      title: 'Customization',
      href: '/settings?tab=customization',
      icon: Sliders,
      description: 'Voice Parameters'
    },
    {
      title: 'History',
      href: '/history',
      icon: History,
      description: 'Generated Audio'
    },
    {
      title: 'API Keys',
      href: '/settings?tab=api-keys',
      icon: Key,
      description: 'Provider Configuration'
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'App Configuration'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/tts') {
      return location.pathname === '/tts' || location.pathname === '/';
    }
    return location.pathname === href || location.search.includes(href.split('?')[1]);
  };

  return (
    <div className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-purple-900 to-blue-900 border-r border-purple-700 transition-all duration-300 z-40",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-white hover:bg-purple-700/50"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Brand Section */}
      <div className="px-4 py-2 border-b border-purple-700/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Mic className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-white">iSpeech</h2>
              <p className="text-xs text-purple-200">Voice Processing</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                active 
                  ? "bg-purple-600 text-white shadow-lg" 
                  : "text-purple-100 hover:bg-purple-700/50 hover:text-white",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 flex-shrink-0",
                active ? "text-white" : "text-purple-200 group-hover:text-white"
              )} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-purple-200 group-hover:text-purple-100">
                    {item.description}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-purple-700/50">
          <div className="text-xs text-purple-200 text-center">
            <p>© 2024 iSpeech</p>
            <p>Voice Processing Platform</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
