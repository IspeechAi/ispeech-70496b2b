
import { useToast } from '@/hooks/use-toast';

export const useAuthError = () => {
  const { toast } = useToast();

  const handleAuthError = (error: any, context?: string) => {
    console.error(`Auth error${context ? ` (${context})` : ''}:`, error);

    let title = "Authentication Error";
    let description = "Something went wrong. Please try again.";

    if (error?.message) {
      // Handle specific Supabase auth errors
      if (error.message.includes('email') && error.message.includes('limit')) {
        title = "Email Limit Reached";
        description = "Too many emails sent. Please wait before requesting another email or try signing in if you already have an account.";
      } else if (error.message.includes('Invalid credentials')) {
        title = "Invalid Credentials";
        description = "Please check your email and password and try again.";
      } else if (error.message.includes('Email not confirmed')) {
        title = "Email Not Confirmed";
        description = "Please check your email and click the confirmation link before signing in.";
      } else if (error.message.includes('User already registered')) {
        title = "Account Exists";
        description = "An account with this email already exists. Please sign in instead.";
      } else if (error.message.includes('Password should be at least')) {
        title = "Password Too Short";
        description = "Password must be at least 6 characters long.";
      } else if (error.message.includes('Unable to validate email address')) {
        title = "Invalid Email";
        description = "Please enter a valid email address.";
      } else if (error.message.includes('Failed to send email')) {
        title = "Email Delivery Failed";
        description = "We couldn't send the email. Please check your email address and try again, or contact support if the problem persists.";
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
      title: "Success",
      description: message,
    });
  };

  return { handleAuthError, handleAuthSuccess };
};
