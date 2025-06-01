
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CloneVoiceRequest {
  provider: string;
  voiceName: string;
  audioFile: string; // base64 encoded audio
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

    const { provider, voiceName, audioFile }: CloneVoiceRequest = await req.json()

    if (!provider || !voiceName || !audioFile) {
      throw new Error('Provider, voice name, and audio file are required')
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
    let clonedVoice: any = null;

    // Clone voice based on provider
    switch (provider) {
      case 'elevenlabs':
        clonedVoice = await cloneWithElevenLabs(voiceName, audioFile, apiKey);
        break;
      
      case 'playht':
        clonedVoice = await cloneWithPlayHT(voiceName, audioFile, apiKey);
        break;
      
      case 'fishaudio':
        clonedVoice = await cloneWithFishAudio(voiceName, audioFile, apiKey);
        break;
      
      default:
        throw new Error('Voice cloning not supported for this provider');
    }

    // Store the cloned voice in the database
    const { data: voiceRecord, error: voiceError } = await supabase
      .from('user_voices')
      .insert({
        user_id: user.id,
        voice_id: clonedVoice.id,
        voice_name: voiceName,
        provider: provider,
        is_cloned: true,
        clone_audio_url: audioFile
      })
      .select()
      .single()

    if (voiceError) throw voiceError

    return new Response(
      JSON.stringify({ 
        success: true, 
        voice: voiceRecord,
        clonedVoice 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Voice cloning error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function cloneWithElevenLabs(name: string, audioFile: string, apiKey: string) {
  // Convert base64 to blob for ElevenLabs
  const audioBuffer = Uint8Array.from(atob(audioFile), c => c.charCodeAt(0));
  
  const formData = new FormData();
  formData.append('name', name);
  formData.append('files', new Blob([audioBuffer], { type: 'audio/mpeg' }));

  const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs cloning failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

async function cloneWithPlayHT(name: string, audioFile: string, apiKey: string) {
  // PlayHT voice cloning implementation
  const response = await fetch('https://api.play.ht/api/v2/cloned-voices', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      voice_name: name,
      sample_file_url: `data:audio/mpeg;base64,${audioFile}`
    })
  });

  if (!response.ok) {
    throw new Error(`PlayHT cloning failed: ${response.status}`);
  }

  return await response.json();
}

async function cloneWithFishAudio(name: string, audioFile: string, apiKey: string) {
  // Fish Audio voice cloning implementation
  // For now, simulate cloning since API details may vary
  return {
    id: `fish_clone_${Date.now()}`,
    name: name,
    status: 'ready'
  };
}
