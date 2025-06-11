import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraProps {
  carPosition?: THREE.Vector3;
  carRotation?: THREE.Euler;
}

const Camera: React.FC<CameraProps> = ({ carPosition, carRotation }) => {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(() => {
    if (carPosition && cameraRef.current) {
      // Calculate camera position behind and above the car
      const cameraOffset = new THREE.Vector3(0, 50, 100); // Offset behind and above car
      
      // Apply car's rotation to the offset
      if (carRotation) {
        cameraOffset.applyEuler(carRotation);
      }
      
      // Set camera position relative to car
      const targetPosition = carPosition.clone().add(cameraOffset);
      cameraRef.current.position.lerp(targetPosition, 0.1); // Smooth follow
      
      // Look at the car
      cameraRef.current.lookAt(carPosition);
    }
  });

  return (
    <perspectiveCamera
      ref={cameraRef}
      fov={75}
      near={0.1}
      far={10000}
      position={[0, 50, 100]}
    />
  );
};

export default Camera; 