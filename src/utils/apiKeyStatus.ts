
import { UserApiKey, ApiKeyConfig } from '@/types/apiKeys';

export const isApiKeySet = (provider: string, userApiKeys: UserApiKey[]): boolean => {
  return userApiKeys.some(key => key.provider === provider && key.is_active);
};

export const getAvailableProviders = (userApiKeys: UserApiKey[], apiKeyConfigs: ApiKeyConfig[]): string[] => {
  const availableProviders = ['auto']; // Always include auto
  
  apiKeyConfigs.forEach(config => {
    if (isApiKeySet(config.id, userApiKeys) || !config.isRequired) {
      availableProviders.push(config.id);
    }
  });
  
  return availableProviders;
};

export const getProviderDisplayName = (provider: string): string => {
  const providerNames: Record<string, string> = {
    'auto': 'Auto (Best Available)',
    'elevenlabs': 'ElevenLabs',
    'openai': 'OpenAI',
    'azure': 'Azure Cognitive Services',
    'google': 'Google Cloud TTS',
    'amazon_polly': 'Amazon Polly'
  };
  
  return providerNames[provider] || provider;
};
