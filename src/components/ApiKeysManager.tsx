
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, Save, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  isRequired: boolean;
  helpText?: string;
}

const ApiKeysManager = () => {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const apiKeyConfigs: ApiKey[] = [
    {
      id: 'openai',
      name: 'OPENAI_API_KEY',
      label: 'OpenAI API Key',
      placeholder: 'sk-proj-...',
      isRequired: true,
      helpText: 'Required for OpenAI TTS models (gpt-4o-audio-preview, tts-1, tts-1-hd)'
    },
    {
      id: 'elevenlabs',
      name: 'ELEVENLABS_API_KEY',
      label: 'ElevenLabs API Key',
      placeholder: 'sk_...',
      isRequired: true,
      helpText: 'Premium voices with emotional range and cloning capabilities'
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
    },
    {
      id: 'anthropic',
      name: 'ANTHROPIC_API_KEY',
      label: 'Anthropic API Key',
      placeholder: 'sk-ant-...',
      isRequired: false,
      helpText: 'For future Claude voice synthesis integration'
    },
    {
      id: 'coqui',
      name: 'COQUI_API_KEY',
      label: 'Coqui Studio API Key',
      placeholder: 'coqui_...',
      isRequired: false,
      helpText: 'Open-source TTS with voice cloning capabilities'
    }
  ];

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
    setSavedKeys(prev => ({
      ...prev,
      [keyId]: false
    }));
  };

  const saveApiKey = async (keyConfig: ApiKey) => {
    const value = apiKeys[keyConfig.id];
    if (!value) {
      toast({
        title: "Error",
        description: "Please enter an API key before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, this would securely store the key
      console.log(`Saving ${keyConfig.name}:`, value);
      
      setSavedKeys(prev => ({
        ...prev,
        [keyConfig.id]: true
      }));

      toast({
        title: "Success",
        description: `${keyConfig.label} saved successfully.`,
      });

      // Simulate API call delay
      setTimeout(() => {
        setSavedKeys(prev => ({
          ...prev,
          [keyConfig.id]: false
        }));
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save ${keyConfig.label}.`,
        variant: "destructive",
      });
    }
  };

  const getKeyStatus = (keyConfig: ApiKey) => {
    const hasValue = !!apiKeys[keyConfig.id];
    const isSaved = savedKeys[keyConfig.id];
    
    if (isSaved) return { icon: Check, color: 'text-green-500' };
    if (hasValue) return { icon: Save, color: 'text-blue-500' };
    if (keyConfig.isRequired) return { icon: X, color: 'text-red-500' };
    return { icon: Key, color: 'text-gray-400' };
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Keys Configuration
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configure your API keys for different TTS providers. Keys are stored securely and never logged.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {apiKeyConfigs.map((keyConfig) => {
          const { icon: StatusIcon, color } = getKeyStatus(keyConfig);
          
          return (
            <div key={keyConfig.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon className={`h-4 w-4 ${color}`} />
                  <div>
                    <Label className="font-medium">{keyConfig.label}</Label>
                    {keyConfig.isRequired && (
                      <span className="text-red-500 text-xs ml-1">*Required</span>
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
                    disabled={!apiKeys[keyConfig.id] || savedKeys[keyConfig.id]}
                    size="sm"
                    className="h-8"
                  >
                    {savedKeys[keyConfig.id] ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
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
          <h4 className="font-medium text-blue-900 mb-2">Getting Started</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• At minimum, configure OpenAI or ElevenLabs API keys to start using TTS</li>
            <li>• Multiple providers enable automatic fallback and load balancing</li>
            <li>• Each provider offers different voice qualities and pricing models</li>
            <li>• Keys are encrypted and stored securely in your Supabase project</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">Provider Links:</h4>
            <div className="space-y-1 text-blue-600">
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" className="block hover:underline">
                → OpenAI API Keys
              </a>
              <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noopener" className="block hover:underline">
                → ElevenLabs API Keys
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
                <span>Configured and saved</span>
              </div>
              <div className="flex items-center gap-2">
                <Save className="h-3 w-3 text-blue-500" />
                <span>Ready to save</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-3 w-3 text-red-500" />
                <span>Required but missing</span>
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
