// In your App.tsx file

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Environment } from '@react-three/drei';
import Track from './components/Track';
import Floor from './components/Floor';
import Car from './components/Car';
import * as THREE from 'three';
function App() {
  // ... (existing state and useEffect for keyboard events)

  // --- Adjust these values for the slightly more top-down Bugatti-like camera angle ---

  // Define the fixed camera rotation for the Bugatti-like perspective, but steeper pitch
  const fixedCameraRotation = new THREE.Euler(
    -Math.PI / 2.9, // More negative = more top-down (about -72 degrees)
    Math.PI / 40,   // Yaw: slight side angle
    0
  );

  // Define the fixed offset for the camera relative to the car's position in world space.
  // Increase Y height for more top-down.
  const cameraOffset = new THREE.Vector3(
    3,   // X offset: To the right of the car
    12,   // Y offset: Increased height for a slightly more top-down feel
    8    // Z offset: Fairly far behind the car
  );

  return (
    <div
      className="w-full h-screen"
      style={{
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
          position: [cameraOffset.x, cameraOffset.y, cameraOffset.z],
          rotation: [fixedCameraRotation.x, fixedCameraRotation.y, fixedCameraRotation.z],
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
          <Car fixedCameraRotation={fixedCameraRotation} cameraOffset={cameraOffset} />
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