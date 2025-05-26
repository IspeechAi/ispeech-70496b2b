
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TextInputProps {
  text: string;
  setText: (text: string) => void;
}

const TextInput = ({ text, setText }: TextInputProps) => {
  const characterCount = text.length;
  const estimatedCost = Math.ceil(characterCount / 1000) * 0.015;

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Enter your text ({characterCount} characters)
      </label>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="min-h-[120px] resize-none"
        maxLength={5000}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Max 5,000 characters</span>
        <span>Estimated cost: ${estimatedCost.toFixed(3)}</span>
      </div>
    </div>
  );
};

export default TextInput;
