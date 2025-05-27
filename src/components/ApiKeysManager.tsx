
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, Save, Check, X, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

interface ApiKeyConfig {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  isRequired: boolean;
  helpText?: string;
}

interface UserApiKey {
  id: string;
  provider: string;
  api_key: string;
  is_active: boolean;
}

const ApiKeysManager = () => {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [userApiKeys, setUserApiKeys] = useState<UserApiKey[]>([]);
  const [savingKeys, setSavingKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const { user } = useAuthStore();

  const apiKeyConfigs: ApiKeyConfig[] = [
    {
      id: 'elevenlabs',
      name: 'ELEVENLABS_API_KEY',
      label: 'ElevenLabs API Key',
      placeholder: 'sk_...',
      isRequired: true,
      helpText: 'Premium voices with emotional range and cloning capabilities'
    },
    {
      id: 'openai',
      name: 'OPENAI_API_KEY',
      label: 'OpenAI API Key',
      placeholder: 'sk-proj-...',
      isRequired: true,
      helpText: 'Required for OpenAI TTS models (gpt-4o-audio-preview, tts-1, tts-1-hd)'
    },
    {
      id: 'azure',
      name: 'AZURE_TTS_KEY',
      label: 'Azure Cognitive Services Key',
      placeholder: 'your-azure-key',
      isRequired: false,
      helpText: 'Microsoft Azure Speech Services for enterprise-grade TTS'
    },
    {
      id: 'google',
      name: 'GOOGLE_TTS_KEY',
      label: 'Google Cloud TTS API Key',
      placeholder: 'AIza...',
      isRequired: false,
      helpText: 'Google Cloud Text-to-Speech with WaveNet voices'
    },
    {
      id: 'aws',
      name: 'AWS_ACCESS_KEY_ID',
      label: 'AWS Access Key ID',
      placeholder: 'AKIA...',
      isRequired: false,
      helpText: 'Amazon Polly for neural voices in multiple languages'
    },
    {
      id: 'aws_secret',
      name: 'AWS_SECRET_ACCESS_KEY',
      label: 'AWS Secret Access Key',
      placeholder: 'your-secret-key',
      isRequired: false,
      helpText: 'Required with AWS Access Key ID for Amazon Polly'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchUserApiKeys();
    }
  }, [user]);

  const fetchUserApiKeys = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('user-api-key-helpers', {
        body: {
          action: 'get',
          userId: user?.id
        }
      });

      if (error) throw error;

      setUserApiKeys(data.data || []);
      
      // Populate the form with existing keys
      const keyMap: Record<string, string> = {};
      data.data?.forEach((key: UserApiKey) => {
        keyMap[key.provider] = key.api_key;
      });
      setApiKeys(keyMap);
    } catch (error) {
      console.error('Error fetching user API keys:', error);
      toast({
        title: "Error",
        description: "Failed to load your API keys.",
        variant: "destructive",
      });
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const handleKeyChange = (keyId: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [keyId]: value
    }));
  };

  const saveApiKey = async (keyConfig: ApiKeyConfig) => {
    const value = apiKeys[keyConfig.id];
    if (!value) {
      toast({
        title: "Error",
        description: "Please enter an API key before saving.",
        variant: "destructive",
      });
      return;
    }

    setSavingKeys(prev => ({ ...prev, [keyConfig.id]: true }));

    try {
      const { error } = await supabase.functions.invoke('user-api-key-helpers', {
        body: {
          action: 'upsert',
          userId: user?.id,
          provider: keyConfig.id,
          apiKey: value
        }
      });

      if (error) throw error;

      await fetchUserApiKeys();

      toast({
        title: "Success",
        description: `${keyConfig.label} saved successfully.`,
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: `Failed to save ${keyConfig.label}.`,
        variant: "destructive",
      });
    } finally {
      setSavingKeys(prev => ({ ...prev, [keyConfig.id]: false }));
    }
  };

  const deleteApiKey = async (keyConfig: ApiKeyConfig) => {
    try {
      const { error } = await supabase.functions.invoke('user-api-key-helpers', {
        body: {
          action: 'delete',
          userId: user?.id,
          provider: keyConfig.id
        }
      });

      if (error) throw error;

      setApiKeys(prev => {
        const newKeys = { ...prev };
        delete newKeys[keyConfig.id];
        return newKeys;
      });

      await fetchUserApiKeys();

      toast({
        title: "Success",
        description: `${keyConfig.label} deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: `Failed to delete ${keyConfig.label}.`,
        variant: "destructive",
      });
    }
  };

  const getKeyStatus = (keyConfig: ApiKeyConfig) => {
    const hasValue = !!apiKeys[keyConfig.id];
    const isSaved = userApiKeys.some(key => key.provider === keyConfig.id && key.is_active);
    const isSaving = savingKeys[keyConfig.id];
    
    if (isSaving) return { icon: Key, color: 'text-blue-500', text: 'Saving...' };
    if (isSaved) return { icon: Check, color: 'text-green-500', text: 'Saved' };
    if (hasValue) return { icon: Save, color: 'text-blue-500', text: 'Save' };
    if (keyConfig.isRequired) return { icon: X, color: 'text-red-500', text: 'Required' };
    return { icon: Key, color: 'text-gray-400', text: 'Optional' };
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Your API Keys
        </CardTitle>
        <p className="text-sm text-gray-600">
          Add your own API keys to access premium TTS services. Your keys are stored securely and encrypted.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {apiKeyConfigs.map((keyConfig) => {
          const { icon: StatusIcon, color, text } = getKeyStatus(keyConfig);
          const hasExistingKey = userApiKeys.some(key => key.provider === keyConfig.id);
          
          return (
            <div key={keyConfig.id} className="border rounded-lg p-4 space-y-3">
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
                    onClick={() => toggleKeyVisibility(keyConfig.id)}
                    className="h-8 w-8 p-0"
                  >
                    {showKeys[keyConfig.id] ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    onClick={() => saveApiKey(keyConfig)}
                    disabled={!apiKeys[keyConfig.id] || savingKeys[keyConfig.id]}
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
                      onClick={() => deleteApiKey(keyConfig)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Input
                  type={showKeys[keyConfig.id] ? 'text' : 'password'}
                  placeholder={keyConfig.placeholder}
                  value={apiKeys[keyConfig.id] || ''}
                  onChange={(e) => handleKeyChange(keyConfig.id, e.target.value)}
                  className="font-mono text-sm"
                />
                {keyConfig.helpText && (
                  <p className="text-xs text-gray-500">{keyConfig.helpText}</p>
                )}
              </div>
            </div>
          );
        })}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your API keys are given priority over our shared service keys</li>
            <li>• This ensures faster processing and higher quotas for your requests</li>
            <li>• Keys are encrypted and stored securely in our database</li>
            <li>• You can remove your keys at any time</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">Get API Keys:</h4>
            <div className="space-y-1 text-blue-600">
              <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noopener" className="block hover:underline">
                → ElevenLabs API Keys
              </a>
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" className="block hover:underline">
                → OpenAI API Keys
              </a>
              <a href="https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/" target="_blank" rel="noopener" className="block hover:underline">
                → Azure Cognitive Services
              </a>
              <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener" className="block hover:underline">
                → Google Cloud Credentials
              </a>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Status Legend:</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                <span>Configured and active</span>
              </div>
              <div className="flex items-center gap-2">
                <Save className="h-3 w-3 text-blue-500" />
                <span>Ready to save</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-3 w-3 text-red-500" />
                <span>Recommended for best experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Key className="h-3 w-3 text-gray-400" />
                <span>Optional</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeysManager;
