
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { useApiKeys } from '@/hooks/useApiKeys';
import { isApiKeySet } from '@/utils/apiKeyStatus';

interface ProviderSelectorProps {
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
  userApiKeys: any[];
}

const ProviderSelector = ({ selectedProvider, onProviderChange, userApiKeys }: ProviderSelectorProps) => {
  const providers = [
    { 
      id: 'auto', 
      name: 'Auto (Best Available)', 
      description: 'Automatically selects the best available provider',
      requiresKey: false 
    },
    { 
      id: 'elevenlabs', 
      name: 'ElevenLabs', 
      description: 'Premium voice synthesis with emotion control',
      requiresKey: true 
    },
    { 
      id: 'openai', 
      name: 'OpenAI', 
      description: 'Natural-sounding voices with fast generation',
      requiresKey: true 
    },
    { 
      id: 'fishaudio', 
      name: 'Fish Audio', 
      description: 'Advanced voice cloning and synthesis',
      requiresKey: true 
    },
    { 
      id: 'azure', 
      name: 'Azure Cognitive Services', 
      description: 'Microsoft\'s enterprise TTS solution',
      requiresKey: true 
    },
    { 
      id: 'amazon_polly', 
      name: 'Amazon Polly', 
      description: 'AWS text-to-speech with neural voices',
      requiresKey: true 
    }
  ];

  const getProviderStatus = (provider: any) => {
    if (!provider.requiresKey) return 'available';
    return isApiKeySet(provider.id, userApiKeys) ? 'configured' : 'needs-key';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'configured':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'needs-key':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'configured':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Ready</Badge>;
      case 'needs-key':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Needs API Key</Badge>;
      default:
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">Available</Badge>;
    }
  };

  return (
    <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 shadow-xl shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="h-5 w-5 text-purple-400" />
          Voice Provider
        </CardTitle>
        <p className="text-gray-400">
          Choose which TTS provider to use for voice generation
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedProvider} onValueChange={onProviderChange}>
          <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white focus:border-purple-400">
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-purple-500/50">
            {providers.map((provider) => {
              const status = getProviderStatus(provider);
              return (
                <SelectItem 
                  key={provider.id} 
                  value={provider.id}
                  className="text-gray-300 focus:bg-purple-500/20"
                  disabled={status === 'needs-key' && provider.id !== 'auto'}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{provider.name}</span>
                        {getStatusIcon(status)}
                      </div>
                      <span className="text-xs text-gray-500">{provider.description}</span>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Provider Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {providers.slice(1).map((provider) => {
            const status = getProviderStatus(provider);
            return (
              <div 
                key={provider.id} 
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-purple-500/20"
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <span className="text-sm text-gray-300">{provider.name}</span>
                </div>
                {getStatusBadge(status)}
              </div>
            );
          })}
        </div>

        {selectedProvider !== 'auto' && getProviderStatus(providers.find(p => p.id === selectedProvider)) === 'needs-key' && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <span className="font-medium text-yellow-300">API Key Required</span>
            </div>
            <p className="text-sm text-yellow-200">
              Please enter your API key for {providers.find(p => p.id === selectedProvider)?.name} in Settings to use this provider.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProviderSelector;
