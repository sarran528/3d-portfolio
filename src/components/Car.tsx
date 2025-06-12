import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const SPEED = 0.15;
const TURN_SPEED = 0.015;
const AUTONOMOUS_SPEED = 0.3; // Adjusted for autonomous driving
const AUTONOMOUS_TURN_SPEED = 0.03; // Adjusted turning speed for autonomous mode
const WAYPOINT_THRESHOLD = 15; // Increased threshold for larger waypoints

interface CarProps {
  fixedCameraRotation: THREE.Euler;
  cameraOffset: THREE.Vector3;
  isManualModeEnabled: boolean;
  autonomousPath: THREE.Vector3[];
  currentWaypointIndex: number;
  setCurrentWaypointIndex: React.Dispatch<React.SetStateAction<number>>;
  WAYPOINT_THRESHOLD: number;
}

// Define a simple path of waypoints for autonomous driving
// These points are now scaled up to roughly match a track scaled by 35.
// You will likely need to FINE-TUNE these values based on your specific track.glb's layout.
const autonomousPath: THREE.Vector3[] = [
  new THREE.Vector3(0, 0, 0), // Start
  new THREE.Vector3(150, 0, 0), // Go straight
  new THREE.Vector3(300, 0, 50), // Gentle curve right
  new THREE.Vector3(350, 0, 200), // Continue curve right
  new THREE.Vector3(300, 0, 350), // Curve more right
  new THREE.Vector3(100, 0, 400), // Curve left
  new THREE.Vector3(-100, 0, 350), // Continue curve left
  new THREE.Vector3(-200, 0, 200), // Curve right back towards center
  new THREE.Vector3(-150, 0, 50), // Approach start area
  new THREE.Vector3(-50, 0, 0), // Closer to start
  new THREE.Vector3(0, 0, 0), // Loop back to start
];

