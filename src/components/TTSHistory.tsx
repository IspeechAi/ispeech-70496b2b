
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Download, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

interface HistoryItem {
  id: string;
  text_input: string;
  provider_used: string;
  audio_url: string | null;
  created_at: string;
  characters_count: number;
}

const TTSHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('user_tts_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const handleDownload = (audioUrl: string, id: string) => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `tts-${id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Sign in to view your history</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-500">No history yet</p>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="border rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">
                  {new Date(item.created_at).toLocaleDateString()} • {item.provider_used}
                </p>
                <p className="text-sm mb-2 line-clamp-2">
                  {item.text_input.substring(0, 80)}...
                </p>
                <div className="flex gap-2">
                  {item.audio_url && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePlay(item.audio_url!)}
                        className="h-7 px-2"
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(item.audio_url!, item.id)}
                        className="h-7 px-2"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TTSHistory;
