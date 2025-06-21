import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function Statue(props: React.ComponentProps<'group'>) {
  // Path is relative to the public folder
  const { scene } = useGLTF('/models/statue.glb');
  return <primitive object={scene} {...props} />;
}
