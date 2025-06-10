import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Checkpoint({ position = [0, 0, 0], color = '#00eaff' }) {
  const group = useRef()
  const beamRef = useRef()
  const ringRef = useRef()

  // Animate the beam and ring for a glowing effect
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (beamRef.current) {
      beamRef.current.material.opacity = 0.35 + 0.15 * Math.sin(t * 2)
    }
    if (ringRef.current) {
      ringRef.current.material.opacity = 0.8 + 0.2 * Math.sin(t * 3)
      ringRef.current.scale.setScalar(1 + 0.04 * Math.sin(t * 2))
    }
  })

  return (
    <group ref={group} position={position}>
      {/* Glowing ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
      >
        <torusGeometry args={[1.2, 0.13, 32, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={1}
        />
      </mesh>
      {/* Vertical glowing beam */}
      <mesh ref={beamRef} position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 3, 32, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export default Checkpoint