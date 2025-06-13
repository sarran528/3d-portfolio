import React from 'react';
import { Text } from '@react-three/drei';

const ARCH_WIDTH = 20;
const ARCH_HEIGHT = 10;
const ARCH_DEPTH = 2;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 2;
const BOARD_DEPTH = 0.5;

const CityArch: React.FC<{ name?: string; position?: [number, number, number] }> = ({
  name = "My City",
  position = [0, 0, 0],
}) => (
  <group position={position}>
    {/* Arch sides */}
    <mesh position={[-ARCH_WIDTH / 2 + ARCH_DEPTH / 2, ARCH_HEIGHT / 2, 0]}>
      <boxGeometry args={[ARCH_DEPTH, ARCH_HEIGHT, ARCH_DEPTH]} />
      <meshStandardMaterial color="#bdbdbd" />
    </mesh>
    <mesh position={[ARCH_WIDTH / 2 - ARCH_DEPTH / 2, ARCH_HEIGHT / 2, 0]}>
      <boxGeometry args={[ARCH_DEPTH, ARCH_HEIGHT, ARCH_DEPTH]} />
      <meshStandardMaterial color="#bdbdbd" />
    </mesh>
    {/* Arch top */}
    <mesh position={[0, ARCH_HEIGHT, 0]}>
      <boxGeometry args={[ARCH_WIDTH, ARCH_DEPTH, ARCH_DEPTH]} />
      <meshStandardMaterial color="#bdbdbd" />
    </mesh>
    {/* Name board */}
    <mesh position={[0, ARCH_HEIGHT - BOARD_HEIGHT, ARCH_DEPTH]}>
      <boxGeometry args={[BOARD_WIDTH, BOARD_HEIGHT, BOARD_DEPTH]} />
      <meshStandardMaterial color="#1976d2" />
    </mesh>
    {/* Name text */}
    <Text
      position={[0, ARCH_HEIGHT - BOARD_HEIGHT, ARCH_DEPTH + 0.3]}
      fontSize={1}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      {name}
    </Text>
  </group>
);

export default CityArch;