import React from 'react';
import { Text } from '@react-three/drei';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 2.5;
const BOARD_DEPTH = 0.3;
const BORDER = 0.15;
const POST_HEIGHT = 6;
const POST_RADIUS = 0.15;

interface CityNameBoardProps {
  name: string;
  position: [number, number, number];
  scale?: [number, number, number];
}

const CityNameBoard: React.FC<CityNameBoardProps> = ({
  name = "SARRAN",
  position = [9, 4, 0],
  scale = [0.4, 0.4, 0.4]
}) => (
  <group position={position} scale={scale}>
    {/* Main white board with realistic material */}
    <mesh 
      position={[0, POST_HEIGHT + BOARD_HEIGHT / 2, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[BOARD_WIDTH, BOARD_HEIGHT, BOARD_DEPTH]} />
      <meshStandardMaterial 
        color="#f8f8f8"
        roughness={0.3}
        metalness={0.0}
      />
    </mesh>

    {/* Subtle shadow/depth behind the main board */}
    <mesh position={[0, POST_HEIGHT + BOARD_HEIGHT / 2, -0.02]}>
      <boxGeometry args={[BOARD_WIDTH + 0.05, BOARD_HEIGHT + 0.05, 0.01]} />
      <meshStandardMaterial color="#e0e0e0" transparent opacity={0.5} />
    </mesh>

    {/* Red border (top) with realistic material */}
    <mesh 
      position={[0, POST_HEIGHT + BOARD_HEIGHT + BORDER / 2, 0]}
      castShadow
    >
      <boxGeometry args={[BOARD_WIDTH + BORDER * 2, BORDER, BOARD_DEPTH + 0.02]} />
      <meshStandardMaterial 
        color="#cc0000"
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>

    {/* Red border (bottom) */}
    <mesh 
      position={[0, POST_HEIGHT - BORDER / 2, 0]}
      castShadow
    >
      <boxGeometry args={[BOARD_WIDTH + BORDER * 2, BORDER, BOARD_DEPTH + 0.02]} />
      <meshStandardMaterial 
        color="#cc0000"
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>

    {/* Red border (left) */}
    <mesh 
      position={[-(BOARD_WIDTH / 2 + BORDER / 2), POST_HEIGHT + BOARD_HEIGHT / 2, 0]}
      castShadow
    >
      <boxGeometry args={[BORDER, BOARD_HEIGHT, BOARD_DEPTH + 0.02]} />
      <meshStandardMaterial 
        color="#cc0000"
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>

    {/* Red border (right) */}
    <mesh 
      position={[(BOARD_WIDTH / 2 + BORDER / 2), POST_HEIGHT + BOARD_HEIGHT / 2, 0]}
      castShadow
    >
      <boxGeometry args={[BORDER, BOARD_HEIGHT, BOARD_DEPTH + 0.02]} />
      <meshStandardMaterial 
        color="#cc0000"
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>

    {/* Post with realistic metal material */}
    <mesh 
      position={[0, POST_HEIGHT / 2, 0]}
      castShadow
      receiveShadow
    >
      <cylinderGeometry args={[POST_RADIUS, POST_RADIUS, POST_HEIGHT, 16]} />
      <meshStandardMaterial 
        color="#888888"
        roughness={0.6}
        metalness={0.8}
      />
    </mesh>

    {/* Post base/foundation */}
    <mesh 
      position={[0, 0.2, 0]}
      receiveShadow
    >
      <cylinderGeometry args={[POST_RADIUS * 1.5, POST_RADIUS * 2, 0.4, 16]} />
      <meshStandardMaterial 
        color="#666666"
        roughness={0.8}
        metalness={0.3}
      />
    </mesh>

    {/* Mounting brackets */}
    <mesh position={[-0.3, POST_HEIGHT + 0.3, 0]}>
      <boxGeometry args={[0.2, 0.3, 0.1]} />
      <meshStandardMaterial 
        color="#555555"
        roughness={0.7}
        metalness={0.9}
      />
    </mesh>
    <mesh position={[0.3, POST_HEIGHT + 0.3, 0]}>
      <boxGeometry args={[0.2, 0.3, 0.1]} />
      <meshStandardMaterial 
        color="#555555"
        roughness={0.7}
        metalness={0.9}
      />
    </mesh>

    {/* Mounting bolts/rivets */}
    {[-0.3, 0.3].map((x, i) => (
      <group key={i}>
        <mesh position={[x, POST_HEIGHT + 0.4, BOARD_DEPTH / 2 + 0.02]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
          <meshStandardMaterial 
            color="#333333"
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[x, POST_HEIGHT + 0.2, BOARD_DEPTH / 2 + 0.02]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
          <meshStandardMaterial 
            color="#333333"
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
      </group>
    ))}

    {/* Subtle frame around the text area */}
    <mesh position={[0, POST_HEIGHT + BOARD_HEIGHT / 2, BOARD_DEPTH / 2 + 0.01]}>
      <boxGeometry args={[BOARD_WIDTH - 0.5, BOARD_HEIGHT - 0.5, 0.02]} />
      <meshStandardMaterial 
        color="#f0f0f0"
        roughness={0.2}
        metalness={0.0}
      />
    </mesh>

    {/* Name text with better typography */}
    <Text
      position={[0, POST_HEIGHT + BOARD_HEIGHT / 2, BOARD_DEPTH / 2 + 0.03]}
      fontSize={0.8}
      color="#1a1a1a"
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.05}
      outlineWidth={0.01}
      outlineColor="#ffffff"
    >
      {name}
    </Text>

    {/* Subtle reflection/highlight on the board */}
    <mesh 
      position={[0, POST_HEIGHT + BOARD_HEIGHT * 0.8, BOARD_DEPTH / 2 + 0.005]}
      rotation={[0, 0, 0]}
    >
      <boxGeometry args={[BOARD_WIDTH - 1, 0.3, 0.001]} />
      <meshStandardMaterial 
        color="#ffffff"
        transparent
        opacity={0.1}
        roughness={0.0}
        metalness={0.0}
      />
    </mesh>

    {/* Weather staining/aging effects */}
    <mesh position={[0, POST_HEIGHT - 0.1, BOARD_DEPTH / 2 + 0.001]}>
      <boxGeometry args={[BOARD_WIDTH + 0.3, 0.05, 0.001]} />
      <meshStandardMaterial 
        color="#d0d0d0"
        transparent
        opacity={0.3}
      />
    </mesh>
  </group>
);

export default CityNameBoard;