
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import GalaxyBackground from '@/components/galaxy/GalaxyBackground';

const NotFound = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GalaxyBackground />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="text-center">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            The page you're looking for doesn't exist in this galaxy.
          </p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
