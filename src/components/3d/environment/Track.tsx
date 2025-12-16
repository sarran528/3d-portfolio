import React, { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Track: React.FC = () => {
  const { scene } = useGLTF('/models/environment/track.glb');
  const [isLoaded, setIsLoaded] = useState(false);

  // Removed trimesh physics: the car is driven via code and does not
  // interact with the physics engine. Keep the visible track mesh only.
  useEffect(() => {
    if (scene) {
      scene.position.set(0, 0.1, 0);
      scene.scale.set(36, 36, 36);

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial) {
                material.metalness = 0.3;
                material.roughness = 0.4;
                material.needsUpdate = true;
              }
            });
          }
        }
      });

      setIsLoaded(true);
    }
  }, [scene]);

  if (!isLoaded) return null;

  return (
    <group>
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
};

// Uncomment and modify this when you provide your GLB file
/*
const TrackWithGLB: React.FC = () => {
  const { scene } = useGLTF('/track.glb'); // Place your track.glb in the public folder
  const [ref] = useTrimesh(() => ({
    mass: 0,
    args: [[], []], // Extract vertices and indices from your GLB
  }));

  return (
    <group ref={ref}>
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
};
*/

export default Track;