const Car: React.FC<CarProps> = ({ fixedCameraRotation, cameraOffset, isManualModeEnabled }) => {
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

  // State to track the current waypoint for autonomous mode
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);

  // Use a ref to track the previous state of isManualModeEnabled
  const prevIsManualModeEnabledRef = useRef(isManualModeEnabled);

  useEffect(() => {
    // Event listener for keydown events
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the pressed key is one of the arrow keys and update its state
      if (e.key in keysRef.current) {
        keysRef.current[e.key as keyof typeof keysRef.current] = true;
      }
    };

    // Event listener for keyup events
    const handleKeyUp = (e: KeyboardEvent) => {
      // Check if the released key is one of the arrow keys and update its state
      if (e.key in keysRef.current) {
        keysRef.current[e.key as keyof typeof keysRef.current] = false;
      }
    };

    // Add event listeners when the component mounts
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount/unmount

  // Effect to reset waypoint index when switching from manual to autonomous mode
  useEffect(() => {
    // If we were in manual mode and now we are NOT (i.e., switched to autonomous/drive mode)
    if (prevIsManualModeEnabledRef.current && !isManualModeEnabled) {
      setCurrentWaypointIndex(0); // Reset to the first waypoint
      // Optionally, reset car position to the start of the path for a clean start
      if (carRef.current && autonomousPath.length > 0) {
        carRef.current.position.copy(autonomousPath[0]);
        carRef.current.lookAt(autonomousPath[1] || autonomousPath[0]); // Make car face next waypoint
      }
    }
    // Update the ref to the current value for the next render cycle
    prevIsManualModeEnabledRef.current = isManualModeEnabled;
  }, [isManualModeEnabled, scene]); // Depend on isManualModeEnabled to detect changes

  // useFrame hook runs on every frame render, used for continuous updates like movement
  useFrame(() => {
    // Ensure carRef.current is available before proceeding
    if (!carRef.current) return;

    const car = carRef.current;

    // Car movement logic is only active if 'isManualModeEnabled' is true
    if (isManualModeEnabled) {
      // Manual driving controls
      if (keysRef.current.ArrowUp) {
        const direction = new THREE.Vector3();
        car.getWorldDirection(direction); // Get the car's forward direction
        car.position.addScaledVector(direction, SPEED); // Move car in its forward direction
      }

      if (keysRef.current.ArrowDown) {
        const direction = new THREE.Vector3();
        car.getWorldDirection(direction); // Get the car's forward direction
        car.position.addScaledVector(direction, -SPEED); // Move car in its backward direction
      }

      if (keysRef.current.ArrowLeft) {
        car.rotation.y += TURN_SPEED; // Rotate car around its Y-axis
      }

      if (keysRef.current.ArrowRight) {
        car.rotation.y -= TURN_SPEED; // Rotate car around its Y-axis
      }
    } else {
      // Autonomous driving logic when manual mode is not enabled (i.e., 'Drive' is clicked)
      if (autonomousPath.length > 0) {
        const targetWaypoint = autonomousPath[currentWaypointIndex];
        const carPosition = car.position;

        // Calculate distance to the target waypoint
        const distance = carPosition.distanceTo(targetWaypoint);

        // If the car is close enough to the current waypoint, move to the next
        if (distance < WAYPOINT_THRESHOLD) {
          setCurrentWaypointIndex((prevIndex) => (prevIndex + 1) % autonomousPath.length);
        }

        // Calculate direction to the current target waypoint
        const directionToWaypoint = new THREE.Vector3();
        directionToWaypoint.subVectors(targetWaypoint, carPosition).normalize();

        // Calculate the car's current forward direction
        const carForward = new THREE.Vector3();
        car.getWorldDirection(carForward);

        // Calculate the angle between the car's forward direction and the direction to the waypoint
        // This effectively calculates the shortest angle to turn to face the waypoint
        const angle = Math.atan2(
          directionToWaypoint.x * carForward.z - directionToWaypoint.z * carForward.x,
          directionToWaypoint.x * carForward.x + directionToWaypoint.z * carForward.z
        );

        // Turn the car towards the waypoint
        // Apply a fraction of the turning speed based on the angle to smooth turns
        if (angle > 0.05) { // Turn left if angle is positive and significant
          car.rotation.y += Math.min(AUTONOMOUS_TURN_SPEED, angle);
        } else if (angle < -0.05) { // Turn right if angle is negative and significant
          car.rotation.y += Math.max(-AUTONOMOUS_TURN_SPEED, angle);
        }

        // Move the car forward
        car.position.addScaledVector(carForward, AUTONOMOUS_SPEED);
      }
    }

    // Camera follow logic for fixed-angle view:
    // This part always runs, regardless of driving mode, to keep the camera with the car.
    targetCameraPosition.current.set(
      car.position.x + cameraOffset.x, // Calculate target X position based on car and offset
      car.position.y + cameraOffset.y, // Calculate target Y position
      car.position.z + cameraOffset.z  // Calculate target Z position
    );

    // Smoothly interpolate the camera's position towards the target position
    camera.position.lerp(targetCameraPosition.current, 0.1);
    // Maintain the fixed camera rotation defined in the App component
    camera.rotation.copy(fixedCameraRotation);
  });

  // useEffect hook to handle GLB model loading and initial setup
  useEffect(() => {
    // Ensure both the loaded scene and the car's ref are available
    if (scene && carRef.current) {
      // Set the initial scale of the car model
      scene.scale.set(150, 150, 150);
      // Set the initial position of the car model relative to its group
      scene.position.set(0, 0, 0);

      // Traverse through all children of the loaded scene
      scene.traverse((child) => {
        // If the child is a Mesh (a renderable 3D object)
        if (child instanceof THREE.Mesh) {
          // Enable casting and receiving shadows for visual realism
          child.castShadow = true;
          child.receiveShadow = true;

          // If the mesh has material(s)
          if (child.material) {
            // Ensure material is an array for consistent iteration
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach(material => {
              // If the material is a MeshStandardMaterial (for physically based rendering)
              if (material instanceof THREE.MeshStandardMaterial) {
                // Adjust metalness and roughness for desired metallic appearance
                material.metalness = 0.5;
                material.roughness = 0.3;
                // Important: signal Three.js that material properties have changed
                material.needsUpdate = true;
              }
            });
          }
        }
      });

      // Add a clone of the loaded scene to the car's group (carRef)
      // Cloning is important to avoid modifying the original scene if multiple cars were needed
      carRef.current.add(scene.clone());
    }
  }, [scene]); // Re-run this effect if the 'scene' object changes

  // The component renders a Three.js Group that will contain the car model
  return (
    <group ref={carRef}>
      {/* Visual debug spheres for waypoints */}
      {autonomousPath.map((wp, index) => (
        <mesh key={index} position={wp}>
          {/* SphereGeometry args: radius, widthSegments, heightSegments */}
          <sphereGeometry args={[WAYPOINT_THRESHOLD / 2, 16, 16]} />
          {/* Change color based on whether it's the current active waypoint */}
          <meshBasicMaterial color={index === currentWaypointIndex ? 'red' : 'blue'} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

export default Car;
