import * as THREE from 'three';

/**
 * Mathematical utility functions for 3D calculations
 */

/**
 * Clamps a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Linear interpolation between two values
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

/**
 * Linear interpolation between two Vector3s
 */
export const lerpVector3 = (start: THREE.Vector3, end: THREE.Vector3, t: number): THREE.Vector3 => {
  return new THREE.Vector3(
    lerp(start.x, end.x, t),
    lerp(start.y, end.y, t),
    lerp(start.z, end.z, t)
  );
};

/**
 * Smooth step interpolation
 */
export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
};

/**
 * Converts degrees to radians
 */
export const degToRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Converts radians to degrees
 */
export const radToDeg = (radians: number): number => {
  return radians * (180 / Math.PI);
};

/**
 * Calculates the distance between two Vector3s
 */
export const distance = (a: THREE.Vector3, b: THREE.Vector3): number => {
  return a.distanceTo(b);
};

/**
 * Calculates the angle between two Vector3s
 */
export const angleBetween = (a: THREE.Vector3, b: THREE.Vector3): number => {
  return a.angleTo(b);
};

/**
 * Normalizes an angle to be between -π and π
 */
export const normalizeAngle = (angle: number): number => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

/**
 * Calculates the shortest rotation between two angles
 */
export const shortestRotation = (current: number, target: number): number => {
  const diff = normalizeAngle(target - current);
  return diff;
};

/**
 * Checks if a point is within a bounding box
 */
export const isPointInBounds = (
  point: THREE.Vector3,
  min: THREE.Vector3,
  max: THREE.Vector3
): boolean => {
  return (
    point.x >= min.x && point.x <= max.x &&
    point.y >= min.y && point.y <= max.y &&
    point.z >= min.z && point.z <= max.z
  );
};

/**
 * Creates a random Vector3 within a range
 */
export const randomVector3 = (min: THREE.Vector3, max: THREE.Vector3): THREE.Vector3 => {
  return new THREE.Vector3(
    Math.random() * (max.x - min.x) + min.x,
    Math.random() * (max.y - min.y) + min.y,
    Math.random() * (max.z - min.z) + min.z
  );
};