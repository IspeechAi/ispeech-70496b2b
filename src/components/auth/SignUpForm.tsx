
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthError } from '@/hooks/useAuthError';
import { useNavigate } from 'react-router-dom';

interface SignUpFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SignUpForm = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  isLoading,
  setIsLoading
}: SignUpFormProps) => {
  const { handleAuthError, handleAuthSuccess } = useAuthError();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      handleAuthError({ message: "Please fill in all fields" });
      return;
    }

    if (password.length < 6) {
      handleAuthError({ message: "Password must be at least 6 characters long" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?mode=confirm`
        }
      });

      if (error) {
        if (error.message.includes('email') && error.message.includes('limit')) {
          handleAuthError({
            message: "Email verification is temporarily limited. Please try signing in if you already have an account, or try again later."
          });
        } else {
          throw error;
        }
      } else {
        handleAuthSuccess("Account created! Please check your email for a confirmation link.");
        // Don't navigate immediately, let them confirm their email first
      }
    } catch (error) {
      handleAuthError(error, "sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-3">
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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="pl-10"
          minLength={6}
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default SignUpForm;
