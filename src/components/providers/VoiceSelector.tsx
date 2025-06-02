
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Provider } from './ProviderSelector';

interface Voice {
  id: string;
  name: string;
}

interface VoiceSelectorProps {
  provider: Provider;
  value: string;
  onValueChange: (value: string) => void;
  voices: Voice[];
  loading: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  provider,
  value,
  onValueChange,
  voices,
  loading,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">Voice</label>
      <Select value={value} onValueChange={onValueChange} disabled={loading || voices.length === 0}>
        <SelectTrigger className="bg-white/10 border-white/20 text-white">
          <SelectValue 
            placeholder={loading ? "Loading voices..." : "Select a voice"} 
          />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-white/20">
          {voices.map((voice) => (
            <SelectItem
              key={voice.id}
              value={voice.id}
              className="text-white hover:bg-white/10"
            >
              {voice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
