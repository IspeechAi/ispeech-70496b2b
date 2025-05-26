
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Download } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
}

const AudioPlayer = ({ audioUrl }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioUrl) {
      // Handle both data URLs and regular URLs
      if (audioUrl.startsWith('data:')) {
        setAudioSrc(audioUrl);
      } else {
        setAudioSrc(audioUrl);
      }
    } else {
      setAudioSrc(null);
    }
  }, [audioUrl]);

  const handlePlay = () => {
    if (audioRef.current && audioSrc) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    }
  };

  const handleDownload = () => {
    if (audioSrc) {
      try {
        // Create a blob URL for download
        let downloadUrl = audioSrc;
        
        if (audioSrc.startsWith('data:')) {
          // Convert data URL to blob for better download handling
          const byteCharacters = atob(audioSrc.split(',')[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'audio/mp3' });
          downloadUrl = URL.createObjectURL(blob);
        }
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `tts-audio-${Date.now()}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up blob URL if we created one
        if (downloadUrl !== audioSrc) {
          setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
        }
      } catch (error) {
        console.error('Error downloading audio:', error);
      }
    }
  };

  if (!audioSrc) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={handlePlay}
            variant="outline"
            size="sm"
            className="w-10 h-10 rounded-full"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <span className="text-sm font-medium">Generated Audio</span>
        </div>
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Audio error:', e);
          setIsPlaying(false);
        }}
        className="w-full mt-3"
        controls
        preload="metadata"
      />
    </div>
  );
};

export default AudioPlayer;
