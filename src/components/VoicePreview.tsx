
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Voice {
  id: string;
  name: string;
  gender: string;
  description: string;
  provider: string;
  sampleText: string;
}

const VoicePreview = () => {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const previewVoices: Voice[] = [
    { id: 'alloy', name: 'Alloy', gender: 'Neutral', description: 'Balanced and clear', provider: 'OpenAI', sampleText: 'Welcome to iSpeech! This is Alloy speaking with a clear and balanced voice perfect for any content.' },
    { id: 'echo', name: 'Echo', gender: 'Male', description: 'Deep and resonant', provider: 'OpenAI', sampleText: 'Hello there! This is Echo with a deep and resonant voice tone that commands attention.' },
    { id: 'nova', name: 'Nova', gender: 'Female', description: 'Bright and energetic', provider: 'OpenAI', sampleText: 'Hi everyone! This is Nova with a bright and energetic voice that brings content to life!' },
    { id: 'alice', name: 'Alice', gender: 'Female', description: 'Professional and warm', provider: 'ElevenLabs', sampleText: 'Hello! This is Alice speaking with a professional and warm voice, perfect for business content.' },
    { id: 'brian', name: 'Brian', gender: 'Male', description: 'Friendly and conversational', provider: 'ElevenLabs', sampleText: 'Hey there! This is Brian speaking in a friendly, conversational tone that feels natural and engaging.' },
    { id: 'charlie', name: 'Charlie', gender: 'Male', description: 'Youthful and energetic', provider: 'ElevenLabs', sampleText: 'What\'s up! This is Charlie with a youthful and energetic voice that\'s great for dynamic content.' }
  ];

  const handlePlayPreview = async (voice: Voice) => {
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
            description: "Failed to play voice preview.",
            variant: "destructive",
          });
        };

        await audio.play();
      }
    } catch (error) {
      console.error('Preview playback error:', error);
      setPlayingVoice(null);
      toast({
        title: "Preview Failed",
        description: "Unable to play voice preview. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-200">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-purple-800">
            <Volume2 className="h-6 w-6" />
            Try Our Voices
          </CardTitle>
          <p className="text-gray-600">
            Listen to our diverse collection of AI voices to find the perfect match for your content
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewVoices.map((voice) => (
              <Card 
                key={voice.id} 
                className="hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-purple-300"
              >
                <CardContent className="pt-4">
                  <div className="text-center space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{voice.name}</h4>
                      <p className="text-sm text-gray-500">{voice.gender} • {voice.provider}</p>
                      <p className="text-xs text-gray-400 mt-1">{voice.description}</p>
                    </div>
                    
                    <Button
                      onClick={() => handlePlayPreview(voice)}
                      variant={playingVoice === voice.id ? "destructive" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      {playingVoice === voice.id ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Preview
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoicePreview;
