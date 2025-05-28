
import { useToast } from '@/hooks/use-toast';

export const useAuthError = () => {
  const { toast } = useToast();

  const handleAuthError = (error: any, context?: string) => {
    console.error(`Auth error${context ? ` during ${context}` : ''}:`, error);
    
    let title = "Authentication Error";
    let description = "An unexpected error occurred. Please try again.";

    if (error?.message) {
      const message = error.message.toLowerCase();
      
      if (message.includes('invalid login credentials') || message.includes('invalid_credentials')) {
        title = "Invalid Credentials";
        description = "The email or password you entered is incorrect. Please try again.";
      } else if (message.includes('email not confirmed')) {
        title = "Email Not Confirmed";
        description = "Please check your email and click the confirmation link before signing in.";
      } else if (message.includes('user already registered')) {
        title = "Account Already Exists";
        description = "An account with this email already exists. Please sign in instead.";
      } else if (message.includes('signup is disabled')) {
        title = "Sign Up Disabled";
        description = "New registrations are temporarily disabled. Please try again later.";
      } else if (message.includes('email rate limit')) {
        title = "Too Many Attempts";
        description = "Too many email attempts. Please wait a few minutes before trying again.";
      } else if (message.includes('invalid app id')) {
        title = "Facebook Login Error";
        description = "Facebook login is temporarily unavailable. Please use email or GitHub login.";
      } else {
        description = error.message;
      }
    }

    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  const handleAuthSuccess = (message: string) => {
    toast({
      title: "Success!",
      description: message,
    });
  };

  return { handleAuthError, handleAuthSuccess };
};
