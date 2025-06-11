import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Environment } from '@react-three/drei';
import Track from './components/Track';
import Floor from './components/Floor';
import Car from './components/Car';

function App() {
  const [isDriving, setIsDriving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setIsDriving(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setIsDriving(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div
      className="w-full h-screen"
      style={{
        // Diagonal evening gradient background
        background: 'linear-gradient(135deg,rgb(20, 135, 184) 0%,rgb(48, 154, 224) 20%, #74c0fc 40%,rgb(228, 197, 151) 60%, #ff5e3a 100%)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      }}
    >
      <Canvas
        shadows
        camera={{
          position: [20, 20, 20],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Environment preset="sunset" />
        <Physics gravity={[0, -9.82, 0]}>
          <Floor />
          <Track />
          <Car />
        </Physics>
        
        <ambientLight intensity={0.6} color="#ff9d4d" />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={1.2} 
          color="#ff9d4d"
          castShadow 
        />
        <pointLight 
          position={[-10, 10, -10]} 
          intensity={0.8} 
          color="#ff6b35"
        />
        <pointLight 
          position={[0, 15, 0]} 
          intensity={0.5} 
          color="#ff9d4d"
        />
      </Canvas>
    </div>
  );
}

export default App;