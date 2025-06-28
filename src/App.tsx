import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Environment, OrbitControls } from '@react-three/drei';
import Track from './components/3d/environment/Track';
import Floor from './components/3d/environment/Floor';
import Car from './components/3d/vehicles/Car';
import RainbowButton from './components/common/RainbowButton';
import Walls from './components/3d/environment/Walls';
import CityArch from './components/3d/architecture/CityArch';
import CityNameBoard from './components/3d/architecture/CityNameBoard';
import * as THREE from 'three';
import { interpolatePath } from './utils/interpolatePath';
import { baseAutonomousPath, WAYPOINT_THRESHOLD } from './utils/trackData';
import ManualButton from './components/common/ManualButton';
import WaypointMarker from './components/ui/WaypointMarker';
import Statue from './components/3d/props/statue';
import { useAppStore } from './state/appStore';

// Base track coordinates are now imported from utils/trackData
const initialAutonomousPathInterpolated = interpolatePath(baseAutonomousPath, 1);

function App() {
  // Use appStore for state management
  const {
    drivingMode,
    setDrivingMode,
    currentWaypointIndex,
    setCurrentWaypointIndex,
    cameraOffset,
    updateCameraOffset,
    setWaypoints
  } = useAppStore();

  // State for mouse camera control
  const [mouseControlEnabled, setMouseControlEnabled] = useState(false);

  // Initialize waypoints in store
  const [waypoints] = useState<THREE.Vector3[]>(initialAutonomousPathInterpolated);
  
  // Set waypoints in store on mount
  useEffect(() => {
    setWaypoints(waypoints);
  }, [waypoints, setWaypoints]);

  const fixedCameraRotation = useMemo(() => new THREE.Euler(
    -Math.PI * 8 / 33,
    Math.PI * 2 / 4349,
    0
  ), []);

  const buttonPosition2 = useMemo(() => [30, 0.5, -10] as [number, number, number], []);

  const handleManualMode = useCallback(() => {
    setDrivingMode('manual');
    console.log('Switched to Manual Driving Mode');
  }, [setDrivingMode]);

  const handleDriveMode = useCallback(() => {
    setDrivingMode('drive');
    console.log('Switched to Drive Mode');
  }, [setDrivingMode]);

  useEffect(() => {
    if (drivingMode === 'drive') {
      setCurrentWaypointIndex(0);
    }
  }, [drivingMode, setCurrentWaypointIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const zoomDistanceFactor = 0.5;
      if (event.key === 'k' || event.key === 'K') {
        updateCameraOffset(zoomDistanceFactor, true);
      } else if (event.key === 'j' || event.key === 'J') {
        updateCameraOffset(zoomDistanceFactor, false);
      } else if (event.key === 'M' || event.key === 'm') {
        setMouseControlEnabled(prev => !prev);
        console.log('Mouse camera control:', !mouseControlEnabled ? 'enabled' : 'disabled');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [updateCameraOffset, mouseControlEnabled]);

  const backgroundStyle = useMemo(() => ({
    background: 'linear-gradient(135deg,rgb(20, 135, 184) 0%,rgb(48, 154, 224) 20%, #74c0fc 40%,rgb(228, 197, 151) 60%, #ff5e3a 100%)',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed' as const,
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  }), []);

  useEffect(() => {
    const preventZoom = (e) => {
      // Prevent zoom with Ctrl+Wheel or Ctrl+Plus/Minus/Equal
      if (
        (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) ||
        (e.ctrlKey && (e.type === 'wheel' || e.type === 'mousewheel')) ||
        (e.metaKey && (e.key === '+' || e.key === '-' || e.key === '=')) // for Mac
      ) {
        e.preventDefault();
      }
      // Prevent pinch zoom on touchpads
      if (e.type === 'gesturestart' || e.type === 'gesturechange') {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventZoom, { passive: false });
    window.addEventListener('keydown', preventZoom, { passive: false });
    window.addEventListener('gesturestart', preventZoom, { passive: false });
    window.addEventListener('gesturechange', preventZoom, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventZoom, { passive: false });
      window.removeEventListener('keydown', preventZoom, { passive: false });
      window.removeEventListener('gesturestart', preventZoom, { passive: false });
      window.removeEventListener('gesturechange', preventZoom, { passive: false });
    };
  }, []);

  return (
    <div className="w-full h-screen" style={backgroundStyle}>
      <ManualButton onClick={handleManualMode} />

      <Canvas
        shadows
        camera={{
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
            cameraOffset={cameraOffset}
            isManualModeEnabled={drivingMode === 'manual'}
            autonomousPath={waypoints}
            currentWaypointIndex={currentWaypointIndex}
            setCurrentWaypointIndex={setCurrentWaypointIndex}
            WAYPOINT_THRESHOLD={WAYPOINT_THRESHOLD}
            mouseControlEnabled={mouseControlEnabled}
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
              threshold={WAYPOINT_THRESHOLD}
            />
          ))}

          <Statue position={[5, 0, 5]} scale={[2, 2, 2]} />
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
        <OrbitControls enableDamping enablePan enableZoom enabled={mouseControlEnabled} />
      </Canvas>
    </div>
  );
}

export default React.memo(App);

