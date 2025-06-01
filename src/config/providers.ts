
import { ApiProvider } from '@/types/providers';

export const API_PROVIDERS: ApiProvider[] = [
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Premium voice synthesis with emotion and multilingual support',
    icon: '🎭',
    supportsCloning: true,
  },
  {
    id: 'playht',
    name: 'PlayHT',
    description: 'High-quality voices with advanced customization options',
    icon: '🎪',
    supportsCloning: true,
  },
  {
    id: 'fishaudio',
    name: 'Fish Audio',
    description: 'Fast and efficient voice generation for all use cases',
    icon: '🐠',
    supportsCloning: false,
  },
  {
    id: 'voicelab',
    name: 'Voicelab Audio',
    description: 'Professional studio-quality voice synthesis',
    icon: '🔬',
    supportsCloning: true,
  },
];
