import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const SPEED = 0.1;
const TURN_SPEED = 0.02;

const SkyGradient = () => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color('#87CEEB') },
      bottomColor: { value: new THREE.Color('#E0F7FF') },
      offset: { value: 400 },
      exponent: { value: 0.6 }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `,
    side: THREE.BackSide
  });

  return (
    <mesh>
      <sphereGeometry args={[1000, 32, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Car: React.FC = () => {
  const { scene } = useGLTF('/models/car.glb');
  const carRef = useRef<THREE.Group>(null);
  const keysRef = useRef<{
    ArrowUp: boolean;
    ArrowDown: boolean;
    ArrowLeft: boolean;
    ArrowRight: boolean;
  }>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  const { camera } = useThree();

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in keysRef.current) {
        keysRef.current[e.key as keyof typeof keysRef.current] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key in keysRef.current) {
        keysRef.current[e.key as keyof typeof keysRef.current] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Frame loop to move the car and update camera
  useFrame(() => {
    if (!carRef.current) return;

    const car = carRef.current;

    // Forward/Backward movement
    if (keysRef.current.ArrowUp) {
      const direction = new THREE.Vector3();
      car.getWorldDirection(direction);
      car.position.addScaledVector(direction, SPEED);
    }

    if (keysRef.current.ArrowDown) {
      const direction = new THREE.Vector3();
      car.getWorldDirection(direction);
      car.position.addScaledVector(direction, -SPEED);
    }

    // Turning
    if (keysRef.current.ArrowLeft) {
      car.rotation.y += TURN_SPEED;
    }

    if (keysRef.current.ArrowRight) {
      car.rotation.y -= TURN_SPEED;
    }

    // Camera follow
    const carPosition = car.position;
    const cameraOffset = new THREE.Vector3(-9,6,18); // Offset from the car

    // Apply car's rotation to the camera offset
    cameraOffset.applyEuler(new THREE.Euler(0, car.rotation.y, 0));

    camera.position.copy(carPosition).add(cameraOffset);
    camera.lookAt(carPosition);
  });

  // Setup car visuals
  useEffect(() => {
    if (scene && carRef.current) {
      scene.scale.set(150, 150, 150);
      scene.position.set(0, 0, 0);

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

      carRef.current.add(scene.clone());
    }
  }, [scene]);

  return <group ref={carRef} />;
};

export default Car;