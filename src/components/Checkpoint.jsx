import React from 'react'

function Checkpoint({ position = [0, 0, 0], color = '#4fc3f7', ...props }) {
  return (
    <mesh position={position} {...props} castShadow>
      <cylinderGeometry args={[1, 1, 0.2, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default Checkpoint 