
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserCredits = () => {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const fetchCredits = async () => {
    if (!user) {
      setCredits(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching credits:', error);
        setCredits(0);
      } else {
        setCredits(data?.credits || 0);
      }
    } catch (error) {
      console.error('Error:', error);
      setCredits(0);
    } finally {
      setLoading(false);
    }
  };

  const deductCredit = async () => {
    if (!user || credits <= 0) {
      toast({
        title: "No Credits",
        description: "You don't have enough credits to generate audio.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ credits: credits - 1 })
        .eq('id', user.id);

      if (error) throw error;

      setCredits(prev => prev - 1);
      return true;
    } catch (error) {
      console.error('Error deducting credit:', error);
      toast({
        title: "Error",
        description: "Failed to deduct credit. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user]);

  return { credits, loading, deductCredit, refetchCredits: fetchCredits };
};
