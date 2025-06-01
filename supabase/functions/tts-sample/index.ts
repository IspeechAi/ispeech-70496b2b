
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SampleRequest {
  text: string;
  voice: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice }: SampleRequest = await req.json()

    if (!text || !voice) {
      throw new Error('Text and voice are required')
    }

    let audioUrl = ''

    // Generate sample based on voice provider
    if (['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'].includes(voice)) {
      audioUrl = await generateOpenAISample(text, voice)
    } else {
      audioUrl = await generateElevenLabsSample(text, voice)
    }

    return new Response(
      JSON.stringify({ audioUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Sample generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function generateOpenAISample(text: string, voice: string): Promise<string> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: voice,
      speed: 1.0
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const audioBuffer = await response.arrayBuffer()
  const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))
  return `data:audio/mpeg;base64,${base64Audio}`
}

async function generateElevenLabsSample(text: string, voice: string): Promise<string> {
  const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')
  if (!elevenlabsApiKey) {
    throw new Error('ElevenLabs API key not configured')
  }

  const voiceIdMap: Record<string, string> = {
    'alice': 'Xb7hH8MSUJpSbSDYk0k2',
    'bill': 'pqHfZKP75CvOlQylNhV4',
    'brian': 'nPczCjzI2devNBz1zQrb',
    'charlie': 'IKne3meq5aSn9XLyUdCD',
    'daniel': 'onwK4e9ZLuTAKqWW03F9',
    'jessica': 'cgSgspJ2msm6clMCkdW9',
    'liam': 'TX3LPaxmHKxFdv7VOQHJ',
    'matilda': 'XrExE9yKIg1WjnnlVkGX',
    'river': 'SAz9YHcvj6GT2YYXdXww',
    'will': 'bIHbv24MWmeRgasZH58o',
    'adam': '9BWtsMINqrJLrRacOk9x',
    'rachel': 'EXAVITQu4vr4xnSDxMaL'
  }

  const voiceId = voiceIdMap[voice] || voiceIdMap['alice']

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': elevenlabsApiKey,
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true
      }
    })
  })

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`)
  }

  const audioBuffer = await response.arrayBuffer()
  const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))
  return `data:audio/mpeg;base64,${base64Audio}`
}
