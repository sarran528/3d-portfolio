import React, { useMemo } from 'react'
import * as THREE from 'three'

function Ground(props) {
  const geometry = useMemo(() => {
    const geo = new THREE.CircleGeometry(35, 70)

    const customBumps = [
      // Depths
      { x: rand(), y: rand(), radius: 6, height: -2.5 }, // 1 large depth
      { x: rand(), y: rand(), radius: 3, height: -1.2 }, // small depth 1
      { x: rand(), y: rand(), radius: 3, height: -1.0 }, // small depth 2

      // Bumps
      { x: rand(), y: rand(), radius: 5, height: 2.5 }, // large bump
      { x: rand(), y: rand(), radius: 2.5, height: 0.8 }, // small bump 1
      { x: rand(), y: rand(), radius: 2.5, height: 0.9 }, // small bump 2
      { x: rand(), y: rand(), radius: 2.5, height: 1.0 }  // small bump 3
    ]

    for (let i = 0; i < geo.attributes.position.count; i++) {
      const x = geo.attributes.position.getX(i)
      const y = geo.attributes.position.getY(i)
      let z = 0

      for (const bump of customBumps) {
        const dx = x - bump.x
        const dy = y - bump.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < bump.radius) {
          const falloff = Math.cos((dist / bump.radius) * Math.PI) * 0.5 + 0.5
          z += bump.height * falloff
        }
      }

      geo.attributes.position.setZ(i, z)
    }

    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} {...props} receiveShadow geometry={geometry}>
      <meshStandardMaterial color="#ffb366" />
    </mesh>
  )
}

function rand() {
  return (Math.random() - 0.5) * 70 // X or Y within the circle's diameter
}

export default Ground
