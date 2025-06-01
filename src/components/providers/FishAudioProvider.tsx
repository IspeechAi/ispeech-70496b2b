
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Fish, Key, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { VoiceConfig } from '@/config/voiceConfigs';

interface FishAudioProviderProps {
  onVoicesLoaded: (voices: VoiceConfig[]) => void;
  onApiKeyChange: (key: string) => void;
  apiKey: string;
}

const FishAudioProvider = ({ onVoicesLoaded, onApiKeyChange, apiKey }: FishAudioProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState<VoiceConfig[]>([]);
  const [isKeyValid, setIsKeyValid] = useState(false);
  const { toast } = useToast();

  const fetchFishAudioVoices = async (key: string) => {
    if (!key.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-fish-voices', {
        body: { apiKey: key.trim() }
      });

      if (error) throw error;

      const fetchedVoices: VoiceConfig[] = data.voices || [];
      setVoices(fetchedVoices);
      setIsKeyValid(true);
      onVoicesLoaded(fetchedVoices);
      
      toast({
        title: "Fish Audio Connected",
        description: `Loaded ${fetchedVoices.length} voices successfully.`,
      });
    } catch (error) {
      console.error('Fish Audio fetch error:', error);
      setIsKeyValid(false);
      toast({
        title: "Failed to load voices",
        description: "Please check your Fish Audio API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySubmit = () => {
    fetchFishAudioVoices(apiKey);
  };

  const handleKeyChange = (value: string) => {
    onApiKeyChange(value);
    if (!value.trim()) {
      setIsKeyValid(false);
      setVoices([]);
    }
  };

  return (
    <Card className="border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-cyan-900/20 backdrop-blur-sm shadow-2xl shadow-cyan-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-300">
          <Fish className="h-5 w-5" />
          Fish Audio Provider
          {isKeyValid && <CheckCircle className="h-4 w-4 text-green-400" />}
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Connect your Fish Audio API key to access advanced voice synthesis
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Enter Fish Audio API Key"
            value={apiKey}
            onChange={(e) => handleKeyChange(e.target.value)}
            className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-gray-500"
          />
          <Button
            onClick={handleApiKeySubmit}
            disabled={!apiKey.trim() || isLoading}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Key className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {voices.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-cyan-300 mb-2">Available Voices: {voices.length}</p>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {voices.map((voice) => (
                <div key={voice.id} className="text-xs text-gray-400 bg-slate-800/30 rounded p-2">
                  <div className="font-medium text-cyan-300">{voice.name}</div>
                  <div className="text-gray-500">{voice.category}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-xs text-blue-300">
            💡 Fish Audio offers advanced voice cloning and synthesis with natural-sounding results.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FishAudioProvider;
