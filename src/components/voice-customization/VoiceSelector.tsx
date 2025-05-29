
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { voiceConfigs, VoiceConfig } from '@/config/voiceConfigs';

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
}

const VoiceSelector = ({ selectedVoice, onVoiceChange }: VoiceSelectorProps) => {
  const getProviderBadge = (provider: string) => {
    const colors = {
      'ElevenLabs': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'OpenAI': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Fish Audio': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    };
    return colors[provider as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const groupedVoices = voiceConfigs.reduce((acc, voice) => {
    if (!acc[voice.provider]) {
      acc[voice.provider] = [];
    }
    acc[voice.provider].push(voice);
    return acc;
  }, {} as Record<string, VoiceConfig[]>);

  return (
    <div>
      <Label className="text-gray-300 mb-3 block">Select Voice</Label>
      <Select value={selectedVoice} onValueChange={onVoiceChange}>
        <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white focus:border-purple-400">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-purple-500/50">
          {Object.entries(groupedVoices).map(([provider, voices]) => (
            <div key={provider}>
              <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {provider}
              </div>
              {voices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id} className="text-gray-300 focus:bg-purple-500/20">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <span className="font-medium">{voice.name}</span>
                      <span className="text-xs text-gray-500">{voice.gender} • {voice.category}</span>
                    </div>
                    <Badge variant="secondary" className={`ml-2 ${getProviderBadge(voice.provider)}`}>
                      {voice.provider}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VoiceSelector;
