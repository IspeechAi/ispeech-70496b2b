
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Key, Upload, Sliders } from 'lucide-react';
import ApiKeysManager from '@/components/ApiKeysManager';
import VoiceCloning from '@/components/VoiceCloning';
import VoiceCustomization from '@/components/VoiceCustomization';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your API keys, voice cloning, and customization options
          </p>
        </div>

        <Tabs defaultValue="api-keys" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="voice-cloning" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Voice Cloning
            </TabsTrigger>
            <TabsTrigger value="customization" className="flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              Voice Customization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys">
            <ApiKeysManager />
          </TabsContent>

          <TabsContent value="voice-cloning">
            <VoiceCloning />
          </TabsContent>

          <TabsContent value="customization">
            <VoiceCustomization />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
