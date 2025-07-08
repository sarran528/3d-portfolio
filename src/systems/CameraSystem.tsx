import React from 'react';
import { OrbitControls } from '@react-three/drei';

interface CameraSystemProps {
  mouseControlEnabled: boolean;
}

const CameraSystem: React.FC<CameraSystemProps> = ({ mouseControlEnabled }) => {
  return (
    <OrbitControls 
      enableDamping 
      enablePan 
      enableZoom 
      enabled={mouseControlEnabled} 
    />
  );
};

export default CameraSystem; 




???sdvjidsjviodvidivd