import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ManualButton from '../components/common/ManualButton';
import HomeScene from '../scenes/HomeScene';
import * as THREE from 'three';

interface MainLayoutProps {
  children?: React.ReactNode;
  drivingMode: 'manual' | 'drive';
  currentWaypointIndex: number;
  waypoints: THREE.Vector3[];
  currentCameraOffset: THREE.Vector3;
  fixedCameraRotation: THREE.Euler;
  WAYPOINT_THRESHOLD: number;
  setCurrentWaypointIndex: React.Dispatch<React.SetStateAction<number>>;
  handleManualMode: () => void;
  handleDriveMode: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  drivingMode,
  currentWaypointIndex,
  waypoints,
  currentCameraOffset,
  fixedCameraRotation,
  WAYPOINT_THRESHOLD,
  setCurrentWaypointIndex,
  handleManualMode,
  handleDriveMode,
}) => {
  const backgroundStyle = {
    background: 'linear-gradient(135deg,rgb(20, 135, 184) 0%,rgb(48, 154, 224) 20%, #74c0fc 40%,rgb(228, 197, 151) 60%, #ff5e3a 100%)',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed' as const,
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  };

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
        <HomeScene
          drivingMode={drivingMode}
          currentWaypointIndex={currentWaypointIndex}
          waypoints={waypoints}
          currentCameraOffset={currentCameraOffset}
          fixedCameraRotation={fixedCameraRotation}
          WAYPOINT_THRESHOLD={WAYPOINT_THRESHOLD}
          setCurrentWaypointIndex={setCurrentWaypointIndex}
          handleDriveMode={handleDriveMode}
        />

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
        {drivingMode === 'manual' && <OrbitControls enableDamping />}
      </Canvas>
      
      {children}
    </div>
  );
};

export default MainLayout; 