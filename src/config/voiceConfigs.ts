
export interface VoiceConfig {
  id: string;
  name: string;
  provider: string;
  gender: string;
  language: string;
  description: string;
  category: string;
}

export const voiceConfigs: VoiceConfig[] = [
  // ElevenLabs Voices
  {
    id: 'Xb7hH8MSUJpSbSDYk0k2',
    name: 'Alice',
    provider: 'ElevenLabs',
    gender: 'Female',
    language: 'English',
    description: 'Warm and professional female voice',
    category: 'Professional'
  },
  {
    id: 'pqHfZKP75CvOlQylNhV4',
    name: 'Bill',
    provider: 'ElevenLabs',
    gender: 'Male',
    language: 'English',
    description: 'Authoritative narrator voice',
    category: 'Narration'
  },
  {
    id: 'nPczCjzI2devNBz1zQrb',
    name: 'Brian',
    provider: 'ElevenLabs',
    gender: 'Male',
    language: 'English',
    description: 'Friendly conversational voice',
    category: 'Conversational'
  },
  {
    id: 'IKne3meq5aSn9XLyUdCD',
    name: 'Charlie',
    provider: 'ElevenLabs',
    gender: 'Male',
    language: 'English',
    description: 'Youthful and energetic voice',
    category: 'Energetic'
  },
  {
    id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'Daniel',
    provider: 'ElevenLabs',
    gender: 'Male',
    language: 'English',
    description: 'Calm and reassuring voice',
    category: 'Calm'
  },
  {
    id: 'cgSgspJ2msm6clMCkdW9',
    name: 'Jessica',
    provider: 'ElevenLabs',
    gender: 'Female',
    language: 'English',
    description: 'Clear and articulate voice',
    category: 'Professional'
  },
  {
    id: 'TX3LPaxmHKxFdv7VOQHJ',
    name: 'Liam',
    provider: 'ElevenLabs',
    gender: 'Male',
    language: 'English',
    description: 'Rich and expressive voice',
    category: 'Expressive'
  },
  {
    id: 'XrExE9yKIg1WjnnlVkGX',
    name: 'Matilda',
    provider: 'ElevenLabs',
    gender: 'Female',
    language: 'English',
    description: 'Mature and sophisticated voice',
    category: 'Sophisticated'
  },
  {
    id: 'SAz9YHcvj6GT2YYXdXww',
    name: 'River',
    provider: 'ElevenLabs',
    gender: 'Non-binary',
    language: 'English',
    description: 'Natural and flowing voice',
    category: 'Natural'
  },
  {
    id: 'bIHbv24MWmeRgasZH58o',
    name: 'Will',
    provider: 'ElevenLabs',
    gender: 'Male',
    language: 'English',
    description: 'Dynamic and engaging voice',
    category: 'Dynamic'
  },
  {
    id: '9BWtsMINqrJLrRacOk9x',
    name: 'Adam',
    provider: 'ElevenLabs',
    gender: 'Male',
    language: 'English',
    description: 'Professional clarity voice',
    category: 'Professional'
  },
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Rachel',
    provider: 'ElevenLabs',
    gender: 'Female',
    language: 'English',
    description: 'Expressive storyteller voice',
    category: 'Storytelling'
  },
  {
    id: 'CwhRBWXzGAHq8TQ4Fs17',
    name: 'Roger',
    provider: 'ElevenLabs',
    gender: 'Male',
    language: 'English',
    description: 'Confident and clear voice',
    category: 'Confident'
  },
  {
    id: 'FGY2WhTYpPnrIDTdsKH5',
    name: 'Laura',
    provider: 'ElevenLabs',
    gender: 'Female',
    language: 'English',
    description: 'Gentle and warm voice',
    category: 'Warm'
  },
  {
    id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'George',
    provider: 'ElevenLabs',
    gender: 'Male',
    language: 'English',
    description: 'Authoritative and deep voice',
    category: 'Authority'
  },
  {
    id: 'N2lVS1w4EtoT3dr4eOWO',
    name: 'Callum',
    provider: 'ElevenLabs',
    gender: 'Male',
    language: 'English',
    description: 'Young and vibrant voice',
    category: 'Youthful'
  },
  {
    id: 'XB0fDUnXU5powFXDhCwa',
    name: 'Charlotte',
    provider: 'ElevenLabs',
    gender: 'Female',
    language: 'English',
    description: 'Professional and polished voice',
    category: 'Professional'
  },
  {
    id: 'pFZP5JQG7iQjIQuC4Bku',
    name: 'Lily',
    provider: 'ElevenLabs',
    gender: 'Female',
    language: 'English',
    description: 'Sweet and youthful voice',
    category: 'Youthful'
  },
  {
    id: 'iP95p4xoKVk53GoZ742B',
    name: 'Chris',
    provider: 'ElevenLabs',
    gender: 'Male',
    language: 'English',
    description: 'Casual and friendly voice',
    category: 'Casual'
  },
  {
    id: 'cjVigY5qzO86Huf0OWal',
    name: 'Eric',
    provider: 'ElevenLabs',
    gender: 'Male',
    language: 'English',
    description: 'Middle-aged and wise voice',
    category: 'Wise'
  },

  // OpenAI Voices
  {
    id: 'alloy',
    name: 'Alloy',
    provider: 'OpenAI',
    gender: 'Neutral',
    language: 'English',
    description: 'Balanced and clear voice',
    category: 'Balanced'
  },
  {
    id: 'echo',
    name: 'Echo',
    provider: 'OpenAI',
    gender: 'Male',
    language: 'English',
    description: 'Deep and resonant voice',
    category: 'Deep'
  },
  {
    id: 'fable',
    name: 'Fable',
    provider: 'OpenAI',
    gender: 'Neutral',
    language: 'English',
    description: 'Perfect for storytelling',
    category: 'Storytelling'
  },
  {
    id: 'onyx',
    name: 'Onyx',
    provider: 'OpenAI',
    gender: 'Male',
    language: 'English',
    description: 'Strong and confident voice',
    category: 'Confident'
  },
  {
    id: 'nova',
    name: 'Nova',
    provider: 'OpenAI',
    gender: 'Female',
    language: 'English',
    description: 'Bright and energetic voice',
    category: 'Energetic'
  },
  {
    id: 'shimmer',
    name: 'Shimmer',
    provider: 'OpenAI',
    gender: 'Female',
    language: 'English',
    description: 'Soft and elegant voice',
    category: 'Elegant'
  },

  // Fish Audio Voices (sample voices)
  {
    id: 'fish_luna',
    name: 'Luna',
    provider: 'Fish Audio',
    gender: 'Female',
    language: 'English',
    description: 'Ethereal and mystical voice',
    category: 'Mystical'
  },
  {
    id: 'fish_orion',
    name: 'Orion',
    provider: 'Fish Audio',
    gender: 'Male',
    language: 'English',
    description: 'Cosmic and commanding voice',
    category: 'Cosmic'
  },
  {
    id: 'fish_stella',
    name: 'Stella',
    provider: 'Fish Audio',
    gender: 'Female',
    language: 'English',
    description: 'Stellar and bright voice',
    category: 'Bright'
  },
  {
    id: 'fish_cosmos',
    name: 'Cosmos',
    provider: 'Fish Audio',
    gender: 'Male',
    language: 'English',
    description: 'Universal and expansive voice',
    category: 'Expansive'
  },
  {
    id: 'fish_aurora',
    name: 'Aurora',
    provider: 'Fish Audio',
    gender: 'Female',
    language: 'English',
    description: 'Dancing and vibrant voice',
    category: 'Vibrant'
  }
];

export const getVoicesByProvider = (provider: string): VoiceConfig[] => {
  return voiceConfigs.filter(voice => voice.provider === provider);
};

export const getVoiceById = (id: string): VoiceConfig | undefined => {
  return voiceConfigs.find(voice => voice.id === id);
};
