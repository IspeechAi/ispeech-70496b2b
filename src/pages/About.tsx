
import React from 'react';
import CosmicBackground from '@/components/CosmicBackground';
import AboutSection from '@/components/AboutSection';

const About = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <CosmicBackground />
      <div className="relative z-10">
        <AboutSection />
      </div>
    </div>
  );
};

export default About;
