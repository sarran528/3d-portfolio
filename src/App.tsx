import React, { Suspense, useState, useEffect, useRef } from 'react'; // Import useRef
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Environment, TransformControls } from '@react-three/drei';
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

// Initial definition of waypoints. Now reduced to 1 point.
const initialAutonomousPath: THREE.Vector3[] = [
  new THREE.Vector3(0, 0, 0),    // Single start point
];

// Threshold for waypoints (constant)
const WAYPOINT_THRESHOLD = 15;

function App() {
  const [drivingMode, setDrivingMode] = useState<'manual' | 'drive'>('manual');
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [waypoints, setWaypoints] = useState<THREE.Vector3[]>(initialAutonomousPath);
  const [currentCameraOffset, setCurrentCameraOffset] = useState(
    new THREE.Vector3(2, 10, 11)
  );
  // State to display waypoint coordinates (will be updated on drag end)
  const [displayedWaypointCoords, setDisplayedWaypointCoords] = useState<string | null>(null);

  // Ref for the single waypoint mesh (needed by TransformControls)
  const waypointMeshRef = useRef<THREE.Mesh>(null);
  // Ref for the coordinate display div (for direct DOM manipulation during drag)
  const coordsDisplayRef = useRef<HTMLDivElement>(null);


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
  }, [drivingMode, currentWaypointIndex]);

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

  // This function updates the displayed coordinates continuously during drag
  // It directly updates the DOM element to avoid React state re-renders during dragging.
  const handleWaypointTransformChange = () => {
    if (waypointMeshRef.current && coordsDisplayRef.current) {
      const currentPosition = waypointMeshRef.current.position;
      const coordsString = `X: ${currentPosition.x.toFixed(2)}, Y: ${currentPosition.y.toFixed(2)}, Z: ${currentPosition.z.toFixed(2)}`;
      coordsDisplayRef.current.innerText = `Waypoint Coords: ${coordsString}`;
    }
  };

  // This function updates the actual waypoint state ONLY when the drag ends
  const handleWaypointDragEnd = () => {
    if (waypointMeshRef.current) {
      const finalPosition = waypointMeshRef.current.position;
      setWaypoints((prevWaypoints) => {
        const updatedWaypoints = [...prevWaypoints];
        updatedWaypoints[0] = new THREE.Vector3(finalPosition.x, 0, finalPosition.z); // Explicitly set Y to 0
        return updatedWaypoints;
      });
      // Also update the React state for displayed coords, in case it's used elsewhere
      const coordsString = `X: ${finalPosition.x.toFixed(2)}, Y: ${finalPosition.y.toFixed(2)}, Z: ${finalPosition.z.toFixed(2)}`;
      setDisplayedWaypointCoords(coordsString);
    }
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

          {/* Visual debug sphere for the single waypoint with TransformControls */}
          {waypoints.map((wp, index) => (
            <TransformControls
              key={index}
              mode="translate"
              axis="xz"
              object={waypointMeshRef} // Controls this specific mesh
              onObjectChange={handleWaypointTransformChange} // Update display continuously
              onDragEnd={handleWaypointDragEnd} // Update state only on drag end
            >
              <mesh ref={waypointMeshRef} position={wp}>
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

      {/* Coordinate Displayer UI */}
      <div ref={coordsDisplayRef} style={{ // Assign the ref here
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 100,
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        Drag waypoint to see coords
      </div>
    </div>
  );
}

export default App;
