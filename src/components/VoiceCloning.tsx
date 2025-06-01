
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Mic, Trash2, Check, Clock, AlertCircle } from 'lucide-react';
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
        if (file.size > 25 * 1024 * 1024) { // 25MB limit
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      
      // Simple recording simulation for now
      setTimeout(() => {
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
        toast({
          title: "Recording complete",
          description: "Voice sample recorded successfully",
        });
      }, 5000);
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
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
      // Create a new voice clone entry
      const { data, error } = await supabase
        .from('voice_clones')
        .insert({
          user_id: user.id,
          name: voiceName.trim(),
          description: voiceDescription.trim() || null,
          audio_file_url: `temp_${Date.now()}_${audioFile.name}`, // Temporary URL
          status: 'processing'
        })
        .select()
        .single();

      if (error) throw error;

      // Simulate processing time
      setTimeout(async () => {
        try {
          // Update status to ready
          await supabase
            .from('voice_clones')
            .update({ status: 'ready' })
            .eq('id', data.id);

          toast({
            title: "Voice clone created!",
            description: `"${voiceName}" is now available in your voice library`,
          });
          
          setAudioFile(null);
          setVoiceName('');
          setVoiceDescription('');
          fetchVoiceClones();
        } catch (error) {
          console.error('Error updating voice clone status:', error);
        }
        setIsProcessing(false);
      }, 3000);

    } catch (error) {
      console.error('Error creating voice clone:', error);
      setIsProcessing(false);
      toast({
        title: "Creation failed",
        description: "Could not create voice clone. Please try again.",
        variant: "destructive",
      });
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
        return <Check className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Voice Clone ({voiceClones.length}/3)</CardTitle>
          <p className="text-sm text-gray-600">
            Upload a clear audio sample (minimum 30 seconds) to create your custom voice. You can create up to 3 voice clones.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Name Input */}
          <div>
            <Label htmlFor="voice-name">Voice Name *</Label>
            <Input
              id="voice-name"
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              placeholder="Enter a name for your voice clone"
              className="mt-1"
              maxLength={50}
            />
          </div>

          {/* Voice Description */}
          <div>
            <Label htmlFor="voice-description">Description (Optional)</Label>
            <Textarea
              id="voice-description"
              value={voiceDescription}
              onChange={(e) => setVoiceDescription(e.target.value)}
              placeholder="Describe this voice (e.g., 'Professional male voice for presentations')"
              className="mt-1"
              maxLength={200}
            />
          </div>

          {/* Audio Upload Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload */}
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <h3 className="font-medium mb-2">Upload Audio File</h3>
                <p className="text-sm text-gray-500 mb-4">
                  MP3, WAV, or M4A files (max 25MB)
                </p>
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="audio-upload"
                />
                <Label htmlFor="audio-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </Label>
                {audioFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {audioFile.name}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Record Audio */}
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <Mic className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <h3 className="font-medium mb-2">Record Voice Sample</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Record directly from your microphone
                </p>
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  onClick={startRecording}
                  disabled={isRecording}
                >
                  {isRecording ? (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Create Voice Clone Button */}
          <Button
            onClick={createVoiceClone}
            disabled={!audioFile || !voiceName.trim() || isProcessing || voiceClones.length >= 3}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing Voice Clone...
              </>
            ) : voiceClones.length >= 3 ? (
              'Voice Limit Reached (3/3)'
            ) : (
              'Create Voice Clone'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Voice Library */}
      <Card>
        <CardHeader>
          <CardTitle>My Voice Library ({voiceClones.length}/3)</CardTitle>
          <p className="text-sm text-gray-600">
            Manage your created voice clones
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading your voice library...</p>
            </div>
          ) : voiceClones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No voice clones created yet</p>
              <p className="text-sm">Upload an audio sample to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {voiceClones.map((clone) => (
                <Card key={clone.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center gap-2">
                          {clone.name}
                          {getStatusIcon(clone.status)}
                        </h4>
                        <p className="text-xs text-gray-500 capitalize">{clone.status}</p>
                        {clone.description && (
                          <p className="text-sm text-gray-600 mt-1">{clone.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteVoiceClone(clone.id, clone.name)}
                        className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">
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
