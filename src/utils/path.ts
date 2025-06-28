import * as THREE from 'three';

export interface PathPoint {
  x: number;
  y: number;
  z: number;
}

export interface PathSegment {
  start: PathPoint;
  end: PathPoint;
  controlPoints?: PathPoint[];
}

export const createSmoothPath = (points: PathPoint[], segments: number = 10): THREE.Vector3[] => {
  const path: THREE.Vector3[] = [];
  
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    
    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;
      const z = start.z + (end.z - start.z) * t;
      
      path.push(new THREE.Vector3(x, y, z));
    }
  }
  
  return path;
};

export const calculatePathLength = (path: THREE.Vector3[]): number => {
  let length = 0;
  
  for (let i = 1; i < path.length; i++) {
    length += path[i].distanceTo(path[i - 1]);
  }
  
  return length;
};

export const getPointAtDistance = (path: THREE.Vector3[], distance: number): THREE.Vector3 => {
  const totalLength = calculatePathLength(path);
  const targetDistance = distance % totalLength;
  
  let currentDistance = 0;
  
  for (let i = 1; i < path.length; i++) {
    const segmentLength = path[i].distanceTo(path[i - 1]);
    
    if (currentDistance + segmentLength >= targetDistance) {
      const t = (targetDistance - currentDistance) / segmentLength;
      return new THREE.Vector3().lerpVectors(path[i - 1], path[i], t);
    }
    
    currentDistance += segmentLength;
  }
  
  return path[path.length - 1];
}; 