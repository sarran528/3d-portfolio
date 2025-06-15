import { useState, useCallback } from 'react';
import * as THREE from 'three';

export function useCameraOffset() {
  const [currentCameraOffset, setCurrentCameraOffset] = useState(
    new THREE.Vector3(2, 10, 11)
  );

  const updateCameraOffset = useCallback((zoomDistanceFactor: number, isZoomIn: boolean) => {
    setCurrentCameraOffset((prevOffset) => {
      const newOffset = prevOffset.clone();
      if (isZoomIn) {
        newOffset.z = Math.max(5, newOffset.z - zoomDistanceFactor * 2);
        newOffset.y = Math.max(5, newOffset.y - zoomDistanceFactor);
      } else {
        newOffset.z = Math.min(30, newOffset.z + zoomDistanceFactor * 2);
        newOffset.y = Math.min(20, newOffset.y + zoomDistanceFactor);
      }
      return newOffset;
    });
  }, []); // Dependency array is empty as setCurrentCameraOffset is stable

  return { currentCameraOffset, updateCameraOffset, setCurrentCameraOffset };
}