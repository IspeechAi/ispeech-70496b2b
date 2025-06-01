
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, Mic, MicOff, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ApiProvider } from '@/types/providers';

interface VoiceCloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ApiProvider;
  onCloneSuccess: (voice: any) => void;
}

const VoiceCloneModal = ({ isOpen, onClose, provider, onCloneSuccess }: VoiceCloneModalProps) => {
  const [voiceName, setVoiceName] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [cloneProgress, setCloneProgress] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
        setAudioFile(file);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 25MB",
          variant: "destructive",
        });
        return;
      }
      setAudioFile(file);
    }
  };

  const handleCloneVoice = async () => {
    if (!voiceName.trim() || !audioFile) {
      toast({
        title: "Missing Information",
        description: "Please provide both a voice name and audio file",
        variant: "destructive",
      });
      return;
    }

    setIsCloning(true);
    setCloneProgress(0);

    try {
      // Convert file to base64
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioFile);
      });

      setCloneProgress(30);

      const { data, error } = await supabase.functions.invoke('clone-voice', {
        body: {
          provider: provider.id,
          voiceName: voiceName.trim(),
          audioFile: base64Audio
        }
      });

      if (error) throw error;

      setCloneProgress(100);

      toast({
        title: "🎉 Voice Cloned Successfully!",
        description: `${voiceName} is now available in your voice library`,
      });

      onCloneSuccess(data.voice);
      onClose();
      
      // Reset form
      setVoiceName('');
      setAudioFile(null);
      setCloneProgress(0);

    } catch (error) {
      console.error('Voice cloning error:', error);
      toast({
        title: "⚠️ Cloning Failed",
        description: error.message || "Failed to clone voice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-cyan-400" />
            Clone Voice with {provider.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="voice-name" className="text-gray-300">Voice Name</Label>
            <Input
              id="voice-name"
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              placeholder="My Custom Voice"
              className="bg-slate-800/50 border-purple-500/30 text-white"
              maxLength={50}
            />
          </div>

          <div>
            <Label className="text-gray-300 mb-3 block">Audio Sample</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant="outline"
                className={`border-purple-500/50 ${isRecording ? 'bg-red-500/20 border-red-500' : 'hover:bg-purple-500/20'}`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Record
                  </>
                )}
              </Button>
              
              <label className="cursor-pointer">
                <Button variant="outline" className="w-full border-purple-500/50 hover:bg-purple-500/20" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </span>
                </Button>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {audioFile && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-300 text-sm">
                📁 {audioFile.name} ({(audioFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            </div>
          )}

          {isCloning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Cloning Progress</span>
                <span className="text-cyan-400">{cloneProgress}%</span>
              </div>
              <Progress value={cloneProgress} className="h-2" />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-500/20"
            disabled={isCloning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCloneVoice}
            disabled={!voiceName.trim() || !audioFile || isCloning}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
          >
            {isCloning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cloning...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Clone Voice
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceCloneModal;
