
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Mic, Play, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VoiceCloning = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [voiceName, setVoiceName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        toast({
          title: "Audio uploaded",
          description: `File: ${file.name}`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file",
          variant: "destructive",
        });
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      
      // Simple recording simulation
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
        description: "Could not access microphone",
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

    setIsProcessing(true);
    
    // Simulate voice cloning process
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Voice clone created!",
        description: `"${voiceName}" is now available in your voice library`,
      });
      setAudioFile(null);
      setVoiceName('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Voice Clone</CardTitle>
          <p className="text-sm text-gray-600">
            Upload a clear audio sample (minimum 30 seconds) to create your custom voice
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Name Input */}
          <div>
            <Label htmlFor="voice-name">Voice Name</Label>
            <Input
              id="voice-name"
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              placeholder="Enter a name for your voice clone"
              className="mt-1"
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
                  MP3, WAV, or M4A files accepted
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
            disabled={!audioFile || !voiceName.trim() || isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing Voice Clone...
              </>
            ) : (
              'Create Voice Clone'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Voice Library */}
      <Card>
        <CardHeader>
          <CardTitle>Your Voice Library</CardTitle>
          <p className="text-sm text-gray-600">
            Manage your created voice clones
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No voice clones created yet</p>
            <p className="text-sm">Upload an audio sample to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceCloning;
