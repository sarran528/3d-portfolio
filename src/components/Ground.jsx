import React from 'react'

function Ground(props) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} {...props} receiveShadow>
      <circleGeometry args={[20, 70]} />
      <meshStandardMaterial color="#ffb366" />
    </mesh>
  )
}

export default Ground 