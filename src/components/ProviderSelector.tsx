
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';

interface ProviderSelectorProps {
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
  userApiKeys: any[];
}

const ProviderSelector = ({ selectedProvider, onProviderChange, userApiKeys }: ProviderSelectorProps) => {
  const providers = [
    { id: 'auto', name: 'Auto (Best Available)', description: 'Automatically selects the best provider' },
    { id: 'elevenlabs', name: 'ElevenLabs', description: 'High-quality voice synthesis' },
    { id: 'openai', name: 'OpenAI', description: 'Natural-sounding voices' },
    { id: 'azure', name: 'Azure Cognitive Services', description: 'Microsoft\'s TTS service' },
    { id: 'google', name: 'Google Cloud TTS', description: 'Google\'s text-to-speech' },
    { id: 'amazon_polly', name: 'Amazon Polly', description: 'AWS text-to-speech service' }
  ];

  const availableProviders = providers.filter(provider => {
    if (provider.id === 'auto') return true;
    return userApiKeys.some(key => key.provider === provider.id);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Choose Provider
        </CardTitle>
        <p className="text-sm text-gray-600">
          Select which TTS provider to use for generation
        </p>
      </CardHeader>
      <CardContent>
        <Select value={selectedProvider} onValueChange={onProviderChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {availableProviders.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                <div>
                  <div className="font-medium">{provider.name}</div>
                  <div className="text-xs text-gray-500">{provider.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {availableProviders.length === 1 && (
          <p className="text-sm text-amber-600 mt-2">
            Add API keys in Settings to access more providers
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProviderSelector;
