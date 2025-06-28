import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

const Mailbox: React.FC<{ position?: [number, number, number]; scale?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
}) => {
  const { scene } = useGLTF('/models/environment/mailbox.glb');
  const ref = useRef<THREE.Group>(null);

  return (
    <primitive
      ref={ref}
      object={scene}
      position={position}
      scale={[scale, scale, scale]}
      castShadow
      receiveShadow
    />
  );
};

export default Mailbox;