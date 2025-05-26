
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Volume2, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TTSHistory from '@/components/TTSHistory';
import ApiKeysManager from '@/components/ApiKeysManager';
import TextInput from '@/components/TextInput';
import VoiceControls from '@/components/VoiceControls';
import VoiceSettings from '@/components/VoiceSettings';
import AudioPlayer from '@/components/AudioPlayer';
import ApiStatus from '@/components/ApiStatus';
import UsageStats from '@/components/UsageStats';
import { useAuthStore } from '@/stores/authStore';

const TTS = () => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [selectedProvider, setSelectedProvider] = useState('auto');
  const [speed, setSpeed] = useState([1]);
  const [stability, setStability] = useState([0.5]);
  const [clarity, setClarity] = useState([0.75]);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the TTS service.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('tts-generate', {
        body: {
          text: text.trim(),
          voice: selectedVoice,
          provider: selectedProvider === 'auto' ? null : selectedProvider,
          speed: speed[0],
          stability: stability[0],
          clarity: clarity[0]
        }
      });

      if (error) throw error;

      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        toast({
          title: "Success",
          description: `Audio generated using ${data.provider}`,
        });
      }
    } catch (error) {
      console.error('TTS generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Text to Speech
          </h1>
          <p className="text-gray-600">
            Convert your text into lifelike speech with advanced AI voices
          </p>
        </div>

        <Tabs defaultValue="tts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="tts" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Text to Speech
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tts">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main TTS Panel */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5" />
                      Text to Speech Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <TextInput text={text} setText={setText} />
                    
                    <VoiceControls
                      selectedVoice={selectedVoice}
                      setSelectedVoice={setSelectedVoice}
                      selectedProvider={selectedProvider}
                      setSelectedProvider={setSelectedProvider}
                    />

                    <VoiceSettings
                      speed={speed}
                      setSpeed={setSpeed}
                      stability={stability}
                      setStability={setStability}
                      clarity={clarity}
                      setClarity={setClarity}
                    />

                    {/* Generate Button */}
                    <Button
                      onClick={handleGenerate}
                      disabled={!text.trim() || isGenerating}
                      className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate Speech'
                      )}
                    </Button>

                    <AudioPlayer audioUrl={audioUrl} />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <ApiStatus />
                <UsageStats />
                <TTSHistory />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <ApiKeysManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TTS;
