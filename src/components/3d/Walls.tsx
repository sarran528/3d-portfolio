import React from 'react';

const WALL_THICKNESS = 0.9;
const WALL_HEIGHT = 10;
const WALL_MIN_X = -75;
const WALL_MAX_X = 75;
const WALL_MIN_Z = -40;
const WALL_MAX_Z = 40;

const Walls = () => (
  <>
    {/* Back wall (negative Z) */}
    <mesh position={[0, WALL_HEIGHT / 2, WALL_MIN_Z]}>
      <boxGeometry args={[WALL_MAX_X - WALL_MIN_X, WALL_HEIGHT, WALL_THICKNESS]} />
      <meshStandardMaterial color="blue" />
    </mesh>
    {/* Front wall (positive Z) */}
    <mesh position={[0, WALL_HEIGHT / 2, WALL_MAX_Z]}>
      <boxGeometry args={[WALL_MAX_X - WALL_MIN_X, WALL_HEIGHT, WALL_THICKNESS]} />
      <meshStandardMaterial color="blue" />
    </mesh>
    {/* Left wall (negative X) */}
    <mesh position={[WALL_MIN_X, WALL_HEIGHT / 2, 0]}>
      <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, WALL_MAX_Z - WALL_MIN_Z]} />
      <meshStandardMaterial color="blue" />
    </mesh>
    {/* Right wall (positive X) */}
    <mesh position={[WALL_MAX_X, WALL_HEIGHT / 2, 0]}>
      <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, WALL_MAX_Z - WALL_MIN_Z]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  </>
);

export default Walls;