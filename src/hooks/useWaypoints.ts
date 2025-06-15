import { useState, useMemo } from 'react';
import * as THREE from 'three';
import { interpolatePath, baseAutonomousPath } from '../utils/math'; // Import from utils

export function useWaypoints() {
  // baseAutonomousPath is now imported from utils

  const waypoints = useMemo(
    () => interpolatePath(baseAutonomousPath, 1),
    [baseAutonomousPath]
  );

  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);

  return { waypoints, currentWaypointIndex, setCurrentWaypointIndex };
}