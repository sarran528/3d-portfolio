import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Environment, TransformControls } from '@react-three/drei'; // Import TransformControls
import Track from './components/Track';
import Floor from './components/Floor';
import Car from './components/Car';
import RainbowButton from './components/RainbowButton';
import * as THREE from 'three';

export interface PortfolioSection {
  id: string;
  title: string;
  position: [number, number, number];
}

// Initial definition of waypoints. This will now be a state variable.
// These points are scaled up to roughly match a track scaled by 35.
// FINE-TUNE these values based on your specific track.glb's layout.
const initialAutonomousPath: THREE.Vector3[] = [
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

// Threshold for waypoints (constant)
const WAYPOINT_THRESHOLD = 15;

function App() {
  const [drivingMode, setDrivingMode] = useState<'manual' | 'drive'>('manual');
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [waypoints, setWaypoints] = useState<THREE.Vector3[]>(initialAutonomousPath); // Waypoints as state
  const [currentCameraOffset, setCurrentCameraOffset] = useState(
    new THREE.Vector3(2, 10, 11)
  );

  const fixedCameraRotation = new THREE.Euler(
    -Math.PI * 8 / 33,
    Math.PI * 2 / 4349,
    0
  );

  const buttonPosition1: [number, number, number] = [30, 2.5, -10];
  const buttonPosition2: [number, number, number] = [30, 0.5, -10];

  useEffect(() => {
    if (drivingMode === 'drive' && currentWaypointIndex !== 0) {
      setCurrentWaypointIndex(0);
    }
  }, [drivingMode, currentWaypointIndex]); // Add currentWaypointIndex to dependencies for correct reset check

  // Effect for keyboard zoom functionality (K for zoom in, J for zoom out)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const zoomDistanceFactor = 0.5;

      setCurrentCameraOffset((prevOffset) => {
        const newOffset = prevOffset.clone();
        if (event.key === 'k' || event.key === 'K') {
          newOffset.z = Math.max(5, newOffset.z - zoomDistanceFactor * 2);
          newOffset.y = Math.max(5, newOffset.y - zoomDistanceFactor);
        } else if (event.key === 'j' || event.key === 'J') {
          newOffset.z = Math.min(30, newOffset.z + zoomDistanceFactor * 2);
          newOffset.y = Math.min(20, newOffset.y + zoomDistanceFactor);
        }
        return newOffset;
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handler for when a waypoint is dragged and released
  const handleWaypointDragEnd = (event: any, index: number) => {
    // event.object is the mesh being dragged by TransformControls
    const newPosition = event.object.position;
    setWaypoints((prevWaypoints) => {
      const updatedWaypoints = [...prevWaypoints];
      updatedWaypoints[index] = new THREE.Vector3(newPosition.x, newPosition.y, newPosition.z);
      return updatedWaypoints;
    });
  };

  return (
    <div
      className="w-full h-screen"
      style={{
        background: 'linear-gradient(135deg,rgb(20, 135, 184) 0%,rgb(48, 154, 224) 20%, #74c0fc 40%,rgb(228, 197, 151) 60%, #ff5e3a 100%)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      }}
    >
      <Canvas
        shadows
        camera={{
          position: [currentCameraOffset.x, currentCameraOffset.y, currentCameraOffset.z],
          rotation: [fixedCameraRotation.x, fixedCameraRotation.y, fixedCameraRotation.z],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Environment preset="sunset" />
        <Physics gravity={[0, -9.82, 0]}>
          <Floor />
          <Track />
          <Car
            fixedCameraRotation={fixedCameraRotation}
            cameraOffset={currentCameraOffset}
            isManualModeEnabled={drivingMode === 'manual'}
            autonomousPath={waypoints} // Pass the state variable 'waypoints'
            currentWaypointIndex={currentWaypointIndex}
            setCurrentWaypointIndex={setCurrentWaypointIndex}
            WAYPOINT_THRESHOLD={WAYPOINT_THRESHOLD}
          />

          {/* Manual Button */}
          <RainbowButton
            position={buttonPosition1}
            text="Manual"
            onClick={() => {
              setDrivingMode('manual');
              console.log('Switched to Manual Driving Mode');
            }}
          />

          {/* Drive Button */}
          <RainbowButton
            position={buttonPosition2}
            text="Drive"
            onClick={() => {
              setDrivingMode('drive');
              console.log('Switched to Drive Mode');
            }}
          />

          {/* Visual debug spheres for waypoints with TransformControls */}
          {waypoints.map((wp, index) => (
            <TransformControls
              key={index}
              mode="translate" // Allows translation (dragging)
              onMouseUp={(e) => handleWaypointDragEnd(e, index)} // Update waypoint position on drag end
            >
              <mesh position={wp}>
                <sphereGeometry args={[WAYPOINT_THRESHOLD / 2, 16, 16]} />
                <meshBasicMaterial
                  color={index === currentWaypointIndex ? 'red' : 'blue'}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            </TransformControls>
          ))}
        </Physics>

        <ambientLight intensity={0.6} color="#ff9d4d" />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1.2}
          color="#ff9d4d"
          castShadow
        />
        <pointLight
          position={[-10, 10, -10]}
          intensity={0.8}
          color="#ff6b35"
        />
        <pointLight
          position={[0, 15, 0]}
          intensity={0.5}
          color="#ff9d4d"
        />
      </Canvas>
    </div>
  );
}

export default App;
