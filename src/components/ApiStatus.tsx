import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
const ApiStatus = () => {
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-3xl font-medium text-green-950 text-center">
          <Settings className="h-5 w-5" />
          API Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">ElevenLabs</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">OpenAI</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Azure</span>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default ApiStatus;