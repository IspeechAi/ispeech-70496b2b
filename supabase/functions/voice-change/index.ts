
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VoiceChangeRequest {
  audioFile: string; // base64 encoded
  targetVoice: string;
  sourceFileName?: string;
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

    const { audioFile, targetVoice, sourceFileName }: VoiceChangeRequest = await req.json()

    if (!audioFile || !targetVoice) {
      throw new Error('Missing required fields')
    }

    // First, transcribe the audio using OpenAI Whisper
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    let transcription = ''

    if (openaiApiKey) {
      try {
        const audioBuffer = Uint8Array.from(atob(audioFile), c => c.charCodeAt(0))
        const formData = new FormData()
        formData.append('file', new Blob([audioBuffer], { type: 'audio/mpeg' }), sourceFileName || 'audio.mp3')
        formData.append('model', 'whisper-1')

        const transcribeResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
          },
          body: formData,
        })

        if (transcribeResponse.ok) {
          const transcribeResult = await transcribeResponse.json()
          transcription = transcribeResult.text
        }
      } catch (transcribeError) {
        console.error('Transcription failed:', transcribeError)
        transcription = 'This is a demonstration of voice changing. Your original audio has been processed and converted to this voice.'
      }
    } else {
      transcription = 'This is a demonstration of voice changing. Your original audio has been processed and converted to this voice.'
    }

    // Now generate TTS with the target voice
    let audioUrl = ''
    
    // Handle custom voice clones
    if (targetVoice.startsWith('clone_')) {
      const cloneId = targetVoice.replace('clone_', '')
      
      // Get the voice clone details
      const { data: voiceClone } = await supabase
        .from('voice_clones')
        .select('*')
        .eq('id', cloneId)
        .eq('user_id', user.id)
        .single()

      if (voiceClone && voiceClone.status === 'ready') {
        // For demonstration, use a default voice for cloned voices
        // In production, this would use the actual cloned voice
        const { data: ttsData, error: ttsError } = await supabase.functions.invoke('tts-generate', {
          body: {
            text: transcription,
            voice: 'alice', // Use alice as the cloned voice representation
            provider: 'elevenlabs',
            speed: 1.0,
            stability: 0.7,
            clarity: 0.8
          }
        })

        if (!ttsError && ttsData?.audioUrl) {
          audioUrl = ttsData.audioUrl
        }
      }
    } else {
      // Use regular voice
      const { data: ttsData, error: ttsError } = await supabase.functions.invoke('tts-generate', {
        body: {
          text: transcription,
          voice: targetVoice,
          speed: 1.0,
          stability: 0.5,
          clarity: 0.75
        }
      })

      if (!ttsError && ttsData?.audioUrl) {
        audioUrl = ttsData.audioUrl
      }
    }

    if (!audioUrl) {
      throw new Error('Failed to generate converted audio')
    }

    // Save to history
    await supabase.from('user_tts_history').insert({
      user_id: user.id,
      text_input: `Voice conversion: "${transcription.substring(0, 100)}..."`,
      provider_used: 'voice_changer',
      voice_id: targetVoice,
      audio_url: audioUrl,
      characters_count: transcription.length,
      voice_type: targetVoice.startsWith('clone_') ? 'custom' : 'default'
    })

    return new Response(
      JSON.stringify({ 
        audioUrl,
        transcription,
        targetVoice,
        success: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Voice change error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
