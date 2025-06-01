
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { UserApiKey, ApiKeyConfig } from '@/types/apiKeys';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [userApiKeys, setUserApiKeys] = useState<UserApiKey[]>([]);
  const [savingKeys, setSavingKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const { user } = useAuthStore();

  const fetchUserApiKeys = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('user-api-key-helpers', {
        body: {
          action: 'get',
          userId: user?.id
        }
      });

      if (error) throw error;

      setUserApiKeys(data.data || []);
      
      // Populate the form with existing keys
      const keyMap: Record<string, string> = {};
      data.data?.forEach((key: UserApiKey) => {
        keyMap[key.provider] = key.api_key;
      });
      setApiKeys(keyMap);
    } catch (error) {
      console.error('Error fetching user API keys:', error);
      toast({
        title: "Error",
        description: "Failed to load your API keys.",
        variant: "destructive",
      });
    }
  };

  const saveApiKey = async (keyConfig: ApiKeyConfig) => {
    const value = apiKeys[keyConfig.id];
    if (!value) {
      toast({
        title: "Error",
        description: "Please enter an API key before saving.",
        variant: "destructive",
      });
      return;
    }

    setSavingKeys(prev => ({ ...prev, [keyConfig.id]: true }));

    try {
      const { error } = await supabase.functions.invoke('user-api-key-helpers', {
        body: {
          action: 'upsert',
          userId: user?.id,
          provider: keyConfig.id,
          apiKey: value
        }
      });

      if (error) throw error;

      await fetchUserApiKeys();

      toast({
        title: "Success",
        description: `${keyConfig.label} saved successfully.`,
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: `Failed to save ${keyConfig.label}.`,
        variant: "destructive",
      });
    } finally {
      setSavingKeys(prev => ({ ...prev, [keyConfig.id]: false }));
    }
  };

  const deleteApiKey = async (keyConfig: ApiKeyConfig) => {
    try {
      const { error } = await supabase.functions.invoke('user-api-key-helpers', {
        body: {
          action: 'delete',
          userId: user?.id,
          provider: keyConfig.id
        }
      });

      if (error) throw error;

      setApiKeys(prev => {
        const newKeys = { ...prev };
        delete newKeys[keyConfig.id];
        return newKeys;
      });

      await fetchUserApiKeys();

      toast({
        title: "Success",
        description: `${keyConfig.label} deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: `Failed to delete ${keyConfig.label}.`,
        variant: "destructive",
      });
    }
  };

  const handleKeyChange = (keyId: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [keyId]: value
    }));
  };

  useEffect(() => {
    if (user) {
      fetchUserApiKeys();
    }
  }, [user]);

  return {
    apiKeys,
    userApiKeys,
    savingKeys,
    saveApiKey,
    deleteApiKey,
    handleKeyChange,
    fetchUserApiKeys
  };
};
