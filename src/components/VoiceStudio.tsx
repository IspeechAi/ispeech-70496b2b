
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Volume2, Play, Download, Waveform, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import ElevenLabsProvider from '@/components/providers/ElevenLabsProvider';
import FishAudioProvider from '@/components/providers/FishAudioProvider';
import DemoVoices from '@/components/DemoVoices';
import VoiceCloning from '@/components/VoiceCloning';
import AudioPlayer from '@/components/AudioPlayer';

interface Voice {
  id: string;
  name: string;
  provider: string;
  voice_id?: string;
}

const VoiceStudio = () => {
  const [text, setText] = useState('Welcome to iSPEECH! This is a demonstration of our AI-powered text-to-speech technology.');
  const [selectedProvider, setSelectedProvider] = useState<'elevenlabs' | 'fishaudio'>('elevenlabs');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [clonedVoices, setClonedVoices] = useState<Voice[]>([]);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');
  const [fishAudioApiKey, setFishAudioApiKey] = useState('');
  
  const { toast } = useToast();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchClonedVoices();
    }
  }, [user]);

  const fetchClonedVoices = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('voice_clones')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'ready')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const clonedVoiceList = data?.map(clone => ({
        id: `clone_${clone.id}`,
        name: `${clone.name} (Cloned)`,
        provider: 'custom',
        voice_id: clone.id
      })) || [];

      setClonedVoices(clonedVoiceList);
    } catch (error) {
      console.error('Error fetching cloned voices:', error);
    }
  };

  const handleElevenLabsVoicesLoaded = (elevenVoices: any[]) => {
    const formattedVoices = elevenVoices.map(voice => ({
      id: voice.voice_id,
      name: voice.name,
      provider: 'elevenlabs',
      voice_id: voice.voice_id
    }));
    setVoices(formattedVoices);
    if (formattedVoices.length > 0 && !selectedVoice) {
      setSelectedVoice(formattedVoices[0].id);
    }
  };

  const handleFishAudioVoicesLoaded = (fishVoices: any[]) => {
    const formattedVoices = fishVoices.map(voice => ({
      id: voice.id,
      name: voice.name,
      provider: 'fishaudio',
      voice_id: voice.id
    }));
    setVoices(formattedVoices);
    if (formattedVoices.length > 0 && !selectedVoice) {
      setSelectedVoice(formattedVoices[0].id);
    }
  };

  const getAllVoices = () => {
    return [...clonedVoices, ...voices];
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedVoice) {
      toast({
        title: "Error",
        description: "Please select a voice.",
        variant: "destructive",
      });
      return;
    }

    const currentApiKey = selectedProvider === 'elevenlabs' ? elevenLabsApiKey : fishAudioApiKey;
    if (!currentApiKey && !selectedVoice.startsWith('clone_')) {
      toast({
        title: "API Key Required",
        description: `Please enter your ${selectedProvider === 'elevenlabs' ? 'ElevenLabs' : 'Fish Audio'} API key to use this feature.`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const selectedVoiceData = getAllVoices().find(v => v.id === selectedVoice);
      
      const { data, error } = await supabase.functions.invoke('tts-generate', {
        body: {
          text: text.trim(),
          voice: selectedVoice.startsWith('clone_') ? selectedVoice : selectedVoiceData?.voice_id || selectedVoice,
          provider: selectedVoice.startsWith('clone_') ? 'custom' : selectedProvider,
          api_key: currentApiKey,
          speed: 1.0,
          stability: 0.5,
          clarity: 0.75
        }
      });

      if (error) throw error;

      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        toast({
          title: "Success",
          description: `Audio generated successfully using ${selectedVoiceData?.name || 'selected voice'}`,
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

  const canGenerate = text.trim() && selectedVoice && (
    selectedVoice.startsWith('clone_') || 
    (selectedProvider === 'elevenlabs' && elevenLabsApiKey) || 
    (selectedProvider === 'fishaudio' && fishAudioApiKey)
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Voice Studio
          </span>
        </h1>
        <p className="text-xl text-gray-300">
          Create professional AI voices with your own API keys
        </p>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-purple-500/30">
          <TabsTrigger value="generate" className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Generate
          </TabsTrigger>
          <TabsTrigger value="clone" className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Clone Voice
          </TabsTrigger>
          <TabsTrigger value="demo" className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Demo Voices
          </TabsTrigger>
          <TabsTrigger value="providers" className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            API Setup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Generation Panel */}
            <div className="lg:col-span-2">
              <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-2xl shadow-purple-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-300">
                    <Volume2 className="h-6 w-6" />
                    Text to Speech Generation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Enter your text
                    </label>
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type or paste the text you want to convert to speech..."
                      className="min-h-32 bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-500 resize-none"
                      maxLength={5000}
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">
                      {text.length}/5000 characters
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Provider
                      </label>
                      <Select value={selectedProvider} onValueChange={(value: 'elevenlabs' | 'fishaudio') => setSelectedProvider(value)}>
                        <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-purple-500/30">
                          <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                          <SelectItem value="fishaudio">Fish Audio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Voice
                      </label>
                      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                          <SelectValue placeholder="Select a voice" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-purple-500/30">
                          {clonedVoices.length > 0 && (
                            <>
                              {clonedVoices.map((voice) => (
                                <SelectItem key={voice.id} value={voice.id}>
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="h-3 w-3 text-cyan-400" />
                                    {voice.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </>
                          )}
                          {voices.filter(v => v.provider === selectedProvider).map((voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              {voice.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Generate Speech
                      </>
                    )}
                  </Button>

                  {!canGenerate && !isGenerating && (
                    <div className="text-center text-yellow-400 text-sm">
                      {!selectedVoice.startsWith('clone_') && (
                        selectedProvider === 'elevenlabs' && !elevenLabsApiKey 
                          ? "Please enter your ElevenLabs API key to generate speech"
                          : selectedProvider === 'fishaudio' && !fishAudioApiKey
                          ? "Please enter your Fish Audio API key to generate speech"
                          : "Please select a voice and enter text"
                      )}
                    </div>
                  )}

                  <AudioPlayer audioUrl={audioUrl} />
                </CardContent>
              </Card>
            </div>

            {/* Info Panel */}
            <div className="space-y-4">
              <Card className="border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-cyan-900/20 backdrop-blur-sm shadow-2xl shadow-cyan-500/10">
                <CardHeader>
                  <CardTitle className="text-cyan-300">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Available Voices:</span>
                    <span className="text-cyan-300">{getAllVoices().length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cloned Voices:</span>
                    <span className="text-cyan-300">{clonedVoices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Text Length:</span>
                    <span className="text-cyan-300">{text.length} chars</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clone">
          <VoiceCloning onVoiceCloned={fetchClonedVoices} />
        </TabsContent>

        <TabsContent value="demo">
          <DemoVoices />
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ElevenLabsProvider
              onVoicesLoaded={handleElevenLabsVoicesLoaded}
              onApiKeyChange={setElevenLabsApiKey}
              apiKey={elevenLabsApiKey}
            />
            <FishAudioProvider
              onVoicesLoaded={handleFishAudioVoicesLoaded}
              onApiKeyChange={setFishAudioApiKey}
              apiKey={fishAudioApiKey}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VoiceStudio;
