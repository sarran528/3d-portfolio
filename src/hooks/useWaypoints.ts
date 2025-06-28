import { useState, useMemo } from 'react';
import { interpolatePath } from '../utils/interpolatePath';
import { baseAutonomousPath } from '../utils/trackData';

export function useWaypoints() {
  // baseAutonomousPath is now imported from utils

  const waypoints = useMemo(
    () => interpolatePath(baseAutonomousPath, 1),
    [baseAutonomousPath]
  );

  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);

  return { waypoints, currentWaypointIndex, setCurrentWaypointIndex };
}