import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface RainbowButtonProps {
  position: [number, number, number];
  text: string;
  onClick: () => void;
}

const RainbowButton: React.FC<RainbowButtonProps> = ({ position, text, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Animate emissive color for a subtle rainbow effect
  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Cycle through hues from 0 to 1 over time to create a color shift
      const hue = (clock.getElapsedTime() * 0.05) % 1;
      // Set the emissive color using HSL (Hue, Saturation, Lightness)
      // Full saturation (1) and moderate lightness (0.4) for vibrancy
      materialRef.current.emissive.setHSL(hue, 1, 0.4);
      materialRef.current.needsUpdate = true; // Tell Three.js to update the material
    }
  });

  return (
    <group
      position={position}
      // Event handlers for hover effects
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      // Click handler for the button
      onClick={onClick}
    >
      {/* Button Body - a 3D box */}
      <mesh
        ref={meshRef}
        // Scale the button slightly on hover for visual feedback
        scale={hovered ? 1.05 : 1}
        castShadow // Button can cast shadows
        receiveShadow // Button can receive shadows
      >
        <boxGeometry args={[4, 1.5, 0.5]} /> {/* Dimensions: width, height, depth */}
        <meshStandardMaterial
          ref={materialRef}
          // Base color changes on hover, providing a slight visual cue
          color={hovered ? '#E6A820' : '#8A8A8A'}
          metalness={1} // Makes the material fully metallic
          roughness={0.2} // Makes the surface slightly rough, allowing for reflections
          envMapIntensity={1} // Controls the intensity of environment map reflections
        />
      </mesh>

      {/* Button Text */}
      <Text
        position={[0, 0, 0.26]} // Position text slightly in front of the button surface
        fontSize={0.8}
        color="black"
        anchorX="center" // Center the text horizontally
        anchorY="middle" // Center the text vertically
        // The 'font' prop has been removed here.
        // This will make @react-three/drei's Text component use its default font.
        // If you wish to use a custom font, ensure that your font file (e.g., Inter-Bold.ttf)
        // is valid and correctly located in your `public/fonts/` directory.
        // Example: font="/fonts/Inter-Bold.ttf"
      >
        {text}
      </Text>
    </group>
  );
};

export default RainbowButton;
