
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Play, Pause, Loader2, RefreshCw, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { VoiceClone } from '@/types/voiceClones';

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

  const defaultVoices = [
    { id: 'alloy', name: 'Alloy - Balanced and clear', provider: 'OpenAI' },
    { id: 'echo', name: 'Echo - Deep and resonant', provider: 'OpenAI' },
    { id: 'fable', name: 'Fable - Storytelling voice', provider: 'OpenAI' },
    { id: 'onyx', name: 'Onyx - Strong and confident', provider: 'OpenAI' },
    { id: 'nova', name: 'Nova - Bright and energetic', provider: 'OpenAI' },
    { id: 'shimmer', name: 'Shimmer - Soft and elegant', provider: 'OpenAI' },
    { id: 'alice', name: 'Alice - Professional and warm', provider: 'ElevenLabs' },
    { id: 'bill', name: 'Bill - Authoritative narrator', provider: 'ElevenLabs' },
    { id: 'brian', name: 'Brian - Friendly conversational', provider: 'ElevenLabs' },
    { id: 'charlie', name: 'Charlie - Youthful and energetic', provider: 'ElevenLabs' },
    { id: 'daniel', name: 'Daniel - Calm and reassuring', provider: 'ElevenLabs' },
    { id: 'jessica', name: 'Jessica - Clear and articulate', provider: 'ElevenLabs' },
    { id: 'liam', name: 'Liam - Rich and expressive', provider: 'ElevenLabs' },
    { id: 'matilda', name: 'Matilda - Mature sophisticated', provider: 'ElevenLabs' },
    { id: 'river', name: 'River - Natural and flowing', provider: 'ElevenLabs' },
    { id: 'will', name: 'Will - Dynamic and engaging', provider: 'ElevenLabs' },
    { id: 'adam', name: 'Adam - Professional clarity', provider: 'ElevenLabs' },
    { id: 'rachel', name: 'Rachel - Expressive storyteller', provider: 'ElevenLabs' }
  ];

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
      // Convert audio file to base64
      const base64Audio = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(audioFile);
      });

      // Call voice change edge function
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
          {/* File Upload */}
          <div>
            <Label htmlFor="voice-file" className="text-gray-300">Upload Audio File</Label>
            <div className="mt-2 flex items-center justify-center w-full">
              <label
                htmlFor="voice-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-500/50 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-4 text-purple-400" />
                  <p className="mb-2 text-sm text-gray-300">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">MP3, WAV, M4A (MAX 25MB or 5 minutes)</p>
                </div>
                <Input
                  id="voice-file"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {audioFile && (
              <div className="mt-2 flex items-center justify-between p-3 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-green-300">✓ {audioFile.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={playOriginalAudio}
                  className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
                >
                  {playingOriginal ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Target Voice Selection */}
          <div>
            <Label htmlFor="target-voice" className="text-gray-300">Select Target Voice</Label>
            <Select value={selectedTargetVoice} onValueChange={setSelectedTargetVoice}>
              <SelectTrigger className="mt-2 bg-slate-800/50 border-purple-500/30 text-white focus:border-purple-400">
                <SelectValue placeholder="Choose a voice to convert to" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/50">
                <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Default Voices
                </div>
                {defaultVoices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id} className="text-gray-300 focus:bg-purple-500/20">
                    <div className="flex flex-col">
                      <span>{voice.name}</span>
                      <span className="text-xs text-gray-500">{voice.provider}</span>
                    </div>
                  </SelectItem>
                ))}
                {myVoices.length > 0 && (
                  <>
                    <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide border-t border-purple-500/30 mt-2 pt-2">
                      My Voices
                    </div>
                    {myVoices.map((voice) => (
                      <SelectItem key={`clone_${voice.id}`} value={`clone_${voice.id}`} className="text-gray-300 focus:bg-purple-500/20">
                        <div className="flex flex-col">
                          <span>{voice.name} (Custom Clone)</span>
                          <span className="text-xs text-gray-500">Personal</span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Convert Button */}
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

          {/* Transcription Display */}
          {transcription && (
            <Card className="border-blue-500/30 bg-blue-500/10">
              <CardContent className="pt-4">
                <h4 className="font-medium text-blue-300 mb-2">Detected Speech:</h4>
                <p className="text-gray-300 text-sm">{transcription}</p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {processedAudioUrl && (
            <Card className="border-green-500/30 bg-gradient-to-r from-green-500/10 to-cyan-500/10">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-green-300 mb-4 flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Conversion Complete!
                </h3>
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={playProcessedAudio}
                    className="flex-1 border-green-500/50 text-green-300 hover:bg-green-500/20"
                  >
                    {playingProcessed ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play Result
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={downloadProcessedAudio}
                    className="flex-1 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceChanger;
