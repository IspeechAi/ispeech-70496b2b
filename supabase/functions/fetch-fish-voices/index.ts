
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FishVoiceResponse {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { apiKey } = await req.json()

    if (!apiKey) {
      throw new Error('API key is required')
    }

    // For now, return mock voices since Fish Audio API integration would require their specific endpoints
    // In a real implementation, you would call Fish Audio's API here
    const mockVoices: FishVoiceResponse[] = [
      { id: 'fish_luna', name: 'Luna', description: 'Ethereal female voice', category: 'Mystical' },
      { id: 'fish_orion', name: 'Orion', description: 'Cosmic male voice', category: 'Cosmic' },
      { id: 'fish_stella', name: 'Stella', description: 'Stellar female voice', category: 'Bright' },
      { id: 'fish_cosmos', name: 'Cosmos', description: 'Universal male voice', category: 'Expansive' },
      { id: 'fish_aurora', name: 'Aurora', description: 'Dancing female voice', category: 'Vibrant' },
      { id: 'fish_nebula', name: 'Nebula', description: 'Mysterious voice', category: 'Mysterious' },
      { id: 'fish_galaxy', name: 'Galaxy', description: 'Expansive voice', category: 'Cosmic' },
      { id: 'fish_comet', name: 'Comet', description: 'Fast and bright voice', category: 'Dynamic' }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const voices = mockVoices.map(voice => ({
      id: voice.id,
      name: voice.name,
      provider: 'Fish Audio',
      gender: voice.name.includes('Luna') || voice.name.includes('Stella') || voice.name.includes('Aurora') ? 'Female' : 'Male',
      language: 'English',
      description: voice.description || 'Fish Audio synthesized voice',
      category: voice.category || 'General'
    }));

    return new Response(
      JSON.stringify({ voices }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Fish Audio voices fetch error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
