
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sliders, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const VoiceCustomization = () => {
  const [pitch, setPitch] = useState([1.0]);
  const [rate, setRate] = useState([1.0]);
  const [volume, setVolume] = useState([1.0]);
  const [emphasis, setEmphasis] = useState([0.5]);
  const [pause, setPause] = useState([0.5]);
  const [testText, setTestText] = useState('This is a test of voice customization settings. Listen to how these parameters affect the voice quality and delivery.');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const testVoiceSettings = async () => {
    if (!testText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some test text.",
        variant: "destructive",
      });
      return;
    }

    // Stop currently playing audio
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      setAudioElement(null);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('tts-generate', {
        body: {
          text: testText.trim(),
          voice: 'alice',
          speed: rate[0],
          stability: emphasis[0],
          clarity: volume[0],
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
            description: "Failed to play test audio.",
            variant: "destructive",
          });
        };

        await audio.play();
        
        toast({
          title: "Playing test audio",
          description: "Listen to how your settings affect the voice.",
        });
      }
    } catch (error) {
      console.error('Voice test error:', error);
      setIsPlaying(false);
      toast({
        title: "Test Failed",
        description: "Could not generate test audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetSettings = () => {
    setPitch([1.0]);
    setRate([1.0]);
    setVolume([1.0]);
    setEmphasis([0.5]);
    setPause([0.5]);
    toast({
      title: "Settings Reset",
      description: "All voice customization settings have been reset to defaults.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Voice Customization
          </CardTitle>
          <p className="text-sm text-gray-600">
            Fine-tune voice parameters to achieve the perfect sound for your content
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pitch Control */}
          <div className="space-y-2">
            <Label>Pitch: {pitch[0].toFixed(1)}x</Label>
            <Slider
              value={pitch}
              onValueChange={setPitch}
              max={2.0}
              min={0.5}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Adjust the fundamental frequency of the voice</p>
          </div>

          {/* Speaking Rate */}
          <div className="space-y-2">
            <Label>Speaking Rate: {rate[0].toFixed(1)}x</Label>
            <Slider
              value={rate}
              onValueChange={setRate}
              max={3.0}
              min={0.25}
              step={0.25}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Control how fast or slow the voice speaks</p>
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <Label>Volume: {volume[0].toFixed(1)}x</Label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={1.5}
              min={0.1}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Adjust the loudness of the generated speech</p>
          </div>

          {/* Emphasis */}
          <div className="space-y-2">
            <Label>Emphasis: {(emphasis[0] * 100).toFixed(0)}%</Label>
            <Slider
              value={emphasis}
              onValueChange={setEmphasis}
              max={1.0}
              min={0.0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Control the emotional expressiveness and stress patterns</p>
          </div>

          {/* Pause Duration */}
          <div className="space-y-2">
            <Label>Pause Duration: {(pause[0] * 100).toFixed(0)}%</Label>
            <Slider
              value={pause}
              onValueChange={setPause}
              max={1.0}
              min={0.0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Adjust the length of natural pauses in speech</p>
          </div>

          {/* Test Text */}
          <div className="space-y-2">
            <Label htmlFor="test-text">Test Text</Label>
            <Textarea
              id="test-text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text to test your voice settings..."
              className="min-h-[100px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={testVoiceSettings}
              disabled={!testText.trim()}
              className="flex-1"
              variant={isPlaying ? "destructive" : "default"}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Test
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Test Settings
                </>
              )}
            </Button>
            <Button
              onClick={resetSettings}
              variant="outline"
              className="px-6"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Settings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Pitch:</span> {pitch[0].toFixed(1)}x
            </div>
            <div>
              <span className="font-medium">Rate:</span> {rate[0].toFixed(1)}x
            </div>
            <div>
              <span className="font-medium">Volume:</span> {volume[0].toFixed(1)}x
            </div>
            <div>
              <span className="font-medium">Emphasis:</span> {(emphasis[0] * 100).toFixed(0)}%
            </div>
            <div className="col-span-2">
              <span className="font-medium">Pause Duration:</span> {(pause[0] * 100).toFixed(0)}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceCustomization;
