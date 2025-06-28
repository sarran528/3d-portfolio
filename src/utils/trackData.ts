// This file will contain general helper functions.

import * as THREE from 'three';

export const baseAutonomousPath: THREE.Vector3[] = [
  new THREE.Vector3(0.00, 0.1, 0.00),
  new THREE.Vector3(3, 0.1, 12),
  new THREE.Vector3(20.58, 0.1, 14.78),
  new THREE.Vector3(37.43, 0.1, 14.07),
  new THREE.Vector3(43.74, 0.1, 23.56),
  new THREE.Vector3(35.38, 0.1, 34.9),
  new THREE.Vector3(23.2, 0.1, 31.9),
  new THREE.Vector3(21.9, 0.1, 25),
  new THREE.Vector3(20.33, 0.1, -20),
  new THREE.Vector3(10.50, 0.1, -27),
  new THREE.Vector3(-1.46, 0.1, -18.65),
];

export const WAYPOINT_THRESHOLD = 5;