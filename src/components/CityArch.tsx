// import React, { useMemo } from 'react';
// import * as THREE from 'three';
// import { Text } from '@react-three/drei';

// const ARCH_HEIGHT = 8;
// const ARCH_WIDTH = 12;
// const PILLAR_RADIUS = 0.4;
// const BEAM_HEIGHT = 0.8;
// const BOARD_WIDTH = 8;
// const BOARD_HEIGHT = 2;
// const BOARD_DEPTH = 0.3;

// const CityArch: React.FC<{ position?: [number, number, number] }> = ({
//   position = [0, 0, 0],
// }) => {
//   const archGeometry = useMemo(() => {
//     // Create path for the arch (semi-circle)
//     // This curve defines the main sweep of the arch
//     const curve = new THREE.EllipseCurve(
//       0, 0,         // center of the ellipse
//       10, 5,        // x radius, y radius (makes it elliptical for the main curve)
//       0, Math.PI,   // start, end angle (from 0 to PI for a semi-circle)
//       false,        // clockwise (false for counter-clockwise)
//       0             // rotation (no rotation of the ellipse)
//     );
    
//     // Get points from the 2D curve and convert them to 3D Vector3,
//     // lifting them up by 10 units on the Y-axis to form the arch's height.
//     const points = curve.getPoints(50); // Get 50 points along the curve
//     const path = new THREE.CatmullRomCurve3( // Smooth curve through the points
//       points.map(p => new THREE.Vector3(p.x, p.y + 10, 0))
//     );

//     // Create a circular profile for the arch, which will be extruded along the path.
//     // This gives the "curved cylinder" effect.
//     const cylinderRadius = 0.75; // Defines the thickness of the "cylinder"
//     const shape = new THREE.Shape();
//     // absarc creates a full circle at (0,0) with the given radius
//     shape.absarc(0, 0, cylinderRadius, 0, Math.PI * 2, false);

//     // Extrude settings for the geometry
//     const extrudeSettings = {
//       steps: 100,          // Number of subdivisions along the path
//       bevelEnabled: false, // No beveling for sharp edges
//       extrudePath: path    // The path along which the circular shape is extruded
//     };

//     return new THREE.ExtrudeGeometry(shape, extrudeSettings);
//   }, []);

//   return (
//     <group position={position}>
//       {/* Main arch geometry */}
//       <mesh>
//         <primitive object={archGeometry} attach="geometry" />
//         <meshStandardMaterial 
//           color="#1f233d" // Dark blue-grey color for the arch
//           metalness={0.8}    // High metalness for a metallic look
//           roughness={0.1}    // Low roughness for a reflective surface
//           envMapIntensity={1} // Environment map intensity for reflections (assumes env map is present in parent scene)
//         />
//       </mesh>

//       {/* Support columns - now cylinders */}
//       {/* Position adjusted slightly to align with the main arch and new cylindrical shape */}
//       {/* Height is 15 for consistency with previous request */}
//       <mesh position={[-10, 3, -0.0]}> {/* Y-position adjusted for new height */}
//         <cylinderGeometry args={[0.72, 0.75, 15, 30]} /> {/* radiusTop, radiusBottom, height, radialSegments */}
//         <meshStandardMaterial 
//           color="#1f233d"
//           metalness={0.8}
//           roughness={0.1}
//         />
//       </mesh>
//       <mesh position={[10, 3, -0]}> {/* Y-position adjusted for new height */}
//         <cylinderGeometry args={[0.72, 0.75, 15, 30]} /> {/* radiusTop, radiusBottom, height, radialSegments */}
//         <meshStandardMaterial 
//           color="#1f233d"
//           metalness={0.8}
//           roughness={0.1}
//         />
//       </mesh>

      
      
      
      
//     </group>
//   );
// };

// export default CityArch;
