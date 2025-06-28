import * as THREE from 'three';

export const interpolatePath = (path: THREE.Vector3[], pointsPerSegment: number): THREE.Vector3[] => {
  if (path.length < 1) return path;

  const newPath: THREE.Vector3[] = [];
  for (let i = 0; i < path.length; i++) {
    const p1 = path[i];
    const p2 = path[(i + 1) % path.length];
    newPath.push(p1);
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