import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

const Car: React.FC = () => {
  const { scene } = useGLTF('/models/car.glb');
  const [isLoaded, setIsLoaded] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  const [ref, api] = useBox(() => ({
    mass: 800,
    position: [0, 1.8, 0], // Lowered to sit *just* above the track
    args: [1, 0.5, 2.2], // Realistic car size, matching GLB scaled by 35
    material: {
      friction: 0.4,
      restitution: 0.1,
    },
    type: 'Dynamic',
  }));
  

  useEffect(() => {
    if (scene) {
      console.log('Car GLB scene loaded:', scene);
      scene.scale.set(150,150,150);
      scene.position.set(0, 0, 0); // Reset visual offset to match physics body
      
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          if (child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach(material => {
              if (material instanceof THREE.MeshStandardMaterial) {
                material.metalness = 0.5;
                material.roughness = 0.3;
                material.needsUpdate = true;
              }
            });
          }
        }
      });
      
      setIsLoaded(true);
    }
  }, [scene]);

  // Sync physics → visual
  useEffect(() => {
    const unsubPos = api.position.subscribe(([x, y, z]) => {
      if (groupRef.current) groupRef.current.position.set(x, y, z);
    });
    const unsubRot = api.rotation.subscribe(([x, y, z]) => {
      if (groupRef.current) {
        const euler = new THREE.Euler(x, y, z, 'XYZ');
        groupRef.current.quaternion.setFromEuler(euler);
      }
    });
    return () => {
      unsubPos();
      unsubRot();
    };
  }, [api]);

  if (!isLoaded) return null;

  return (
    <group ref={groupRef}> {/* Attach the groupRef to the visual group */}
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
};

export default Car;
