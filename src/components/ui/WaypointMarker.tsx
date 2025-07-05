import React, { useState, useEffect, useCallback } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface WaypointMarkerProps {
  position: THREE.Vector3;
  isCurrent: boolean;
  threshold: number;
  index: number;
}

const MOVE_STEP = 1; // Adjust movement step as needed

const WaypointMarker: React.FC<WaypointMarkerProps> = ({
  position,
  isCurrent,
  threshold,
  index,
}) => {
  const [localPos, setLocalPos] = useState<[number, number, number]>([position.x, position.y, position.z]);
  const [selected, setSelected] = useState(false);

  // Keyboard movement handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!selected) return;
      setLocalPos(([x, y, z]) => {
        switch (event.key) {
          case 'ArrowLeft':
            return [x - MOVE_STEP, y, z];
          case 'ArrowRight':
            return [x + MOVE_STEP, y, z];
          case 'ArrowUp':
            return [x, y, z - MOVE_STEP];
          case 'ArrowDown':
            return [x, y, z + MOVE_STEP];
          default:
            return [x, y, z];
        }
      });
    },
    [selected]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Click to select/deselect marker
  const handlePointerDown = () => setSelected((s) => !s);

  return (
    <group position={localPos}>
      <mesh
        onPointerDown={handlePointerDown}
        scale={selected ? 1.2 : 1}
      >
        <sphereGeometry args={[threshold / 1.5, 24, 24]} />
        <meshStandardMaterial
          color={isCurrent ? 'red' : selected ? 'orange' : 'blue'}
          transparent
          opacity={0.3} // Reduced opacity
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
};

export default WaypointMarker;