
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Download, Sparkles, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { Voice, ApiKeyStatus } from '@/types/providers';

interface TTSGeneratorProps {
  selectedVoice: Voice | null;
  voices: Voice[];
  apiKeyStatuses: Record<string, ApiKeyStatus>;
  onQuotaExhausted: (provider: string) => void;
}

const TTSGenerator = ({ selectedVoice, voices, apiKeyStatuses, onQuotaExhausted }: TTSGeneratorProps) => {
  const [text, setText] = useState('Welcome to iSpeech! Experience the future of AI-powered voice generation.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Voice parameters
  const [speed, setSpeed] = useState([1.0]);
  const [stability, setStability] = useState([0.5]);
  const [clarity, setClarityState] = useState([0.75]);
  const [emotion, setEmotion] = useState([0.5]);

  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "❌ Error",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedVoice) {
      toast({
        title: "❌ Error",
        description: "Please select a voice first.",
        variant: "destructive",
      });
      return;
    }

    // Check if provider has valid API key
    const providerStatus = apiKeyStatuses[selectedVoice.provider];
    if (!providerStatus?.isActive) {
      toast({
        title: "❌ API Key Required",
        description: `Please add a valid ${selectedVoice.provider} API key to use this voice.`,
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
            stability: stability[0],
            clarity: clarity[0],
            emotion: emotion[0]
          }
        }
      });

      if (error) {
        // Check if it's a quota exhaustion error
        if (error.message.includes('quota') || error.message.includes('limit')) {
          onQuotaExhausted(selectedVoice.provider);
          return;
        }
        throw error;
      }

      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        toast({
          title: "✅ Audio Generated!",
          description: `Successfully generated speech using ${selectedVoice.name}`,
        });
      }
    } catch (error) {
      console.error('TTS generation error:', error);
      toast({
        title: "❌ Generation Failed",
        description: error.message || "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlay = () => {
    if (!audioUrl) return;
    
    const audio = new Audio(audioUrl);
    setIsPlaying(true);
    
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setIsPlaying(false);
      toast({
        title: "❌ Playback Error",
        description: "Could not play the audio file.",
        variant: "destructive",
      });
    };
    
    audio.play();
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `ispeech_${selectedVoice?.name || 'voice'}_${Date.now()}.mp3`;
    link.click();
    
    toast({
      title: "⬇️ Download Started",
      description: "Your audio file is being downloaded.",
    });
  };

  const canGenerate = text.trim() && selectedVoice && apiKeyStatuses[selectedVoice?.provider]?.isActive;

  return (
    <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10 galaxy-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Volume2 className="h-6 w-6 text-purple-400" />
          Text to Speech Generator
        </CardTitle>
        {selectedVoice && (
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant="secondary" 
              className="bg-purple-500/20 text-purple-300 border-purple-500/30"
            >
              {selectedVoice.provider}
            </Badge>
            {selectedVoice.isCloned && (
              <Badge 
                variant="secondary" 
                className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Cloned
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter your text
          </label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste the text you want to convert to speech..."
            className="min-h-32 bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-400"
            maxLength={5000}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {text.length}/5000 characters
          </div>
        </div>

        {/* Voice Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Speed: {speed[0]}x
            </label>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              min={0.25}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stability: {stability[0]}
            </label>
            <Slider
              value={stability}
              onValueChange={setStability}
              min={0.0}
              max={1.0}
              step={0.1}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Clarity: {clarity[0]}
            </label>
            <Slider
              value={clarity}
              onValueChange={setClarityState}
              min={0.0}
              max={1.0}
              step={0.1}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Emotion: {emotion[0]}
            </label>
            <Slider
              value={emotion}
              onValueChange={setEmotion}
              min={0.0}
              max={1.0}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
          className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 galaxy-glow"
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

        {/* Status Messages */}
        {!canGenerate && !isGenerating && (
          <div className="text-center">
            {!selectedVoice ? (
              <p className="text-yellow-400 text-sm">Please select a voice to continue</p>
            ) : !apiKeyStatuses[selectedVoice.provider]?.isActive ? (
              <p className="text-yellow-400 text-sm">
                Please add a valid {selectedVoice.provider} API key to use this voice
              </p>
            ) : (
              <p className="text-yellow-400 text-sm">Please enter some text to generate speech</p>
            )}
          </div>
        )}

        {/* Audio Player */}
        {audioUrl && (
          <Card className="border-cyan-500/30 bg-cyan-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handlePlay}
                    disabled={isPlaying}
                    variant="outline"
                    className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                  >
                    {isPlaying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <span className="text-cyan-300 text-sm">Generated Audio</span>
                </div>
                
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <audio controls className="w-full mt-4" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default TTSGenerator;
