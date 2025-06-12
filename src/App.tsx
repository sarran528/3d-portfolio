import React, { Suspense, useState, useEffect, useRef } from 'react';
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

// Your base track coordinates (11 points)
const baseAutonomousPath: THREE.Vector3[] = [
  new THREE.Vector3(0.00, 0.1, 0.00),    // Point 1 (Y updated to 0.1)
  new THREE.Vector3(1.76, 0.1, 14.91),   // Point 2 (Y updated to 0.1)
  new THREE.Vector3(20.58, 0.1, 14.78),  // Point 3 (Y updated to 0.1)
  new THREE.Vector3(38.43, 0.1, 14.07),  // Point 4 (Y updated to 0.1, was 114.07, assuming typo)
  new THREE.Vector3(43.74, 0.1, 23.56),  // Point 5 (Y updated to 0.1)
  new THREE.Vector3(35.38, 0.1, 35.70),  // Point 6 (Y updated to 0.1)
  new THREE.Vector3(22.83, 0.1, 34.45),  // Point 7 (Y updated to 0.1)
  new THREE.Vector3(18.50, 0.1, 27.12),  // Point 8 (Y updated to 0.1)
  new THREE.Vector3(20.33, 0.1, -24.77), // Point 9 (Y updated to 0.1)
  new THREE.Vector3(10.50, 0.1, -30.12), // Point 10 (Y updated to 0.1)
  new THREE.Vector3(-1.46, 0.1, -18.65),  // Point 11 (Y updated to 0.1)
];

// Function to interpolate points for a smoother path
const interpolatePath = (path: THREE.Vector3[], pointsPerSegment: number): THREE.Vector3[] => {
  if (path.length < 1) return path;

  const newPath: THREE.Vector3[] = [];
  for (let i = 0; i < path.length; i++) { // Iterate through all points, including the last one for the loop
    const p1 = path[i];
    // For the last point, loop back to the first point
    const p2 = path[(i + 1) % path.length]; // This handles looping back to the first point

    newPath.push(p1); // Add the original point

    // Only add interpolated points if it's not the last segment (looping back)
    // This is generally for creating a smooth loop.
    if (i < path.length) { // Ensure interpolation happens before the last segment if you want a perfect loop.
                            // If it's a closed loop, the last segment connects to the first.
      for (let j = 1; j <= pointsPerSegment; j++) {
        const t = j / (pointsPerSegment + 1);
        const interpolatedPoint = new THREE.Vector3(
          p1.x + (p2.x - p1.x) * t,
          p1.y + (p2.y - p1.y) * t,
          p1.z + (p2.z - p1.z) * t
        );
        newPath.push(interpolatedPoint);
      }
    }
  }
  return newPath;
};


// Generate the initial waypoints by interpolating.
// Adding 1 point between each original segment will result in 11 (original) + 11 (interpolated) = 22 points.
// Note: If you want exactly 22 points including the start/end, adjust `pointsPerSegment` accordingly.
// For 11 original points, there are 11 segments (if it's a loop). To get 22 points, you need 1 interpolated point per segment.
const initialAutonomousPathInterpolated = interpolatePath(baseAutonomousPath, 1);

// Threshold for waypoints (constant)
// Keeping it at 5 as it was the last used value, you can adjust this if the car
// skips too many points or gets stuck.
const WAYPOINT_THRESHOLD = 5;

function App() {
  const [drivingMode, setDrivingMode] = useState<'manual' | 'drive'>('manual');
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  // Use the interpolated path for the waypoints state
  const [waypoints, setWaypoints] = useState<THREE.Vector3[]>(initialAutonomousPathInterpolated);
  const [currentCameraOffset, setCurrentCameraOffset] = useState(
    new THREE.Vector3(2, 10, 11)
  );
  // State to display waypoint coordinates (will be updated on drag end)
  const [displayedWaypointCoords, setDisplayedWaypointCoords] = useState<string | null>(null);

  // Create refs for each waypoint mesh, stored in an array
  const waypointMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
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
    // When switching to 'drive' mode, reset to the first waypoint
    if (drivingMode === 'drive') {
      setCurrentWaypointIndex(0);
    }
    // Set initial displayed coordinates when component mounts or waypoints change
    if (waypoints.length > 0 && coordsDisplayRef.current) {
        const initialCoords = waypoints[0];
        const coordsString = `X: ${initialCoords.x.toFixed(2)}, Y: ${initialCoords.y.toFixed(2)}, Z: ${initialCoords.z.toFixed(2)}`;
        setDisplayedWaypointCoords(coordsString);
        coordsDisplayRef.current.innerText = `Waypoint Coords: ${coordsString}`;
    }
  }, [drivingMode, waypoints]); // Depend on drivingMode and waypoints for reset/initial display

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
  const handleWaypointTransformChange = (index: number) => {
    // Use the ref for the specific waypoint being dragged
    const currentMesh = waypointMeshRefs.current[index];
    if (currentMesh && coordsDisplayRef.current) {
      const currentPosition = currentMesh.position;
      const coordsString = `X: ${currentPosition.x.toFixed(2)}, Y: ${currentPosition.y.toFixed(2)}, Z: ${currentPosition.z.toFixed(2)}`;
      coordsDisplayRef.current.innerText = `Waypoint Coords: ${coordsString}`;
    }
  };

  // This function updates the actual waypoint state ONLY when the drag ends
  const handleWaypointDragEnd = (index: number) => {
    // Use the ref for the specific waypoint that was dragged
    const finalMesh = waypointMeshRefs.current[index];
    if (finalMesh) {
      const finalPosition = finalMesh.position;
      setWaypoints((prevWaypoints) => {
        const updatedWaypoints = [...prevWaypoints];
        // Waypoints should stay at the track's Y-level
        updatedWaypoints[index] = new THREE.Vector3(finalPosition.x, 0.1, finalPosition.z);
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

          {/* Visual debug spheres for waypoints with TransformControls */}
          {waypoints.map((wp, index) => (
            <TransformControls
              key={index}
              mode="translate"
              axis="xz"
              object={waypointMeshRefs.current[index]}
              onObjectChange={() => handleWaypointTransformChange(index)} // Pass index to handler
              onDragEnd={() => handleWaypointDragEnd(index)} // Pass index to handler
            >
              <mesh ref={(el) => (waypointMeshRefs.current[index] = el)} position={wp}>
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
      <div ref={coordsDisplayRef} style={{
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
        {displayedWaypointCoords ? `Waypoint Coords: ${displayedWaypointCoords}` : 'Drag waypoint to see coords'}
      </div>
    </div>
  );
}

export default App;
