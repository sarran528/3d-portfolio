import React, { Suspense, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Environment, OrbitControls } from '@react-three/drei'; // Added OrbitControls
<<<<<<< HEAD
import Track from './components/3d/Track';
import Floor from './components/3d/Floor';
import Car from './components/3d/Car';
import RainbowButton from './components/ui/RainbowButton';
import Walls from './components/3d/Walls'; // Import Walls component
import CityArch from './components/3d/CityArch';
import CityNameBoard from './components/3d/CityNameBoard';
import * as THREE from 'three';
=======
import * as THREE from 'three'; // Make sure THREE is imported
import { AppContextProvider, useAppContext } from './context/AppContext'; // Import context provider and hook

// Lazy load components that load heavy assets
const LazyCar = React.lazy(() => import('./components/vehicles/Car'));
const LazyTrack = React.lazy(() => import('./components/scene/Track'));
const LazyCityArch = React.lazy(() => import('./components/environment/CityArch'));

import Floor from './components/scene/Floor';
import Walls from './components/scene/Walls';
import RainbowButton from './components/ui/RainbowButton';
import CityNameBoard from './components/ui/CityNameBoard';
import LoadingScreen from './components/ui/LoadingScreen'; // Assuming you want to use the loading screen as fallback
>>>>>>> 6772a69 (structured and optimized)


// Your base track coordinates (11 points)
const baseAutonomousPath: THREE.Vector3[] = [
  new THREE.Vector3(0.00, 0.1, 0.00),    // Point 1 (Y updated to 0.1)
  new THREE.Vector3(3, 0.1, 12),   // Point 2 (Y updated to 0.1)
  new THREE.Vector3(20.58, 0.1, 14.78),  // Point 3 (Y updated to 0.1)
  new THREE.Vector3(37.43, 0.1, 14.07),  // Point 4 (Y updated to 0.1, was 114.07, assuming typo)
  new THREE.Vector3(43.74, 0.1, 23.56),  // Point 5 (Y updated to 0.1)
  new THREE.Vector3(35.38, 0.1, 34.9),  // Point 6 (Y updated to 0.1)
  new THREE.Vector3(23.2, 0.1, 31.9),  // Point 7 (Y updated to 0.1)
  new THREE.Vector3(21.9, 0.1, 25),  // Point 8 (Y updated to 0.1)
  new THREE.Vector3(20.33, 0.1, -20), // Point 9 (Y updated to 0.1)
  new THREE.Vector3(10.50, 0.1, -27), // Point 10 (Y updated to 0.1)
  new THREE.Vector3(-1.46, 0.1, -18.65),   // Point 11 (Y updated to 0.1)
];

