
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Mic, Trash2, Check, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { VoiceClone } from '@/types/voiceClones';

const VoiceCloning = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [voiceName, setVoiceName] = useState('');
  const [voiceDescription, setVoiceDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceClones, setVoiceClones] = useState<VoiceClone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuthStore();

  React.useEffect(() => {
    if (user) {
      fetchVoiceClones();
    }
  }, [user]);

  const fetchVoiceClones = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('voice_clones')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVoiceClones(data || []);
    } catch (error) {
      console.error('Error fetching voice clones:', error);
      toast({
        title: "Error loading voice clones",
        description: "Could not load your voice library.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        if (file.size > 25 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload an audio file smaller than 25MB",
            variant: "destructive",
          });
          return;
        }
        setAudioFile(file);
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

  const createVoiceClone = async () => {
    if (!audioFile || !voiceName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both an audio file and voice name",
        variant: "destructive",
      });
      return;
    }

    if (voiceClones.length >= 3) {
      toast({
        title: "Voice limit reached",
        description: "You can only create up to 3 voice clones. Delete one to create a new one.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create voice clones",
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
          resolve(result.split(',')[1]); // Remove data:audio/... prefix
        };
        reader.readAsDataURL(audioFile);
      });

      // Create voice clone entry
      const { data, error } = await supabase
        .from('voice_clones')
        .insert({
          user_id: user.id,
          name: voiceName.trim(),
          description: voiceDescription.trim() || null,
          audio_file_url: `processing_${Date.now()}`,
          status: 'processing'
        })
        .select()
        .single();

      if (error) throw error;

      // Process the voice clone using edge function
      const { data: processData, error: processError } = await supabase.functions.invoke('voice-clone-process', {
        body: {
          voiceCloneId: data.id,
          audioFile: base64Audio,
          name: voiceName.trim(),
          description: voiceDescription.trim()
        }
      });

      if (processError) throw processError;

      toast({
        title: "Voice clone created!",
        description: `"${voiceName}" is now available in your voice library`,
      });
      
      setAudioFile(null);
      setVoiceName('');
      setVoiceDescription('');
      fetchVoiceClones();

    } catch (error) {
      console.error('Error creating voice clone:', error);
      toast({
        title: "Creation failed",
        description: "Could not create voice clone. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteVoiceClone = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from('voice_clones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Voice clone deleted",
        description: `"${name}" has been removed from your library`,
      });
      
      fetchVoiceClones();
    } catch (error) {
      console.error('Error deleting voice clone:', error);
      toast({
        title: "Deletion failed",
        description: "Could not delete voice clone. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <Check className="h-4 w-4 text-green-400" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 shadow-xl shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="h-6 w-6 text-purple-400" />
            Create Voice Clone ({voiceClones.length}/3)
          </CardTitle>
          <p className="text-gray-400">
            Upload a clear audio sample (minimum 30 seconds) to create your custom voice. You can create up to 3 voice clones.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Name Input */}
          <div>
            <Label htmlFor="voice-name" className="text-gray-300">Voice Name *</Label>
            <Input
              id="voice-name"
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              placeholder="Enter a name for your voice clone"
              className="mt-1 bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20"
              maxLength={50}
            />
          </div>

          {/* Voice Description */}
          <div>
            <Label htmlFor="voice-description" className="text-gray-300">Description (Optional)</Label>
            <Textarea
              id="voice-description"
              value={voiceDescription}
              onChange={(e) => setVoiceDescription(e.target.value)}
              placeholder="Describe this voice (e.g., 'Professional male voice for presentations')"
              className="mt-1 bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20"
              maxLength={200}
            />
          </div>

          {/* Audio Upload */}
          <Card className="border-dashed border-purple-500/50 bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
            <CardContent className="pt-6 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              <h3 className="font-medium mb-2 text-white">Upload Audio File</h3>
              <p className="text-sm text-gray-400 mb-4">
                MP3, WAV, or M4A files (max 25MB, min 30 seconds)
              </p>
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <Label htmlFor="audio-upload" className="cursor-pointer">
                <Button variant="outline" asChild className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20">
                  <span>Choose File</span>
                </Button>
              </Label>
              {audioFile && (
                <p className="text-sm text-green-400 mt-2 flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" />
                  {audioFile.name}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Create Voice Clone Button */}
          <Button
            onClick={createVoiceClone}
            disabled={!audioFile || !voiceName.trim() || isProcessing || voiceClones.length >= 3}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing Voice Clone...
              </>
            ) : voiceClones.length >= 3 ? (
              'Voice Limit Reached (3/3)'
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Create Voice Clone
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Voice Library */}
      <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 shadow-xl shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-white">My Voice Library ({voiceClones.length}/3)</CardTitle>
          <p className="text-gray-400">Manage your created voice clones</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading your voice library...</p>
            </div>
          ) : voiceClones.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No voice clones created yet</p>
              <p className="text-sm">Upload an audio sample to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {voiceClones.map((clone) => (
                <Card key={clone.id} className="border-purple-500/30 bg-slate-800/30 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center gap-2 text-white">
                          {clone.name}
                          {getStatusIcon(clone.status)}
                        </h4>
                        <p className="text-xs text-gray-400 capitalize">{clone.status}</p>
                        {clone.description && (
                          <p className="text-sm text-gray-300 mt-1">{clone.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteVoiceClone(clone.id, clone.name)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Created {new Date(clone.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceCloning;
