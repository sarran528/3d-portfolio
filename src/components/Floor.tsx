import React from 'react';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

const Floor: React.FC = () => {
  const [ref] = useBox(() => ({
    mass: 0, // Static object
    position: [0, -0.5, 0], // Slightly below ground level
    args: [100, 1, 100], // Much larger floor
    material: {
      friction: 1.0, // High friction
      restitution: 0.0, // No bounce
    },
    type: 'Static',
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <boxGeometry args={[100, 1, 100]} />
      <meshStandardMaterial 
        color="#303030"
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
};

export default Floor; 