
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Volume2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth code from URL
        const authCode = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          console.error('Auth callback error:', error, errorDescription);
          toast({
            title: "Authentication Error",
            description: errorDescription || "There was an issue with authentication. Please try signing in again.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        if (authCode) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(authCode);
          
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            toast({
              title: "Authentication Error",
              description: "Failed to complete sign in. Please try again.",
              variant: "destructive",
            });
            navigate('/auth');
          } else if (data.session) {
            toast({
              title: "Welcome to iSPEECH!",
              description: "You've been successfully signed in.",
            });
            navigate('/tts');
          } else {
            navigate('/auth');
          }
        } else {
          // Check for existing session
          const { data, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            navigate('/auth');
          } else if (data.session) {
            toast({
              title: "Welcome back!",
              description: "You're now signed in to iSPEECH.",
            });
            navigate('/tts');
          } else {
            navigate('/auth');
          }
        }
      } catch (error) {
        console.error('Unexpected auth callback error:', error);
        toast({
          title: "Authentication Error",
          description: "Something went wrong. Please try signing in again.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Volume2 className="h-12 w-12 text-purple-600 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            iSPEECH
          </h1>
        </div>
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
