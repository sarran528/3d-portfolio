import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'

function Ground(props) {
  // Memoize the geometry with gentle bumps
  const geometry = useMemo(() => {
    const geo = new THREE.CircleGeometry(20, 70)
    for (let i = 0; i < geo.attributes.position.count; i++) {
      const x = geo.attributes.position.getX(i)
      const y = geo.attributes.position.getY(i)
      // 30% of previous bump intensity
      const bump = (Math.sin(x * 2) * Math.cos(y * 2) * 0.5 + Math.random() * 0.2) * 0.3
      geo.attributes.position.setZ(i, bump)
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

export default Ground