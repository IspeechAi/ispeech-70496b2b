
import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {user && (
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
      )}
      <main className={cn(
        "pt-16", // Account for fixed header
        user && "transition-all duration-300",
        user && (sidebarCollapsed ? "ml-16" : "ml-64")
      )}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
