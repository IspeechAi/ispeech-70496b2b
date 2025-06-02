
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Volume2, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import { ProviderSelector, Provider } from '@/components/providers/ProviderSelector';
import { VoiceSelector } from '@/components/providers/VoiceSelector';
import { ApiKeyInput } from '@/components/providers/ApiKeyInput';
import { AudioPlayer } from '@/components/audio/AudioPlayer';

interface Voice {
  id: string;
  name: string;
}

const TTS = () => {
  const [text, setText] = useState('');
  const [provider, setProvider] = useState<Provider>('openai');
  const [voice, setVoice] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean | null>(null);
  const [validating, setValidating] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const { user } = useAuthStore();
  const { credits, deductCredit } = useUserCredits();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    // Reset states when provider changes
    setVoice('');
    setIsApiKeyValid(null);
    setApiKey('');
    setVoices([]);
  }, [provider]);

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    setValidating(true);
    setLoadingVoices(true);
    
    try {
      console.log('Validating API key for provider:', provider);
      
      const { data, error } = await supabase.functions.invoke('validate-api-key', {
        body: { provider, apiKey },
      });

      console.log('Validation response:', data, error);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to validate API key');
      }

      if (data && data.valid) {
        setIsApiKeyValid(true);
        
        // Set voices from the API response
        if (data.voices && Array.isArray(data.voices)) {
          setVoices(data.voices);
          if (data.voices.length > 0) {
            setVoice(data.voices[0].id); // Set first voice as default
          }
          console.log('Loaded voices:', data.voices);
        }
        
        toast({
          title: "Success",
          description: `${data.message}. Loaded ${data.voices?.length || 0} voices.`,
        });
      } else {
        setIsApiKeyValid(false);
        setVoices([]);
        toast({
          title: "Invalid API Key",
          description: data?.message || "The API key is invalid",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('API key validation error:', error);
      setIsApiKeyValid(false);
      setVoices([]);
      toast({
        title: "Validation Failed",
        description: error.message || "Could not validate API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setValidating(false);
      setLoadingVoices(false);
    }
  };

  const generateAudio = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to convert to speech",
        variant: "destructive",
      });
      return;
    }

    if (text.length > 300) {
      toast({
        title: "Error",
        description: "Text is too long. Maximum 300 characters allowed.",
        variant: "destructive",
      });
      return;
    }

    if (credits <= 0) {
      toast({
        title: "No Credits",
        description: "You don't have enough credits to generate audio.",
        variant: "destructive",
      });
      return;
    }

    if (!isApiKeyValid) {
      toast({
        title: "API Key Required",
        description: "Please validate your API key first",
        variant: "destructive",
      });
      return;
    }

    if (!voice) {
      toast({
        title: "Voice Required",
        description: "Please select a voice",
        variant: "destructive",
      });
      return;
    }

    const creditDeducted = await deductCredit();
    if (!creditDeducted) return;

    setGenerating(true);
    setAudioUrl(null);
    setAudioBlob(null);

    try {
      console.log('Generating TTS with:', { text: text.trim(), provider, voice, apiKeyLength: apiKey.length });
      
      const { data, error } = await supabase.functions.invoke('generate-tts', {
        body: {
          text: text.trim(),
          provider,
          voice,
          apiKey,
        },
      });

      console.log('TTS generation response:', data, error);

      if (error) {
        throw new Error(error.message || 'Failed to generate audio');
      }

      if (data && data.audioUrl) {
        setAudioUrl(data.audioUrl);
        
        // Save to history
        await supabase.from('tts_history').insert({
          user_id: user.id,
          text_input: text.trim(),
          provider,
          voice,
          audio_url: data.audioUrl,
        });

        toast({
          title: "Success",
          description: `Audio generated successfully using ${provider}`,
        });
      } else {
        throw new Error('No audio URL returned');
      }
    } catch (error) {
      console.error('TTS generation error:', error);
      
      // Refund the credit on error
      try {
        await supabase
          .from('user_profiles')
          .update({ credits: credits })
          .eq('id', user.id);
      } catch (refundError) {
        console.error('Failed to refund credit:', refundError);
      }

      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate audio. Your credit has been refunded.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Volume2 className="h-8 w-8 text-purple-400" />
              AI Text to Speech
            </h1>
            <p className="text-white/70 text-lg">
              Convert your text into lifelike speech with AI-powered voices
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Generate Speech</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Text to convert ({text.length}/300)
                </label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter the text you want to convert to speech..."
                  maxLength={300}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                />
              </div>

              {/* Provider Selection */}
              <ProviderSelector value={provider} onValueChange={setProvider} />

              {/* API Key Input */}
              <ApiKeyInput
                provider={provider}
                apiKey={apiKey}
                onApiKeyChange={setApiKey}
                isValid={isApiKeyValid}
                onValidate={validateApiKey}
                validating={validating}
              />

              {/* Voice Selection - Only show if API key is valid and voices are loaded */}
              {isApiKeyValid && voices.length > 0 && (
                <VoiceSelector
                  provider={provider}
                  value={voice}
                  onValueChange={setVoice}
                  voices={voices}
                  loading={loadingVoices}
                />
              )}

              {/* Generate Button */}
              <Button
                onClick={generateAudio}
                disabled={!text.trim() || !isApiKeyValid || !voice || generating || credits <= 0}
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Speech'
                )}
              </Button>

              {/* Audio Player */}
              <AudioPlayer audioUrl={audioUrl} audioBlob={audioBlob} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TTS;
