import React from 'react';
import { useGLTF } from '@react-three/drei';

interface CityPropProps {
  modelPath: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
}

const CityProp: React.FC<CityPropProps> = ({
  modelPath,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = [0, 0, 0]
}) => {
  const { scene } = useGLTF(modelPath);

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

export default CityProp; 