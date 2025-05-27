
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Volume2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate('/tts');
    }
  }, [user, navigate]);

  // Handle password reset mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'reset') {
      setShowForgotPassword(true);
    }
  }, [searchParams]);

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Volume2 className="h-8 w-8 text-purple-600 animate-pulse" />
            <span className="text-2xl font-bold text-gray-900">ISPEECH</span>
          </div>
          <CardTitle>Welcome to ISPEECH</CardTitle>
          <p className="text-sm text-gray-600">
            Sign in to access AI-powered text-to-speech
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <SignInForm
                email={email}
                password={password}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onForgotPassword={() => setShowForgotPassword(true)}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <SignUpForm
                email={email}
                password={password}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </TabsContent>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <GoogleSignInButton
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </Tabs>

          <div className="mt-6 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-purple-600 hover:underline">
              Terms & Conditions
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
