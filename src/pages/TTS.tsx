
import React from 'react';
import CosmicBackground from '@/components/CosmicBackground';
import VoiceStudio from '@/components/VoiceStudio';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

const TTS = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CosmicBackground />
      <div className="relative z-10">
        <VoiceStudio />
      </div>
    </div>
  );
};

export default TTS;
