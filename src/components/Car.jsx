import React from 'react'
import { useGLTF } from '@react-three/drei'

function Car(props) {
  const { scene } = useGLTF('/models/car.glb')
  return <primitive object={scene} scale={1.5} {...props} />
}

export default Car 