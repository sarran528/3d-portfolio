import React, { createContext, useState, useContext, ReactNode } from 'react';
import * as THREE from 'three';

// Define the type for the context state
interface AppContextType {
  drivingMode: 'manual' | 'drive';
  currentWaypointIndex: number;
  waypoints: THREE.Vector3[];
  currentCameraOffset: THREE.Vector3;
  setDrivingMode: React.Dispatch<React.SetStateAction<'manual' | 'drive'>>;
  setCurrentWaypointIndex: React.Dispatch<React.SetStateAction<number>>;
  setWaypoints: React.Dispatch<React.SetStateAction<THREE.Vector3[]>>;
  setCurrentCameraOffset: React.Dispatch<React.SetStateAction<THREE.Vector3>>;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Define the provider component
export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [drivingMode, setDrivingMode] = useState<'manual' | 'drive'>('manual');
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);

  // Define the initial waypoints here or import them if they are defined elsewhere
  // For now, let's use a placeholder. You should replace this with your actual initial waypoints.
  const initialAutonomousPathInterpolated: THREE.Vector3[] = [
      // new THREE.Vector3(0.00, 0.1, 0.00),
      // new THREE.Vector3(3, 0.1, 12),
      // new THREE.Vector3(20.58, 0.1, 14.78),
      // new THREE.Vector3(37.43, 0.1, 14.07),
      // new THREE.Vector3(43.74, 0.1, 23.56),
      // new THREE.Vector3(35.38, 0.1, 34.9),
      // new THREE.Vector3(23.2, 0.1, 31.9),
      // new THREE.Vector3(21.9, 0.1, 25),
      // new THREE.Vector3(20.33, 0.1, -20),
      // new THREE.Vector3(10.50, 0.1, -27),
      // new THREE.Vector3(-1.46, 0.1, -18.65),
       new THREE.Vector3(0.00, 0.1, 0.00),
    //     new THREE.Vector3(0.00, 0.1, 9.00),
    // new THREE.Vector3(1.00, 0.1, 12.00),
   new THREE.Vector3(3, 0.1, 12),
    new THREE.Vector3(8.00, 0.1, 13.00),
    new THREE.Vector3(31.00, 0.1, 13.00),
    new THREE.Vector3(36.00, 0.1, 15.00),
    new THREE.Vector3(40.00, 0.1, 19.00),
    new THREE.Vector3(42.00, 0.1, 24.00),
    new THREE.Vector3(40.00, 0.1, 30.00),
    new THREE.Vector3(38.00, 0.1, 32.00),
    new THREE.Vector3(36.00, 0.1, 34.00),
    new THREE.Vector3(31.00, 0.1, 35.00),
    new THREE.Vector3(28.00, 0.1, 34.00),
    new THREE.Vector3(26.00, 0.1, 33.00),
    new THREE.Vector3(23.00, 0.1, 30.00),
    new THREE.Vector3(21.00, 0.1, 26.00),
    new THREE.Vector3(21.00, 0.1, 24.00),
    new THREE.Vector3(21.00, 0.1, -18.00),
    new THREE.Vector3(19.00, 0.1, -22.00),
    new THREE.Vector3(13.00, 0.1, -26.00),
    new THREE.Vector3(5.00, 0.1, -25.00),
    new THREE.Vector3(1.00, 0.1, -20.00),
    new THREE.Vector3(0.00, 0.1, -15.00),
    new THREE.Vector3(0.00, 0.1, 9.00),
    new THREE.Vector3(-2.00, 0.1, 13.00),
    new THREE.Vector3(-5.00, 0.1, 13.00),
    new THREE.Vector3(-43.00, 0.1, 14.00),
    new THREE.Vector3(-48.00, 0.1, 13.00),
    new THREE.Vector3(-53.00, 0.1, 11.00),
    new THREE.Vector3(-56.00, 0.1, 7.00),
    new THREE.Vector3(-57.00, 0.1, -8.00),
    new THREE.Vector3(-56.00, 0.1, -16.00),
    new THREE.Vector3(-54.00, 0.1, -19.00),
    new THREE.Vector3(-51.00, 0.1, -22.00),
    new THREE.Vector3(-46.00, 0.1, -23.00),
    new THREE.Vector3(-31.00, 0.1, -22.00),
    new THREE.Vector3(-27.00, 0.1, -20.00),
    new THREE.Vector3(-24.00, 0.1, -16.00),

    new THREE.Vector3(-24.00, 0.1, 12.00),
    new THREE.Vector3(-21.00, 0.1, 13.00),
    new THREE.Vector3(-19.00, 0.1, 14.00),
    
 
    new THREE.Vector3(8.00, 0.1, 13.00),
    new THREE.Vector3(31.00, 0.1, 13.00),
    new THREE.Vector3(36.00, 0.1, 15.00),
    new THREE.Vector3(40.00, 0.1, 19.00),
    new THREE.Vector3(42.00, 0.1, 24.00),
    new THREE.Vector3(40.00, 0.1, 30.00),
    new THREE.Vector3(38.00, 0.1, 32.00),
    new THREE.Vector3(36.00, 0.1, 34.00),
    new THREE.Vector3(31.00, 0.1, 35.00),
    new THREE.Vector3(28.00, 0.1, 34.00),
    new THREE.Vector3(26.00, 0.1, 33.00),
    new THREE.Vector3(23.00, 0.1, 30.00),
    new THREE.Vector3(21.00, 0.1, 26.00),
    new THREE.Vector3(21.00, 0.1, 24.00),
    new THREE.Vector3(21.00, 0.1, -18.00),
    new THREE.Vector3(19.00, 0.1, -22.00),
    new THREE.Vector3(13.00, 0.1, -26.00),
    new THREE.Vector3(5.00, 0.1, -25.00),
    new THREE.Vector3(1.00, 0.1, -20.00),
    new THREE.Vector3(0.00, 0.1, -15.00),
    new THREE.Vector3(0.00, 0.1, 9.00),
 


  ];
  const [waypoints, setWaypoints] = useState<THREE.Vector3[]>(initialAutonomousPathInterpolated);
  const [currentCameraOffset, setCurrentCameraOffset] = useState(
    new THREE.Vector3(2, 10, 11)
  );

  return (
    <AppContext.Provider
      value={{
        drivingMode,
        currentWaypointIndex,
        waypoints,
        currentCameraOffset,
        setDrivingMode,
        setCurrentWaypointIndex,
        setWaypoints,
        setCurrentCameraOffset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to consume the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export default AppContext;