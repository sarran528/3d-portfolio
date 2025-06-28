import { create } from 'zustand';
import * as THREE from 'three';

interface AppState {
  drivingMode: 'manual' | 'drive';
  currentWaypointIndex: number;
  cameraOffset: THREE.Vector3;
  isLoading: boolean;
  
  // Actions
  setDrivingMode: (mode: 'manual' | 'drive') => void;
  setCurrentWaypointIndex: (index: number) => void;
  setCameraOffset: (offset: THREE.Vector3) => void;
  setLoading: (loading: boolean) => void;
  resetWaypointIndex: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  drivingMode: 'manual',
  currentWaypointIndex: 0,
  cameraOffset: new THREE.Vector3(2, 10, 11),
  isLoading: false,
  
  setDrivingMode: (mode) => set({ drivingMode: mode }),
  setCurrentWaypointIndex: (index) => set({ currentWaypointIndex: index }),
  setCameraOffset: (offset) => set({ cameraOffset: offset }),
  setLoading: (loading) => set({ isLoading: loading }),
  resetWaypointIndex: () => set({ currentWaypointIndex: 0 }),
})); 