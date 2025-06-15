import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import * as THREE from 'three';

const useCameraControls = () => {
  const { setCurrentCameraOffset } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const zoomDistanceFactor = 0.5;

      setCurrentCameraOffset((prevOffset) => {
        const newOffset = prevOffset.clone();
        if (event.key === 'k' || event.key === 'K') {
          newOffset.z = Math.max(5, newOffset.z - zoomDistanceFactor * 2);
          newOffset.y = Math.max(5, newOffset.y - zoomDistanceFactor);
        } else if (event.key === 'j' || event.key === 'J') {
          newOffset.z = Math.min(30, newOffset.z + zoomDistanceFactor * 2);
          newOffset.y = Math.min(20, newOffset.y + zoomDistanceFactor);
        }
        return newOffset;
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setCurrentCameraOffset]); // Add setCurrentCameraOffset to the dependency array
};

export default useCameraControls;