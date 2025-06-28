import React from 'react';
import { useGLTF } from '@react-three/drei';

interface PCSetupProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
}

const PCSetup: React.FC<PCSetupProps> = ({
  position = [0, 0, 0],
  scale = [5, 5, 5],
  rotation = [0, 0, 0]
}) => {
  const { scene } = useGLTF('/models/sections/pcsetup.glb');

  return (
    <primitive
      object={scene}
      position={position}
      scale={scale}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  );
};

export default PCSetup; 