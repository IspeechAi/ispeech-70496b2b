
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import GalaxyBackground from '@/components/galaxy/GalaxyBackground';

const Settings = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GalaxyBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-300">
              <SettingsIcon className="h-6 w-6" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-center py-12">
              Account settings and preferences will be available here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
