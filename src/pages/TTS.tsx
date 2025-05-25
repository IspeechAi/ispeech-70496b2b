
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Download, Loader2, Volume2, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TTSHistory from '@/components/TTSHistory';
import { useAuthStore } from '@/stores/authStore';

const TTS = () => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [selectedProvider, setSelectedProvider] = useState('auto');
  const [speed, setSpeed] = useState([1]);
  const [stability, setStability] = useState([0.5]);
  const [clarity, setClarity] = useState([0.75]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const voices = [
    { id: 'alloy', name: 'Alloy', type: 'neutral' },
    { id: 'echo', name: 'Echo', type: 'male' },
    { id: 'fable', name: 'Fable', type: 'male' },
    { id: 'onyx', name: 'Onyx', type: 'male' },
    { id: 'nova', name: 'Nova', type: 'female' },
    { id: 'shimmer', name: 'Shimmer', type: 'female' }
  ];

  const providers = [
    { id: 'auto', name: 'Auto-Select Best' },
    { id: 'elevenlabs', name: 'ElevenLabs' },
    { id: 'openai', name: 'OpenAI' },
    { id: 'azure', name: 'Azure' },
    { id: 'google', name: 'Google' }
  ];

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

  const handlePlay = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `tts-audio-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const characterCount = text.length;
  const estimatedCost = Math.ceil(characterCount / 1000) * 0.015;

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
                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter your text ({characterCount} characters)
                  </label>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste your text here..."
                    className="min-h-[120px] resize-none"
                    maxLength={5000}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Max 5,000 characters</span>
                    <span>Estimated cost: ${estimatedCost.toFixed(3)}</span>
                  </div>
                </div>

                {/* Voice and Provider Selection */}
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
                            {voice.name} ({voice.type})
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

                {/* Voice Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Speed: {speed[0]}x
                    </label>
                    <Slider
                      value={speed}
                      onValueChange={setSpeed}
                      min={0.25}
                      max={2}
                      step={0.25}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stability: {stability[0]}
                    </label>
                    <Slider
                      value={stability}
                      onValueChange={setStability}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Clarity + Similarity: {clarity[0]}
                    </label>
                    <Slider
                      value={clarity}
                      onValueChange={setClarity}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>

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

                {/* Audio Player */}
                {audioUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={handlePlay}
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 rounded-full"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">Generated Audio</span>
                      </div>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      className="w-full mt-3"
                      controls
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* API Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  API Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ElevenLabs</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">OpenAI</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Azure</span>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Characters</span>
                    <span className="text-sm font-medium">2,450 / 10,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24.5%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent History */}
            <TTSHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTS;
