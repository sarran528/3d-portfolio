import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAppContext } from '../context/AppContext';
import * as THREE from 'three';

const SPEED = 0.15;
const TURN_SPEED = 0.015;
const AUTONOMOUS_SPEED = 0.15; // Slightly reduced for better control
const AUTONOMOUS_TURN_SPEED = 0.015; // Increased for better turning
const WAYPOINT_THRESHOLD = 5; // Assuming this is needed within the hook


const useVehicleControls = (carRef: React.RefObject<THREE.Group>) => {
  const { drivingMode, waypoints, currentWaypointIndex, setCurrentWaypointIndex } = useAppContext();

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

  // Use a ref to track the previous state of drivingMode
  const prevDrivingModeRef = useRef(drivingMode);

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
    if (prevDrivingModeRef.current === 'manual' && drivingMode === 'drive' && waypoints.length > 0) {
      setCurrentWaypointIndex(0);
      if (carRef.current) {
        // Position the car at the first waypoint
        carRef.current.position.copy(waypoints[0]);
        // Make car face the second waypoint if available
        if (waypoints.length > 1) {
          const direction = new THREE.Vector3()
            .subVectors(waypoints[1], waypoints[0])
            .normalize();
          const angle = Math.atan2(direction.x, direction.z);
          carRef.current.rotation.y = angle;
        }
      }
    }
    prevDrivingModeRef.current = drivingMode;
  }, [drivingMode, waypoints, setCurrentWaypointIndex, carRef]);


  useFrame(() => {
    if (!carRef.current) return;

    const car = carRef.current;

    if (drivingMode === 'manual') {
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
      if (waypoints.length > 0) {
        const targetWaypoint = waypoints[currentWaypointIndex];
        const carPosition = car.position;

        // Calculate distance to the target waypoint
        const distance = carPosition.distanceTo(targetWaypoint);

        // If the car is close enough to the current waypoint, move to the next
        if (distance < WAYPOINT_THRESHOLD) {
          const nextIndex = (currentWaypointIndex + 1) % waypoints.length;
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

    // Wall collision detection and response
    const carHalfWidth = 2.5; // Adjust based on your car model\'s scale
    const carHalfLength = 5; // Adjust based on your car model\'s scale

    const WALL_MIN_X = -75;
    const WALL_MAX_X = 75;
    const WALL_MIN_Z = -40;
    const WALL_MAX_Z = 40;

    car.position.x = Math.max(WALL_MIN_X + carHalfWidth, Math.min(WALL_MAX_X - carHalfWidth, car.position.x));
    car.position.z = Math.max(WALL_MIN_Z + carHalfLength, Math.min(WALL_MAX_Z - carHalfLength, car.position.z));
  });
};

export default useVehicleControls;