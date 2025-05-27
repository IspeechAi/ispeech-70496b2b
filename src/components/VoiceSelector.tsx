
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Volume2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Voice {
  id: string;
  name: string;
  gender: string;
  description: string;
  provider: string;
  sampleText: string;
}

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
}

const VoiceSelector = ({ selectedVoice, onVoiceChange }: VoiceSelectorProps) => {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const voices: Voice[] = [
    { id: 'alloy', name: 'Alloy', gender: 'Neutral', description: 'Balanced and clear', provider: 'OpenAI', sampleText: 'Hello, this is Alloy speaking with a clear and balanced voice.' },
    { id: 'echo', name: 'Echo', gender: 'Male', description: 'Deep and resonant', provider: 'OpenAI', sampleText: 'Hello, this is Echo with a deep and resonant voice tone.' },
    { id: 'fable', name: 'Fable', gender: 'Female', description: 'Storytelling voice', provider: 'OpenAI', sampleText: 'Hello, this is Fable, perfect for storytelling and narration.' },
    { id: 'onyx', name: 'Onyx', gender: 'Male', description: 'Strong and confident', provider: 'OpenAI', sampleText: 'Hello, this is Onyx speaking with strength and confidence.' },
    { id: 'nova', name: 'Nova', gender: 'Female', description: 'Bright and energetic', provider: 'OpenAI', sampleText: 'Hello, this is Nova with a bright and energetic voice.' },
    { id: 'shimmer', name: 'Shimmer', gender: 'Female', description: 'Soft and elegant', provider: 'OpenAI', sampleText: 'Hello, this is Shimmer speaking with a soft and elegant tone.' },
    { id: 'alice', name: 'Alice', gender: 'Female', description: 'Professional and warm', provider: 'ElevenLabs', sampleText: 'Hello, this is Alice with a professional and warm voice.' },
    { id: 'bill', name: 'Bill', gender: 'Male', description: 'Authoritative narrator', provider: 'ElevenLabs', sampleText: 'Hello, this is Bill, perfect for authoritative narration.' },
    { id: 'brian', name: 'Brian', gender: 'Male', description: 'Friendly and conversational', provider: 'ElevenLabs', sampleText: 'Hello, this is Brian speaking in a friendly, conversational tone.' },
    { id: 'charlie', name: 'Charlie', gender: 'Male', description: 'Youthful and energetic', provider: 'ElevenLabs', sampleText: 'Hello, this is Charlie with a youthful and energetic voice.' },
    { id: 'daniel', name: 'Daniel', gender: 'Male', description: 'Calm and reassuring', provider: 'ElevenLabs', sampleText: 'Hello, this is Daniel speaking with a calm and reassuring voice.' },
    { id: 'jessica', name: 'Jessica', gender: 'Female', description: 'Clear and articulate', provider: 'ElevenLabs', sampleText: 'Hello, this is Jessica with a clear and articulate speaking style.' },
    { id: 'liam', name: 'Liam', gender: 'Male', description: 'Rich and expressive', provider: 'ElevenLabs', sampleText: 'Hello, this is Liam with a rich and expressive voice quality.' },
    { id: 'matilda', name: 'Matilda', gender: 'Female', description: 'Mature and sophisticated', provider: 'ElevenLabs', sampleText: 'Hello, this is Matilda speaking with maturity and sophistication.' },
    { id: 'river', name: 'River', gender: 'Neutral', description: 'Natural and flowing', provider: 'ElevenLabs', sampleText: 'Hello, this is River with a natural and flowing speech pattern.' },
    { id: 'will', name: 'Will', gender: 'Male', description: 'Dynamic and engaging', provider: 'ElevenLabs', sampleText: 'Hello, this is Will speaking with a dynamic and engaging voice.' }
  ];

  const handlePlaySample = async (voice: Voice) => {
    try {
      // Stop currently playing audio
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        setAudioElement(null);
      }

      if (playingVoice === voice.id) {
        setPlayingVoice(null);
        return;
      }

      setPlayingVoice(voice.id);

      const { data, error } = await supabase.functions.invoke('tts-sample', {
        body: {
          text: voice.sampleText,
          voice: voice.id
        }
      });

      if (error) throw error;

      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        setAudioElement(audio);
        
        audio.onended = () => {
          setPlayingVoice(null);
          setAudioElement(null);
        };
        
        audio.onerror = () => {
          setPlayingVoice(null);
          setAudioElement(null);
          toast({
            title: "Playback Error",
            description: "Failed to play voice sample.",
            variant: "destructive",
          });
        };

        await audio.play();
      }
    } catch (error) {
      console.error('Sample playback error:', error);
      setPlayingVoice(null);
      toast({
        title: "Sample Failed",
        description: "Unable to play voice sample. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopPlayback = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      setAudioElement(null);
    }
    setPlayingVoice(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Select Voice
        </CardTitle>
        <p className="text-sm text-gray-600">
          Choose from our collection of AI voices and listen to samples
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {voices.map((voice) => (
            <div
              key={voice.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                selectedVoice === voice.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onVoiceChange(voice.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium">{voice.name}</h4>
                  <p className="text-xs text-gray-500">{voice.gender} • {voice.provider}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (playingVoice === voice.id) {
                      stopPlayback();
                    } else {
                      handlePlaySample(voice);
                    }
                  }}
                  className="h-8 w-8 p-0"
                >
                  {playingVoice === voice.id ? (
                    <Pause className="h-3 w-3" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-600">{voice.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSelector;
