
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sliders as SlidersIcon, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { voiceConfigs } from '@/config/voiceConfigs';
import VoiceSelector from './voice-customization/VoiceSelector';
import VoiceParameterSlider from './voice-customization/VoiceParameterSlider';
import VoiceControls from './voice-customization/VoiceControls';

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
          <VoiceSelector selectedVoice={selectedVoice} onVoiceChange={setSelectedVoice} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VoiceParameterSlider
              label="Speech Speed"
              value={speed}
              onChange={setSpeed}
              min={0.5}
              max={2}
              step={0.1}
              displayValue={`${speed[0].toFixed(1)}x`}
              displayColor="text-purple-400"
              labels={['Slow', 'Normal', 'Fast']}
            />

            <VoiceParameterSlider
              label="Pitch"
              value={pitch}
              onChange={setPitch}
              min={-10}
              max={10}
              step={1}
              displayValue={`${pitch[0] > 0 ? '+' : ''}${pitch[0]}`}
              displayColor="text-cyan-400"
              labels={['Lower', 'Normal', 'Higher']}
            />

            <VoiceParameterSlider
              label="Voice Stability"
              value={stability}
              onChange={setStability}
              min={0}
              max={1}
              step={0.05}
              displayValue={`${(stability[0] * 100).toFixed(0)}%`}
              displayColor="text-green-400"
              labels={['Variable', 'Stable']}
            />

            <VoiceParameterSlider
              label="Voice Clarity"
              value={clarity}
              onChange={setClarity}
              min={0}
              max={1}
              step={0.05}
              displayValue={`${(clarity[0] * 100).toFixed(0)}%`}
              displayColor="text-orange-400"
              labels={['Soft', 'Clear']}
            />

            <div className="md:col-span-2">
              <VoiceParameterSlider
                label="Emotional Intensity"
                value={emotion}
                onChange={setEmotion}
                min={0}
                max={1}
                step={0.05}
                displayValue={`${(emotion[0] * 100).toFixed(0)}%`}
                displayColor="text-pink-400"
                labels={['Neutral', 'Moderate', 'Expressive']}
              />
            </div>
          </div>

          <VoiceControls
            onPlayPreview={playPreview}
            onResetDefaults={resetToDefaults}
            isGenerating={isGenerating}
            isPlaying={isPlaying}
          />

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
