
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Volume2, 
  Settings, 
  History, 
  Key, 
  Mic, 
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'TTS Generator',
      icon: Volume2,
      path: '/tts',
      description: 'Text to Speech'
    },
    {
      title: 'History',
      icon: History,
      path: '/history',
      description: 'Generation History'
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
      description: 'App Settings'
    }
  ];

  const settingsSubItems = [
    {
      title: 'API Keys',
      icon: Key,
      path: '/settings?tab=api-keys',
      description: 'Manage API Keys'
    },
    {
      title: 'Voice Cloning',
      icon: Mic,
      path: '/settings?tab=voice-cloning',
      description: 'Clone Voices'
    },
    {
      title: 'Voice Changer',
      icon: RefreshCw,
      path: '/settings?tab=voice-changer',
      description: 'Change Voice'
    }
  ];

  const isActivePath = (path: string) => {
    if (path === '/settings') {
      return location.pathname === '/settings';
    }
    return location.pathname === path || location.search.includes(path.split('?')[1]);
  };

  return (
    <div className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="absolute -right-3 top-4 h-6 w-6 rounded-full border bg-white shadow-md hover:bg-gray-50"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.path);
          
          return (
            <div key={item.path}>
              <Link to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="text-left">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  )}
                </Button>
              </Link>

              {/* Settings Sub-items */}
              {item.path === '/settings' && !isCollapsed && isActive && (
                <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                  {settingsSubItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = isActivePath(subItem.path);
                    
                    return (
                      <Link key={subItem.path} to={subItem.path}>
                        <Button
                          variant={isSubActive ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start gap-2 h-10"
                        >
                          <SubIcon className="h-4 w-4" />
                          <div className="text-left">
                            <div className="text-sm">{subItem.title}</div>
                            <div className="text-xs text-muted-foreground">{subItem.description}</div>
                          </div>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
