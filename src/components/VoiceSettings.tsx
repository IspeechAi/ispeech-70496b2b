
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface VoiceSettingsProps {
  speed: number[];
  setSpeed: (speed: number[]) => void;
  stability: number[];
  setStability: (stability: number[]) => void;
  clarity: number[];
  setClarity: (clarity: number[]) => void;
}

const VoiceSettings = ({ 
  speed, 
  setSpeed, 
  stability, 
  setStability, 
  clarity, 
  setClarity 
}: VoiceSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Speed: {speed[0]}x
        </label>
        <Slider
          value={speed}
          onValueChange={setSpeed}
          min={0.25}
          max={2}
          step={0.25}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Stability: {stability[0]}
        </label>
        <Slider
          value={stability}
          onValueChange={setStability}
          min={0}
          max={1}
          step={0.1}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Clarity + Similarity: {clarity[0]}
        </label>
        <Slider
          value={clarity}
          onValueChange={setClarity}
          min={0}
          max={1}
          step={0.1}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default VoiceSettings;
