import { useState, useEffect } from 'react';
import { useAppStore } from '../state/appStore';

export function useCameraControls() {
  const [mouseControlEnabled, setMouseControlEnabled] = useState(false);
  const { updateCameraOffset } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const zoomDistanceFactor = 0.5;
      
      if (event.key === 'k' || event.key === 'K') {
        updateCameraOffset(zoomDistanceFactor, true);
      } else if (event.key === 'j' || event.key === 'J') {
        updateCameraOffset(zoomDistanceFactor, false);
      } else if (event.key === 'M' || event.key === 'm') {
        setMouseControlEnabled(prev => !prev);
        console.log('Mouse camera control:', !mouseControlEnabled ? 'enabled' : 'disabled');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [updateCameraOffset, mouseControlEnabled]);

  return {
    mouseControlEnabled,
    setMouseControlEnabled
  };
}