// Your base track coordinates (11 points)
const baseAutonomousPath: THREE.Vector3[] = [
  new THREE.Vector3(0.00, 0.1, 0.00),    // Point 1 (Y updated to 0.1)
  new THREE.Vector3(3, 0.1, 12),   // Point 2 (Y updated to 0.1)
  new THREE.Vector3(20.58, 0.1, 14.78),  // Point 3 (Y updated to 0.1)
  new THREE.Vector3(37.43, 0.1, 14.07),  // Point 4 (Y updated to 0.1, was 114.07, assuming typo)
  new THREE.Vector3(43.74, 0.1, 23.56),  // Point 5 (Y updated to 0.1)
  new THREE.Vector3(35.38, 0.1, 34.9),  // Point 6 (Y updated to 0.1)
  new THREE.Vector3(23.2, 0.1, 31.9),  // Point 7 (Y updated to 0.1)
  new THREE.Vector3(21.9, 0.1, 25),  // Point 8 (Y updated to 0.1)
  new THREE.Vector3(20.33, 0.1, -20), // Point 9 (Y updated to 0.1)\n  new THREE.Vector3(10.50, 0.1, -27), // Point 10 (Y updated to 0.1)\n  new THREE.Vector3(-1.46, 0.1, -18.65),   // Point 11 (Y updated to 0.1)\n];

// Function to interpolate points for a smoother path
const interpolatePath = (path: THREE.Vector3[], pointsPerSegment: number): THREE.Vector3[] => {
  if (path.length < 1) return path;

  const newPath: THREE.Vector3[] = [];
  for (let i = 0; i < path.length; i++) {
    const p1 = path[i];
    const p2 = path[(i + 1) % path.length]; // This handles looping back to the first point

    newPath.push(p1); // Add the original point

    // Add interpolated points for smooth transitions
    if (i < path.length) {
      for (let j = 1; j <= pointsPerSegment; j++) {
        const t = j / (pointsPerSegment + 1);\n        const interpolatedPoint = new THREE.Vector3(\n          p1.x + (p2.x - p1.x) * t,\n          p1.y + (p2.y - p1.y) * t,\n          p1.z + (p2.z - p1.z) * t\n        );\n        newPath.push(interpolatedPoint);\n      }\n    }\n  }\n  return newPath;\n};

// Generate the initial waypoints by interpolating (1 point in between each base segment).
const initialAutonomousPathInterpolated = interpolatePath(baseAutonomousPath, 1);

// Threshold for waypoints (constant) - this controls how close the car needs to be
// to a waypoint before moving to the next one.
const WAYPOINT_THRESHOLD = 5;
import * as THREE from 'three';

// Your base track coordinates (11 points)
export const baseAutonomousPath: THREE.Vector3[] = [
  new THREE.Vector3(0.00, 0.1, 0.00),    // Point 1 (Y updated to 0.1)
  new THREE.Vector3(3, 0.1, 12),   // Point 2 (Y updated to 0.1)
  new THREE.Vector3(20.58, 0.1, 14.78),  // Point 3 (Y updated to 0.1)
  new THREE.Vector3(37.43, 0.1, 14.07),  // Point 4 (Y updated to 0.1, was 114.07, assuming typo)
  new THREE.Vector3(43.74, 0.1, 23.56),  // Point 5 (Y updated to 0.1)
  new THREE.Vector3(35.38, 0.1, 34.9),  // Point 6 (Y updated to 0.1)
  new THREE.Vector3(23.2, 0.1, 31.9),  // Point 7 (Y updated to 0.1)
  new THREE.Vector3(21.9, 0.1, 25),  // Point 8 (Y updated to 0.1)
  new THREE.Vector3(20.33, 0.1, -20), // Point 9 (Y updated to 0.1)
  new THREE.Vector3(10.50, 0.1, -27), // Point 10 (Y updated to 0.1)
  new THREE.Vector3(-1.46, 0.1, -18.65),   // Point 11 (Y updated to 0.1)
];
export const WAYPOINT_THRESHOLD = 5;

/**
 * Interpolates points for a smoother path.
 * @param path - The original array of THREE.Vector3 points.
 * @param pointsPerSegment - The number of interpolated points to add between each original segment.
 * @returns A new array of THREE.Vector3 points with interpolated points.
 */
export const interpolatePath = (path: THREE.Vector3[], pointsPerSegment: number): THREE.Vector3[] => {
  if (path.length < 1) return path;

  const newPath: THREE.Vector3[] = [];
  for (let i = 0; i < path.length; i++) {
    const p1 = path[i];
    const p2 = path[(i + 1) % path.length]; // This handles looping back to the first point

    newPath.push(p1); // Add the original point

    // Add interpolated points for smooth transitions
    if (i < path.length) {
      for (let j = 1; j <= pointsPerSegment; j++) {
        const t = j / (pointsPerSegment + 1);
        const interpolatedPoint = new THREE.Vector3(
          p1.x + (p2.x - p1.x) * t,
          p1.y + (p2.y - p1.y) * t,
          p1.z + (p2.z - p1.z) * t
        );
        newPath.push(interpolatedPoint);
      }
    }
  }
  return newPath;
};