
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface VoiceParameterSliderProps {
  label: string;
  value: number[];
  onChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  displayColor: string;
  labels: string[];
}

const VoiceParameterSlider = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step, 
  displayValue, 
  displayColor, 
  labels 
}: VoiceParameterSliderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-gray-300">{label}</Label>
        <span className={`text-sm ${displayColor}`}>{displayValue}</span>
      </div>
      <Slider
        value={value}
        onValueChange={onChange}
        max={max}
        min={min}
        step={step}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </div>
  );
};

export default VoiceParameterSlider;
