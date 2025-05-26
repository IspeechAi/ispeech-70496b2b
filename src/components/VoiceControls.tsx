
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

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
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  const voices = [
    { id: 'alloy', name: 'Alloy', type: 'neutral', sample: 'Hello! I am Alloy, a neutral voice perfect for professional content.' },
    { id: 'echo', name: 'Echo', type: 'male', sample: 'Hi there! I am Echo, a clear male voice with excellent pronunciation.' },
    { id: 'fable', name: 'Fable', type: 'male', sample: 'Greetings! I am Fable, a warm male voice ideal for storytelling.' },
    { id: 'onyx', name: 'Onyx', type: 'male', sample: 'Hello! I am Onyx, a deep male voice with rich tones.' },
    { id: 'nova', name: 'Nova', type: 'female', sample: 'Hi! I am Nova, a friendly female voice perfect for conversations.' },
    { id: 'shimmer', name: 'Shimmer', type: 'female', sample: 'Hello! I am Shimmer, a gentle female voice with soft tones.' },
    { id: 'alice', name: 'Alice', type: 'female', sample: 'Hi! I am Alice, a bright female voice full of energy.' },
    { id: 'bill', name: 'Bill', type: 'male', sample: 'Hello! I am Bill, a mature male voice with authority.' },
    { id: 'brian', name: 'Brian', type: 'male', sample: 'Hi there! I am Brian, a friendly male voice for everyday use.' },
    { id: 'charlie', name: 'Charlie', type: 'male', sample: 'Hello! I am Charlie, a youthful male voice with enthusiasm.' },
    { id: 'daniel', name: 'Daniel', type: 'male', sample: 'Greetings! I am Daniel, a professional male voice for business.' },
    { id: 'jessica', name: 'Jessica', type: 'female', sample: 'Hi! I am Jessica, a sophisticated female voice with elegance.' },
    { id: 'liam', name: 'Liam', type: 'male', sample: 'Hello! I am Liam, a casual male voice perfect for informal content.' },
    { id: 'matilda', name: 'Matilda', type: 'female', sample: 'Hi there! I am Matilda, a cheerful female voice with character.' },
    { id: 'river', name: 'River', type: 'neutral', sample: 'Hello! I am River, a calm neutral voice for meditation and relaxation.' },
    { id: 'will', name: 'Will', type: 'male', sample: 'Hi! I am Will, a confident male voice for presentations.' }
  ];

  const providers = [
    { id: 'auto', name: 'Auto-Select Best' },
    { id: 'elevenlabs', name: 'ElevenLabs' },
    { id: 'openai', name: 'OpenAI' },
    { id: 'azure', name: 'Azure' },
    { id: 'google', name: 'Google' }
  ];

  const playVoiceSample = async (voice: any) => {
    if (playingVoice === voice.id) {
      setPlayingVoice(null);
      return;
    }

    setPlayingVoice(voice.id);
    
    try {
      const response = await fetch('/api/tts-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: voice.sample,
          voice: voice.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const audio = new Audio(data.audioUrl);
        
        audio.onended = () => setPlayingVoice(null);
        audio.onerror = () => setPlayingVoice(null);
        
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing voice sample:', error);
      setPlayingVoice(null);
    }
  };

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
                <div className="flex items-center justify-between w-full">
                  <span>{voice.name} ({voice.type})</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      playVoiceSample(voice);
                    }}
                  >
                    {playingVoice === voice.id ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                </div>
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
