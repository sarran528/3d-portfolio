import React from 'react'
import { useFrame } from '@react-three/fiber'

// This component does NOT render any mesh, but restricts the car's position
function BoundaryWall({ carRef, carState, radius = 35 }) {
  useFrame(() => {
    if (carRef?.current && carState?.current) {
      const x = carRef.current.position.x
      const z = carRef.current.position.z
      const dist = Math.sqrt(x * x + z * z)
      if (dist > radius) {
        // Clamp the car to the edge of the circle, just inside the wall
        const angle = Math.atan2(z, x)
        const clampX = Math.cos(angle) * (radius - 0.5) // 0.5 buffer so car doesn't overlap
        const clampZ = Math.sin(angle) * (radius - 0.5)
        // Clamp mesh
        carRef.current.position.x = clampX
        carRef.current.position.z = clampZ
        // Clamp state
        carState.current.position.x = clampX
        carState.current.position.z = clampZ
      }
    }
  })
  return null // No visible mesh
}

export default BoundaryWall 