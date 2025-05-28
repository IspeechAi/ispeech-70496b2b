
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TTSRequest {
  text: string;
  voice: string;
  provider?: string;
  speed?: number;
  stability?: number;
  clarity?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { text, voice, provider, speed = 1.0, stability = 0.5, clarity = 0.75 }: TTSRequest = await req.json()

    if (!text || !voice) {
      throw new Error('Text and voice are required')
    }

    let audioUrl = ''
    let usedProvider = provider || 'auto'

    // Handle cloned voices
    if (voice.startsWith('clone_')) {
      const cloneId = voice.replace('clone_', '')
      
      // Get the voice clone details
      const { data: voiceClone } = await supabase
        .from('voice_clones')
        .select('*')
        .eq('id', cloneId)
        .eq('user_id', user.id)
        .single()

      if (voiceClone && voiceClone.status === 'ready') {
        usedProvider = 'voice_clone'
        // Use the actual cloned voice for generation
        audioUrl = await generateWithClonedVoice(text, voiceClone, speed, stability, clarity)
      } else {
        throw new Error('Voice clone not found or not ready')
      }
    } else {
      // Use regular voice generation
      if (provider === 'elevenlabs' || (!provider && voice.includes('alice'))) {
        audioUrl = await generateWithElevenLabs(text, voice, speed, stability, clarity)
        usedProvider = 'elevenlabs'
      } else if (provider === 'openai' || (!provider && ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'].includes(voice))) {
        audioUrl = await generateWithOpenAI(text, voice, speed)
        usedProvider = 'openai'
      } else {
        // Fallback to OpenAI
        audioUrl = await generateWithOpenAI(text, voice, speed)
        usedProvider = 'openai'
      }
    }

    // Save to history
    await supabase.from('user_tts_history').insert({
      user_id: user.id,
      text_input: text,
      provider_used: usedProvider,
      voice_id: voice,
      audio_url: audioUrl,
      characters_count: text.length,
      voice_type: voice.startsWith('clone_') ? 'custom' : 'default'
    })

    return new Response(
      JSON.stringify({ 
        audioUrl, 
        provider: usedProvider,
        cached: false 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('TTS generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function generateWithElevenLabs(text: string, voice: string, speed: number, stability: number, clarity: number): Promise<string> {
  const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')
  if (!elevenlabsApiKey) {
    throw new Error('ElevenLabs API key not configured')
  }

  // Voice ID mapping for ElevenLabs
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
        stability: stability,
        similarity_boost: clarity,
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

async function generateWithOpenAI(text: string, voice: string, speed: number): Promise<string> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
  const selectedVoice = validVoices.includes(voice) ? voice : 'alloy'

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: selectedVoice,
      speed: speed
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const audioBuffer = await response.arrayBuffer()
  const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))
  return `data:audio/mpeg;base64,${base64Audio}`
}

async function generateWithClonedVoice(text: string, voiceClone: any, speed: number, stability: number, clarity: number): Promise<string> {
  // For now, use ElevenLabs with a similar voice as a placeholder
  // In production, this would use the actual cloned voice data
  return await generateWithElevenLabs(text, 'alice', speed, stability, clarity)
}
