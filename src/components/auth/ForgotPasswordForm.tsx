
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthError } from '@/hooks/useAuthError';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { handleAuthError, handleAuthSuccess } = useAuthError();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      handleAuthError({ message: "Please enter your email address" });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      handleAuthSuccess("Password reset email sent! Please check your inbox.");
    } catch (error) {
      handleAuthError(error, "password reset");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle>Check Your Email</CardTitle>
          <p className="text-sm text-gray-600">
            We've sent a password reset link to {email}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-500">
            <p>Didn't receive the email? Check your spam folder.</p>
          </div>
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <p className="text-sm text-gray-600">
          Enter your email to receive a password reset link
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <div className="space-y-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign In
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
