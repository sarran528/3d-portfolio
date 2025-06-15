import React, { Suspense, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Environment, OrbitControls } from '@react-three/drei'; // Added OrbitControls
import Track from './components/3d/Track';
import Floor from './components/3d/Floor';
import Car from './components/3d/Car';
import RainbowButton from './components/ui/RainbowButton';
import Walls from './components/3d/Walls'; // Import Walls component
import CityArch from './components/3d/CityArch';
import CityNameBoard from './components/3d/CityNameBoard';
import * as THREE from 'three';
import { interpolatePath } from './components/helpers/interpolatePath';

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
 

  const waypointMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const coordsDisplayRef = useRef<HTMLDivElement>(null);

  // Memoize fixed values
  const fixedCameraRotation = useMemo(() => new THREE.Euler(
    -Math.PI * 8 / 33,
    Math.PI * 2 / 4349,import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Import Context Provider and Hook
import { AppContextProvider, useAppContext } from './context/AppContext';

// Import Lazy Loaded Components
const LazyCar = React.lazy(() => import('./components/vehicles/Car'));
const LazyTrack = React.lazy(() => import('./components/scene/Track'));
const LazyCityArch = React.lazy(() => import('./components/environment/CityArch'));

// Import other components
import Floor from './components/scene/Floor';
import Walls from './components/scene/Walls';
import RainbowButton from './components/ui/RainbowButton';
import CityNameBoard from './components/ui/CityNameBoard';
import ManualButton from './components/ui/ManualButton';
import WaypointMarker from './components/ui/WaypointMarker'; // Assuming you want to keep waypoint markers visible
import LoadingScreen from './components/ui/LoadingScreen'; // For Suspense fallback

// Import Hooks
import { useCameraOffset } from './hooks/useCameraOffset';
import { useWaypoints } from './hooks/useWaypoints'; // Although waypoints are in context, you might need the hook if it has additional logic

// Import types if needed directly in App.tsx
// import { Waypoint } from './types';

// Define the main App component
function AppContent() {
  // Consume state and functions from context
  const { drivingMode, setDrivingMode, currentWaypointIndex, setCurrentWaypointIndex, waypoints } = useAppContext();

  // Use custom hooks
  const { currentCameraOffset } = useCameraOffset(); // Assuming useCameraOffset updates the context

  // Memoize fixed values if they are truly fixed and not dependent on props/state
  const fixedCameraRotation = React.useMemo(() => new THREE.Euler(
    -Math.PI * 8 / 33,
    Math.PI * 2 / 4349,
    0
  ), []);

  const driveButtonPosition: [number, number, number] = [30, 0.5, -10];

  // Handlers that update context
  const handleManualMode = React.useCallback(() => {
    setDrivingMode('manual');
    console.log('Switched to Manual Driving Mode');
  }, [setDrivingMode]);

  const handleDriveMode = React.useCallback(() => {
    setDrivingMode('drive');
    console.log('Switched to Drive Mode');
  }, [setDrivingMode]);

  // Memoize the background style
  const backgroundStyle = React.useMemo(() => ({
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
    <div className="w-full h-screen" style={backgroundStyle}>
      {/* UI elements outside Canvas */}
      <ManualButton onClick={handleManualMode} />

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
          {/* Static components */}
          <Floor />
          <Walls />
          <CityNameBoard name="SARRAN" position={[-8, 0, 13]} /> // Example position

          {/* Lazy loaded components wrapped in Suspense */}
          <Suspense fallback={null}> {/* Consider a better fallback */}
            <LazyTrack />
          </Suspense>

          <Suspense fallback={null}> {/* Consider a better fallback */}
            <LazyCar
              fixedCameraRotation={fixedCameraRotation} // Still needed for the hook within Car
              cameraOffset={currentCameraOffset} // Still needed for camera follow logic in the hook
              isManualModeEnabled={drivingMode === 'manual'} // From context
              autonomousPath={waypoints} // From context
              currentWaypointIndex={currentWaypointIndex} // From context
              setCurrentWaypointIndex={setCurrentWaypointIndex} // From context
              // WAYPOINT_THRESHOLD={WAYPOINT_THRESHOLD} // If used in Car, pass it or get from utils
            />
          </Suspense>

          <RainbowButton
            position={driveButtonPosition}
            text="Drive"
            onClick={handleDriveMode}
          />

          <Suspense fallback={null}> {/* Consider a better fallback */}
             <LazyCityArch />
          </Suspense>

          {/* Waypoint Markers (if you want to keep them visible) */}
          {waypoints.map((wp, index) => (
            <WaypointMarker
              key={index}
              position={wp}
              isCurrent={index === currentWaypointIndex}
              // threshold={WAYPOINT_THRESHOLD} // Pass if needed
            />
          ))}
        </Physics>

        {/* Lighting (assuming not heavy) */}
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

        {/* OrbitControls for debugging/development */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}

function App() {
  return (
    <AppContextProvider>
      <Suspense fallback={<LoadingScreen />}> {/* Outer Suspense for initial loading */}
        <AppContent />
      </Suspense>
    </AppContextProvider>
  );
}


export default React.memo(App); // Keep memoization if desired

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
    <div className="w-full h-screen" style={backgroundStyle}>
      <ManualButton onClick={handleManualMode} />

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
            autonomousPath={waypoints}
            currentWaypointIndex={currentWaypointIndex}
            setCurrentWaypointIndex={setCurrentWaypointIndex}
            WAYPOINT_THRESHOLD={WAYPOINT_THRESHOLD}
          />

          <RainbowButton
            position={buttonPosition2}
            text="Drive"
            onClick={handleDriveMode}
          />

          <Walls />
          <CityArch />
          <CityNameBoard name="SARRAN" position={[-8, 0, 13]} />

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
