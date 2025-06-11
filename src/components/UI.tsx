import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Info,
  Car,
  Zap
} from 'lucide-react';

const UI: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      {/* Top UI Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Car className="w-8 h-8 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              3D Racing
            </span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
          >
            <Info className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 p-4">
        <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>Controls</span>
        </h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <kbd className="bg-white/20 px-2 py-1 rounded text-xs">W</kbd>
            <span>Forward</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="bg-white/20 px-2 py-1 rounded text-xs">S</kbd>
            <span>Backward</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="bg-white/20 px-2 py-1 rounded text-xs">A</kbd>
            <span>Turn Left</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="bg-white/20 px-2 py-1 rounded text-xs">D</kbd>
            <span>Turn Right</span>
          </div>
        </div>
      </div>

      {/* Speed and Status */}
      <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 p-4">
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-cyan-400">0</div>
          <div className="text-sm text-gray-300">KM/H</div>
        </div>
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Lap Time</span>
            <span>00:00:00</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Best Lap</span>
            <span>--:--:--</span>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-gray-900 rounded-lg border border-white/20 p-6 max-w-lg mx-4">
            <h2 className="text-xl font-bold text-white mb-4">3D Racing Game</h2>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                Welcome to the 3D racing experience! This demo showcases a Three.js-powered
                racing game with realistic physics and collision detection.
              </p>
              <div>
                <h3 className="text-white font-semibold mb-2">Features:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Real-time 3D rendering with Three.js</li>
                  <li>Physics simulation with collision detection</li>
                  <li>Dynamic lighting and shadows</li>
                  <li>Responsive car controls</li>
                  <li>Ready for your custom GLB models</li>
                </ul>
              </div>
              <p className="text-cyan-400">
                Replace the placeholder models with your car.glb and track.glb files
                to see your custom assets in action!
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UI;