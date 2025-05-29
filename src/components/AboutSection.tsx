
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic2, Brain, Key, Zap, Shield, Globe } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Mic2,
      title: 'Voice Cloning Technology',
      description: 'Advanced AI algorithms clone voices with just a few minutes of audio, creating personalized speech synthesis.'
    },
    {
      icon: Brain,
      title: 'Multiple AI Providers',
      description: 'Support for ElevenLabs, Fish Audio, OpenAI, and more. Choose the best provider for your needs.'
    },
    {
      icon: Key,
      title: 'Bring Your Own API Keys',
      description: 'Use your own API keys for unlimited access and better pricing. We never store or misuse your keys.'
    },
    {
      icon: Zap,
      title: 'Real-time Generation',
      description: 'Fast text-to-speech generation with high-quality output and customizable voice parameters.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your data is encrypted and secure. Voice clones and API keys are stored safely with enterprise-grade security.'
    },
    {
      icon: Globe,
      title: 'Global Language Support',
      description: 'Support for multiple languages and accents. Create content for a global audience.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            About iSPEECH
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          The ultimate AI-powered voice platform that brings your text to life with natural, 
          human-like speech using cutting-edge voice cloning and synthesis technology.
        </p>
      </div>

      <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-2xl shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-300">What is iSPEECH?</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            iSPEECH is a comprehensive AI voice platform that empowers creators, businesses, and developers 
            to generate high-quality speech from text using state-of-the-art artificial intelligence.
          </p>
          <p>
            Our platform integrates with leading AI providers like ElevenLabs and Fish Audio, allowing you 
            to access premium voice synthesis capabilities while maintaining full control over your API keys and data.
          </p>
          <p>
            Whether you're creating audiobooks, podcasts, video content, or need accessibility features, 
            iSPEECH provides the tools you need to transform text into natural, expressive speech.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-cyan-900/20 backdrop-blur-sm shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 group">
              <CardHeader>
                <Icon className="h-8 w-8 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                <CardTitle className="text-lg text-cyan-300">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-blue-500/30 bg-gradient-to-br from-slate-900/90 to-blue-900/20 backdrop-blur-sm shadow-2xl shadow-blue-500/10">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-300">How Voice Cloning Works</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold text-purple-300 mb-2">Upload Audio</h3>
              <p className="text-sm text-gray-400">
                Provide a clean audio sample (30 seconds to 5 minutes) of the voice you want to clone.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold text-cyan-300 mb-2">AI Processing</h3>
              <p className="text-sm text-gray-400">
                Our AI analyzes the voice characteristics, tone, and speech patterns using advanced deep learning.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold text-green-300 mb-2">Generate Speech</h3>
              <p className="text-sm text-gray-400">
                Use your cloned voice to generate natural speech from any text with customizable parameters.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-pink-500/30 bg-gradient-to-br from-slate-900/90 to-pink-900/20 backdrop-blur-sm shadow-2xl shadow-pink-500/10">
        <CardHeader>
          <CardTitle className="text-2xl text-pink-300">Supported Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-purple-300">ElevenLabs</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Premium voice quality</li>
                <li>• 29+ languages supported</li>
                <li>• Advanced voice cloning</li>
                <li>• Emotional speech synthesis</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-cyan-300">Fish Audio</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Cost-effective solution</li>
                <li>• Fast generation speeds</li>
                <li>• High-quality output</li>
                <li>• Multiple voice options</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSection;
