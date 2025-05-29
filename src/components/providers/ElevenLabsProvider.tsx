
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Volume2, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  preview_url?: string;
}

interface ElevenLabsProviderProps {
  onVoicesLoaded: (voices: ElevenLabsVoice[]) => void;
  onApiKeyChange: (key: string) => void;
  apiKey: string;
}

const ElevenLabsProvider = ({ onVoicesLoaded, onApiKeyChange, apiKey }: ElevenLabsProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const { toast } = useToast();

  const fetchElevenLabsVoices = async (key: string) => {
    if (!key.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': key,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid API key or failed to fetch voices');
      }

      const data = await response.json();
      const voiceList = data.voices || [];
      
      setVoices(voiceList);
      onVoicesLoaded(voiceList);
      toast({
        title: "ElevenLabs Connected",
        description: `Loaded ${voiceList.length} voices successfully.`,
      });
    } catch (error) {
      toast({
        title: "Failed to load voices",
        description: "Please check your ElevenLabs API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySubmit = () => {
    fetchElevenLabsVoices(apiKey);
  };

  return (
    <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-2xl shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-300">
          <Volume2 className="h-5 w-5" />
          ElevenLabs Provider
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Enter ElevenLabs API Key"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-500"
          />
          <Button
            onClick={handleApiKeySubmit}
            disabled={!apiKey.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
            <p className="text-sm text-purple-300 mb-2">Available Voices: {voices.length}</p>
            <div className="grid grid-cols-2 gap-2">
              {voices.slice(0, 4).map((voice) => (
                <div key={voice.voice_id} className="text-xs text-gray-400 bg-slate-800/30 rounded p-2">
                  {voice.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ElevenLabsProvider;
