// import React from 'react';
// import { Text } from '@react-three/drei';

// const BOARD_WIDTH = 10;
// const BOARD_HEIGHT = 2.5;
// const BOARD_DEPTH = 0.3;
// const BORDER = 0.2;
// const POST_HEIGHT = 6;
// const POST_RADIUS = 0.15;

// const CityNameBoard = ({
//   name = "SARRAN",
//   position = [0, 0, 0],
// }: {
//   name?: string;
//   position?: [number, number, number];
// }) => (
//   <group position={position}>
//     {/* Main white board */}
//     <mesh position={[0, POST_HEIGHT + BOARD_HEIGHT / 2, 0]}>
//       <boxGeometry args={[BOARD_WIDTH, BOARD_HEIGHT, BOARD_DEPTH]} />
//       <meshStandardMaterial color="white" />
//     </mesh>
//     {/* Red border (top) */}
//     <mesh position={[0, POST_HEIGHT + BOARD_HEIGHT + BORDER / 2, 0]}>
//       <boxGeometry args={[BOARD_WIDTH + BORDER * 2, BORDER, BOARD_DEPTH + BORDER]} />
//       <meshStandardMaterial color="red" />
//     </mesh>
//     {/* Red border (bottom) */}
//     <mesh position={[0, POST_HEIGHT - BORDER / 2, 0]}>
//       <boxGeometry args={[BOARD_WIDTH + BORDER * 2, BORDER, BOARD_DEPTH + BORDER]} />
//       <meshStandardMaterial color="red" />
//     </mesh>
//     {/* Red border (left) */}
//     <mesh position={[-(BOARD_WIDTH / 2 + BORDER / 2), POST_HEIGHT + BOARD_HEIGHT / 2, 0]}>
//       <boxGeometry args={[BORDER, BOARD_HEIGHT, BOARD_DEPTH + BORDER]} />
//       <meshStandardMaterial color="red" />
//     </mesh>
//     {/* Red border (right) */}
//     <mesh position={[(BOARD_WIDTH / 2 + BORDER / 2), POST_HEIGHT + BOARD_HEIGHT / 2, 0]}>
//       <boxGeometry args={[BORDER, BOARD_HEIGHT, BOARD_DEPTH + BORDER]} />
//       <meshStandardMaterial color="red" />
//     </mesh>
//     {/* Post */}
//     <mesh position={[0, POST_HEIGHT / 2, 0]}>
//       <cylinderGeometry args={[POST_RADIUS, POST_RADIUS, POST_HEIGHT, 16]} />
//       <meshStandardMaterial color="#bdbdbd" />
//     </mesh>
//     {/* Name text */}
//     <Text
//       position={[0, POST_HEIGHT + BOARD_HEIGHT / 2, BOARD_DEPTH / 2 + 0.05]}
//       fontSize={1}
//       color="black"
//       anchorX="center"
//       anchorY="middle"
//     >
//       {name}
//     </Text>
//   </group>
// );

// export default CityNameBoard;