
import React from 'react';

const GalaxyBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main galaxy background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-blue-900/30" />
      
      {/* Animated stars */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Galaxy spiral overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-radial from-purple-400/30 via-blue-500/20 to-transparent animate-spin-slow" />
      </div>
      
      {/* Nebula clouds */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-radial from-pink-400/10 via-purple-400/5 to-transparent rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-radial from-blue-400/10 via-cyan-400/5 to-transparent rounded-full blur-xl animate-float-delayed" />
    </div>
  );
};

export default GalaxyBackground;
