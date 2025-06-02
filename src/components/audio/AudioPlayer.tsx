
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Download, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
  audioBlob?: Blob;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, audioBlob }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ispeech-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `ispeech-${Date.now()}.mp3`;
      a.click();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioUrl && !audioBlob) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
      <audio
        ref={audioRef}
        src={audioUrl || (audioBlob ? URL.createObjectURL(audioBlob) : undefined)}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />
      
      <div className="flex items-center gap-4">
        <Button
          onClick={handlePlayPause}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-white/70" />
            <div className="flex-1 bg-white/20 rounded-full h-2 relative overflow-hidden">
              <div 
                className="bg-purple-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-white/70 min-w-[80px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
        
        <Button
          onClick={handleDownload}
          size="sm"
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
