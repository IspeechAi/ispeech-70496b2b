import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Volume2, Sparkles, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

interface VoiceCloning {
  onVoiceCloned: () => void;
}

const VoiceCloning = ({ onVoiceCloned }: VoiceCloning) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [voiceName, setVoiceName] = useState('');
  const [description, setDescription] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (25MB limit)
      const maxSize = 25 * 1024 * 1024; // 25MB in bytes
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 25MB.",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file.",
          variant: "destructive",
        });
        return;
      }

      setAudioFile(file);
      setUploadProgress(0);
    }
  };

  const handleStartCloning = async () => {
    if (!audioFile || !voiceName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both an audio file and a voice name.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to clone voices.",
        variant: "destructive",
      });
      return;
    }

    setIsCloning(true);
    setUploadProgress(0);

    try {
      // Convert file to base64
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:audio/... prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioFile);
      });

      // Create voice clone record
      const { data: voiceClone, error: insertError } = await supabase
        .from('voice_clones')
        .insert({
          user_id: user.id,
          name: voiceName.trim(),
          description: description.trim(),
          status: 'processing'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setUploadProgress(50);

      // Process the voice clone
      const { data, error } = await supabase.functions.invoke('voice-clone-process', {
        body: {
          voiceCloneId: voiceClone.id,
          audioFile: base64Audio,
          name: voiceName.trim(),
          description: description.trim()
        }
      });

      if (error) throw error;

      setUploadProgress(100);

      toast({
        title: "Voice cloning successful!",
        description: `${voiceName} has been cloned and is ready to use.`,
      });

      // Reset form
      setAudioFile(null);
      setVoiceName('');
      setDescription('');
      setUploadProgress(0);
      
      // Notify parent component
      if (onVoiceCloned) {
        onVoiceCloned();
      }

    } catch (error) {
      console.error('Voice cloning error:', error);
      toast({
        title: "Cloning failed",
        description: error.message || "Failed to clone voice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <Card className="border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-cyan-900/20 backdrop-blur-sm shadow-2xl shadow-cyan-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-300">
          <Sparkles className="h-6 w-6" />
          Voice Cloning Studio
        </CardTitle>
        <p className="text-gray-400">
          Upload a clean audio sample to create your custom AI voice clone
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-8 text-center hover:border-cyan-500/50 transition-colors">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          <Volume2 className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-2">Upload Audio Sample</p>
          <p className="text-sm text-gray-500 mb-4">
            MP3, WAV, M4A • Max 25MB • 30 seconds to 5 minutes recommended
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose Audio File
          </Button>
        </div>

        {audioFile && (
          <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-cyan-400" />
              <div className="flex-1">
                <p className="text-cyan-300 font-medium">{audioFile.name}</p>
                <p className="text-xs text-gray-400">
                  Size: {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAudioFile(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Voice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="voice-name" className="text-gray-300">Voice Name *</Label>
            <Input
              id="voice-name"
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              placeholder="My Custom Voice"
              className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-gray-500"
              maxLength={50}
            />
          </div>
          <div>
            <Label htmlFor="voice-description" className="text-gray-300">Description</Label>
            <Input
              id="voice-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Professional male voice"
              className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-gray-500"
              maxLength={100}
            />
          </div>
        </div>

        {/* Progress Bar */}
        {isCloning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Cloning Progress</span>
              <span className="text-cyan-400">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Clone Button */}
        <Button
          onClick={handleStartCloning}
          disabled={!audioFile || !voiceName.trim() || isCloning}
          className="w-full h-12 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 disabled:opacity-50"
        >
          {isCloning ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Cloning Voice...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Clone Voice
            </>
          )}
        </Button>

        {/* Guidelines */}
        <Card className="border-purple-500/30 bg-purple-500/10">
          <CardContent className="pt-6">
            <h3 className="font-medium text-purple-300 mb-3">Voice Cloning Guidelines</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Use clear, high-quality audio without background noise</li>
              <li>• Include diverse speech patterns and emotions</li>
              <li>• Speak at a natural pace with clear pronunciation</li>
              <li>• Minimum 30 seconds, maximum 5 minutes recommended</li>
              <li>• Ensure you have rights to clone the voice</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default VoiceCloning;
