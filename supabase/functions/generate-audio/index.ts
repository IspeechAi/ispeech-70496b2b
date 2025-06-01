
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateAudioRequest {
  text: string;
  voiceId: string;
  provider: string;
  parameters?: {
    speed?: number;
    pitch?: number;
    stability?: number;
    clarity?: number;
    emotion?: number;
  };
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

    const { text, voiceId, provider, parameters = {} }: GenerateAudioRequest = await req.json()

    if (!text || !voiceId || !provider) {
      throw new Error('Text, voice ID, and provider are required')
    }

    // Get user's API key for the provider
    const { data: apiKeyData, error: keyError } = await supabase
      .from('user_api_keys')
      .select('api_key')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .eq('is_active', true)
      .single()

    if (keyError || !apiKeyData) {
      throw new Error(`No valid API key found for ${provider}`)
    }

    const apiKey = apiKeyData.api_key;
    let audioUrl = '';

    // Generate audio based on provider
    switch (provider) {
      case 'elevenlabs':
        audioUrl = await generateWithElevenLabs(text, voiceId, apiKey, parameters);
        break;
      
      case 'playht':
        audioUrl = await generateWithPlayHT(text, voiceId, apiKey, parameters);
        break;
      
      case 'fishaudio':
        audioUrl = await generateWithFishAudio(text, voiceId, apiKey, parameters);
        break;
      
      case 'voicelab':
        audioUrl = await generateWithVoicelab(text, voiceId, apiKey, parameters);
        break;
      
      default:
        throw new Error('Unsupported provider');
    }

    // Log usage
    await supabase.from('user_tts_history').insert({
      user_id: user.id,
      text_input: text,
      provider_used: provider,
      voice_id: voiceId,
      audio_url: audioUrl,
      characters_count: text.length,
      voice_type: 'default'
    });

    return new Response(
      JSON.stringify({ audioUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Audio generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function generateWithElevenLabs(
  text: string, 
  voiceId: string, 
  apiKey: string, 
  params: any
): Promise<string> {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: params.stability || 0.5,
        similarity_boost: params.clarity || 0.75,
        style: params.emotion || 0.5,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
  return `data:audio/mpeg;base64,${base64Audio}`;
}

async function generateWithPlayHT(
  text: string, 
  voiceId: string, 
  apiKey: string, 
  params: any
): Promise<string> {
  // PlayHT implementation would go here
  // For now, return a placeholder
  throw new Error('PlayHT generation not implemented yet');
}

async function generateWithFishAudio(
  text: string, 
  voiceId: string, 
  apiKey: string, 
  params: any
): Promise<string> {
  // Fish Audio implementation would go here
  // For now, return a placeholder
  throw new Error('Fish Audio generation not implemented yet');
}

async function generateWithVoicelab(
  text: string, 
  voiceId: string, 
  apiKey: string, 
  params: any
): Promise<string> {
  // Voicelab implementation would go here
  // For now, return a placeholder
  throw new Error('Voicelab generation not implemented yet');
}
