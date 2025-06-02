
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Provider } from './ProviderSelector';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ApiKeyInputProps {
  provider: Provider;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  isValid: boolean | null;
  onValidate: () => Promise<void>;
  validating: boolean;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  provider,
  apiKey,
  onApiKeyChange,
  isValid,
  onValidate,
  validating,
}) => {
  const getStatusIcon = () => {
    if (validating) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (isValid === true) return <CheckCircle className="h-4 w-4 text-green-400" />;
    if (isValid === false) return <XCircle className="h-4 w-4 text-red-400" />;
    return null;
  };

  const getStatusMessage = () => {
    if (isValid === true) return "API key is valid";
    if (isValid === false) return "API key is invalid";
    return "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">
        {provider.charAt(0).toUpperCase() + provider.slice(1)} API Key
      </label>
      <div className="flex gap-2">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder={`Enter your ${provider} API key`}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
        <Button
          onClick={onValidate}
          disabled={!apiKey || validating}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {validating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Validate'}
        </Button>
      </div>
      <div className="flex items-center gap-2 text-sm">
        {getStatusIcon()}
        <span className={isValid === true ? 'text-green-400' : isValid === false ? 'text-red-400' : 'text-white/70'}>
          {getStatusMessage()}
        </span>
      </div>
    </div>
  );
};
