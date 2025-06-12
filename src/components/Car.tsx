import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

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
}

const Car: React.FC<CarProps> = ({
  fixedCameraRotation,
  cameraOffset,
  isManualModeEnabled,
  autonomousPath,
  currentWaypointIndex,
  setCurrentWaypointIndex,
  WAYPOINT_THRESHOLD
}) => {
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
  const targetCameraPosition = useRef(new THREE.Vector3());

  // Use a ref to track the previous state of isManualModeEnabled
  const prevIsManualModeEnabledRef = useRef(isManualModeEnabled);

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

    // Camera follow logic
    targetCameraPosition.current.set(
      car.position.x + cameraOffset.x,
      car.position.y + cameraOffset.y,
      car.position.z + cameraOffset.z
    );

    camera.position.lerp(targetCameraPosition.current, 0.1);
    camera.rotation.copy(fixedCameraRotation);
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
    }
  }, [scene]);

  return <group ref={carRef} />;
};

export default Car;