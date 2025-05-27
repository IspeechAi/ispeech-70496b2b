
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  type: 'magic_link' | 'password_reset' | 'email_confirmation'
  token?: string
  redirectUrl?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, type, token, redirectUrl }: EmailRequest = await req.json()

    console.log(`Sending ${type} email to ${to}`)

    // Create email content based on type
    let emailContent = ''
    let emailSubject = subject

    switch (type) {
      case 'magic_link':
        emailSubject = 'Sign in to ISPEECH'
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed;">Welcome to ISPEECH</h1>
            <p>Click the link below to sign in to your account:</p>
            <a href="${redirectUrl}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
              Sign In to ISPEECH
            </a>
            <p>If you didn't request this email, you can safely ignore it.</p>
            <p>Best regards,<br>The ISPEECH Team</p>
          </div>
        `
        break
      
      case 'password_reset':
        emailSubject = 'Reset your ISPEECH password'
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed;">Reset Your Password</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${redirectUrl}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
              Reset Password
            </a>
            <p>If you didn't request this password reset, you can safely ignore this email.</p>
            <p>Best regards,<br>The ISPEECH Team</p>
          </div>
        `
        break
      
      case 'email_confirmation':
        emailSubject = 'Confirm your ISPEECH account'
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed;">Welcome to ISPEECH!</h1>
            <p>Please confirm your email address by clicking the link below:</p>
            <a href="${redirectUrl}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
              Confirm Email
            </a>
            <p>Thank you for joining ISPEECH!</p>
            <p>Best regards,<br>The ISPEECH Team</p>
          </div>
        `
        break
    }

    // Send email using Brevo SMTP
    const emailData = {
      sender: {
        name: "ISPEECH",
        email: "sscary470@gmail.com"
      },
      to: [{ email: to }],
      subject: emailSubject,
      htmlContent: emailContent
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': Deno.env.get('BREVO_API_KEY') || ''
      },
      body: JSON.stringify(emailData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Brevo API error:', errorText)
      throw new Error(`Failed to send email: ${response.status}`)
    }

    const result = await response.json()
    console.log('Email sent successfully:', result)

    return new Response(
      JSON.stringify({ success: true, messageId: result.messageId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
