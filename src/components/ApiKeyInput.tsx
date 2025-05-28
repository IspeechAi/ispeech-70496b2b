
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Save, Trash2, ExternalLink, CheckCircle } from 'lucide-react';
import { ApiKeyConfig, UserApiKey } from '@/types/apiKeys';

interface ApiKeyInputProps {
  keyConfig: ApiKeyConfig;
  value: string;
  userApiKeys: UserApiKey[];
  savingKeys: Record<string, boolean>;
  apiKeys: Record<string, string>;
  onValueChange: (provider: string, value: string) => void;
  onSave: (provider: string, value: string) => void;
  onDelete: (provider: string) => void;
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
  const [localValue, setLocalValue] = useState('');

  const isKeySet = userApiKeys.some(key => key.provider === keyConfig.id && key.is_active);
  const isSaving = savingKeys[keyConfig.id];
  const displayValue = isKeySet ? '••••••••••••••••' : localValue;

  const handleSave = () => {
    if (localValue.trim()) {
      onSave(keyConfig.id, localValue.trim());
      setLocalValue('');
    }
  };

  const handleDelete = () => {
    onDelete(keyConfig.id);
    setLocalValue('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onValueChange(keyConfig.id, newValue);
  };

  return (
    <Card className="border-purple-200 hover:border-purple-300 transition-colors">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor={keyConfig.id} className="text-sm font-medium text-gray-900">
                {keyConfig.label}
                {isKeySet && (
                  <CheckCircle className="inline-block w-4 h-4 ml-2 text-green-500" />
                )}
              </Label>
              <p className="text-xs text-gray-500 mt-1">{keyConfig.description}</p>
            </div>
            {keyConfig.helpUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(keyConfig.helpUrl, '_blank')}
                className="text-purple-600 hover:text-purple-700"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id={keyConfig.id}
                type={showKey ? 'text' : 'password'}
                placeholder={isKeySet ? 'API key is set' : keyConfig.placeholder}
                value={isKeySet ? displayValue : localValue}
                onChange={handleInputChange}
                disabled={isKeySet}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>

            {isKeySet ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isSaving}
                className="px-3"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={!localValue.trim() || isSaving}
                size="sm"
                className="px-6 bg-purple-600 hover:bg-purple-700"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
