import React from 'react';
import { 
  X, 
  Play, 
  Pause,
  User,
  Briefcase,
  Code,
  Mail
} from 'lucide-react';
// Define the PortfolioSection type here or import it as a type from the correct file
// Example definition (replace with your actual structure):
export interface PortfolioSection {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
}
// If you already have this type defined elsewhere, import it as:
// import type { PortfolioSection } from '../../App';

interface PortfolioOverlayProps {
  currentSection: PortfolioSection | null;
  onClose: () => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

const PortfolioOverlay: React.FC<PortfolioOverlayProps> = ({ 
  currentSection, 
  onClose, 
  isAutoPlaying, 
  onToggleAutoPlay 
}) => {
  const getSectionIcon = (id: string) => {
    switch (id) {
      case 'about': return <User className="w-6 h-6" />;
      case 'projects': return <Briefcase className="w-6 h-6" />;
      case 'skills': return <Code className="w-6 h-6" />;
      case 'contact': return <Mail className="w-6 h-6" />;
      default: return <User className="w-6 h-6" />;
    }
  };

  return (
    <>
      {/* Top Navigation */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Portfolio Showcase
            </span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleAutoPlay}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-sm">{isAutoPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 p-4 max-w-sm">
        <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <span>Interactive Portfolio</span>
        </h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>Watch the car travel around the track and discover different sections of my portfolio.</p>
          <div className="flex items-center space-x-2 mt-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
            <span className="text-xs">Auto-playing journey</span>
          </div>
        </div>
      </div>

      {/* Section Modal */}
      {currentSection && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 p-4">
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-white/20 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center text-white">
                  {getSectionIcon(currentSection.id)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentSection.title}</h2>
                  <p className="text-gray-400">{currentSection.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-white">
              {currentSection.content}
            </div>
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg hover:from-cyan-700 hover:to-purple-700 transition-all duration-200 font-semibold"
              >
                Continue Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioOverlay;