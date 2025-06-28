import React from 'react';
import { useGLTF } from '@react-three/drei';

interface StatueProps {
  position: [number, number, number];
  scale: [number, number, number];
}

const Statue: React.FC<StatueProps> = ({ position, scale }) => {
  const { scene } = useGLTF('/models/misc/statue.glb');

  return (
    <primitive
      object={scene}
      position={position}
      scale={scale}
    />
  );
};

export default Statue;
