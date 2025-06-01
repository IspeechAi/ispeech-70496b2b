
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { UserApiKey } from '@/types/apiKeys';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [userApiKeys, setUserApiKeys] = useState<UserApiKey[]>([]);
  const [savingKeys, setSavingKeys] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserApiKeys();
    }
  }, [user]);

  const fetchUserApiKeys = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('user-api-key-helpers', {
        body: { action: 'get', userId: user.id }
      });

      if (error) throw error;

      setUserApiKeys(data.data || []);
      
      // Set the API keys in the local state
      const keysMap: Record<string, string> = {};
      (data.data || []).forEach((key: UserApiKey) => {
        if (key.is_active) {
          keysMap[key.provider] = '••••••••';
        }
      });
      setApiKeys(keysMap);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: "Error loading API keys",
        description: "Could not load your saved API keys. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyChange = (provider: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  const saveApiKey = async (provider: string, apiKey: string) => {
    if (!user || !apiKey.trim()) return;

    setSavingKeys(prev => ({ ...prev, [provider]: true }));
    
    try {
      const { error } = await supabase.functions.invoke('user-api-key-helpers', {
        body: { 
          action: 'upsert', 
          userId: user.id, 
          provider: provider, 
          apiKey: apiKey.trim() 
        }
      });

      if (error) throw error;

      toast({
        title: "API key saved",
        description: `Your ${provider} API key has been saved successfully.`,
      });

      await fetchUserApiKeys();
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Save failed",
        description: "Could not save your API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingKeys(prev => ({ ...prev, [provider]: false }));
    }
  };

  const deleteApiKey = async (provider: string) => {
    if (!user) return;

    setSavingKeys(prev => ({ ...prev, [provider]: true }));
    
    try {
      const { error } = await supabase.functions.invoke('user-api-key-helpers', {
        body: { 
          action: 'delete', 
          userId: user.id, 
          provider: provider 
        }
      });

      if (error) throw error;

      toast({
        title: "API key removed",
        description: `Your ${provider} API key has been removed.`,
      });

      await fetchUserApiKeys();
      
      // Remove from local state
      setApiKeys(prev => {
        const newKeys = { ...prev };
        delete newKeys[provider];
        return newKeys;
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Deletion failed",
        description: "Could not remove your API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingKeys(prev => ({ ...prev, [provider]: false }));
    }
  };

  return {
    apiKeys,
    userApiKeys,
    savingKeys,
    isLoading,
    saveApiKey,
    deleteApiKey,
    handleKeyChange,
    refetch: fetchUserApiKeys
  };
};
