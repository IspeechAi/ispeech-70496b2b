
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TTSRequest {
  text: string;
  voice?: string;
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

    const { text, voice = 'alloy', provider, speed = 1, stability = 0.5, clarity = 0.75 }: TTSRequest = await req.json()

    if (!text || text.length === 0) {
      throw new Error('Text is required')
    }

    if (text.length > 5000) {
      throw new Error('Text too long. Maximum 5000 characters allowed.')
    }

    // Generate text hash for caching
    const textHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(text + voice + speed + stability + clarity)
    )
    const hashHex = Array.from(new Uint8Array(textHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Check cache first
    const { data: cachedResult } = await supabase
      .from('tts_cache')
      .select('*')
      .eq('text_hash', hashHex)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (cachedResult) {
      console.log('Returning cached result')
      return new Response(
        JSON.stringify({ 
          audioUrl: cachedResult.audio_url, 
          provider: cachedResult.provider,
          cached: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Select best available provider
    const selectedProvider = await selectBestProvider(supabase, provider)
    console.log('Selected provider:', selectedProvider)

    // Generate TTS audio
    const audioUrl = await generateTTS(selectedProvider, text, voice, speed, stability, clarity)

    // Update usage tracking
    await updateUsageTracking(supabase, selectedProvider, text.length)

    // Cache the result
    await supabase.from('tts_cache').insert({
      text_hash: hashHex,
      text_input: text.substring(0, 500), // Truncate for storage
      provider: selectedProvider,
      voice_id: voice,
      audio_url: audioUrl,
    })

    // Save to user history
    await supabase.from('user_tts_history').insert({
      user_id: user.id,
      text_input: text,
      provider_used: selectedProvider,
      voice_id: voice,
      audio_url: audioUrl,
      characters_count: text.length,
    })

    return new Response(
      JSON.stringify({ audioUrl, provider: selectedProvider }),
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

async function selectBestProvider(supabase: any, preferredProvider?: string) {
  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().substring(0, 7)

  // Get active providers ordered by priority
  const { data: providers } = await supabase
    .from('tts_api_configs')
    .select('*')
    .eq('is_active', true)
    .order('priority')

  if (!providers || providers.length === 0) {
    throw new Error('No TTS providers configured')
  }

  // Get usage data for current month
  const { data: usageData } = await supabase
    .from('tts_usage_tracking')
    .select('*')
    .eq('month_year', currentMonth)

  const usageMap = new Map()
  usageData?.forEach((usage: any) => {
    usageMap.set(usage.provider, usage.characters_used)
  })

  // If preferred provider is specified and available, try it first
  if (preferredProvider) {
    const preferred = providers.find((p: any) => p.provider === preferredProvider)
    if (preferred) {
      const usage = usageMap.get(preferredProvider) || 0
      if (usage < preferred.monthly_quota) {
        return preferredProvider
      }
    }
  }

  // Find first available provider under quota
  for (const provider of providers) {
    const usage = usageMap.get(provider.provider) || 0
    if (usage < provider.monthly_quota) {
      return provider.provider
    }
  }

  // If all providers are over quota, use the one with highest quota
  return providers[0].provider
}

async function generateTTS(provider: string, text: string, voice: string, speed: number, stability: number, clarity: number): Promise<string> {
  console.log(`Generating TTS with ${provider}`)

  switch (provider) {
    case 'elevenlabs':
      return await generateElevenLabsTTS(text, voice, stability, clarity)
    case 'openai':
      return await generateOpenAITTS(text, voice, speed)
    case 'azure':
      return await generateAzureTTS(text, voice, speed)
    case 'google':
      return await generateGoogleTTS(text, voice, speed)
    default:
      return await generateOpenAITTS(text, voice, speed)
  }
}

async function generateOpenAITTS(text: string, voice: string, speed: number): Promise<string> {
  const apiKey = Deno.env.get('OPENAI_API_KEY')
  if (!apiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: voice,
      speed: speed,
      response_format: 'mp3',
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`OpenAI TTS failed: ${error.error?.message || 'Unknown error'}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const base64String = arrayBufferToBase64(arrayBuffer)
  return `data:audio/mp3;base64,${base64String}`
}

async function generateElevenLabsTTS(text: string, voice: string, stability: number, clarity: number): Promise<string> {
  const apiKey = Deno.env.get('ELEVENLABS_API_KEY')
  if (!apiKey) {
    throw new Error('ElevenLabs API key not configured')
  }

  // Map voices to ElevenLabs voice IDs
  const voiceMap: { [key: string]: string } = {
    'alloy': '9BWtsMINqrJLrRacOk9x', // Aria
    'echo': 'CwhRBWXzGAHq8TQ4Fs17', // Roger
    'fable': 'EXAVITQu4vr4xnSDxMaL', // Sarah
    'onyx': 'JBFqnCBsd6RMkjVDRZzb', // George
    'nova': 'XB0fDUnXU5powFXDhCwa', // Charlotte
    'shimmer': 'Xb7hH8MSUJpSbSDYk0k2', // Alice
    'alice': 'Xb7hH8MSUJpSbSDYk0k2', // Alice
    'bill': 'pqHfZKP75CvOlQylNhV4', // Bill
    'brian': 'nPczCjzI2devNBz1zQrb', // Brian
    'charlie': 'IKne3meq5aSn9XLyUdCD', // Charlie
    'daniel': 'onwK4e9ZLuTAKqWW03F9', // Daniel
    'jessica': 'cgSgspJ2msm6clMCkdW9', // Jessica
    'liam': 'TX3LPaxmHKxFdv7VOQHJ', // Liam
    'matilda': 'XrExE9yKIg1WjnnlVkGX', // Matilda
    'river': 'SAz9YHcvj6GT2YYXdXww', // River
    'will': 'bIHbv24MWmeRgasZH58o', // Will
  }

  const voiceId = voiceMap[voice] || voiceMap['alloy']

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: stability,
        similarity_boost: clarity,
      }
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`ElevenLabs TTS failed: ${response.status} ${errorText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const base64String = arrayBufferToBase64(arrayBuffer)
  return `data:audio/mp3;base64,${base64String}`
}

async function generateAzureTTS(text: string, voice: string, speed: number): Promise<string> {
  const apiKey = Deno.env.get('AZURE_TTS_API_KEY')
  const region = Deno.env.get('AZURE_TTS_REGION') || 'eastus'
  
  if (!apiKey) {
    throw new Error('Azure TTS API key not configured')
  }

  // Map voices to Azure TTS voice names
  const voiceMap: { [key: string]: string } = {
    'alloy': 'en-US-JennyNeural',
    'echo': 'en-US-GuyNeural',
    'fable': 'en-US-AriaNeural',
    'onyx': 'en-US-DavisNeural',
    'nova': 'en-US-AmberNeural',
    'shimmer': 'en-US-AnaNeural',
  }

  const voiceName = voiceMap[voice] || voiceMap['alloy']
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="${voiceName}">
      <prosody rate="${speed > 1 ? 'fast' : speed < 1 ? 'slow' : 'medium'}">
        ${text}
      </prosody>
    </voice>
  </speak>`

  const response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
    },
    body: ssml,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Azure TTS failed: ${response.status} ${errorText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const base64String = arrayBufferToBase64(arrayBuffer)
  return `data:audio/mp3;base64,${base64String}`
}

async function generateGoogleTTS(text: string, voice: string, speed: number): Promise<string> {
  const apiKey = Deno.env.get('GOOGLE_TTS_API_KEY')
  
  if (!apiKey) {
    throw new Error('Google TTS API key not configured')
  }

  // Map voices to Google TTS voice names
  const voiceMap: { [key: string]: { name: string, gender: string } } = {
    'alloy': { name: 'en-US-Standard-F', gender: 'FEMALE' },
    'echo': { name: 'en-US-Standard-B', gender: 'MALE' },
    'fable': { name: 'en-US-Standard-C', gender: 'FEMALE' },
    'onyx': { name: 'en-US-Standard-D', gender: 'MALE' },
    'nova': { name: 'en-US-Standard-E', gender: 'FEMALE' },
    'shimmer': { name: 'en-US-Standard-G', gender: 'FEMALE' },
  }

  const voiceConfig = voiceMap[voice] || voiceMap['alloy']

  const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: voiceConfig.name,
        ssmlGender: voiceConfig.gender,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: speed,
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Google TTS failed: ${response.status} ${errorText}`)
  }

  const result = await response.json()
  return `data:audio/mp3;base64,${result.audioContent}`
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const chunkSize = 0x8000 // 32KB chunks to avoid stack overflow
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize)
    binary += String.fromCharCode.apply(null, Array.from(chunk))
  }
  
  return btoa(binary)
}

async function updateUsageTracking(supabase: any, provider: string, charactersUsed: number) {
  const currentMonth = new Date().toISOString().substring(0, 7)

  const { error } = await supabase
    .from('tts_usage_tracking')
    .upsert({
      provider,
      month_year: currentMonth,
      characters_used: charactersUsed,
      requests_count: 1,
    }, {
      onConflict: 'provider,month_year',
      ignoreDuplicates: false,
    })

  if (error) {
    console.error('Failed to update usage tracking:', error)
  }
}
