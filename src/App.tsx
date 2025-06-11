import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Environment, OrbitControls } from '@react-three/drei';
import Track from './components/Track';
import Floor from './components/Floor';
import Car from './components/Car';

function App() {
  return (
    <div className="w-full h-screen" style={{ background: '#1a1a2e' }}>
      <Canvas
        shadows
        camera={{
          position: [20, 20, 20],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <Environment preset="sunset" />
        <Physics gravity={[0, -9.82, 0]}>
          <Floor />
          <Track />
          <Car />
        </Physics>
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={100}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
      </Canvas>
    </div>
  );
}

export default App;