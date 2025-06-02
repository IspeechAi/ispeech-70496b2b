
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

    switch (provider) {
      case 'openai':
        try {
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
            },
          })
          isValid = response.ok
          message = isValid ? 'OpenAI API key is valid' : 'Invalid OpenAI API key'
        } catch (error) {
          isValid = false
          message = 'Failed to validate OpenAI API key'
        }
        break

      case 'elevenlabs':
        try {
          const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: {
              'xi-api-key': apiKey,
            },
          })
          isValid = response.ok
          message = isValid ? 'ElevenLabs API key is valid' : 'Invalid ElevenLabs API key'
        } catch (error) {
          isValid = false
          message = 'Failed to validate ElevenLabs API key'
        }
        break

      case 'playht':
        try {
          const response = await fetch('https://api.play.ht/api/v2/voices', {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'X-User-ID': 'test', // PlayHT requires user ID but we're just testing
            },
          })
          isValid = response.ok
          message = isValid ? 'PlayHT API key is valid' : 'Invalid PlayHT API key'
        } catch (error) {
          isValid = false
          message = 'Failed to validate PlayHT API key'
        }
        break

      default:
        throw new Error('Unsupported provider')
    }

    return new Response(
      JSON.stringify({ valid: isValid, message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('API key validation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
