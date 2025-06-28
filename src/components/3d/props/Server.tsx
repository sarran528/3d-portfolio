import React from 'react';
import { useGLTF } from '@react-three/drei';

interface ServerProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
}

const Server: React.FC<ServerProps> = ({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = [0, 0, 0]
}) => {
  const { scene } = useGLTF('/models/sections/server.glb');

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

export default Server; 