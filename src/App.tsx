import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ThreeDScene from './components/3d/ThreeDScene';
import { interpolatePath } from './utils/interpolatePath';
import { baseAutonomousPath, WAYPOINT_THRESHOLD } from './utils/trackData';
import * as THREE from 'three';
import { useAppStore } from './state/appStore';
import ManualButton from './components/common/ManualButton';
import CheckpointMarkers from './components/3d/props/CheckpointMarkers';

const initialAutonomousPathInterpolated = interpolatePath(baseAutonomousPath, 1);

const checkpointPositions = [
  [-40, 0, 15], // Statue and Server
  [90, -24, 230], // PCSetup
  [10, 0, 10], // Mailbox
];

function App() {
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

  const [waypoints, setLocalWaypoints] = useState<THREE.Vector3[]>(initialAutonomousPathInterpolated);
  const [singleWaypoint, setSingleWaypoint] = useState<THREE.Vector3>(new THREE.Vector3(0, 0.1, 0));

  useEffect(() => {
    setWaypoints(waypoints);
  }, [waypoints, setWaypoints]);

  const fixedCameraRotation = useMemo(() => new THREE.Euler(
    -Math.PI / 4,
    Math.PI / 4,
    Math.PI / 5
  ), []);

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
      const waypointMoveDistance = 1;
      if (event.key === 'k' || event.key === 'K') {
        updateCameraOffset(zoomDistanceFactor, true);
      } else if (event.key === 'j' || event.key === 'J') {
        updateCameraOffset(zoomDistanceFactor, false);
      } else if (event.key === 'M' || event.key === 'm') {
        setMouseControlEnabled(!mouseControlEnabled);
        console.log('Mouse camera control:', !mouseControlEnabled ? 'enabled' : 'disabled');
      } else if (event.key === 'a' || event.key === 'A') {
        setSingleWaypoint(prev => new THREE.Vector3(prev.x - waypointMoveDistance, prev.y, prev.z));
      } else if (event.key === 'd' || event.key === 'D') {
        setSingleWaypoint(prev => new THREE.Vector3(prev.x + waypointMoveDistance, prev.y, prev.z));
      } else if (event.key === 'w' || event.key === 'W') {
        setSingleWaypoint(prev => new THREE.Vector3(prev.x, prev.y, prev.z - waypointMoveDistance));
      } else if (event.key === 's' || event.key === 'S') {
        setSingleWaypoint(prev => new THREE.Vector3(prev.x, prev.y, prev.z + waypointMoveDistance));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [updateCameraOffset, mouseControlEnabled, setMouseControlEnabled]);

  useEffect(() => {
    const preventZoom = (e: any) => {
      if (!mouseControlEnabled && (e.type === 'wheel' || e.type === 'mousewheel')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      if (
        (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) ||
        (e.metaKey && (e.key === '+' || e.key === '-' || e.key === '='))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      if (e.type === 'gesturestart' || e.type === 'gesturechange') {
        e.preventDefault();
        e.stopPropagation();
        return false;adfknadsvje
      }
    };
    window.addEventListener('wheel', preventZoom, { passive: false });
    window.addEventListener('mousewheel', preventZoom, { passive: false });
    window.addEventListener('keydown', preventZoom);
    window.addEventListener('gesturestart', preventZoom);
    window.addEventListener('gesturechange', preventZoom);
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

  // Restore the original simple 3D view for development
  return (
    <div className="w-full h-screen" style={{
      background: 'linear-gradient(135deg,rgb(20, 135, 184) 0%,rgb(48, 154, 224) 20%, #74c0fc 40%,rgb(228, 197, 151) 60%, #ff5e3a 100%)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    }}>
      <ManualButton onClick={handleManualMode} />
      {/* Coordinate Tracker */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg text-sm font-mono">
        <h3 className="font-bold mb-2">Waypoint Coordinates</h3>
        <p>X: {singleWaypoint.x.toFixed(2)}</p>
        <p>Y: {singleWaypoint.y.toFixed(2)}</p>
        <p>Z: {singleWaypoint.z.toFixed(2)}</p>
      </div>
      <ThreeDScene
        drivingMode={drivingMode}
        setDrivingMode={setDrivingMode}
        cameraOffset={cameraOffset}
        waypoints={waypoints}
        currentWaypointIndex={currentWaypointIndex}
        setCurrentWaypointIndex={setCurrentWaypointIndex}
        mouseControlEnabled={mouseControlEnabled}
        setMouseControlEnabled={setMouseControlEnabled}
        setWaypoints={setWaypoints}
        singleWaypoint={singleWaypoint}
        handleDriveMode={handleDriveMode}
        fixedCameraRotation={fixedCameraRotation}
        onManualButton={handleManualMode}
        checkpointPositions={checkpointPositions}
      />
    </div>
  );
}

export default React.memo(App);

