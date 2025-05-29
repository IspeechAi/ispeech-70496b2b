import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Volume2, 
  Mic, 
  RefreshCw, 
  Sliders, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Zap,
  Shield,
  Users,
  Sparkles,
  AudioLines
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import VoicePreview from '@/components/VoicePreview';

const Landing = () => {
  const { user } = useAuthStore();

  const features = [
    {
      icon: Volume2,
      title: 'AI Text-to-Speech',
      description: 'Convert text to natural-sounding speech with multiple voice options and providers',
      color: 'text-purple-400',
      link: '/tts'
    },
    {
      icon: Sparkles,
      title: 'Voice Cloning',
      description: 'Clone any voice with just a short audio sample and use it for your content',
      color: 'text-cyan-400',
      link: '/settings?tab=voice-cloning'
    },
    {
      icon: RefreshCw,
      title: 'Voice Changer',
      description: 'Transform existing audio files to speak in different voices instantly',
      color: 'text-green-400',
      link: '/settings?tab=voice-changer'
    },
    {
      icon: Sliders,
      title: 'Voice Customization',
      description: 'Fine-tune pitch, speed, emotion, and other parameters for perfect results',
      color: 'text-orange-400',
      link: '/settings?tab=customization'
    }
  ];

  const benefits = [
    'Multiple TTS providers (ElevenLabs, OpenAI, Azure, Fish Audio)',
    'Custom voice cloning with just 30 seconds of audio',
    'Real-time voice parameter adjustments',
    'Secure API key management',
    'Audio history and project management',
    'Professional-grade voice quality'
  ];

  const stats = [
    { icon: Users, label: 'Active Users', value: '50,000+' },
    { icon: Volume2, label: 'Voices Generated', value: '2M+' },
    { icon: Star, label: 'User Rating', value: '4.9/5' },
    { icon: Zap, label: 'Processing Speed', value: '<2s' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
              <div className="relative p-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full">
                <Mic className="h-16 w-16 text-white animate-bounce" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              iSPEECH
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The ultimate AI voice processing platform for creators, businesses, and developers. 
            Clone voices, change audio, and generate speech with professional quality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {user ? (
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-8 py-4 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
                <Link to="/tts">
                  <Volume2 className="mr-2 h-5 w-5" />
                  Open Voice Studio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-8 py-4 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
                  <Link to="/auth">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300">
                  <Link to="/auth">
                    Sign In
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-4 bg-slate-800/30 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-colors duration-300">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Voice Preview Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <VoicePreview />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Voice Processing Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to create, modify, and perfect voice content with AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 group cursor-pointer">
                  <Link to={feature.link}>
                    <CardHeader className="text-center">
                      <Icon className={`h-12 w-12 mx-auto mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                      <CardTitle className="text-lg text-white group-hover:text-purple-300 transition-colors">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-center group-hover:text-gray-300 transition-colors">{feature.description}</p>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose iSPEECH?
            </h2>
            <p className="text-xl text-gray-400">
              Professional voice processing made simple and accessible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-lg shadow-sm border border-purple-500/30 hover:border-purple-400/50 transition-colors duration-300">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 shadow-xl shadow-purple-500/10">
            <CardContent className="pt-8 pb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-md opacity-60"></div>
                <Shield className="relative h-16 w-16 mx-auto text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Voice Content?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of creators using iSPEECH for professional voice processing. 
                Start for free with our basic features, no credit card required.
              </p>
              
              {!user && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
                    <Link to="/auth">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300">
                    <Link to="/auth">
                      Learn More
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gradient-to-r from-slate-900 to-purple-900 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-sm opacity-60"></div>
              <Mic className="relative h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">iSPEECH</span>
          </div>
          <p className="text-gray-400">
            © 2024 iSPEECH. Professional AI voice processing platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
