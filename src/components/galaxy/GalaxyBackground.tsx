
import React from 'react';

const GalaxyBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep space gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-blue-900/40" />
      
      {/* Secondary gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/10 to-slate-900/50" />
      
      {/* Animated twinkling stars */}
      <div className="absolute inset-0">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 2}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>
      
      {/* Large bright stars */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={`bright-${i}`}
            className="absolute rounded-full bg-gradient-radial from-white via-cyan-200 to-transparent animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 3}s`,
            }}
          />
        ))}
      </div>
      
      {/* Galaxy spiral center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-96 h-96 rounded-full bg-gradient-radial from-purple-400/20 via-blue-500/15 to-transparent animate-spin-slow opacity-30" />
        <div className="absolute inset-0 w-72 h-72 m-auto rounded-full bg-gradient-radial from-cyan-400/15 via-purple-400/10 to-transparent animate-spin-slow" 
             style={{animationDirection: 'reverse', animationDuration: '30s'}} />
      </div>
      
      {/* Floating nebula clouds */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-gradient-radial from-pink-400/8 via-purple-400/4 to-transparent rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-radial from-blue-400/8 via-cyan-400/4 to-transparent rounded-full blur-2xl animate-float-delayed" />
      <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-gradient-radial from-violet-400/6 via-indigo-400/3 to-transparent rounded-full blur-xl animate-float" 
           style={{animationDelay: '1s', animationDuration: '7s'}} />
      
      {/* Cosmic dust particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={`dust-${i}`}
            className="absolute rounded-full bg-gradient-radial from-white/20 to-transparent animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 10 + 8}s`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
          />
        ))}
      </div>
      
      {/* Shooting stars */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
            style={{
              left: `${Math.random() * 50}%`,
              top: `${Math.random() * 50}%`,
              width: '100px',
              transform: 'rotate(45deg)',
              animation: `shooting-star 3s linear infinite ${Math.random() * 10}s`,
              opacity: 0,
            }}
          />
        ))}
      </div>
      
      {/* Cosmic glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/20" />
    </div>
  );
};

export default GalaxyBackground;
