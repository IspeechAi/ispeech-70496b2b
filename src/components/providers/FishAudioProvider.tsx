
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Fish, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FishVoice {
  id: string;
  name: string;
  preview_url?: string;
}

interface FishAudioProviderProps {
  onVoicesLoaded: (voices: FishVoice[]) => void;
  onApiKeyChange: (key: string) => void;
  apiKey: string;
}

const FishAudioProvider = ({ onVoicesLoaded, onApiKeyChange, apiKey }: FishAudioProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState<FishVoice[]>([]);
  const { toast } = useToast();

  const fetchFishAudioVoices = async (key: string) => {
    if (!key.trim()) return;
    
    setIsLoading(true);
    try {
      // Mock Fish Audio voices for demo - replace with real API call
      const mockVoices: FishVoice[] = [
        { id: 'fish_voice_1', name: 'Luna (Female)' },
        { id: 'fish_voice_2', name: 'Orion (Male)' },
        { id: 'fish_voice_3', name: 'Stella (Female)' },
        { id: 'fish_voice_4', name: 'Cosmos (Male)' },
        { id: 'fish_voice_5', name: 'Aurora (Female)' },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setVoices(mockVoices);
      onVoicesLoaded(mockVoices);
      toast({
        title: "Fish Audio Connected",
        description: `Loaded ${mockVoices.length} voices successfully.`,
      });
    } catch (error) {
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

  return (
    <Card className="border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-cyan-900/20 backdrop-blur-sm shadow-2xl shadow-cyan-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-300">
          <Fish className="h-5 w-5" />
          Fish Audio Provider
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Enter Fish Audio API Key"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
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
            <div className="grid grid-cols-2 gap-2">
              {voices.slice(0, 4).map((voice) => (
                <div key={voice.id} className="text-xs text-gray-400 bg-slate-800/30 rounded p-2">
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

export default FishAudioProvider;
