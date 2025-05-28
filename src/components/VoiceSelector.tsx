
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, User, Sparkles } from 'lucide-react';
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
    // OpenAI Voices
    { id: 'alloy', name: 'Alloy', gender: 'Neutral', description: 'Balanced and clear', provider: 'OpenAI', sampleText: 'Hello, this is Alloy speaking with a clear and balanced voice.' },
    { id: 'echo', name: 'Echo', gender: 'Male', description: 'Deep and resonant', provider: 'OpenAI', sampleText: 'Hello, this is Echo with a deep and resonant voice tone.' },
    { id: 'fable', name: 'Fable', gender: 'Female', description: 'Storytelling voice', provider: 'OpenAI', sampleText: 'Hello, this is Fable, perfect for storytelling and narration.' },
    { id: 'onyx', name: 'Onyx', gender: 'Male', description: 'Strong and confident', provider: 'OpenAI', sampleText: 'Hello, this is Onyx speaking with strength and confidence.' },
    { id: 'nova', name: 'Nova', gender: 'Female', description: 'Bright and energetic', provider: 'OpenAI', sampleText: 'Hello, this is Nova with a bright and energetic voice.' },
    { id: 'shimmer', name: 'Shimmer', gender: 'Female', description: 'Soft and elegant', provider: 'OpenAI', sampleText: 'Hello, this is Shimmer speaking with a soft and elegant tone.' },
    
    // ElevenLabs Voices
    { id: 'alice', name: 'Alice', gender: 'Female', description: 'Professional and warm', provider: 'ElevenLabs', sampleText: 'Hello, this is Alice with a professional and warm voice.' },
    { id: 'bill', name: 'Bill', gender: 'Male', description: 'Authoritative narrator', provider: 'ElevenLabs', sampleText: 'Hello, this is Bill, perfect for authoritative narration.' },
    { id: 'brian', name: 'Brian', gender: 'Male', description: 'Friendly and conversational', provider: 'ElevenLabs', sampleText: 'Hello, this is Brian speaking in a friendly, conversational tone.' },
    { id: 'charlie', name: 'Charlie', gender: 'Male', description: 'Youthful and energetic', provider: 'ElevenLabs', sampleText: 'Hello, this is Charlie with a youthful and energetic voice.' },
    { id: 'daniel', name: 'Daniel', gender: 'Male', description: 'Calm and reassuring', provider: 'ElevenLabs', sampleText: 'Hello, this is Daniel speaking with a calm and reassuring voice.' },
    { id: 'jessica', name: 'Jessica', gender: 'Female', description: 'Clear and articulate', provider: 'ElevenLabs', sampleText: 'Hello, this is Jessica with a clear and articulate speaking style.' },
    { id: 'liam', name: 'Liam', gender: 'Male', description: 'Rich and expressive', provider: 'ElevenLabs', sampleText: 'Hello, this is Liam with a rich and expressive voice quality.' },
    { id: 'matilda', name: 'Matilda', gender: 'Female', description: 'Mature and sophisticated', provider: 'ElevenLabs', sampleText: 'Hello, this is Matilda speaking with maturity and sophistication.' },
    { id: 'river', name: 'River', gender: 'Neutral', description: 'Natural and flowing', provider: 'ElevenLabs', sampleText: 'Hello, this is River with a natural and flowing speech pattern.' },
    { id: 'will', name: 'Will', gender: 'Male', description: 'Dynamic and engaging', provider: 'ElevenLabs', sampleText: 'Hello, this is Will speaking with a dynamic and engaging voice.' },
    { id: 'adam', name: 'Adam', gender: 'Male', description: 'Professional clarity', provider: 'ElevenLabs', sampleText: 'Hello, this is Adam with professional clarity and warmth.' },
    { id: 'rachel', name: 'Rachel', gender: 'Female', description: 'Expressive storyteller', provider: 'ElevenLabs', sampleText: 'Hello, this is Rachel, perfect for expressive storytelling and narration.' }
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

  const getProviderBadge = (provider: string) => {
    const colors = {
      'OpenAI': 'bg-green-500/20 text-green-400 border-green-500/30',
      'ElevenLabs': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Azure': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Google': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Amazon': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return colors[provider as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 shadow-xl shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Volume2 className="h-5 w-5 text-purple-400" />
          Select Voice
        </CardTitle>
        <p className="text-gray-400">
          Choose from our collection of AI voices or use your custom clones
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="default" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-purple-500/30">
            <TabsTrigger value="default" className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Default Voices
            </TabsTrigger>
            <TabsTrigger value="my-voices" className="flex items-center gap-2 text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <User className="h-4 w-4" />
              My Voices ({myVoices.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="default" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {defaultVoices.map((voice) => (
                <div
                  key={voice.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedVoice === voice.id
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                      : 'border-purple-500/30 bg-slate-800/30 hover:border-purple-500/50 hover:bg-slate-800/50'
                  }`}
                  onClick={() => onVoiceChange(voice.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white">{voice.name}</h4>
                        <Badge variant="secondary" className={`text-xs ${getProviderBadge(voice.provider)}`}>
                          {voice.provider}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400">{voice.gender}</p>
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
                      className="h-8 w-8 p-0 hover:bg-purple-500/20"
                    >
                      {playingVoice === voice.id ? (
                        <Pause className="h-3 w-3 text-purple-400" />
                      ) : (
                        <Play className="h-3 w-3 text-purple-400" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-300">{voice.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-voices" className="mt-4">
            {isLoadingMyVoices ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-400">Loading your voices...</p>
              </div>
            ) : myVoices.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 mb-2">No custom voices yet</p>
                <p className="text-sm text-gray-500">Create voice clones in the Settings page</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {myVoices.map((voiceClone) => (
                  <div
                    key={voiceClone.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedVoice === `clone_${voiceClone.id}`
                        ? 'border-cyan-500 bg-cyan-500/20 shadow-lg shadow-cyan-500/25'
                        : 'border-purple-500/30 bg-slate-800/30 hover:border-cyan-500/50 hover:bg-slate-800/50'
                    }`}
                    onClick={() => handlePlayMyVoice(voiceClone)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center gap-2 text-white">
                          <Sparkles className="h-4 w-4 text-cyan-400" />
                          {voiceClone.name}
                        </h4>
                        <Badge variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                          Custom Clone
                        </Badge>
                      </div>
                    </div>
                    {voiceClone.description && (
                      <p className="text-xs text-gray-300">{voiceClone.description}</p>
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
