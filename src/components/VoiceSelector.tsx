
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Volume2, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { VoiceClone } from '@/types/voiceClones';

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
  const [myVoices, setMyVoices] = useState<VoiceClone[]>([]);
  const [isLoadingMyVoices, setIsLoadingMyVoices] = useState(true);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const defaultVoices: Voice[] = [
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

  React.useEffect(() => {
    if (user) {
      fetchMyVoices();
    }
  }, [user]);

  const fetchMyVoices = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('voice_clones')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'ready')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyVoices(data || []);
    } catch (error) {
      console.error('Error fetching my voices:', error);
    } finally {
      setIsLoadingMyVoices(false);
    }
  };

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

  const handlePlayMyVoice = (voiceClone: VoiceClone) => {
    // For now, just show a message since we'd need the actual audio file
    toast({
      title: "Voice Clone Selected",
      description: `Selected your custom voice: ${voiceClone.name}`,
    });
    onVoiceChange(`clone_${voiceClone.id}`);
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
          Choose from our collection of AI voices or use your custom clones
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="default" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="default">Default Voices</TabsTrigger>
            <TabsTrigger value="my-voices" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              My Voices ({myVoices.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="default" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {defaultVoices.map((voice) => (
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
          </TabsContent>

          <TabsContent value="my-voices" className="mt-4">
            {isLoadingMyVoices ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading your voices...</p>
              </div>
            ) : myVoices.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-2">No custom voices yet</p>
                <p className="text-sm text-gray-400">Create voice clones in the Settings page</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {myVoices.map((voiceClone) => (
                  <div
                    key={voiceClone.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedVoice === `clone_${voiceClone.id}`
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePlayMyVoice(voiceClone)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <User className="h-3 w-3 text-purple-600" />
                          {voiceClone.name}
                        </h4>
                        <p className="text-xs text-gray-500">Custom Clone</p>
                      </div>
                    </div>
                    {voiceClone.description && (
                      <p className="text-xs text-gray-600">{voiceClone.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VoiceSelector;
