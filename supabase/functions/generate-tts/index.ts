
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
      default:
        throw new Error('Unsupported provider')
    }

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
    const error = await response.json()
    throw new Error(`OpenAI TTS failed: ${error.error?.message || 'Unknown error'}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const base64String = arrayBufferToBase64(arrayBuffer)
  return `data:audio/mp3;base64,${base64String}`
}

async function generateElevenLabs(text: string, voice: string, apiKey: string): Promise<string> {
  // Map voice names to ElevenLabs voice IDs
  const voiceMap: { [key: string]: string } = {
    'rachel': '21m00Tcm4TlvDq8ikWAM',
    'domi': 'AZnzlk1XvdvUeBnXmlld',
    'bella': 'EXAVITQu4vr4xnSDxMaL',
    'antoni': 'ErXwobaYiN019PkySvjV',
    'elli': 'MF3mGyEYCl7XYWbV9V6O',
    'josh': 'TxGEqnHWrfWFTfGW9XjX',
    'arnold': 'VR6AewLTigWG4xSOukaG',
    'adam': 'pNInz6obpgDQGcFmaJgB',
    'sam': 'yoZ06aMxZJJ28mfd3POQ',
  }

  const voiceId = voiceMap[voice] || voiceMap['rachel']

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
        stability: 0.5,
        similarity_boost: 0.75,
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

async function generatePlayHT(text: string, voice: string, apiKey: string): Promise<string> {
  // For PlayHT, we'll need to create a generation job and then download the result
  // This is a simplified version - in production you might want to implement polling
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
    throw new Error(`PlayHT TTS failed: ${response.status} ${errorText}`)
  }

  const result = await response.json()
  
  // For now, return a placeholder since PlayHT requires more complex handling
  // In a real implementation, you'd poll for the job completion and download the audio
  throw new Error('PlayHT integration requires additional setup for job polling')
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
