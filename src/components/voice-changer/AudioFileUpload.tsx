
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Volume2, Play, Pause } from 'lucide-react';

interface AudioFileUploadProps {
  audioFile: File | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPlayOriginal: () => void;
  playingOriginal: boolean;
}

const AudioFileUpload = ({ audioFile, onFileUpload, onPlayOriginal, playingOriginal }: AudioFileUploadProps) => {
  return (
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
            onChange={onFileUpload}
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
            onClick={onPlayOriginal}
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
  );
};

export default AudioFileUpload;
