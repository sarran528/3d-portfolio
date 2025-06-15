import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-400/30 rounded-full animate-spin mx-auto">
            <div className="absolute inset-2 border-4 border-purple-500/50 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}>
              <div className="absolute inset-2 border-4 border-pink-400/70 rounded-full animate-spin">
                <div className="absolute inset-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Loading Portfolio Experience</h2>
          <p className="text-gray-300 max-w-md mx-auto">
            Preparing your interactive 3D journey through my work and expertise...
          </p>
        </div>
        
        <div className="w-80 mx-auto">
          <div className="bg-gray-700/50 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 h-full rounded-full animate-pulse"></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">Initializing 3D environment...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;