
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { ApiKeyConfig, UserApiKey } from '@/types/apiKeys';
import { getKeyStatus } from '@/utils/apiKeyStatus';

interface ApiKeyInputProps {
  keyConfig: ApiKeyConfig;
  value: string;
  userApiKeys: UserApiKey[];
  savingKeys: Record<string, boolean>;
  apiKeys: Record<string, string>;
  onValueChange: (keyId: string, value: string) => void;
  onSave: (keyConfig: ApiKeyConfig) => void;
  onDelete: (keyConfig: ApiKeyConfig) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  keyConfig,
  value,
  userApiKeys,
  savingKeys,
  apiKeys,
  onValueChange,
  onSave,
  onDelete
}) => {
  const [showKey, setShowKey] = useState(false);
  
  const { icon: StatusIcon, color, text } = getKeyStatus(keyConfig, apiKeys, userApiKeys, savingKeys);
  const hasExistingKey = userApiKeys.some(key => key.provider === keyConfig.id);

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusIcon className={`h-4 w-4 ${color}`} />
          <div>
            <Label className="font-medium">{keyConfig.label}</Label>
            {keyConfig.isRequired && (
              <span className="text-red-500 text-xs ml-1">*Recommended</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowKey(!showKey)}
            className="h-8 w-8 p-0"
          >
            {showKey ? (
              <EyeOff className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </Button>
          <Button
            onClick={() => onSave(keyConfig)}
            disabled={!value || savingKeys[keyConfig.id]}
            size="sm"
            className="h-8"
          >
            <StatusIcon className="h-3 w-3 mr-1" />
            {text}
          </Button>
          {hasExistingKey && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(keyConfig)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Input
          type={showKey ? 'text' : 'password'}
          placeholder={keyConfig.placeholder}
          value={value || ''}
          onChange={(e) => onValueChange(keyConfig.id, e.target.value)}
          className="font-mono text-sm"
        />
        {keyConfig.helpText && (
          <p className="text-xs text-gray-500">{keyConfig.helpText}</p>
        )}
      </div>
    </div>
  );
};

export default ApiKeyInput;
