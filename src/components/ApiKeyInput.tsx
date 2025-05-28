
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Save, Trash2 } from 'lucide-react';
import { ApiKeyConfig, UserApiKey } from '@/types/apiKeys';

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

const ApiKeyInput = ({
  keyConfig,
  value,
  userApiKeys,
  savingKeys,
  apiKeys,
  onValueChange,
  onSave,
  onDelete
}: ApiKeyInputProps) => {
  const [showKey, setShowKey] = useState(false);
  const existingKey = userApiKeys.find(key => key.provider === keyConfig.id);
  const hasKey = !!existingKey;
  const isModified = value !== (existingKey?.api_key || '');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={keyConfig.id} className="text-sm font-medium">
          {keyConfig.label}
        </Label>
        {hasKey && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
              ✓ Active
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(keyConfig)}
              className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
              title="Remove API key"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id={keyConfig.id}
            type={showKey ? "text" : "password"}
            placeholder={hasKey ? "••••••••••••••••" : keyConfig.placeholder}
            value={value || ''}
            onChange={(e) => onValueChange(keyConfig.id, e.target.value)}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <Button
          onClick={() => onSave(keyConfig)}
          disabled={!value || savingKeys[keyConfig.id] || (!hasKey && !value) || (hasKey && !isModified)}
          size="sm"
          className="px-4"
        >
          {savingKeys[keyConfig.id] ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              {hasKey && isModified ? 'Update' : 'Save'}
            </>
          )}
        </Button>
      </div>
      
      <p className="text-xs text-gray-500">{keyConfig.description}</p>
      
      {keyConfig.helpUrl && (
        <a
          href={keyConfig.helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          Get your {keyConfig.label} →
        </a>
      )}
    </div>
  );
};

export default ApiKeyInput;
