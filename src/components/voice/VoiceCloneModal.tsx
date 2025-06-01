
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { ApiProvider } from '@/types/providers';

interface VoiceCloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ApiProvider;
  onCloneSuccess: (voice: any) => void;
}

const VoiceCloneModal = ({ isOpen, onClose, provider, onCloneSuccess }: VoiceCloneModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 25MB",
          variant: "destructive",
        });
        return;
      }
      setAudioFile(file);
    }
  };

  const handleClone = async () => {
    if (!user || !name.trim() || !audioFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsCloning(true);
    try {
      // Convert file to base64
      const base64Audio = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(audioFile);
      });

      const { data, error } = await supabase.functions.invoke('clone-voice', {
        body: {
          name: name.trim(),
          description: description.trim(),
          audioData: base64Audio,
          provider: provider.id,
          userId: user.id
        }
      });

      if (error) throw error;

      toast({
        title: "🎉 Voice cloning started!",
        description: `${name} is being processed. You'll be notified when it's ready.`,
      });

      onCloneSuccess(data.voice);
      onClose();
      
      // Reset form
      setName('');
      setDescription('');
      setAudioFile(null);
    } catch (error) {
      console.error('Voice cloning error:', error);
      toast({
        title: "❌ Cloning failed",
        description: error.message || "Failed to start voice cloning",
        variant: "destructive",
      });
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{provider.icon}</span>
            Clone Voice with {provider.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="voice-name" className="text-gray-300">Voice Name *</Label>
            <Input
              id="voice-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your voice"
              className="bg-slate-800/50 border-purple-500/30 text-white mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="voice-description" className="text-gray-300">Description</Label>
            <Textarea
              id="voice-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your voice (optional)"
              className="bg-slate-800/50 border-purple-500/30 text-white mt-1"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="voice-audio" className="text-gray-300">Audio Sample *</Label>
            <div className="mt-2 flex items-center justify-center w-full">
              <label
                htmlFor="voice-audio"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-500/50 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-purple-400" />
                  <p className="mb-2 text-sm text-gray-300">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500">MP3, WAV (MAX 25MB, 5 min)</p>
                </div>
                <Input
                  id="voice-audio"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {audioFile && (
              <p className="text-sm text-green-400 mt-2">✓ {audioFile.name}</p>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-500/50 text-gray-300"
              disabled={isCloning}
            >
              Cancel
            </Button>
            <Button
              onClick={handleClone}
              disabled={!name.trim() || !audioFile || isCloning}
              className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              {isCloning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cloning...
                </>
              ) : (
                'Start Cloning'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceCloneModal;
