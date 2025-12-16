import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { lerpVector3 } from '../../../utils/math';
import { easing } from '../../../utils/easing';

const SPEED = 0.15;
const TURN_SPEED = 0.015;
const AUTONOMOUS_SPEED = 0.15; // Slightly reduced for better control
const AUTONOMOUS_TURN_SPEED = 0.015; // Increased for better turning

interface CarProps {
  fixedCameraRotation: THREE.Euler;
  cameraOffset: THREE.Vector3;
  isManualModeEnabled: boolean;
  autonomousPath: THREE.Vector3[];
  currentWaypointIndex: number;
  setCurrentWaypointIndex: React.Dispatch<React.SetStateAction<number>>;
  WAYPOINT_THRESHOLD: number;
  mouseControlEnabled: boolean;
  obstacles?: { position: [number, number, number]; size: [number, number, number] }[];
}

const Car: React.FC<CarProps> = ({
  fixedCameraRotation,
  cameraOffset,
  isManualModeEnabled,
  autonomousPath,
  currentWaypointIndex,
  setCurrentWaypointIndex,
  WAYPOINT_THRESHOLD,
  mouseControlEnabled
  , obstacles = []
}) => {
  const { scene } = useGLTF('/models/vehicles/car.glb');
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
  const targetCameraPosition = useRef(new THREE.Vector3());

  // Use a ref to track the previous state of isManualModeEnabled
  const prevIsManualModeEnabledRef = useRef(isManualModeEnabled);
  const carHalfSizeRef = useRef(new THREE.Vector3(2.5, 1.0, 5)); // fallback half-extents
  const [helperReady, setHelperReady] = useState(false);
  const carBBoxCenterRef = useRef(new THREE.Vector3(0, 0, 0));
  const helperBoxRef = useRef<THREE.Mesh>(null);
  const helperCircleRef = useRef<THREE.Mesh>(null);

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

  // Effect to reset waypoint index and car position when switching from manual to autonomous mode
  useEffect(() => {
    if (prevIsManualModeEnabledRef.current && !isManualModeEnabled && autonomousPath.length > 0) {
      setCurrentWaypointIndex(0);
      if (carRef.current) {
        // Position the car at the first waypoint
        carRef.current.position.copy(autonomousPath[0]);
        // Make car face the second waypoint if available
        if (autonomousPath.length > 1) {
          const direction = new THREE.Vector3()
            .subVectors(autonomousPath[1], autonomousPath[0])
            .normalize();
          const angle = Math.atan2(direction.x, direction.z);
          carRef.current.rotation.y = angle;
        }
      }
    }
    prevIsManualModeEnabledRef.current = isManualModeEnabled;
  }, [isManualModeEnabled, autonomousPath, setCurrentWaypointIndex]);

  useFrame(() => {
    if (!carRef.current) return;

    const car = carRef.current;

    if (isManualModeEnabled) {
      // Manual driving controls
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

      if (keysRef.current.ArrowLeft) {
        car.rotation.y += TURN_SPEED;
      }

      if (keysRef.current.ArrowRight) {
        car.rotation.y -= TURN_SPEED;
      }
    } else {
      // Autonomous driving logic
      if (autonomousPath.length > 0) {
        const targetWaypoint = autonomousPath[currentWaypointIndex];
        const carPosition = car.position;

        // Calculate distance to the target waypoint
        const distance = carPosition.distanceTo(targetWaypoint);

        // If the car is close enough to the current waypoint, move to the next
        if (distance < WAYPOINT_THRESHOLD) {
          const nextIndex = (currentWaypointIndex + 1) % autonomousPath.length;
          setCurrentWaypointIndex(nextIndex);
          return; // Skip this frame to allow state update
        }

        // Calculate direction to the current target waypoint
        const directionToWaypoint = new THREE.Vector3()
          .subVectors(targetWaypoint, carPosition)
          .normalize();

        // Calculate the car's current forward direction
        const carForward = new THREE.Vector3();
        car.getWorldDirection(carForward);

        // Calculate the target angle the car should face
        const targetAngle = Math.atan2(directionToWaypoint.x, directionToWaypoint.z);
        const currentAngle = car.rotation.y;

        // Calculate the difference between current and target angles
        let angleDiff = targetAngle - currentAngle;
        
        // Normalize angle difference to [-π, π]
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

        // Apply turning with smoother control
        const maxTurnThisFrame = AUTONOMOUS_TURN_SPEED;
        if (Math.abs(angleDiff) > 0.05) { // Only turn if significant difference
          if (angleDiff > 0) {
            car.rotation.y += Math.min(maxTurnThisFrame, angleDiff);
          } else {
            car.rotation.y += Math.max(-maxTurnThisFrame, angleDiff);
          }
        }

        // Always move forward
        const moveDirection = new THREE.Vector3();
        car.getWorldDirection(moveDirection);
        car.position.addScaledVector(moveDirection, AUTONOMOUS_SPEED);
      }
    }

    // Camera follow logic with easing (only when mouse control is disabled)
    if (!mouseControlEnabled) {
      targetCameraPosition.current.set(
        car.position.x + cameraOffset.x,
        car.position.y + cameraOffset.y,
        car.position.z + cameraOffset.z
      );

      // Use easing for smoother camera movement
      const easedPosition = lerpVector3(
        camera.position,
        targetCameraPosition.current,
        0.05 // Smoother camera following
      );
      camera.position.copy(easedPosition);
      camera.rotation.copy(fixedCameraRotation);
    }

    // Wall collision detection and response
    const WALL_MIN_X = -75;
    const WALL_MAX_X = 75;
    const WALL_MIN_Z = -40;
    const WALL_MAX_Z = 40;

    // Circle-based collision on XZ plane (rotation-invariant)
    const half = carHalfSizeRef.current;
    const localCenter = carBBoxCenterRef.current.clone();
    const worldCenter = carRef.current.localToWorld(localCenter.clone());

    // use a flat radius from bbox (max of half-width and half-length) and add small padding
    const padding = 0.05;
    const carRadius = Math.max(half.x, half.z) + padding;

    for (const obs of obstacles) {
      const obsPos = new THREE.Vector3(obs.position[0], obs.position[1], obs.position[2]);
      const obsHalfX = obs.size[0] / 2;
      const obsHalfZ = obs.size[2] / 2;

      // approximate obstacle by its XZ extents as a rectangle; compute closest point on obs to car center
      const dx = Math.max(Math.abs(worldCenter.x - obsPos.x) - obsHalfX, 0);
      const dz = Math.max(Math.abs(worldCenter.z - obsPos.z) - obsHalfZ, 0);
      const distance = Math.sqrt(dx * dx + dz * dz);

      const combinedRadius = carRadius; // obstacle treated as rectangle; distance already accounts for obs size

      if (distance < combinedRadius) {
        // penetration depth
        const penetration = combinedRadius - distance;

        // compute push direction (from obstacle toward car) on XZ
        let pushDir = new THREE.Vector3(worldCenter.x - obsPos.x, 0, worldCenter.z - obsPos.z);
        if (pushDir.lengthSq() === 0) {
          // arbitrary direction if centers coincide
          pushDir.set(1, 0, 0);
        }
        pushDir.normalize();

        // apply world-space delta to car.position
        car.position.x += pushDir.x * penetration;
        car.position.z += pushDir.z * penetration;
      }
    }

    // Keep the car within world bounds
    car.position.x = Math.max(WALL_MIN_X + half.x, Math.min(WALL_MAX_X - half.x, car.position.x));
    car.position.z = Math.max(WALL_MIN_Z + half.z, Math.min(WALL_MAX_Z - half.z, car.position.z));

    // Update helper visuals to match computed local center
    if (helperReady) {
      if (helperBoxRef.current) {
        helperBoxRef.current.position.copy(carBBoxCenterRef.current);
      }
      if (helperCircleRef.current) {
        // place circle slightly below the bbox center toward the bottom of the bbox
        helperCircleRef.current.position.set(
          carBBoxCenterRef.current.x,
          carBBoxCenterRef.current.y - half.y + 0.01,
          carBBoxCenterRef.current.z
        );
      }
    }
  });

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

      // compute bounding box for car to determine half-extents
      try {
        const cloned = scene.clone(true);
        cloned.scale.set(150, 150, 150);
        const bbox = new THREE.Box3().setFromObject(cloned);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        bbox.getSize(size);
        bbox.getCenter(center);
        carHalfSizeRef.current.set(size.x / 2, size.y / 2, size.z / 2);
        carBBoxCenterRef.current.copy(center);
        setHelperReady(true);
      } catch (err) {
        // fallback keeps default half-extents
        console.warn('Could not compute car bbox, using fallback extents', err);
      }
    }
  }, [scene]);

  return (
    <group ref={carRef}>
      {/* Example car size: width 2, height 1, length 4 */}
      {/* Collision helper visuals: wireframe AABB and ground circle */}
      {helperReady && (
        <>
          <mesh ref={helperBoxRef as any}>
            <boxGeometry args={[carHalfSizeRef.current.x * 2, carHalfSizeRef.current.y * 2, carHalfSizeRef.current.z * 2]} />
            <meshBasicMaterial color="#ffcc00" wireframe opacity={0.9} transparent />
          </mesh>

          <mesh ref={helperCircleRef as any} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[Math.max(carHalfSizeRef.current.x, carHalfSizeRef.current.z) + 0.1, 32]} />
            <meshBasicMaterial color="#00ff88" opacity={0.6} transparent />
          </mesh>
        </>
      )}
    </group>
  );
};

export default Car;