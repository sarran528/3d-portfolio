import * as THREE from 'three';
import { interpolatePath } from './interpolatePath';

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

/**
 * Creates a smooth path using the existing interpolatePath function
 * This is a wrapper around the existing functionality
 */
export const createSmoothPath = (points: PathPoint[], segments: number = 10): THREE.Vector3[] => {
  const vector3Points = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
  return interpolatePath(vector3Points, segments);
};

/**
 * Calculates the total length of a path
 */
export const calculatePathLength = (path: THREE.Vector3[]): number => {
  let length = 0;
  
  for (let i = 1; i < path.length; i++) {
    length += path[i].distanceTo(path[i - 1]);
  }
  
  return length;
};

/**
 * Gets a point at a specific distance along the path
 */
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

/**
 * Creates a curved path using quadratic Bezier curves
 */
export const createCurvedPath = (points: THREE.Vector3[], tension: number = 0.5): THREE.Vector3[] => {
  if (points.length < 3) return points;
  
  const curvedPath: THREE.Vector3[] = [];
  
  for (let i = 0; i < points.length - 2; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const p2 = points[i + 2];
    
    // Create control points for smooth curves
    const cp1 = new THREE.Vector3().lerpVectors(p0, p1, 1 - tension);
    const cp2 = new THREE.Vector3().lerpVectors(p1, p2, tension);
    
    // Add points along the curve
    for (let t = 0; t <= 1; t += 0.1) {
      const point = quadraticBezier(p0, cp1, p2, t);
      curvedPath.push(point);
    }
  }
  
  return curvedPath;
};

/**
 * Quadratic Bezier curve calculation
 */
const quadraticBezier = (p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, t: number): THREE.Vector3 => {
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
  const z = (1 - t) * (1 - t) * p0.z + 2 * (1 - t) * t * p1.z + t * t * p2.z;
  
  return new THREE.Vector3(x, y, z);
};

/**
 * Finds the closest point on a path to a given position
 */
export const findClosestPointOnPath = (path: THREE.Vector3[], position: THREE.Vector3): {
  point: THREE.Vector3;
  index: number;
  distance: number;
} => {
  let closestPoint = path[0];
  let closestIndex = 0;
  let closestDistance = position.distanceTo(path[0]);
  
  for (let i = 1; i < path.length; i++) {
    const distance = position.distanceTo(path[i]);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPoint = path[i];
      closestIndex = i;
    }
  }
  
  return {
    point: closestPoint,
    index: closestIndex,
    distance: closestDistance
  };
}; 