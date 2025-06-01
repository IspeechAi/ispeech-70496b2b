
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Voice } from '@/types/providers';
import { Sparkles, Play, Volume2 } from 'lucide-react';

interface VoiceDropdownProps {
  voices: Voice[];
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
  onPreviewVoice?: (voice: Voice) => void;
}

const VoiceDropdown = ({ voices, selectedVoice, onVoiceChange, onPreviewVoice }: VoiceDropdownProps) => {
  const groupedVoices = voices.reduce((acc, voice) => {
    if (!acc[voice.provider]) {
      acc[voice.provider] = [];
    }
    acc[voice.provider].push(voice);
    return acc;
  }, {} as Record<string, Voice[]>);

  const getProviderBadge = (provider: string) => {
    const colors = {
      'elevenlabs': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'playht': 'bg-green-500/20 text-green-400 border-green-500/30',
      'fishaudio': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'voicelab': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };
    return colors[provider as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getProviderName = (provider: string) => {
    const names = {
      'elevenlabs': 'ElevenLabs',
      'playht': 'PlayHT',
      'fishaudio': 'Fish Audio',
      'voicelab': 'Voicelab',
    };
    return names[provider as keyof typeof names] || provider;
  };

  if (voices.length === 0) {
    return (
      <div className="p-8 text-center border border-purple-500/30 rounded-lg bg-slate-800/30">
        <Volume2 className="h-12 w-12 mx-auto mb-4 text-gray-500" />
        <p className="text-gray-400 mb-2">No voices available</p>
        <p className="text-sm text-gray-500">Add API keys to access voices</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Select value={selectedVoice} onValueChange={onVoiceChange}>
        <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white focus:border-purple-400">
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-purple-500/50 max-h-80">
          {Object.entries(groupedVoices).map(([provider, providerVoices]) => (
            <div key={provider}>
              <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                {getProviderName(provider)}
              </div>
              {providerVoices.map((voice) => (
                <SelectItem 
                  key={voice.id} 
                  value={voice.id}
                  className="text-gray-300 focus:bg-purple-500/20 cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {voice.isCloned && (
                        <Sparkles className="h-3 w-3 text-cyan-400" />
                      )}
                      <span className="font-medium">{voice.name}</span>
                      {voice.gender && (
                        <span className="text-xs text-gray-500">({voice.gender})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getProviderBadge(voice.provider)}`}
                      >
                        {getProviderName(voice.provider)}
                      </Badge>
                      {onPreviewVoice && voice.preview_url && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreviewVoice(voice);
                          }}
                          className="p-1 hover:bg-purple-500/20 rounded"
                        >
                          <Play className="h-3 w-3 text-purple-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
      
      {selectedVoice && (
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Selected: {voices.find(v => v.id === selectedVoice)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceDropdown;
