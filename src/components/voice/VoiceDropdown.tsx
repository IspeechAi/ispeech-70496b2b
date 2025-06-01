
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Voice } from '@/types/providers';

interface VoiceDropdownProps {
  voices: Voice[];
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
}

const VoiceDropdown = ({ voices, selectedVoice, onVoiceChange }: VoiceDropdownProps) => {
  if (voices.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400 bg-slate-800/30 rounded-lg border border-purple-500/30">
        <p className="text-sm">No voices available</p>
        <p className="text-xs mt-1">Please add API keys to load voices</p>
      </div>
    );
  }

  // Group voices by provider
  const groupedVoices = voices.reduce((acc, voice) => {
    if (!acc[voice.provider]) {
      acc[voice.provider] = [];
    }
    acc[voice.provider].push(voice);
    return acc;
  }, {} as Record<string, Voice[]>);

  return (
    <Select value={selectedVoice} onValueChange={onVoiceChange}>
      <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
        <SelectValue placeholder="Select a voice" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-purple-500/30 max-h-80">
        {Object.entries(groupedVoices).map(([provider, providerVoices]) => (
          <div key={provider}>
            <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-600 mb-1">
              {provider}
            </div>
            {providerVoices.map((voice) => (
              <SelectItem key={voice.id} value={voice.id} className="text-gray-300 focus:bg-purple-500/20">
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-medium">{voice.name}</span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {voice.gender && <span>{voice.gender}</span>}
                      {voice.language && <span>• {voice.language}</span>}
                    </div>
                  </div>
                  {voice.isCloned && (
                    <Badge variant="secondary" className="ml-2 bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                      Cloned
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VoiceDropdown;
