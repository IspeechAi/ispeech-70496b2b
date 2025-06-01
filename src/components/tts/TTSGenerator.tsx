
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, Download, Loader2, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Voice } from '@/types/providers';

interface TTSGeneratorProps {
  selectedVoice: Voice | null;
  voices: Voice[];
}

const TTSGenerator = ({ selectedVoice, voices }: TTSGeneratorProps) => {
  const [text, setText] = useState('Welcome to iSpeech! Experience the future of voice generation with our advanced AI technology.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Voice parameters
  const [speed, setSpeed] = useState([1.0]);
  const [pitch, setPitch] = useState([0]);
  const [stability, setStability] = useState([0.5]);
  const [clarity, setClarity] = useState([0.75]);
  const [emotion, setEmotion] = useState([0.5]);
  
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "Text Required",
        description: "Please enter some text to convert to speech",
        variant: "destructive",
      });
      return;
    }

    if (!selectedVoice) {
      toast({
        title: "Voice Required",
        description: "Please select a voice from the dropdown",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-audio', {
        body: {
          text: text.trim(),
          voiceId: selectedVoice.id,
          provider: selectedVoice.provider,
          parameters: {
            speed: speed[0],
            pitch: pitch[0],
            stability: stability[0],
            clarity: clarity[0],
            emotion: emotion[0]
          }
        }
      });

      if (error) throw error;

      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        toast({
          title: "🎉 Audio Generated!",
          description: `Successfully generated speech using ${selectedVoice.name}`,
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

  const handlePlayAudio = () => {
    if (!audioUrl) return;

    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
      setIsPlaying(false);
      return;
    }

    const audio = new Audio(audioUrl);
    setAudioElement(audio);
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      setAudioElement(null);
    };

    audio.onerror = () => {
      setIsPlaying(false);
      setAudioElement(null);
      toast({
        title: "Playback Error",
        description: "Failed to play audio",
        variant: "destructive",
      });
    };

    audio.play();
  };

  const handleDownload = () => {
    if (!audioUrl) return;

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `ispeech_${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Volume2 className="h-6 w-6 text-cyan-400" />
          Text to Speech Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-gray-300 mb-3 block">Enter your text</Label>
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

        {selectedVoice && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300 mb-2 block">Speed</Label>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                max={2}
                min={0.5}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Slow</span>
                <span>{speed[0]}x</span>
                <span>Fast</span>
              </div>
            </div>

            <div>
              <Label className="text-gray-300 mb-2 block">Pitch</Label>
              <Slider
                value={pitch}
                onValueChange={setPitch}
                max={1}
                min={-1}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>{pitch[0] > 0 ? '+' : ''}{pitch[0]}</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <Label className="text-gray-300 mb-2 block">Stability</Label>
              <Slider
                value={stability}
                onValueChange={setStability}
                max={1}
                min={0}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Variable</span>
                <span>{Math.round(stability[0] * 100)}%</span>
                <span>Stable</span>
              </div>
            </div>

            <div>
              <Label className="text-gray-300 mb-2 block">Clarity</Label>
              <Slider
                value={clarity}
                onValueChange={setClarity}
                max={1}
                min={0}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Soft</span>
                <span>{Math.round(clarity[0] * 100)}%</span>
                <span>Clear</span>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={!text.trim() || !selectedVoice || isGenerating}
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

        {audioUrl && (
          <Card className="border-green-500/30 bg-green-500/10">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-green-300 mb-4">
                🎉 Audio Generated Successfully!
              </h3>
              <div className="flex gap-3">
                <Button
                  onClick={handlePlayAudio}
                  variant="outline"
                  className="flex-1 border-green-500/50 text-green-300 hover:bg-green-500/20"
                >
                  {isPlaying ? 'Stop' : 'Play'}
                </Button>
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default TTSGenerator;
