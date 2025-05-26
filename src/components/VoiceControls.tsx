
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VoiceControlsProps {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  selectedProvider: string;
  setSelectedProvider: (provider: string) => void;
}

const VoiceControls = ({ 
  selectedVoice, 
  setSelectedVoice, 
  selectedProvider, 
  setSelectedProvider 
}: VoiceControlsProps) => {
  const voices = [
    { id: 'alloy', name: 'Alloy', type: 'neutral' },
    { id: 'echo', name: 'Echo', type: 'male' },
    { id: 'fable', name: 'Fable', type: 'male' },
    { id: 'onyx', name: 'Onyx', type: 'male' },
    { id: 'nova', name: 'Nova', type: 'female' },
    { id: 'shimmer', name: 'Shimmer', type: 'female' }
  ];

  const providers = [
    { id: 'auto', name: 'Auto-Select Best' },
    { id: 'elevenlabs', name: 'ElevenLabs' },
    { id: 'openai', name: 'OpenAI' },
    { id: 'azure', name: 'Azure' },
    { id: 'google', name: 'Google' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Voice</label>
        <Select value={selectedVoice} onValueChange={setSelectedVoice}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice) => (
              <SelectItem key={voice.id} value={voice.id}>
                {voice.name} ({voice.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Provider</label>
        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VoiceControls;
