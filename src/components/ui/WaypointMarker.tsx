import React, { useRef, useEffect } from 'react';
import { Text, TransformControls } from '@react-three/drei';
import * as THREE from 'three';

interface WaypointMarkerProps {
  position: THREE.Vector3;
  isCurrent: boolean;
  threshold: number;
  index: number;
  onMove?: (newPos: THREE.Vector3, index: number) => void;
}

const WaypointMarker: React.FC<WaypointMarkerProps> = ({
  position,
  isCurrent,
  threshold,
  index,
  onMove,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const controlsRef = useRef<any>(null);

  // Sync mesh position with prop
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(position);
    }
  }, [position]);

  // Listen for transform changes and notify parent
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const callback = () => {
      if (onMove && meshRef.current) {
        onMove(meshRef.current.position.clone(), index);
      }
    };
    controls.addEventListener('objectChange', callback);
    return () => controls.removeEventListener('objectChange', callback);
  }, [onMove, index]);

  return (
    <TransformControls ref={controlsRef} object={meshRef.current ?? undefined} mode="translate" showX showY showZ>
      <>
        <mesh ref={meshRef}>
          <sphereGeometry args={[threshold / 1.5, 24, 24]} />
          <meshStandardMaterial
            color={isCurrent ? 'red' : 'blue'}
            transparent
            opacity={0.3}
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
      </>
    </TransformControls>
  );
};

export default WaypointMarker;
////neisnvsovd