import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface WaypointMarkerProps {
  position: THREE.Vector3;
  isCurrent: boolean;
  threshold: number;
  index: number;
}

const WaypointMarker: React.FC<WaypointMarkerProps> = ({ position, isCurrent, threshold, index }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[threshold / 1.5, 24, 24]} />
      <meshStandardMaterial
        color={isCurrent ? 'red' : 'blue'}
        transparent
        opacity={1} // Make visible
      />
    </mesh>
    <Text
      position={[0, threshold, 0]}
      fontSize={threshold / 1.5}
      color="white"
      anchorX="center"
      anchorY="bottom"
      outlineColor="black"
      outlineWidth={0.1}
    >
      {index + 1}
    </Text>
  </group>
);

export default WaypointMarker;