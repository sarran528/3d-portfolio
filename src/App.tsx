import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ThreeDScene from './components/3d/ThreeDScene';
import { interpolatePath } from './utils/interpolatePath';
import { baseAutonomousPath, WAYPOINT_THRESHOLD } from './utils/trackData';
import * as THREE from 'three';
import { useAppStore } from './state/appStore';

const initialAutonomousPathInterpolated = interpolatePath(baseAutonomousPath, 1);

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
      } else if (event.key === 'ArrowLeft') {
        setSingleWaypoint(prev => new THREE.Vector3(prev.x - waypointMoveDistance, prev.y, prev.z));
      } else if (event.key === 'ArrowRight') {
        setSingleWaypoint(prev => new THREE.Vector3(prev.x + waypointMoveDistance, prev.y, prev.z));
      } else if (event.key === 'ArrowUp') {
        setSingleWaypoint(prev => new THREE.Vector3(prev.x, prev.y, prev.z - waypointMoveDistance));
      } else if (event.key === 'ArrowDown') {
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
        return false;
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

  // Creative main page layout: Centered card with a title and the canvas inside
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="w-full max-w-4xl bg-white/10 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg text-center">
          🚗 3D Portfolio City Drive
        </h1>
        <p className="text-lg text-blue-100 mb-8 text-center max-w-2xl">
          Explore the interactive 3D city! Use the manual/drive modes, move waypoints, and enjoy the immersive experience.<br/>
          <span className="text-xs text-orange-200">(Use arrow keys to move the waypoint, M to toggle mouse camera, J/K to zoom)</span>
        </p>
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
        />
      </div>
    </div>
  );
}

export default React.memo(App);

