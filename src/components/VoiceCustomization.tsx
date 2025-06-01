
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VoiceCustomization = () => {
  const [pitch, setPitch] = useState([0]);
  const [tone, setTone] = useState([50]);
  const [speed, setSpeed] = useState([50]);
  const [emotion, setEmotion] = useState('neutral');
  const [effect, setEffect] = useState('none');
  const { toast } = useToast();

  const emotions = [
    { id: 'neutral', name: 'Neutral' },
    { id: 'happy', name: 'Happy' },
    { id: 'sad', name: 'Sad' },
    { id: 'excited', name: 'Excited' },
    { id: 'angry', name: 'Angry' },
    { id: 'calm', name: 'Calm' },
    { id: 'whisper', name: 'Whisper' },
    { id: 'shout', name: 'Shout' }
  ];

  const effects = [
    { id: 'none', name: 'None' },
    { id: 'robotic', name: 'Robotic' },
    { id: 'child', name: 'Child-like' },
    { id: 'elderly', name: 'Elderly' },
    { id: 'alien', name: 'Alien' },
    { id: 'monster', name: 'Monster' },
    { id: 'echo', name: 'Echo' },
    { id: 'reverb', name: 'Reverb' }
  ];

  const resetToDefaults = () => {
    setPitch([0]);
    setTone([50]);
    setSpeed([50]);
    setEmotion('neutral');
    setEffect('none');
    toast({
      title: "Settings reset",
      description: "Voice settings restored to defaults",
    });
  };

  const savePreset = () => {
    toast({
      title: "Preset saved",
      description: "Your custom voice settings have been saved",
    });
  };

  const previewVoice = () => {
    toast({
      title: "Preview playing",
      description: "Playing voice sample with your custom settings",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Voice Parameters</CardTitle>
          <p className="text-sm text-gray-600">
            Fine-tune your voice characteristics
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pitch Control */}
          <div>
            <Label>Pitch: {pitch[0] > 0 ? '+' : ''}{pitch[0]}</Label>
            <Slider
              value={pitch}
              onValueChange={setPitch}
              min={-50}
              max={50}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Lower</span>
              <span>Higher</span>
            </div>
          </div>

          {/* Tone Control */}
          <div>
            <Label>Tone Warmth: {tone[0]}%</Label>
            <Slider
              value={tone}
              onValueChange={setTone}
              min={0}
              max={100}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Cold</span>
              <span>Warm</span>
            </div>
          </div>

          {/* Speed Control */}
          <div>
            <Label>Speaking Speed: {speed[0]}%</Label>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              min={25}
              max={200}
              step={5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emotional Style</CardTitle>
          <p className="text-sm text-gray-600">
            Add emotional characteristics to your voice
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Emotion</Label>
            <Select value={emotion} onValueChange={setEmotion}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {emotions.map((emo) => (
                  <SelectItem key={emo.id} value={emo.id}>
                    {emo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voice Effects</CardTitle>
          <p className="text-sm text-gray-600">
            Apply special effects to transform your voice
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Effect Type</Label>
            <Select value={effect} onValueChange={setEffect}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {effects.map((eff) => (
                  <SelectItem key={eff.id} value={eff.id}>
                    {eff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={previewVoice} variant="outline" className="flex-1">
          <Play className="h-4 w-4 mr-2" />
          Preview Voice
        </Button>
        <Button onClick={savePreset} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save Preset
        </Button>
        <Button onClick={resetToDefaults} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default VoiceCustomization;
