
import { ApiProvider } from '@/types/providers';

export const API_PROVIDERS: ApiProvider[] = [
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Premium voice synthesis with emotion control',
    supportsCloning: true,
    icon: '🎭'
  },
  {
    id: 'playht',
    name: 'PlayHT',
    description: 'Natural-sounding voices with fast generation',
    supportsCloning: true,
    icon: '🎵'
  },
  {
    id: 'fishaudio',
    name: 'Fish Audio',
    description: 'Advanced voice cloning and synthesis',
    supportsCloning: true,
    icon: '🐟'
  },
  {
    id: 'voicelab',
    name: 'Voicelab Audio',
    description: 'Universal voice generation platform',
    supportsCloning: false,
    icon: '🔬'
  }
];
