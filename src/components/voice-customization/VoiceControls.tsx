
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface VoiceControlsProps {
  onPlayPreview: () => void;
  onResetDefaults: () => void;
  isGenerating: boolean;
  isPlaying: boolean;
}

const VoiceControls = ({ onPlayPreview, onResetDefaults, isGenerating, isPlaying }: VoiceControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        onClick={onPlayPreview}
        disabled={isGenerating}
        className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Generating...
          </>
        ) : isPlaying ? (
          <>
            <Pause className="mr-2 h-4 w-4" />
            Stop Preview
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Play Preview
          </>
        )}
      </Button>
      
      <Button
        onClick={onResetDefaults}
        variant="outline"
        className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset Defaults
      </Button>
    </div>
  );
};

export default VoiceControls;
