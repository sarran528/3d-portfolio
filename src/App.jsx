import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import Scene from './components/Scene'
import './App.css'

function App() {
  return (
    <div className="app">
      <Canvas
        camera={{
          position: [50, 36, 30],
          fov: 20,
          near: 0.1,
          far: 1000
        }}
      >
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls
            target={[8, -1.5, 0]}
            minDistance={10}
            maxDistance={60}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
