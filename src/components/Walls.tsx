import React from 'react';

const WALL_THICKNESS = 2;
const FLOOR_SIZE = 100; // Adjust to match your floor size
const WALL_HEIGHT = 10;

const Walls = () => (
  <>
    {/* Back wall */}
    <mesh position={[0, WALL_HEIGHT / 2, -FLOOR_SIZE / 2]}>
      <boxGeometry args={[FLOOR_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
      <meshStandardMaterial color="#fff3e0" />
    </mesh>
    {/* Front wall */}
    <mesh position={[0, WALL_HEIGHT / 2, FLOOR_SIZE / 2]}>
      <boxGeometry args={[FLOOR_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
      <meshStandardMaterial color="#fff3e0" />
    </mesh>
    {/* Left wall */}
    <mesh position={[-FLOOR_SIZE / 2, WALL_HEIGHT / 2, 0]}>
      <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, FLOOR_SIZE]} />
      <meshStandardMaterial color="#fff3e0" />
    </mesh>
    {/* Right wall */}
    <mesh position={[FLOOR_SIZE / 2, WALL_HEIGHT / 2, 0]}>
      <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, FLOOR_SIZE]} />
      <meshStandardMaterial color="#fff3e0" />
    </mesh>
    {/* Additional wall example */}
    <mesh position={[0, 5, -50]}>
      <boxGeometry args={[100, 10, 2]} />
      <meshStandardMaterial color="orange" /> {/* Use any color you like */}
    </mesh>
  </>
);

export default Walls;