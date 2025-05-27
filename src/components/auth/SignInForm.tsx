
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthError } from '@/hooks/useAuthError';
import { useNavigate } from 'react-router-dom';

interface SignInFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onForgotPassword: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SignInForm = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onForgotPassword,
  isLoading,
  setIsLoading
}: SignInFormProps) => {
  const { handleAuthError, handleAuthSuccess } = useAuthError();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      handleAuthError({ message: "Please fill in all fields" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      handleAuthSuccess("Welcome back! You've been signed in successfully.");
      navigate('/tts');
    } catch (error) {
      handleAuthError(error, "sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-3">
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="pl-10"
          required
        />
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="pl-10"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
      <Button
        type="button"
        variant="link"
        onClick={onForgotPassword}
        className="w-full text-sm text-purple-600 hover:text-purple-700"
      >
        Forgot Password?
      </Button>
    </form>
  );
};

export default SignInForm;
