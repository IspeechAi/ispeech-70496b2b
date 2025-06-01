
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, Sparkles, Zap, Globe } from 'lucide-react';
import GalaxyBackground from '@/components/galaxy/GalaxyBackground';

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GalaxyBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              The Future of Voice
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience next-generation AI voice synthesis with multiple providers, 
            voice cloning, and professional-grade audio generation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tts">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-8 py-3 h-auto galaxy-glow">
                <Volume2 className="mr-2 h-5 w-5" />
                Start Creating
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 text-lg px-8 py-3 h-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10 galaxy-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <Sparkles className="h-6 w-6" />
                Multi-Provider Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Connect with ElevenLabs, PlayHT, Fish Audio, and Voicelab for the best voice quality and variety.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10 galaxy-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <Zap className="h-6 w-6" />
                Voice Cloning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Clone any voice with just a short audio sample and create personalized AI voices.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10 galaxy-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <Globe className="h-6 w-6" />
                Professional Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Generate studio-quality audio with advanced controls for speed, emotion, and clarity.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Voice?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators using iSpeech for their projects
          </p>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-8 py-3 h-auto galaxy-glow">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
