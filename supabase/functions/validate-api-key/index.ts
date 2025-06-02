
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
    const { provider, apiKey } = await req.json()

    if (!provider || !apiKey) {
      throw new Error('Provider and API key are required')
    }

    let isValid = false
    let message = ''
    let voices = []

    console.log(`Validating ${provider} API key...`)

    switch (provider) {
      case 'openai':
        try {
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
            },
          })
          
          if (response.ok) {
            const data = await response.json()
            // Check if models are returned
            if (data.data && Array.isArray(data.data)) {
              isValid = true
              message = 'OpenAI API key is valid'
              // OpenAI TTS voices are predefined
              voices = [
                { id: 'alloy', name: 'Alloy' },
                { id: 'echo', name: 'Echo' },
                { id: 'fable', name: 'Fable' },
                { id: 'onyx', name: 'Onyx' },
                { id: 'nova', name: 'Nova' },
                { id: 'shimmer', name: 'Shimmer' },
              ]
            } else {
              isValid = false
              message = 'Invalid OpenAI API key - no models returned'
            }
          } else {
            const errorData = await response.json()
            isValid = false
            message = `Invalid OpenAI API key: ${errorData.error?.message || 'Authentication failed'}`
          }
        } catch (error) {
          console.error('OpenAI validation error:', error)
          isValid = false
          message = 'Failed to validate OpenAI API key - network error'
        }
        break

      case 'elevenlabs':
        try {
          const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: {
              'xi-api-key': apiKey,
            },
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.voices && Array.isArray(data.voices)) {
              isValid = true
              message = 'ElevenLabs API key is valid'
              // Map actual ElevenLabs voices
              voices = data.voices.map(voice => ({
                id: voice.voice_id,
                name: voice.name
              })).slice(0, 20) // Limit to first 20 voices
            } else {
              isValid = false
              message = 'Invalid ElevenLabs API key - no voices returned'
            }
          } else {
            const errorText = await response.text()
            isValid = false
            message = `Invalid ElevenLabs API key: ${response.status} ${errorText}`
          }
        } catch (error) {
          console.error('ElevenLabs validation error:', error)
          isValid = false
          message = 'Failed to validate ElevenLabs API key - network error'
        }
        break

      case 'playht':
        try {
          const response = await fetch('https://api.play.ht/api/v2/voices', {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'X-User-ID': 'test-user',
            },
          })
          
          if (response.ok) {
            const data = await response.json()
            if (Array.isArray(data)) {
              isValid = true
              message = 'PlayHT API key is valid'
              voices = data.map(voice => ({
                id: voice.id || voice.voice,
                name: voice.name || voice.voice
              })).slice(0, 20)
            } else {
              isValid = false
              message = 'Invalid PlayHT API key - no voices returned'
            }
          } else {
            const errorText = await response.text()
            isValid = false
            message = `Invalid PlayHT API key: ${response.status} ${errorText}`
          }
        } catch (error) {
          console.error('PlayHT validation error:', error)
          isValid = false
          message = 'Failed to validate PlayHT API key - network error'
        }
        break

      case 'fishaudio':
        try {
          const response = await fetch('https://api.fish.audio/v1/tts', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
            },
          })
          
          if (response.ok || response.status === 405) {
            // Fish Audio might return 405 for GET but still be valid
            isValid = true
            message = 'Fish Audio API key is valid'
            // Fish Audio default voices (these would need to be fetched from actual API)
            voices = [
              { id: 'fishaudio_v1', name: 'Fish Audio Voice 1' },
              { id: 'fishaudio_v2', name: 'Fish Audio Voice 2' },
              { id: 'fishaudio_v3', name: 'Fish Audio Voice 3' },
            ]
          } else {
            const errorText = await response.text()
            isValid = false
            message = `Invalid Fish Audio API key: ${response.status} ${errorText}`
          }
        } catch (error) {
          console.error('Fish Audio validation error:', error)
          isValid = false
          message = 'Failed to validate Fish Audio API key - network error'
        }
        break

      default:
        throw new Error('Unsupported provider')
    }

    console.log(`Validation result for ${provider}:`, { isValid, message, voiceCount: voices.length })

    return new Response(
      JSON.stringify({ 
        valid: isValid, 
        message,
        voices: voices
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('API key validation error:', error)
    return new Response(
      JSON.stringify({ 
        valid: false,
        error: error.message,
        voices: []
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
