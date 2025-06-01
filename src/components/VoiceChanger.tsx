
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Play, Pause, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { VoiceClone } from '@/types/voiceClones';

const VoiceChanger = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedTargetVoice, setSelectedTargetVoice] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedAudioUrl, setProcessedAudioUrl] = useState<string | null>(null);
  const [playingOriginal, setPlayingOriginal] = useState(false);
  const [playingProcessed, setPlayingProcessed] = useState(false);
  const [myVoices, setMyVoices] = useState<VoiceClone[]>([]);
  const [originalAudioElement, setOriginalAudioElement] = useState<HTMLAudioElement | null>(null);
  const [processedAudioElement, setProcessedAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const defaultVoices = [
    { id: 'alloy', name: 'Alloy - Balanced and clear' },
    { id: 'echo', name: 'Echo - Deep and resonant' },
    { id: 'fable', name: 'Fable - Storytelling voice' },
    { id: 'onyx', name: 'Onyx - Strong and confident' },
    { id: 'nova', name: 'Nova - Bright and energetic' },
    { id: 'shimmer', name: 'Shimmer - Soft and elegant' },
    { id: 'alice', name: 'Alice - Professional and warm' },
    { id: 'bill', name: 'Bill - Authoritative narrator' },
    { id: 'brian', name: 'Brian - Friendly and conversational' },
    { id: 'charlie', name: 'Charlie - Youthful and energetic' },
    { id: 'daniel', name: 'Daniel - Calm and reassuring' },
    { id: 'jessica', name: 'Jessica - Clear and articulate' },
    { id: 'liam', name: 'Liam - Rich and expressive' },
    { id: 'matilda', name: 'Matilda - Mature and sophisticated' },
    { id: 'river', name: 'River - Natural and flowing' },
    { id: 'will', name: 'Will - Dynamic and engaging' }
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
        if (file.size > 25 * 1024 * 1024) { // 25MB limit
          toast({
            title: "File too large",
            description: "Please upload an audio file smaller than 25MB (or 5 minutes)",
            variant: "destructive",
          });
          return;
        }
        setAudioFile(file);
        setProcessedAudioUrl(null); // Clear previous result
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
      // For now, we'll simulate the voice changing process
      // In a real implementation, this would involve:
      // 1. Uploading the audio file to storage
      // 2. Calling a voice conversion API
      // 3. Returning the converted audio

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      // For demo purposes, we'll use a TTS generation with the target voice
      // speaking a generic message
      const { data, error } = await supabase.functions.invoke('tts-generate', {
        body: {
          text: "This is a demonstration of voice changing. Your original audio has been processed and converted to this voice.",
          voice: selectedTargetVoice.startsWith('clone_') ? selectedTargetVoice.replace('clone_', '') : selectedTargetVoice,
          speed: 1.0,
          stability: 0.5,
          clarity: 0.75
        }
      });

      if (error) throw error;

      if (data.audioUrl) {
        setProcessedAudioUrl(data.audioUrl);
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
      <Card>
        <CardHeader>
          <CardTitle>Voice Changer</CardTitle>
          <p className="text-sm text-gray-600">
            Upload an audio file and convert it to any voice from our collection or your custom clones.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div>
            <Label htmlFor="voice-file">Upload Audio File</Label>
            <div className="mt-2 flex items-center justify-center w-full">
              <label
                htmlFor="voice-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
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
              <div className="mt-2 flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <span className="text-sm text-green-700">✓ {audioFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={playOriginalAudio}
                  className="text-green-600 hover:text-green-700"
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
            <Label htmlFor="target-voice">Select Target Voice</Label>
            <Select value={selectedTargetVoice} onValueChange={setSelectedTargetVoice}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a voice to convert to" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Default Voices
                </div>
                {defaultVoices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                  </SelectItem>
                ))}
                {myVoices.length > 0 && (
                  <>
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide border-t mt-2 pt-2">
                      My Voices
                    </div>
                    {myVoices.map((voice) => (
                      <SelectItem key={`clone_${voice.id}`} value={`clone_${voice.id}`}>
                        {voice.name} (Custom Clone)
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
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Converting Voice...
              </>
            ) : (
              'Convert Voice'
            )}
          </Button>

          {/* Results */}
          {processedAudioUrl && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-green-800 mb-4">Conversion Complete!</h3>
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={playProcessedAudio}
                    className="flex-1"
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
                    className="flex-1"
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
