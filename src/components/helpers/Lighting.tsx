import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Lighting: React.FC = () => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    // Animate the main directional light
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 1500;
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.3) * 1500;
    }

    // Animate spotlight for dramatic effect
    if (spotLightRef.current) {
      spotLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 10000;
      spotLightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 10000;
    }
  });

  return (
    <>
      {/* Ambient light for general illumination */}
      <ambientLight intensity={2} color="#4a4a5a" />
      
      {/* Main directional light */}
      <directionalLight
        ref={lightRef}
        position={[1500, 2500, 1000]}
        intensity={3}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={100000}
        shadow-camera-left={-5000}
        shadow-camera-right={5000}
        shadow-camera-top={5000}
        shadow-camera-bottom={-5000}
        shadow-bias={-0.0001}
      />
      
      {/* Dramatic spotlight */}
      <spotLight
        ref={spotLightRef}
        position={[10000, 20000, 0]}
        intensity={2.5}
        color="#00ffff"
        angle={Math.PI / 6}
        penumbra={0.5}
        distance={5000}
        decay={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Accent point lights */}
      <pointLight
        position={[0, 800, 0]}
        intensity={1.5}
        color="#6366f1"
        distance={400}
        decay={2}
      />
      
      <pointLight
        position={[2000, 500, 0]}
        intensity={1.5}
        color="#ec4899"
        distance={300}
        decay={2}
      />
      
      <pointLight
        position={[-2000, 500, 0]}
        intensity={1.5}
        color="#10b981"
        distance={300}
        decay={2}
      />
      
      <pointLight
        position={[0, 500, 2000]}
        intensity={1.5}
        color="#f59e0b"
        distance={300}
        decay={2}
      />
      
      <pointLight
        position={[0, 500, -2000]}
        intensity={1.5}
        color="#8b5cf6"
        distance={300}
        decay={2}
      />
      
      {/* Hemisphere light for natural lighting */}
      <hemisphereLight
        color="#0f172a"
        groundColor="#1e1b4b"
        intensity={1.0}
      />
    </>
  );
};

export default Lighting;