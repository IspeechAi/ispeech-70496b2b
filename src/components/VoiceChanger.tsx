
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { VoiceClone } from '@/types/voiceClones';
import AudioFileUpload from './voice-changer/AudioFileUpload';
import TargetVoiceSelector from './voice-changer/TargetVoiceSelector';
import ConversionResults from './voice-changer/ConversionResults';

const VoiceChanger = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedTargetVoice, setSelectedTargetVoice] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedAudioUrl, setProcessedAudioUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [playingOriginal, setPlayingOriginal] = useState(false);
  const [playingProcessed, setPlayingProcessed] = useState(false);
  const [myVoices, setMyVoices] = useState<VoiceClone[]>([]);
  const [originalAudioElement, setOriginalAudioElement] = useState<HTMLAudioElement | null>(null);
  const [processedAudioElement, setProcessedAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { user } = useAuthStore();

  React.useEffect(() => {
    if (user) {
      fetchMyVoices();
    }
  }, [user]);

  const fetchMyVoices = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('voice_clones')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'ready')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyVoices(data || []);
    } catch (error) {
      console.error('Error fetching my voices:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        if (file.size > 25 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload an audio file smaller than 25MB (or 5 minutes)",
            variant: "destructive",
          });
          return;
        }
        setAudioFile(file);
        setProcessedAudioUrl(null);
        setTranscription('');
        toast({
          title: "Audio uploaded",
          description: `File: ${file.name}`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (MP3, WAV, M4A)",
          variant: "destructive",
        });
      }
    }
  };

  const processVoiceChange = async () => {
    if (!audioFile || !selectedTargetVoice) {
      toast({
        title: "Missing information",
        description: "Please provide both an audio file and select a target voice",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use voice changer",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const base64Audio = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(audioFile);
      });

      const { data, error } = await supabase.functions.invoke('voice-change', {
        body: {
          audioFile: base64Audio,
          targetVoice: selectedTargetVoice,
          sourceFileName: audioFile.name
        }
      });

      if (error) throw error;

      if (data.audioUrl) {
        setProcessedAudioUrl(data.audioUrl);
        setTranscription(data.transcription || '');
        toast({
          title: "Voice conversion complete!",
          description: "Your audio has been successfully converted to the selected voice.",
        });
      }
    } catch (error) {
      console.error('Voice changing error:', error);
      toast({
        title: "Conversion failed",
        description: "Could not convert your voice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const playOriginalAudio = () => {
    if (!audioFile) return;

    if (originalAudioElement) {
      originalAudioElement.pause();
      setOriginalAudioElement(null);
      setPlayingOriginal(false);
      return;
    }

    const url = URL.createObjectURL(audioFile);
    const audio = new Audio(url);
    setOriginalAudioElement(audio);
    setPlayingOriginal(true);

    audio.onended = () => {
      setPlayingOriginal(false);
      setOriginalAudioElement(null);
      URL.revokeObjectURL(url);
    };

    audio.onerror = () => {
      setPlayingOriginal(false);
      setOriginalAudioElement(null);
      URL.revokeObjectURL(url);
      toast({
        title: "Playback Error",
        description: "Failed to play original audio file.",
        variant: "destructive",
      });
    };

    audio.play();
  };

  const playProcessedAudio = () => {
    if (!processedAudioUrl) return;

    if (processedAudioElement) {
      processedAudioElement.pause();
      setProcessedAudioElement(null);
      setPlayingProcessed(false);
      return;
    }

    const audio = new Audio(processedAudioUrl);
    setProcessedAudioElement(audio);
    setPlayingProcessed(true);

    audio.onended = () => {
      setPlayingProcessed(false);
      setProcessedAudioElement(null);
    };

    audio.onerror = () => {
      setPlayingProcessed(false);
      setProcessedAudioElement(null);
      toast({
        title: "Playback Error",
        description: "Failed to play processed audio file.",
        variant: "destructive",
      });
    };

    audio.play();
  };

  const downloadProcessedAudio = () => {
    if (!processedAudioUrl) return;

    const link = document.createElement('a');
    link.href = processedAudioUrl;
    link.download = `voice_changed_${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 shadow-xl shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <RefreshCw className="h-6 w-6 text-cyan-400" />
            Voice Changer
          </CardTitle>
          <p className="text-gray-400">
            Upload an audio file and convert it to any voice from our collection or your custom clones.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <AudioFileUpload
            audioFile={audioFile}
            onFileUpload={handleFileUpload}
            onPlayOriginal={playOriginalAudio}
            playingOriginal={playingOriginal}
          />

          <TargetVoiceSelector
            selectedTargetVoice={selectedTargetVoice}
            onVoiceChange={setSelectedTargetVoice}
            myVoices={myVoices}
          />

          <Button
            onClick={processVoiceChange}
            disabled={!audioFile || !selectedTargetVoice || isProcessing}
            className="w-full h-12 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Converting Voice...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Convert Voice
              </>
            )}
          </Button>

          <ConversionResults
            processedAudioUrl={processedAudioUrl}
            transcription={transcription}
            playingProcessed={playingProcessed}
            onPlayProcessed={playProcessedAudio}
            onDownload={downloadProcessedAudio}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceChanger;
