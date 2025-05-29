
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Sliders as SlidersIcon, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { voiceConfigs, VoiceConfig } from '@/config/voiceConfigs';

const VoiceCustomization = () => {
  const [selectedVoice, setSelectedVoice] = useState('Xb7hH8MSUJpSbSDYk0k2');
  const [speed, setSpeed] = useState([1.0]);
  const [pitch, setPitch] = useState([0]);
  const [stability, setStability] = useState([0.5]);
  const [clarity, setClarity] = useState([0.75]);
  const [emotion, setEmotion] = useState([0.5]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const sampleText = "Welcome to iSPEECH voice customization. This is how your voice will sound with the current settings.";

  const resetToDefaults = () => {
    setSpeed([1.0]);
    setPitch([0]);
    setStability([0.5]);
    setClarity([0.75]);
    setEmotion([0.5]);
    toast({
      title: "Settings Reset",
      description: "All voice parameters have been reset to default values.",
    });
  };

  const playPreview = async () => {
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
      setIsPlaying(false);
      return;
    }

    setIsGenerating(true);
    setIsPlaying(true);
    
    try {
      const selectedVoiceConfig = voiceConfigs.find(v => v.id === selectedVoice);
      
      const { data, error } = await supabase.functions.invoke('tts-generate', {
        body: {
          text: sampleText,
          voice: selectedVoice,
          provider: selectedVoiceConfig?.provider.toLowerCase().replace(' ', ''),
          speed: speed[0],
          stability: stability[0],
          clarity: clarity[0],
          emotion: emotion[0],
          pitch: pitch[0]
        }
      });

      if (error) throw error;

      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        setAudioElement(audio);
        
        audio.onended = () => {
          setIsPlaying(false);
          setAudioElement(null);
        };
        
        audio.onerror = () => {
          setIsPlaying(false);
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
      console.error('Preview error:', error);
      setIsPlaying(false);
      toast({
        title: "Preview Failed",
        description: "Unable to generate voice preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getProviderBadge = (provider: string) => {
    const colors = {
      'ElevenLabs': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'OpenAI': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Fish Audio': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    };
    return colors[provider as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const groupedVoices = voiceConfigs.reduce((acc, voice) => {
    if (!acc[voice.provider]) {
      acc[voice.provider] = [];
    }
    acc[voice.provider].push(voice);
    return acc;
  }, {} as Record<string, VoiceConfig[]>);

  return (
    <div className="space-y-6">
      <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 shadow-xl shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <SlidersIcon className="h-6 w-6 text-purple-400" />
            Voice Customization
          </CardTitle>
          <p className="text-gray-400">
            Fine-tune voice parameters to create the perfect sound for your content
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Selection */}
          <div>
            <Label className="text-gray-300 mb-3 block">Select Voice</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white focus:border-purple-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/50">
                {Object.entries(groupedVoices).map(([provider, voices]) => (
                  <div key={provider}>
                    <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      {provider}
                    </div>
                    {voices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id} className="text-gray-300 focus:bg-purple-500/20">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="font-medium">{voice.name}</span>
                            <span className="text-xs text-gray-500">{voice.gender} • {voice.category}</span>
                          </div>
                          <Badge variant="secondary" className={`ml-2 ${getProviderBadge(voice.provider)}`}>
                            {voice.provider}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Voice Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Speed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Speech Speed</Label>
                <span className="text-sm text-purple-400">{speed[0].toFixed(1)}x</span>
              </div>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                max={2}
                min={0.5}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>

            {/* Pitch */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Pitch</Label>
                <span className="text-sm text-cyan-400">{pitch[0] > 0 ? '+' : ''}{pitch[0]}</span>
              </div>
              <Slider
                value={pitch}
                onValueChange={setPitch}
                max={10}
                min={-10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Lower</span>
                <span>Normal</span>
                <span>Higher</span>
              </div>
            </div>

            {/* Stability */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Voice Stability</Label>
                <span className="text-sm text-green-400">{(stability[0] * 100).toFixed(0)}%</span>
              </div>
              <Slider
                value={stability}
                onValueChange={setStability}
                max={1}
                min={0}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Variable</span>
                <span>Stable</span>
              </div>
            </div>

            {/* Clarity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Voice Clarity</Label>
                <span className="text-sm text-orange-400">{(clarity[0] * 100).toFixed(0)}%</span>
              </div>
              <Slider
                value={clarity}
                onValueChange={setClarity}
                max={1}
                min={0}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Soft</span>
                <span>Clear</span>
              </div>
            </div>

            {/* Emotion */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Emotional Intensity</Label>
                <span className="text-sm text-pink-400">{(emotion[0] * 100).toFixed(0)}%</span>
              </div>
              <Slider
                value={emotion}
                onValueChange={setEmotion}
                max={1}
                min={0}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Neutral</span>
                <span>Moderate</span>
                <span>Expressive</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={playPreview}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Stop Preview
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Play Preview
                </>
              )}
            </Button>
            
            <Button
              onClick={resetToDefaults}
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Defaults
            </Button>
          </div>

          {/* Real-time Preview Info */}
          <Card className="border-blue-500/30 bg-blue-500/10">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-blue-300">Real-time Preview</span>
              </div>
              <p className="text-sm text-gray-400">
                Adjust any parameter and click "Play Preview" to hear how your voice will sound with the current settings.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceCustomization;
