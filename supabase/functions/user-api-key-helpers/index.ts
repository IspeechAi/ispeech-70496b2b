
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, userId, provider, apiKey } = await req.json()

    switch (action) {
      case 'get':
        const { data: keys, error: getError } = await supabaseClient
          .from('user_api_keys')
          .select('*')
          .eq('user_id', userId)

        if (getError) throw getError

        return new Response(
          JSON.stringify({ data: keys }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'upsert':
        const { error: upsertError } = await supabaseClient
          .from('user_api_keys')
          .upsert({
            user_id: userId,
            provider: provider,
            api_key: apiKey,
            is_active: true
          }, {
            onConflict: 'user_id,provider'
          })

        if (upsertError) throw upsertError

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'delete':
        const { error: deleteError } = await supabaseClient
          .from('user_api_keys')
          .delete()
          .eq('user_id', userId)
          .eq('provider', provider)

        if (deleteError) throw deleteError

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
