
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, History, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';

interface UserProfile {
  id: string;
  email: string;
  credits: number;
  created_at: string;
}

interface GenerationHistory {
  id: string;
  user_email: string;
  text_input: string;
  provider: string;
  voice: string;
  created_at: string;
}

const AdminPanel = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { toast } = useToast();

  // Check if current user is admin (you can customize this logic)
  const isAdmin = user?.email === 'admin@ispeech.com' || user?.email?.endsWith('@admin.com');

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('id, email, credits, created_at')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch generation history
      const { data: historyData, error: historyError } = await supabase
        .from('tts_history')
        .select(`
          id,
          text_input,
          provider,
          voice,
          created_at,
          user_profiles!inner(email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (historyError) throw historyError;

      setUsers(usersData || []);
      setHistory(historyData?.map(item => ({
        id: item.id,
        user_email: item.user_profiles.email,
        text_input: item.text_input,
        provider: item.provider,
        voice: item.voice,
        created_at: item.created_at,
      })) || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetUserCredits = async (userId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ credits: 10 })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Credits reset for ${email}`,
      });
      
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error resetting credits:', error);
      toast({
        title: "Error",
        description: "Failed to reset credits",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Please sign in to access admin panel</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-white/70">You don't have permission to access the admin panel.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-purple-400" />
              Admin Panel
            </h1>
            <p className="text-white/70 text-lg">
              Manage users and monitor system usage
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Users Management */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Users ({users.length})
                </CardTitle>
                <Button
                  onClick={fetchData}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-white/70 text-center py-4">Loading...</div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="bg-white/5 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-white font-medium">{user.email}</div>
                          <div className="text-white/70 text-sm">
                            Credits: {user.credits} | Joined: {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          onClick={() => resetUserCredits(user.id, user.email)}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Reset Credits
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generation History */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Generations ({history.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-white/70 text-center py-4">Loading...</div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white/5 rounded-lg p-3"
                      >
                        <div className="text-white font-medium text-sm mb-1">
                          {item.user_email}
                        </div>
                        <div className="text-white/70 text-sm mb-2">
                          "{item.text_input.substring(0, 50)}..."
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <span>{item.provider}</span>
                          <span>•</span>
                          <span>{item.voice}</span>
                          <span>•</span>
                          <span>{new Date(item.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
