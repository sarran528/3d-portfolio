import React from 'react';
import { Physics } from '@react-three/cannon';
import { Environment } from '@react-three/drei';
import Track from '../components/3d/environment/Track';
import Floor from '../components/3d/environment/Floor';
import Car from '../components/3d/vehicles/Car';
import Walls from '../components/3d/environment/Walls';
import CityArch from '../components/3d/architecture/CityArch';
import CityNameBoard from '../components/3d/architecture/CityNameBoard';
import Statue from '../components/3d/props/statue';
import RainbowButton from '../components/common/RainbowButton';
import WaypointMarker from '../components/ui/WaypointMarker';
import * as THREE from 'three';

interface HomeSceneProps {
  drivingMode: 'manual' | 'drive';
  currentWaypointIndex: number;
  waypoints: THREE.Vector3[];
  currentCameraOffset: THREE.Vector3;
  fixedCameraRotation: THREE.Euler;
  WAYPOINT_THRESHOLD: number;
  setCurrentWaypointIndex: React.Dispatch<React.SetStateAction<number>>;
  handleDriveMode: () => void;
}

const HomeScene: React.FC<HomeSceneProps> = ({
  drivingMode,
  currentWaypointIndex,
  waypoints,
  currentCameraOffset,
  fixedCameraRotation,
  WAYPOINT_THRESHOLD,
  setCurrentWaypointIndex,
  handleDriveMode,
}) => {
  const buttonPosition = [30, 0.5, -10] as [number, number, number];

  return (
    <>
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
          position={buttonPosition}
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
    </>
  );
};

export default HomeScene; 