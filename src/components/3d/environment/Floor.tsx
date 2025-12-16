import React from 'react';

const Floor: React.FC = () => {
  // Physics body removed: the car is currently moved via code
  // and the scene already relies on manual collision handling.
  // Keep the visible floor mesh only to preserve visuals.
  return (
    <mesh position={[0, -0.5, 0]} receiveShadow>
      <boxGeometry args={[150, 1, 80]} />
      <meshStandardMaterial 
        color="#303030"
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
};

export default Floor;