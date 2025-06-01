
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, Play, Pause, Star, Users, Clock, Shield, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Landing = () => {
  const [playingDemo, setPlayingDemo] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();

  React.useEffect(() => {
    if (user) {
      navigate('/tts');
    }
  }, [user, navigate]);

  const demoVoices = [
    {
      id: 'alice',
      name: 'Alice',
      text: 'Welcome to iSPEECH - Transform your text into lifelike speech with professional AI voices.',
      type: 'Professional Female',
      avatar: '👩‍💼'
    },
    {
      id: 'bill', 
      name: 'Bill',
      text: 'Experience the future of voice technology with our advanced text-to-speech platform.',
      type: 'Professional Male',
      avatar: '👨‍💼'
    },
    {
      id: 'brian',
      name: 'Brian',
      text: 'Create engaging content with our premium voice collection and custom cloning features.',
      type: 'Friendly Male',
      avatar: '🎭'
    },
    {
      id: 'nova',
      name: 'Nova',
      text: 'Join thousands of creators who trust iSPEECH for their voice generation needs.',
      type: 'Energetic Female',
      avatar: '🎵'
    }
  ];

  const features = [
    {
      icon: <Volume2 className="h-8 w-8 text-purple-600" />,
      title: 'Multiple Voice Engines',
      description: 'Access to ElevenLabs, OpenAI, Azure, and more premium TTS APIs'
    },
    {
      icon: <Mic className="h-8 w-8 text-blue-600" />,
      title: 'Custom Voice Cloning',
      description: 'Upload your voice and create personalized AI voices (3 voice limit)'
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: 'Real-time Generation',
      description: 'Instant audio generation with download capabilities'
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-600" />,
      title: 'Secure & Private',
      description: 'Your API keys and data are encrypted and protected'
    }
  ];

  const playDemo = async (voice: any) => {
    if (playingDemo === voice.id) {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        setAudioElement(null);
      }
      setPlayingDemo(null);
      return;
    }

    try {
      // Stop currently playing audio
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        setAudioElement(null);
      }

      setPlayingDemo(voice.id);

      const { data, error } = await supabase.functions.invoke('tts-sample', {
        body: {
          text: voice.text,
          voice: voice.id
        }
      });

      if (error) throw error;

      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        setAudioElement(audio);
        
        audio.onended = () => {
          setPlayingDemo(null);
          setAudioElement(null);
        };
        
        audio.onerror = () => {
          setPlayingDemo(null);
          setAudioElement(null);
          toast({
            title: "Playback Error",
            description: "Failed to play voice sample. Please try again.",
            variant: "destructive",
          });
        };

        await audio.play();
      }
    } catch (error) {
      console.error('Demo playback error:', error);
      setPlayingDemo(null);
      toast({
        title: "Sample Unavailable",
        description: "Voice sample temporarily unavailable. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleFeatureClick = (featureTitle: string) => {
    if (featureTitle === 'Custom Voice Cloning') {
      toast({
        title: "Sign up to clone voices",
        description: "Create an account to start cloning your own voices!",
      });
      setTimeout(() => navigate('/auth'), 1000);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <Volume2 className="h-16 w-16 text-purple-600 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                iSPEECH
              </h1>
            </div>
            <h2 className="text-3xl text-gray-700 mb-8 max-w-4xl mx-auto font-medium">
              Transform your text into lifelike speech with AI-powered voices. 
              Multiple engines, custom cloning, and professional quality.
            </h2>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('voice-demos')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-lg px-8 py-4"
              >
                Try Voice Samples
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Demos */}
      <div id="voice-demos" className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-4xl font-bold text-center mb-4">Try Our AI Voices</h3>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Click play to hear our premium voice collection - no signup required!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoVoices.map((voice) => (
            <Card key={voice.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{voice.avatar}</div>
                <CardTitle className="flex items-center justify-between">
                  <span>{voice.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playDemo(voice)}
                    className="w-12 h-12 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
                  >
                    {playingDemo === voice.id ? (
                      <Pause className="h-5 w-5 text-purple-600" />
                    ) : (
                      <Play className="h-5 w-5 text-purple-600" />
                    )}
                  </Button>
                </CardTitle>
                <p className="text-sm text-purple-600 font-medium">{voice.type}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 italic">"{voice.text}"</p>
                {playingDemo === voice.id && (
                  <div className="mt-3 flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-4xl font-bold text-center mb-12">Powerful Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" 
              onClick={() => handleFeatureClick(feature.title)}
            >
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="font-semibold mb-2 text-lg">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-4xl font-bold mb-6">Ready to Get Started?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users creating amazing voice content with iSPEECH
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4"
            >
              Start Creating Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => handleFeatureClick('Custom Voice Cloning')}
              className="text-lg px-8 py-4"
            >
              Clone Your Voice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
