
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
  Users
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
      color: 'text-purple-600'
    },
    {
      icon: Mic,
      title: 'Voice Cloning',
      description: 'Clone any voice with just a short audio sample and use it for your content',
      color: 'text-blue-600'
    },
    {
      icon: RefreshCw,
      title: 'Voice Changer',
      description: 'Transform existing audio files to speak in different voices instantly',
      color: 'text-green-600'
    },
    {
      icon: Sliders,
      title: 'Voice Customization',
      description: 'Fine-tune pitch, speed, emotion, and other parameters for perfect results',
      color: 'text-orange-600'
    }
  ];

  const benefits = [
    'Multiple TTS providers (ElevenLabs, OpenAI, Azure, Google)',
    'Custom voice cloning with just 30 seconds of audio',
    'Real-time voice parameter adjustments',
    'Secure API key management',
    'Audio history and project management',
    'Professional-grade voice quality'
  ];

  const stats = [
    { icon: Users, label: 'Active Users', value: '10,000+' },
    { icon: Volume2, label: 'Voices Generated', value: '500K+' },
    { icon: Star, label: 'User Rating', value: '4.9/5' },
    { icon: Zap, label: 'Processing Speed', value: '<3s' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Mic className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              iSpeech
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The ultimate AI voice processing platform for creators, businesses, and developers. 
            Clone voices, change audio, and generate speech with professional quality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {user ? (
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3">
                <Link to="/tts">
                  Open Voice Studio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3">
                  <Link to="/auth">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 border-purple-300 hover:bg-purple-50">
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
                <div key={index} className="text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Voice Processing Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, modify, and perfect voice content with AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-purple-100 hover:border-purple-300">
                  <CardHeader className="text-center">
                    <Icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-100 to-blue-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose iSpeech?
            </h2>
            <p className="text-xl text-gray-600">
              Professional voice processing made simple and accessible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="pt-8 pb-8">
              <Shield className="h-16 w-16 mx-auto mb-6 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Voice Content?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of creators using iSpeech for professional voice processing. 
                Start for free with our basic features, no credit card required.
              </p>
              
              {!user && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Link to="/auth">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-purple-300 hover:bg-purple-50">
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
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mic className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold">iSpeech</span>
          </div>
          <p className="text-gray-400">
            © 2024 iSpeech. Professional AI voice processing platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
