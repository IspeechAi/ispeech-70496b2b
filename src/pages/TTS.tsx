
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Volume2, Play, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import GalaxyBackground from '@/components/galaxy/GalaxyBackground';
import ApiKeyBar from '@/components/api/ApiKeyBar';
import VoiceDropdown from '@/components/voice/VoiceDropdown';
import VoiceCloneModal from '@/components/voice/VoiceCloneModal';
import TTSGenerator from '@/components/tts/TTSGenerator';

import { API_PROVIDERS } from '@/config/providers';
import { Voice, ApiKeyStatus } from '@/types/providers';

const TTS = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [apiKeyStatuses, setApiKeyStatuses] = useState<Record<string, ApiKeyStatus>>({});
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [selectedProviderForCloning, setSelectedProviderForCloning] = useState<string>('');
  const [galaxyMode, setGalaxyMode] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      fetchApiKeyStatuses();
      fetchUserVoices();
    }
  }, [user, navigate]);

  const fetchApiKeyStatuses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('get-api-key-status', {
        body: { userId: user.id }
      });

      if (error) throw error;

      const statusMap: Record<string, ApiKeyStatus> = {};
      (data.statuses || []).forEach((status: ApiKeyStatus) => {
        statusMap[status.provider] = status;
      });
      setApiKeyStatuses(statusMap);
    } catch (error) {
      console.error('Error fetching API key statuses:', error);
    }
  };

  const fetchUserVoices = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('get-user-voices', {
        body: { userId: user.id }
      });

      if (error) throw error;

      setVoices(data.voices || []);
    } catch (error) {
      console.error('Error fetching voices:', error);
    }
  };

  const handleKeyValidated = (provider: string) => {
    setApiKeyStatuses(prev => ({
      ...prev,
      [provider]: { ...prev[provider], isValid: true, isActive: true }
    }));
    fetchUserVoices();
    
    toast({
      title: "✅ API Key Verified",
      description: `Your ${provider} API key has been validated and saved securely.`,
    });
  };

  const handleVoicesLoaded = (provider: string, newVoices: any[]) => {
    const formattedVoices: Voice[] = newVoices.map(voice => ({
      id: voice.id,
      name: voice.name,
      provider: provider,
      gender: voice.gender,
      language: voice.language,
      isCloned: voice.isCloned || false,
      preview_url: voice.preview_url
    }));

    setVoices(prev => [
      ...prev.filter(v => v.provider !== provider),
      ...formattedVoices
    ]);
  };

  const handleOpenCloneModal = (provider: string) => {
    setSelectedProviderForCloning(provider);
    setCloneModalOpen(true);
  };

  const handleCloneSuccess = (newVoice: any) => {
    const voice: Voice = {
      id: newVoice.id,
      name: newVoice.name,
      provider: selectedProviderForCloning,
      isCloned: true
    };

    setVoices(prev => [...prev, voice]);
    setSelectedVoice(voice.id);
    
    toast({
      title: "🎉 Voice Cloned Successfully!",
      description: `${voice.name} has been added to your voice library`,
    });
  };

  const handleQuotaExhausted = (provider: string) => {
    toast({
      title: "⚠️ Usage Limit Reached",
      description: `Your ${provider} API key has reached its usage limit. Please add another key or wait for the quota to reset.`,
      variant: "destructive",
    });

    // Auto-enable next available provider
    const nextProvider = API_PROVIDERS.find(p => 
      p.id !== provider && apiKeyStatuses[p.id]?.isActive
    );
    
    if (nextProvider) {
      toast({
        title: "🔄 Switching Provider",
        description: `Automatically switched to ${nextProvider.name}`,
      });
    } else {
      toast({
        title: "❌ No Available Providers",
        description: "Please add a new API key to continue generating audio.",
        variant: "destructive",
      });
    }
  };

  const selectedVoiceObj = voices.find(v => v.id === selectedVoice) || null;

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {galaxyMode && <GalaxyBackground />}
      
      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Header with Galaxy Toggle */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                iSpeech
              </span>
            </h1>
            <Button
              onClick={() => setGalaxyMode(!galaxyMode)}
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
            >
              {galaxyMode ? '🌌' : '⭐'} Galaxy Mode
            </Button>
          </div>
          <p className="text-xl text-gray-300">
            Experience the future of voice generation with advanced AI technology
          </p>
        </div>

        {/* API Key Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {API_PROVIDERS.map((provider) => (
            <div key={provider.id} className="space-y-3">
              <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10 galaxy-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <span className="text-2xl">{provider.icon}</span>
                    {provider.name}
                  </CardTitle>
                  <p className="text-sm text-gray-400">{provider.description}</p>
                </CardHeader>
                <CardContent>
                  <ApiKeyBar
                    provider={provider}
                    status={apiKeyStatuses[provider.id] || null}
                    onKeyValidated={handleKeyValidated}
                    onVoicesLoaded={handleVoicesLoaded}
                    onQuotaExhausted={handleQuotaExhausted}
                  />
                  
                  {/* Quota Display */}
                  {apiKeyStatuses[provider.id]?.isActive && (
                    <div className="mt-3 p-2 bg-slate-800/50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Usage:</span>
                        <span className="text-cyan-300">
                          {apiKeyStatuses[provider.id]?.quotaUsed || 0} / {apiKeyStatuses[provider.id]?.quotaLimit || '∞'}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Voice Cloning Button */}
              {provider.supportsCloning && apiKeyStatuses[provider.id]?.isActive && (
                <Button
                  onClick={() => handleOpenCloneModal(provider.id)}
                  variant="outline"
                  className="w-full border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 galaxy-glow"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  🎙 Clone Voice with {provider.name}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Voice Selection and Generation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10 galaxy-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Select Voice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceDropdown
                  voices={voices}
                  selectedVoice={selectedVoice}
                  onVoiceChange={setSelectedVoice}
                />
                
                {/* Voice Stats */}
                <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Voices:</span>
                      <span className="text-cyan-300">{voices.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cloned Voices:</span>
                      <span className="text-cyan-300">{voices.filter(v => v.isCloned).length}</span>
                    </div>
                    {selectedVoiceObj && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Selected:</span>
                        <span className="text-cyan-300">{selectedVoiceObj.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <TTSGenerator
              selectedVoice={selectedVoiceObj}
              voices={voices}
              apiKeyStatuses={apiKeyStatuses}
              onQuotaExhausted={handleQuotaExhausted}
            />
          </div>
        </div>

        {/* Voice Clone Modal */}
        <VoiceCloneModal
          isOpen={cloneModalOpen}
          onClose={() => setCloneModalOpen(false)}
          provider={API_PROVIDERS.find(p => p.id === selectedProviderForCloning)!}
          onCloneSuccess={handleCloneSuccess}
        />
      </div>
    </div>
  );
};

export default TTS;
