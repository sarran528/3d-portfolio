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
import Mailbox from './components/3d/environment/Mailbox';
import PCSetup from './components/3d/props/PCSetup';
import Server from './components/3d/props/Server';
import CityProp from './components/3d/props/CityProp';

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
    setWaypoints,
    mouseControlEnabled,
    setMouseControlEnabled
  } = useAppStore();

  // Initialize waypoints in store
  const [waypoints] = useState<THREE.Vector3[]>(initialAutonomousPathInterpolated);
  
  // Set waypoints in store on mount
  useEffect(() => {
    setWaypoints(waypoints);
  }, [waypoints, setWaypoints]);

  const fixedCameraRotation = useMemo(() => new THREE.Euler(
    -Math.PI / 4,  // X: tilt 45° down
    Math.PI / 4,  // Y: rotate 45° left
    Math.PI / 5  
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
        setMouseControlEnabled(!mouseControlEnabled);
        console.log('Mouse camera control:', !mouseControlEnabled ? 'enabled' : 'disabled');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [updateCameraOffset, mouseControlEnabled, setMouseControlEnabled]);

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
    const preventZoom = (e: any) => {
      // Only prevent wheel events when mouse controls are disabled
      if (!mouseControlEnabled && (e.type === 'wheel' || e.type === 'mousewheel')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Prevent zoom with Ctrl+Wheel or Ctrl+Plus/Minus/Equal
      if (
        (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) ||
        (e.metaKey && (e.key === '+' || e.key === '-' || e.key === '=')) // for Mac
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Prevent pinch zoom on touchpads
      if (e.type === 'gesturestart' || e.type === 'gesturechange') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Add event listeners to both window and document
    window.addEventListener('wheel', preventZoom, { passive: false });
    window.addEventListener('mousewheel', preventZoom, { passive: false });
    window.addEventListener('keydown', preventZoom);
    window.addEventListener('gesturestart', preventZoom);
    window.addEventListener('gesturechange', preventZoom);
    
    // Also prevent on the document
    document.addEventListener('wheel', preventZoom, { passive: false });
    document.addEventListener('mousewheel', preventZoom, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventZoom);
      window.removeEventListener('mousewheel', preventZoom);
      window.removeEventListener('keydown', preventZoom);
      window.removeEventListener('gesturestart', preventZoom);
      window.removeEventListener('gesturechange', preventZoom);
      document.removeEventListener('wheel', preventZoom);
      document.removeEventListener('mousewheel', preventZoom);
    };
  }, [mouseControlEnabled]);

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
{/* sdvmosmvdsmvmsvm */}
          <Walls />
          <CityArch />
          <CityNameBoard name="SARRAN" position={[-15, 0, 10]} />

          {waypoints.map((wp, index) => (
            <WaypointMarker
              key={index}
              position={wp}
              isCurrent={index === currentWaypointIndex}
              threshold={WAYPOINT_THRESHOLD}
            />
          ))}

          <Statue position={[-40, 0, 15]} scale={[3,3,3]} />
          <Mailbox position={[10, 0, 10]} scale={1.5} />
          <PCSetup position={[90, -24, 230]} scale={[20,20,20]} />
          <Server position={[-40, 0, 15]} scale={[3,3,3]} />
          <CityProp 
            modelPath="/models/environment/carprobs.glb"
            position={[20, 0, 20]} 
            scale={[1.5, 1.5, 1.5]} 
          />
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
        {mouseControlEnabled && (
          <OrbitControls 
            enableDamping 
            enablePan 
            enableZoom 
            enabled={true}
          />
        )}
      </Canvas>
    </div>
  );
}

export default React.memo(App);

