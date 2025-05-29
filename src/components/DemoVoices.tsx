
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';

interface DemoVoice {
  id: string;
  name: string;
  gender: string;
  provider: string;
  sampleUrl: string;
  description: string;
}

const DemoVoices = () => {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const demoVoices: DemoVoice[] = [
    {
      id: 'demo_alice',
      name: 'Alice',
      gender: 'Female',
      provider: 'ElevenLabs',
      sampleUrl: '/demo-samples/alice.mp3',
      description: 'Professional and warm voice, perfect for presentations'
    },
    {
      id: 'demo_brian',
      name: 'Brian',
      gender: 'Male',
      provider: 'ElevenLabs',
      sampleUrl: '/demo-samples/brian.mp3',
      description: 'Friendly conversational tone, great for tutorials'
    },
    {
      id: 'demo_luna',
      name: 'Luna',
      gender: 'Female',
      provider: 'Fish Audio',
      sampleUrl: '/demo-samples/luna.mp3',
      description: 'Expressive and engaging, ideal for storytelling'
    },
    {
      id: 'demo_orion',
      name: 'Orion',
      gender: 'Male',
      provider: 'Fish Audio',
      sampleUrl: '/demo-samples/orion.mp3',
      description: 'Deep and authoritative, perfect for narration'
    }
  ];

  const playDemo = async (voice: DemoVoice) => {
    try {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        setAudioElement(null);
      }

      if (playingVoice === voice.id) {
        setPlayingVoice(null);
        return;
      }

      setPlayingVoice(voice.id);

      // For demo purposes, we'll use text-to-speech generation
      const sampleText = `Hello, this is ${voice.name} speaking. I'm a ${voice.gender.toLowerCase()} voice from ${voice.provider}. ${voice.description}`;
      
      // Create a simple beep sound for demo
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
      
      setTimeout(() => {
        setPlayingVoice(null);
      }, 500);

    } catch (error) {
      console.error('Demo playback error:', error);
      setPlayingVoice(null);
    }
  };

  const getProviderColor = (provider: string) => {
    return provider === 'ElevenLabs' 
      ? 'border-purple-500/30 bg-purple-500/10' 
      : 'border-cyan-500/30 bg-cyan-500/10';
  };

  return (
    <Card className="border-blue-500/30 bg-gradient-to-br from-slate-900/90 to-blue-900/20 backdrop-blur-sm shadow-2xl shadow-blue-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-300">
          <Volume2 className="h-6 w-6" />
          Demo Voices
        </CardTitle>
        <p className="text-gray-400">
          Try these sample voices to experience the quality before using your API keys
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoVoices.map((voice) => (
            <div
              key={voice.id}
              className={`border rounded-lg p-4 transition-all duration-300 hover:shadow-lg ${getProviderColor(voice.provider)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-white">{voice.name}</h4>
                  <p className="text-xs text-gray-400">{voice.gender} • {voice.provider}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playDemo(voice)}
                  className="h-8 w-8 p-0 hover:bg-white/10"
                >
                  {playingVoice === voice.id ? (
                    <Pause className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Play className="h-4 w-4 text-blue-400" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-300">{voice.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoVoices;
