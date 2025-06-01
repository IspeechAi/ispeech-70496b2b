
import { ApiKeyConfig } from '@/types/apiKeys';

export const apiKeyConfigs: ApiKeyConfig[] = [
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
