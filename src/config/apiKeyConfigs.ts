
import { ApiKeyConfig } from '@/types/apiKeys';

export const apiKeyConfigs: ApiKeyConfig[] = [
  {
    id: 'elevenlabs',
    label: 'ElevenLabs API Key',
    placeholder: 'sk-...',
    description: 'High-quality voice synthesis with custom voice cloning',
    helpUrl: 'https://elevenlabs.io/app/speech-synthesis',
    isRequired: false
  },
  {
    id: 'openai',
    label: 'OpenAI API Key',
    placeholder: 'sk-...',
    description: 'Natural-sounding TTS voices from OpenAI',
    helpUrl: 'https://platform.openai.com/api-keys',
    isRequired: false
  },
  {
    id: 'azure',
    label: 'Azure Cognitive Services Key',
    placeholder: 'your-azure-key',
    description: 'Microsoft Azure Text-to-Speech service',
    helpUrl: 'https://portal.azure.com',
    isRequired: false
  },
  {
    id: 'google',
    label: 'Google Cloud TTS API Key',
    placeholder: 'your-google-api-key',
    description: 'Google Cloud Text-to-Speech API',
    helpUrl: 'https://console.cloud.google.com/apis/credentials',
    isRequired: false
  },
  {
    id: 'amazon_polly',
    label: 'Amazon Polly Access Key',
    placeholder: 'AKIA...',
    description: 'AWS Polly text-to-speech service',
    helpUrl: 'https://console.aws.amazon.com/iam/home?#/security_credentials',
    isRequired: false
  }
];
