
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
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Authentication Error",
            description: "There was an issue confirming your email. Please try signing in.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        if (data.session) {
          toast({
            title: "Email Confirmed!",
            description: "Welcome to ISPEECH! Your account is now active.",
          });
          navigate('/tts');
        } else {
          // Handle the auth code from URL
          const authCode = searchParams.get('code');
          if (authCode) {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(authCode);
            
            if (exchangeError) {
              console.error('Code exchange error:', exchangeError);
              toast({
                title: "Authentication Error",
                description: "Failed to confirm email. Please try signing in.",
                variant: "destructive",
              });
              navigate('/auth');
            } else {
              toast({
                title: "Email Confirmed!",
                description: "Welcome to ISPEECH! Your account is now active.",
              });
              navigate('/tts');
            }
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
            ISPEECH
          </h1>
        </div>
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Confirming your email...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
