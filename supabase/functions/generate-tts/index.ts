
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, provider, voice, apiKey } = await req.json()

    if (!text || !provider || !voice || !apiKey) {
      throw new Error('Text, provider, voice, and API key are required')
    }

    if (text.length > 300) {
      throw new Error('Text too long. Maximum 300 characters allowed.')
    }

    console.log(`Generating TTS with ${provider}, voice: ${voice}, text length: ${text.length}`)

    let audioUrl = ''

    switch (provider) {
      case 'openai':
        audioUrl = await generateOpenAI(text, voice, apiKey)
        break
      case 'elevenlabs':
        audioUrl = await generateElevenLabs(text, voice, apiKey)
        break
      case 'playht':
        audioUrl = await generatePlayHT(text, voice, apiKey)
        break
      case 'fishaudio':
        audioUrl = await generateFishAudio(text, voice, apiKey)
        break
      default:
        throw new Error('Unsupported provider')
    }

    console.log(`Successfully generated audio with ${provider}`)

    return new Response(
      JSON.stringify({ audioUrl }),
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

async function generateOpenAI(text: string, voice: string, apiKey: string): Promise<string> {
  console.log('Calling OpenAI TTS API...')
  
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
      response_format: 'mp3',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('OpenAI API error:', response.status, errorText)
    throw new Error(`OpenAI TTS failed: ${response.status} ${errorText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const base64String = arrayBufferToBase64(arrayBuffer)
  return `data:audio/mp3;base64,${base64String}`
}

async function generateElevenLabs(text: string, voice: string, apiKey: string): Promise<string> {
  console.log('Calling ElevenLabs TTS API...')
  
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
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
        stability: 0.5,
        similarity_boost: 0.75,
      }
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('ElevenLabs API error:', response.status, errorText)
    throw new Error(`ElevenLabs TTS failed: ${response.status} ${errorText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const base64String = arrayBufferToBase64(arrayBuffer)
  return `data:audio/mp3;base64,${base64String}`
}

async function generatePlayHT(text: string, voice: string, apiKey: string): Promise<string> {
  console.log('Calling PlayHT TTS API...')
  
  const response = await fetch('https://api.play.ht/api/v2/tts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'X-User-ID': 'user',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      voice: voice,
      output_format: 'mp3',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('PlayHT API error:', response.status, errorText)
    throw new Error(`PlayHT TTS failed: ${response.status} ${errorText}`)
  }

  const result = await response.json()
  
  // PlayHT returns a job URL that needs to be polled
  if (result.url) {
    // For now, we'll just return the URL directly
    // In production, you'd want to poll for completion
    return result.url
  }
  
  throw new Error('PlayHT did not return audio URL')
}

async function generateFishAudio(text: string, voice: string, apiKey: string): Promise<string> {
  console.log('Calling Fish Audio TTS API...')
  
  try {
    const response = await fetch('https://api.fish.audio/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice: voice,
        format: 'mp3',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Fish Audio API error:', response.status, errorText)
      throw new Error(`Fish Audio TTS failed: ${response.status} ${errorText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const base64String = arrayBufferToBase64(arrayBuffer)
    return `data:audio/mp3;base64,${base64String}`
    
  } catch (error) {
    console.error('Fish Audio generation error:', error)
    // Fallback to a simple TTS for Fish Audio (placeholder)
    throw new Error('Fish Audio TTS is not fully implemented yet')
  }
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
