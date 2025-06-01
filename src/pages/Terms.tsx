
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GalaxyBackground from '@/components/galaxy/GalaxyBackground';

const Terms = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GalaxyBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="text-cyan-300">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-300 space-y-4">
              <p>Welcome to iSpeech. By using our service, you agree to these terms.</p>
              <h3 className="text-lg font-semibold text-white">Use of Service</h3>
              <p>You may use iSpeech for legitimate voice generation purposes only.</p>
              <h3 className="text-lg font-semibold text-white">API Keys</h3>
              <p>You are responsible for keeping your API keys secure and for all usage under your account.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
