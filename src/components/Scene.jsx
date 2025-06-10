import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import Ground from './Ground'
import Car from './Car'
import Checkpoint from './Checkpoint'
import checkpoints from './CheckpointsData'
import useCarControls from '../hooks/useCarControls'
import BoundaryWall from './BoundaryWall'

const SPEED = 0.15
const TURN_SPEED = 0.04

function Scene() {
  const carRef = useRef()
  const controls = useCarControls()
  const carState = useRef({
    position: { x: 0, z: 0 },
    rotation: 0,
  })
  const { camera } = useThree()

  useEffect(() => {
    camera.lookAt(8, 0, 0) // Match the center of the plane
  }, [])

  useFrame(() => {
    if (carRef.current) {
      // Car movement logic
      if (controls.forward) {
        carState.current.position.x += Math.sin(carState.current.rotation) * SPEED
        carState.current.position.z += Math.cos(carState.current.rotation) * SPEED
      }
      if (controls.backward) {
        carState.current.position.x -= Math.sin(carState.current.rotation) * SPEED
        carState.current.position.z -= Math.cos(carState.current.rotation) * SPEED
      }
      if (controls.left) {
        carState.current.rotation += TURN_SPEED
      }
      if (controls.right) {
        carState.current.rotation -= TURN_SPEED
      }
      carRef.current.position.x = carState.current.position.x
      carRef.current.position.z = carState.current.position.z
      carRef.current.position.y = -1.5
      carRef.current.rotation.y = carState.current.rotation
    }
  })

  return (
    <group>
      <Ground />
      <BoundaryWall carRef={carRef} carState={carState} />
      <Car ref={carRef} />
      {checkpoints.map((cp, i) => (
        <Checkpoint key={i} position={cp.position} color={cp.color} />
      ))}
    </group>
  )
}

export default Scene