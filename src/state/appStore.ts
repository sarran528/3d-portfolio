import { create } from 'zustand';
import * as THREE from 'three';
//
interface AppState {
  drivingMode: 'manual' | 'drive';
  currentWaypointIndex: number;
  cameraOffset: THREE.Vector3;
  isLoading: boolean;
  waypoints: THREE.Vector3[];
  mouseControlEnabled: boolean;
  
  // Actions
  setDrivingMode: (mode: 'manual' | 'drive') => void;
  setCurrentWaypointIndex: React.Dispatch<React.SetStateAction<number>>;
  setCameraOffset: (offset: THREE.Vector3) => void;
  setLoading: (loading: boolean) => void;
  resetWaypointIndex: () => void;
  updateCameraOffset: (zoomDistanceFactor: number, isZoomIn: boolean) => void;
  setWaypoints: (waypoints: THREE.Vector3[]) => void;
  setMouseControlEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  drivingMode: 'manual',
  currentWaypointIndex: 0,
  cameraOffset: new THREE.Vector3(10,10,10),
  isLoading: false,
  waypoints: [],
  mouseControlEnabled: false,
  
  setDrivingMode: (mode) => set({ drivingMode: mode }),
  setCurrentWaypointIndex: (value) => {
    if (typeof value === 'function') {
      set((state) => ({ currentWaypointIndex: value(state.currentWaypointIndex) }));
    } else {
      set({ currentWaypointIndex: value });
    }
  },
  setCameraOffset: (offset) => set({ cameraOffset: offset }),
  setLoading: (loading) => set({ isLoading: loading }),
  resetWaypointIndex: () => set({ currentWaypointIndex: 0 }),
  setWaypoints: (waypoints) => set({ waypoints }),
  
  updateCameraOffset: (zoomDistanceFactor: number, isZoomIn: boolean) => {
    set((state) => {
      const newOffset = state.cameraOffset.clone();
      if (isZoomIn) {
        newOffset.z = Math.max(5, newOffset.z - zoomDistanceFactor * 2);
        newOffset.y = Math.max(5, newOffset.y - zoomDistanceFactor);
      } else {
        newOffset.z = Math.min(30, newOffset.z + zoomDistanceFactor * 2);
        newOffset.y = Math.min(20, newOffset.y + zoomDistanceFactor);
      }
      return { cameraOffset: newOffset };
    });
  },
  setMouseControlEnabled: (enabled) => set({ mouseControlEnabled: enabled }),
})); 