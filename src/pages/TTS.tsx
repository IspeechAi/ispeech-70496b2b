
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Volume2, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TTSHistory from '@/components/TTSHistory';
import TextInput from '@/components/TextInput';
import VoiceControls from '@/components/VoiceControls';
import VoiceSettings from '@/components/VoiceSettings';
import VoiceSelector from '@/components/VoiceSelector';
import AudioPlayer from '@/components/AudioPlayer';
import ApiStatus from '@/components/ApiStatus';
import UsageStats from '@/components/UsageStats';
import ProviderSelector from '@/components/ProviderSelector';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useApiKeys } from '@/hooks/useApiKeys';

const TTS = () => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [selectedProvider, setSelectedProvider] = useState('auto');
  const [speed, setSpeed] = useState([1]);
  const [stability, setStability] = useState([0.5]);
  const [clarity, setClarity] = useState([0.75]);
  const [currentProvider, setCurrentProvider] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { userApiKeys } = useApiKeys();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

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
        setCurrentProvider(data.provider);
        toast({
          title: "Success",
          description: `Audio generated using ${data.provider}${data.cached ? ' (cached)' : ''}`,
        });
      }
    } catch (error) {
      console.error('TTS generation error:', error);
      
      // Check if it's a quota/availability error
      if (error.message?.includes('quota') || error.message?.includes('unavailable')) {
        toast({
          title: "All voice engines are unavailable",
          description: "All voice services are temporarily unavailable due to usage limits. Please try again later or add your own API key from Settings.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: error.message || "Failed to generate audio. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Volume2 className={`h-8 w-8 text-purple-600 ${isGenerating ? 'animate-spin' : 'animate-pulse'}`} />
            <h1 className="text-4xl font-bold text-gray-900">
              AI Text to Speech
            </h1>
          </div>
          <p className="text-gray-600">
            Convert your text into lifelike speech with AI-powered voices
          </p>
          {currentProvider && (
            <p className="text-sm text-purple-600 mt-2">
              Currently using: {currentProvider}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main TTS Panel */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 animate-pulse" />
                  iSPEECH Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <TextInput text={text} setText={setText} />
                
                <VoiceSelector 
                  selectedVoice={selectedVoice}
                  onVoiceChange={setSelectedVoice}
                />

                <ProviderSelector
                  selectedProvider={selectedProvider}
                  onProviderChange={setSelectedProvider}
                  userApiKeys={userApiKeys}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTS;