// Function to interpolate points for a smoother path
const interpolatePath = (path: THREE.Vector3[], pointsPerSegment: number): THREE.Vector3[] => {
  if (path.length < 1) return path;

  const newPath: THREE.Vector3[] = [];
  for (let i = 0; i < path.length; i++) {
    const p1 = path[i];
    const p2 = path[(i + 1) % path.length]; // This handles looping back to the first point

    newPath.push(p1); // Add the original point

    // Add interpolated points for smooth transitions
    if (i < path.length) {
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


// Generate the initial waypoints by interpolating (1 point in between each base segment).
const initialAutonomousPathInterpolated = interpolatePath(baseAutonomousPath, 1);

// Threshold for waypoints (constant) - this controls how close the car needs to be
// to a waypoint before moving to the next one.
const WAYPOINT_THRESHOLD = 5;

// Extract the ManualButton component
const ManualButton = React.memo(({ onClick }: { onClick: () => void }) => (
  <button
    style={{
      position: 'absolute',
      top: 32,
      left: 32,
      zIndex: 100,
      padding: '16px 32px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(90deg, #ff5e3a, #ff9d4d, #74c0fc)',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}
    onClick={onClick}
  >
    Manual
  </button>
));

// Extract the WaypointMarker component
const WaypointMarker = React.memo(({ position, isCurrent }: { position: THREE.Vector3, isCurrent: boolean }) => (
  <mesh position={position}>
    <sphereGeometry args={[WAYPOINT_THRESHOLD / 2, 16, 16]} />
    <meshBasicMaterial
      color={isCurrent ? 'red' : 'blue'}
      transparent
      opacity={0}
    />
  </mesh>
));

function App() {
<<<<<<< HEAD
  const [drivingMode, setDrivingMode] = useState<'manual' | 'drive'>('manual');
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [waypoints] = useState<THREE.Vector3[]>(initialAutonomousPathInterpolated);
  const [currentCameraOffset, setCurrentCameraOffset] = useState(
    new THREE.Vector3(2, 10, 11)
=======
  const { drivingMode, setDrivingMode, currentWaypointIndex, setCurrentWaypointIndex, waypoints, currentCameraOffset, setCurrentCameraOffset } = useAppContext(
>>>>>>> 6772a69 (structured and optimized)
  );

  const waypointMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const coordsDisplayRef = useRef<HTMLDivElement>(null);

  // Memoize fixed values
  const fixedCameraRotation = useMemo(() => new THREE.Euler(
    -Math.PI * 8 / 33,
    Math.PI * 2 / 4349,
    0
  ), []);

  const buttonPosition1 = useMemo(() => [30, 2.5, -10] as [number, number, number], []);
  const buttonPosition2 = useMemo(() => [30, 0.5, -10] as [number, number, number], []);

  // Memoize handlers
  const handleManualMode = useCallback(() => {
    setDrivingMode('manual');
    console.log('Switched to Manual Driving Mode');
  }, []);

  const handleDriveMode = useCallback(() => {
    setDrivingMode('drive');
    console.log('Switched to Drive Mode');
  }, []);

  // Memoize camera offset update
  const updateCameraOffset = useCallback((zoomDistanceFactor: number, isZoomIn: boolean) => {
    setCurrentCameraOffset((prevOffset) => {
      const newOffset = prevOffset.clone();
      if (isZoomIn) {
        newOffset.z = Math.max(5, newOffset.z - zoomDistanceFactor * 2);
        newOffset.y = Math.max(5, newOffset.y - zoomDistanceFactor);
      } else {
        newOffset.z = Math.min(30, newOffset.z + zoomDistanceFactor * 2);
        newOffset.y = Math.min(20, newOffset.y + zoomDistanceFactor);
      }
      return newOffset;
    });
  }, []);

  useEffect(() => {
    if (drivingMode === 'drive') {
      setCurrentWaypointIndex(0);
    }
  }, [drivingMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const zoomDistanceFactor = 0.5;
      if (event.key === 'k' || event.key === 'K') {
        updateCameraOffset(zoomDistanceFactor, true);
      } else if (event.key === 'j' || event.key === 'J') {
        updateCameraOffset(zoomDistanceFactor, false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [updateCameraOffset]);

  // Memoize the background style
  const backgroundStyle = useMemo(() => ({
    background: 'linear-gradient(135deg,rgb(20, 135, 184) 0%,rgb(48, 154, 224) 20%, #74c0fc 40%,rgb(228, 197, 151) 60%, #ff5e3a 100%)',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  }), []);

  return (
<<<<<<< HEAD
    <div className="w-full h-screen" style={backgroundStyle}>
      <ManualButton onClick={handleManualMode} />
=======
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
    <Suspense fallback={<LoadingScreen />}>
      {/* OUTSIDE CANVAS: HTML Manual Button */}
      <button
        style={{
          position: 'absolute',
          top: 32,
          left: 32,
          zIndex: 100,
          padding: '16px 32px',
          borderRadius: '8px',
          border: 'none',
          background: 'linear-gradient(90deg, #ff5e3a, #ff9d4d, #74c0fc)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
        onClick={() => {
          setDrivingMode('manual');
          console.log('Switched to Manual Driving Mode');
        }}
      >
        Manual
      </button>
>>>>>>> 6772a69 (structured and optimized)

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
<<<<<<< HEAD
          <Floor />
          <Track />
          <Car
            fixedCameraRotation={fixedCameraRotation}
            cameraOffset={currentCameraOffset}
            isManualModeEnabled={drivingMode === 'manual'}
            autonomousPath={waypoints}
            currentWaypointIndex={currentWaypointIndex}
            setCurrentWaypointIndex={setCurrentWaypointIndex}
            WAYPOINT_THRESHOLD={WAYPOINT_THRESHOLD}
          />
=======
          {/* Static components */}
          <Floor /> {/* Assuming Floor is not heavy */}
          <Walls /> {/* Assuming Walls is not heavy */}
          <CityNameBoard name="CANNES" position={[0, 0, 20]} /> {/* Assuming CityNameBoard is not heavy */}

          {/* Lazy loaded components wrapped in Suspense */}
          <Suspense fallback={null}> {/* Add a fallback component */}
            <Track /> {/* Assuming Track is heavy due to GLB */}
          </Suspense>

          <Suspense fallback={null}> {/* Add a fallback component */}
            <LazyCar
              fixedCameraRotation={fixedCameraRotation}
              cameraOffset={currentCameraOffset}
              isManualModeEnabled={drivingMode === 'manual'}
              autonomousPath={waypoints} // Pass the state variable 'waypoints'
              currentWaypointIndex={currentWaypointIndex}
              setCurrentWaypointIndex={setCurrentWaypointIndex}
              WAYPOINT_THRESHOLD={WAYPOINT_THRESHOLD}
            />
          </Suspense>
>>>>>>> 6772a69 (structured and optimized)

          <RainbowButton
            position={buttonPosition2}
            text="Drive"
            onClick={handleDriveMode}
          />

<<<<<<< HEAD
          <Walls />
          <CityArch />
          <CityNameBoard name="SARRAN" position={[-8, 0, 13]} />
=======
          <Suspense fallback={null}> {/* Add a fallback component */}
             <CityArch name="Welcome to 3D City" position={[0, 0, 0]} /> {/* Add CityArch component */}
          </Suspense>
>>>>>>> 6772a69 (structured and optimized)

          {waypoints.map((wp, index) => (
            <WaypointMarker
              key={index}
              position={wp}
              isCurrent={index === currentWaypointIndex}
            />
          ))}
        </Physics>

        <ambientLight intensity={0.6} color="#ff9d4d" />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1.2}
          color="#ff9d4d"
          castShadow
        />
         {/* Assuming Lighting is not heavy and can be directly included */}
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
        <OrbitControls /> {/* Added OrbitControls for camera control */}
      </Canvas>
    </div>
  );
}

export default React.memo(App);
