
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, Sparkles, Zap, Shield } from 'lucide-react';
import GalaxyBackground from '@/components/galaxy/GalaxyBackground';

const About = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GalaxyBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              About iSpeech
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionizing voice generation with cutting-edge AI technology and multi-provider integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <Volume2 className="h-6 w-6" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                To democratize voice technology by providing easy access to the best AI voice generation 
                platforms, enabling creators to bring their ideas to life with professional-quality audio.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <Sparkles className="h-6 w-6" />
                Innovation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                We integrate multiple leading voice AI providers into one seamless platform, 
                giving you access to the latest voice synthesis technologies.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <Zap className="h-6 w-6" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Built for speed and reliability, our platform ensures fast voice generation 
                with intelligent fallbacks and quota management across providers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <Shield className="h-6 w-6" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Your API keys and data are encrypted and securely stored. We never share 
                your information and follow industry best practices for data protection.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Supported Providers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'ElevenLabs', icon: '🎭' },
              { name: 'PlayHT', icon: '🎪' },
              { name: 'Fish Audio', icon: '🐠' },
              { name: 'Voicelab', icon: '🔬' },
            ].map((provider) => (
              <div key={provider.name} className="text-center p-4 rounded-lg bg-slate-800/30">
                <div className="text-3xl mb-2">{provider.icon}</div>
                <div className="text-gray-300 font-medium">{provider.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
