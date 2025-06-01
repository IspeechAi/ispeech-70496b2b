
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

interface UsageData {
  provider: string;
  characters_used: number;
  requests_count: number;
  quota: number;
}

const UsageStats = () => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      const currentMonth = new Date().toISOString().substring(0, 7);
      
      // Get usage tracking data
      const { data: usage } = await supabase
        .from('tts_usage_tracking')
        .select('*')
        .eq('month_year', currentMonth);

      // Get API configs for quotas
      const { data: configs } = await supabase
        .from('tts_api_configs')
        .select('*')
        .eq('is_active', true);

      if (usage && configs) {
        const combinedData = configs.map(config => {
          const usageRecord = usage.find(u => u.provider === config.provider);
          return {
            provider: config.provider,
            characters_used: usageRecord?.characters_used || 0,
            requests_count: usageRecord?.requests_count || 0,
            quota: config.monthly_quota,
          };
        });
        
        setUsageData(combinedData);
      }
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProviderDisplayName = (provider: string) => {
    const names: { [key: string]: string } = {
      'elevenlabs': 'ElevenLabs',
      'openai': 'OpenAI',
      'azure': 'Azure TTS',
      'google': 'Google TTS'
    };
    return names[provider] || provider;
  };

  const getUsagePercentage = (used: number, quota: number) => {
    return quota > 0 ? Math.min((used / quota) * 100, 100) : 0;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage This Month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {usageData.length > 0 ? (
            usageData.map((data) => {
              const percentage = getUsagePercentage(data.characters_used, data.quota);
              const isOverQuota = percentage >= 100;
              
              return (
                <div key={data.provider} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {getProviderDisplayName(data.provider)}
                    </span>
                    <span className={`text-sm ${isOverQuota ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                      {formatNumber(data.characters_used)} / {formatNumber(data.quota)}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${isOverQuota ? 'bg-red-100' : ''}`}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{data.requests_count} requests</span>
                    <span>{percentage.toFixed(1)}% used</span>
                  </div>
                  {isOverQuota && (
                    <div className="text-xs text-red-600 font-medium">
                      ⚠️ Quota exceeded
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              No usage data available for this month
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStats;
