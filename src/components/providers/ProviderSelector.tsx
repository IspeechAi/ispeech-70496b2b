
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type Provider = 'openai' | 'elevenlabs' | 'playht' | 'fishaudio';

interface ProviderSelectorProps {
  value: Provider;
  onValueChange: (value: Provider) => void;
}

const providers = [
  { value: 'openai' as const, label: 'OpenAI TTS' },
  { value: 'elevenlabs' as const, label: 'ElevenLabs' },
  { value: 'playht' as const, label: 'PlayHT' },
  { value: 'fishaudio' as const, label: 'Fish Audio' },
];

export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">Provider</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="bg-white/10 border-white/20 text-white">
          <SelectValue placeholder="Select a provider" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-white/20">
          {providers.map((provider) => (
            <SelectItem
              key={provider.value}
              value={provider.value}
              className="text-white hover:bg-white/10"
            >
              {provider.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
