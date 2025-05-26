
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
    const { text, voice } = await req.json()

    // Use ElevenLabs for samples since it has the best quality
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!apiKey) {
      throw new Error('ElevenLabs API key not configured')
    }

    const voiceMap: { [key: string]: string } = {
      'alloy': '9BWtsMINqrJLrRacOk9x',
      'echo': 'CwhRBWXzGAHq8TQ4Fs17',
      'fable': 'EXAVITQu4vr4xnSDxMaL',
      'onyx': 'JBFqnCBsd6RMkjVDRZzb',
      'nova': 'XB0fDUnXU5powFXDhCwa',
      'shimmer': 'Xb7hH8MSUJpSbSDYk0k2',
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
        text: text.substring(0, 100), // Limit sample length
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs sample failed: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    let binary = ''
    const chunkSize = 0x8000
    
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize)
      binary += String.fromCharCode.apply(null, Array.from(chunk))
    }
    
    const base64String = btoa(binary)

    return new Response(
      JSON.stringify({ audioUrl: `data:audio/mp3;base64,${base64String}` }),
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
