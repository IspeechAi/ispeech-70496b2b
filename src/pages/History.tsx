
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Download, Clock, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

interface HistoryItem {
  id: string;
  text_input: string;
  provider: string;
  voice: string;
  audio_url: string | null;
  created_at: string;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('tts_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Error",
        description: "Failed to load history",
        variant: "destructive",
      });
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
    link.download = `ispeech-${id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tts_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(history.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Audio deleted from history",
      });
    } catch (error) {
      console.error('Error deleting history item:', error);
      toast({
        title: "Error",
        description: "Failed to delete audio",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="pt-6 text-center">
                <p className="text-white/70">Please sign in to view your history</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Clock className="h-8 w-8 text-purple-400" />
              Voice History
            </h1>
            <p className="text-white/70 text-lg">
              Your generated audio files and conversation history
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-white/70 mt-2">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="pt-6 text-center">
                <p className="text-white/70 mb-4">No audio history yet</p>
                <Button 
                  onClick={() => window.location.href = '/tts'}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Create Your First Audio
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {history.map((item) => (
                <Card key={item.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 text-white">
                          {item.text_input.substring(0, 100)}
                          {item.text_input.length > 100 && '...'}
                        </CardTitle>
                        <div className="flex gap-4 text-sm text-white/70">
                          <span>Voice: {item.voice}</span>
                          <span>Provider: {item.provider}</span>
                          <span>{new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 justify-between items-center">
                      <div className="flex gap-2">
                        {item.audio_url && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePlay(item.audio_url!)}
                              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              <Play className="h-4 w-4" />
                              Play
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(item.audio_url!, item.id)}
                              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 border-red-400/20 hover:border-red-300/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                    {!item.audio_url && (
                      <p className="text-sm text-white/50 mt-2">Audio file no longer available</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
