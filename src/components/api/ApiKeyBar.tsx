
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Key, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ApiProvider, ApiKeyStatus } from '@/types/providers';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ApiKeyBarProps {
  provider: ApiProvider;
  status: ApiKeyStatus | null;
  onKeyValidated: (provider: string) => void;
  onVoicesLoaded: (provider: string, voices: any[]) => void;
  onQuotaExhausted: (provider: string) => void;
}

const ApiKeyBar = ({ provider, status, onKeyValidated, onVoicesLoaded, onQuotaExhausted }: ApiKeyBarProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleValidateKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-api-key', {
        body: {
          provider: provider.id,
          apiKey: apiKey.trim()
        }
      });

      if (error) throw error;

      if (data.isValid) {
        toast({
          title: "✅ API Key Validated",
          description: `Successfully connected to ${provider.name}`,
        });
        
        onKeyValidated(provider.id);
        
        // Fetch voices for this provider
        if (data.voices) {
          onVoicesLoaded(provider.id, data.voices);
        }
        
        setApiKey('');
      } else {
        throw new Error(data.error || 'Invalid API key');
      }
    } catch (error) {
      console.error('API key validation error:', error);
      toast({
        title: "❌ Invalid API Key",
        description: error.message || `Failed to validate ${provider.name} API key`,
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusBadge = () => {
    if (!status) return null;
    
    if (status.isValid && status.isActive) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const getQuotaInfo = () => {
    if (!status || !status.quotaUsed || !status.quotaLimit) return null;
    
    const percentage = (status.quotaUsed / status.quotaLimit) * 100;
    const isNearLimit = percentage > 80;
    
    // Check if quota is exhausted
    if (percentage >= 100) {
      onQuotaExhausted(provider.id);
    }
    
    return (
      <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Usage</span>
          <span>{status.quotaUsed}/{status.quotaLimit}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all ${
              isNearLimit ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{provider.icon}</span>
            <div>
              <h3 className="text-lg font-semibold">{provider.name}</h3>
              <p className="text-sm text-gray-400 font-normal">{provider.description}</p>
            </div>
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!status?.isActive && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showKey ? 'text' : 'password'}
                placeholder={`Enter ${provider.name} API Key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-500 pr-10"
                onKeyPress={(e) => e.key === 'Enter' && handleValidateKey()}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>
            <Button
              onClick={handleValidateKey}
              disabled={!apiKey.trim() || isValidating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isValidating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Key className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
        
        {status?.isActive && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-green-300">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">API key is active and ready to use</span>
            </div>
            {getQuotaInfo()}
          </div>
        )}
        
        {provider.supportsCloning && status?.isActive && (
          <div className="pt-2 border-t border-purple-500/20">
            <Badge variant="outline" className="text-cyan-300 border-cyan-500/30">
              🎙️ Voice Cloning Available
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyBar;
