import React, { Suspense, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Environment, OrbitControls } from '@react-three/drei';
import Track from './components/3d/Track';
import Floor from './components/3d/Floor';
import Car from './components/3d/Car';
import RainbowButton from './components/ui/RainbowButton';
import Walls from './components/3d/Walls';
import CityArch from './components/3d/CityArch';
import CityNameBoard from './components/3d/CityNameBoard';
import * as THREE from 'three';
import { interpolatePath } from './components/helpers/interpolatePath';

// Base track coordinates
const baseAutonomousPath: THREE.Vector3[] = [
  new THREE.Vector3(0.00, 0.1, 0.00),
  new THREE.Vector3(3, 0.1, 12),
  new THREE.Vector3(20.58, 0.1, 14.78),
  new THREE.Vector3(37.43, 0.1, 14.07),
  new THREE.Vector3(43.74, 0.1, 23.56),
  new THREE.Vector3(35.38, 0.1, 34.9),
  new THREE.Vector3(23.2, 0.1, 31.9),
  new THREE.Vector3(21.9, 0.1, 25),
  new THREE.Vector3(20.33, 0.1, -20),
  new THREE.Vector3(10.50, 0.1, -27),
  new THREE.Vector3(-1.46, 0.1, -18.65),
];

const initialAutonomousPathInterpolated = interpolatePath(baseAutonomousPath, 1);
const WAYPOINT_THRESHOLD = 5;

// UI Components
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
  const [drivingMode, setDrivingMode] = useState<'manual' | 'drive'>('manual');
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [waypoints] = useState<THREE.Vector3[]>(initialAutonomousPathInterpolated);
  const [currentCameraOffset, setCurrentCameraOffset] = useState(
    new THREE.Vector3(2, 10, 11)
  );

  const waypointMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const coordsDisplayRef = useRef<HTMLDivElement>(null);

  const fixedCameraRotation = useMemo(() => new THREE.Euler(
    -Math.PI * 8 / 33,
    Math.PI * 2 / 4349,
    0
  ), []);

  const buttonPosition2 = useMemo(() => [30, 0.5, -10] as [number, number, number], []);

  const handleManualMode = useCallback(() => {
    setDrivingMode('manual');
    console.log('Switched to Manual Driving Mode');
  }, []);

  const handleDriveMode = useCallback(() => {
    setDrivingMode('drive');
    console.log('Switched to Drive Mode');
  }, []);

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
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default React.memo(App);
