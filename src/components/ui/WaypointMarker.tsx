import React, { useRef, useEffect, useState } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);

  // Sync mesh position with prop
  useEffect(() => {
    if (meshRef.current && !isDragging) {
      meshRef.current.position.copy(position);
    }
  }, [position, isDragging]);

  // Listen for transform changes and notify parent
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const onMouseDown = () => {
      setIsDragging(true);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      if (onMove && meshRef.current) {
        onMove(meshRef.current.position.clone(), index);
      }
    };

    const onObjectChange = () => {
      if (onMove && meshRef.current) {
        onMove(meshRef.current.position.clone(), index);
      }
    };

    controls.addEventListener('mouseDown', onMouseDown);
    controls.addEventListener('mouseUp', onMouseUp);
    controls.addEventListener('objectChange', onObjectChange);

    return () => {
      controls.removeEventListener('mouseDown', onMouseDown);
      controls.removeEventListener('mouseUp', onMouseUp);
      controls.removeEventListener('objectChange', onObjectChange);
    };
  }, [onMove, index]);

  return (
    <group>
      <TransformControls 
        ref={controlsRef} 
        object={meshRef.current ?? undefined} 
        mode="translate" 
        showX 
        showY 
        showZ
        size={0.5}
      >
        <mesh ref={meshRef}>
          <sphereGeometry args={[threshold / 2, 16, 16]} />
          <meshStandardMaterial
            color={isCurrent ? '#ff4444' : '#4444ff'}
            transparent
            opacity={0.4}
            emissive={isCurrent ? '#ff0000' : '#0000ff'}
            emissiveIntensity={0.2}
          />
        </mesh>
      </TransformControls>
      
      {/* Always render the text outside of TransformControls */}
      <Text
        position={[position.x, position.y + threshold + 0.5, position.z]}
        fontSize={threshold / 2}
        color="white"
        anchorX="center"
        anchorY="bottom"
        outlineColor="black"
        outlineWidth={0.05}
      >
        {index + 1}
      </Text>
    </group>
  );
};

export default WaypointMarker;