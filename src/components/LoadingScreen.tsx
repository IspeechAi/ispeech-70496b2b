
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-blue-900/40 flex items-center justify-center">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            iSpeech
          </h1>
          <p className="text-xl text-gray-300">Loading the future of voice generation...</p>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <span className="text-gray-300 text-lg">Initializing</span>
        </div>
        
        <div className="mt-8 w-64 mx-auto">
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
