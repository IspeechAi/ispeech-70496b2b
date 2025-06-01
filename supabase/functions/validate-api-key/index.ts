
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValidateKeyRequest {
  provider: string;
  apiKey: string;
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

    const { provider, apiKey }: ValidateKeyRequest = await req.json()

    if (!provider || !apiKey) {
      throw new Error('Provider and API key are required')
    }

    let isValid = false;
    let voices: any[] = [];
    let error = '';

    // Validate API key based on provider
    try {
      switch (provider) {
        case 'elevenlabs':
          const elevenResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: { 'xi-api-key': apiKey }
          });
          
          if (elevenResponse.ok) {
            const data = await elevenResponse.json();
            isValid = true;
            voices = data.voices?.map((voice: any) => ({
              id: voice.voice_id,
              name: voice.name,
              provider: 'elevenlabs',
              gender: voice.labels?.gender || 'unknown',
              preview_url: voice.preview_url
            })) || [];
          } else {
            error = 'Invalid ElevenLabs API key';
          }
          break;

        case 'playht':
          const playhtResponse = await fetch('https://api.play.ht/api/v2/voices', {
            headers: { 
              'Authorization': `Bearer ${apiKey}`,
              'X-User-ID': 'user'
            }
          });
          
          if (playhtResponse.ok) {
            const data = await playhtResponse.json();
            isValid = true;
            voices = data.voices?.map((voice: any) => ({
              id: voice.id,
              name: voice.name,
              provider: 'playht',
              gender: voice.gender || 'unknown',
              language: voice.language
            })) || [];
          } else {
            error = 'Invalid PlayHT API key';
          }
          break;

        case 'fishaudio':
          // Fish Audio validation would go here
          // For now, we'll simulate validation
          isValid = true;
          voices = [
            { id: 'fish_1', name: 'Fish Voice 1', provider: 'fishaudio', gender: 'female' },
            { id: 'fish_2', name: 'Fish Voice 2', provider: 'fishaudio', gender: 'male' }
          ];
          break;

        case 'voicelab':
          // Voicelab validation would go here
          isValid = true;
          voices = [
            { id: 'voicelab_1', name: 'Voicelab Voice 1', provider: 'voicelab' },
            { id: 'voicelab_2', name: 'Voicelab Voice 2', provider: 'voicelab' }
          ];
          break;

        default:
          throw new Error('Unsupported provider');
      }

      if (isValid) {
        // Store the API key securely
        const { error: dbError } = await supabase
          .from('user_api_keys')
          .upsert({
            user_id: user.id,
            provider: provider,
            api_key: apiKey,
            is_valid: true,
            is_active: true,
            updated_at: new Date().toISOString()
          });

        if (dbError) {
          console.error('Database error:', dbError);
        }

        // Store voices
        if (voices.length > 0) {
          const voiceRecords = voices.map(voice => ({
            user_id: user.id,
            voice_id: voice.id,
            voice_name: voice.name,
            provider: voice.provider,
            gender: voice.gender,
            language: voice.language,
            is_cloned: false
          }));

          const { error: voicesError } = await supabase
            .from('user_voices')
            .upsert(voiceRecords, { onConflict: 'user_id,voice_id,provider' });

          if (voicesError) {
            console.error('Voices storage error:', voicesError);
          }
        }
      }

    } catch (validationError) {
      console.error('Validation error:', validationError);
      error = 'Failed to validate API key';
    }

    return new Response(
      JSON.stringify({ 
        isValid, 
        voices, 
        error: error || undefined 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('API key validation error:', error)
    return new Response(
      JSON.stringify({ 
        isValid: false, 
        error: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
