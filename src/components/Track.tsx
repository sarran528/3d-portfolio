import React, { useEffect, useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useTrimesh } from '@react-three/cannon';
import * as THREE from 'three';

const Track: React.FC = () => {
  const { scene } = useGLTF('/models/track.glb');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Extract vertices and indices from the GLB model
  const { vertices, indices } = useMemo(() => {
    const vertices: number[] = [];
    const indices: number[] = [];
    
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const geometry = child.geometry;
        const position = geometry.attributes.position;
        const index = geometry.index;
        
        // Scale vertices to match the scene scale
        for (let i = 0; i < position.count; i++) {
          vertices.push(
            position.getX(i) * 35,
            position.getY(i) * 35,
            position.getZ(i) * 35
          );
        }
        
        // Add indices
        if (index) {
          for (let i = 0; i < index.count; i++) {
            indices.push(index.getX(i));
          }
        }
      }
    });
    
    return { vertices, indices };
  }, [scene]);
  
  // Add physics to the track using trimeshL
  const [ref] = useTrimesh(() => ({
    mass: 0, // Static object
    position: [0, 0.1, 0], // Changed from [0, 0.1, 0] to ground level
    args: [vertices, indices],
    material: {
      friction: 0.8,
      restitution: 0.0,
    },
    type: 'Static',
  }));
  
  useEffect(() => {
    if (scene) {
      console.log('Track GLB scene loaded:', scene);
      scene.position.set(0, 0.1, 0); // Changed from [0, 0.1, 0] to ground level
      scene.scale.set(35, 35, 35);
      
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          if (child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach(material => {
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

  if (!isLoaded) {
    return null;
  }

  return (
    <group ref={ref as any}>
      <primitive 
        object={scene} 
        castShadow
        receiveShadow
      />
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