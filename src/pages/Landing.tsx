
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, Play, Pause, Star, Users, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const Landing = () => {
  const [playingDemo, setPlayingDemo] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  React.useEffect(() => {
    if (user) {
      navigate('/tts');
    }
  }, [user, navigate]);

  const demoVoices = [
    {
      id: 'demo1',
      name: 'Aria',
      text: 'Welcome to ISPEECH - the ultimate text to speech platform.',
      type: 'Professional Female'
    },
    {
      id: 'demo2', 
      name: 'Adam',
      text: 'Transform your text into lifelike speech with our AI voices.',
      type: 'Professional Male'
    },
    {
      id: 'demo3',
      name: 'Rachel',
      text: 'Experience the future of voice technology today.',
      type: 'Warm Female'
    }
  ];

  const features = [
    {
      icon: <Volume2 className="h-8 w-8 text-purple-600" />,
      title: 'Multiple Voice Engines',
      description: 'Access to ElevenLabs, Google, Azure, and more premium TTS APIs'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Custom Voice Cloning',
      description: 'Upload your voice and create personalized AI voices'
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
      setPlayingDemo(null);
      return;
    }

    setPlayingDemo(voice.id);
    
    // Simulate playing demo audio
    setTimeout(() => {
      setPlayingDemo(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Volume2 className="h-12 w-12 text-purple-600 animate-pulse" />
              <h1 className="text-5xl font-bold text-gray-900">ISPEECH</h1>
            </div>
            <h2 className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your text into lifelike speech with AI-powered voices. 
              Multiple engines, custom cloning, and professional quality.
            </h2>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Get Started Free
              </Button>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Demos */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Try Our Voices</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoVoices.map((voice) => (
            <Card key={voice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {voice.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playDemo(voice)}
                    className="w-10 h-10 rounded-full"
                  >
                    {playingDemo === voice.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
                <p className="text-sm text-gray-500">{voice.type}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">"{voice.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Powerful Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users creating amazing voice content with ISPEECH
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Start Creating Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
