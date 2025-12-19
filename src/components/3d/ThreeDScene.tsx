import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, useBox } from '@react-three/cannon';
import { Environment, OrbitControls } from '@react-three/drei';
import Track from './environment/Track';
import Floor from './environment/Floor';
import Car from './vehicles/Car';
import RainbowButton from '../common/RainbowButton';
import Walls from './environment/Walls';
import CityArch from './architecture/CityArch';
import CityNameBoard from './architecture/CityNameBoard';
import Statue from './props/statue';
import Mailbox from './environment/Mailbox';
import PCSetup from './props/PCSetup';
import Server from './props/Server';
import CityProp from './props/CityProp';
import WaypointMarker from '../ui/WaypointMarker';
import * as THREE from 'three';
import { WAYPOINT_THRESHOLD } from '../../utils/trackData';

interface ThreeDSceneProps {
  drivingMode: string;
  setDrivingMode: (mode: "manual" | "drive") => void;
  cameraOffset: any;
  waypoints: THREE.Vector3[];
  currentWaypointIndex: number;
  setCurrentWaypointIndex: React.Dispatch<React.SetStateAction<number>>;
  mouseControlEnabled: boolean;
  setMouseControlEnabled: (enabled: boolean) => void;
  setWaypoints: (wps: THREE.Vector3[]) => void;
  singleWaypoint: THREE.Vector3;
  handleDriveMode: () => void;
  fixedCameraRotation: THREE.Euler;
  onManualButton: () => void;
}

const buttonPosition2 = [30, 0.5, -10] as [number, number, number];

// Static obstacle with a physics collider and visual mesh
const Obstacle: React.FC<{ position: [number, number, number]; size: [number, number, number]; color?: string }> = ({ position, size, color = '#00bb00' }) => {
  // react-three/cannon expects box "args" as half-extents (x/2, y/2, z/2).
  const halfArgs: [number, number, number] = [size[0] / 2, size[1] / 2, size[2] / 2];
  const [ref] = useBox(() => ({
    mass: 0,
    args: halfArgs,
    position,
    type: 'Static',
    material: { friction: 1.0, restitution: 0 },
  }));

  return (
    <mesh ref={ref as any} position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} opacity={0.6} transparent />
    </mesh>
  );
};

const ThreeDScene: React.FC<ThreeDSceneProps> = ({
  drivingMode,
  setDrivingMode,
  cameraOffset,
  waypoints,
  currentWaypointIndex,
  setCurrentWaypointIndex,
  mouseControlEnabled,
  setMouseControlEnabled,
  setWaypoints,
  singleWaypoint,
  handleDriveMode,
  fixedCameraRotation,
  onManualButton,
}) => {
  // Single test obstacle (center position and full size [w,h,d]).
  // Y is the center height (size[1] / 2) so box sits on the ground.
  const obstacles = [
    { position: [5, 2, 10] as [number, number, number], size: [8, 4, 8] as [number, number, number] },
    { position: [-15, 2, 20] as [number, number, number], size: [8, 4, 8] as [number, number, number] },
    { position: [30, 2, -10] as [number, number, number], size: [8, 4, 8] as [number, number, number] },
    { position: [-30, 2, 40] as [number, number, number], size: [8, 4, 8] as [number, number, number] },
  ];
  return (
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
      className="w-full h-full"
    >
      <Environment preset="sunset" />
      <Physics gravity={[0, -9.82, 0]}>
        <Floor />
        <Track />
        {/* render obstacles as static physics colliders + visuals */}
        {obstacles.map((o, i) => (
          <Obstacle key={`obstacle-${i}`} position={o.position} size={o.size} />
        ))}

        <Car
          fixedCameraRotation={fixedCameraRotation}
          cameraOffset={cameraOffset}
          isManualModeEnabled={drivingMode === 'manual'}
          autonomousPath={waypoints}
          currentWaypointIndex={currentWaypointIndex}
          setCurrentWaypointIndex={setCurrentWaypointIndex}
          WAYPOINT_THRESHOLD={WAYPOINT_THRESHOLD}
          mouseControlEnabled={mouseControlEnabled}
          obstacles={obstacles}
        />
        <RainbowButton
          position={buttonPosition2}
          text="Drive"
          onClick={handleDriveMode}
        />
        <Walls />
        <CityArch />
        <CityNameBoard name="SARRAN" position={[-15, 0, 10]} />
        <WaypointMarker
          position={singleWaypoint}
          isCurrent={true}
          threshold={WAYPOINT_THRESHOLD}
          index={0}
          onMove={() => {}}
        />
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
  );
};

export default ThreeDScene; 