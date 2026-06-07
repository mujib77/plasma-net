import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Suspense } from 'react'
import Sun from './components/Sun'
import Earth from './components/Earth'
import HUD from './components/HUD'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      
      <HUD />

      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <EffectComposer>
         <Bloom
          intensity={1.5}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
       />
     </EffectComposer>
        <ambientLight intensity={0.3} />
        <pointLight position={[-3, 0, 0]} intensity={3} color="#ff8800" distance={20} />
        <directionalLight
          position={[-5, 0, 0]}
          intensity={2}
          colors='ffffff'
        />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          fade
          speed={0.5}
        />

        <Suspense fallback={null}>
          <Sun position={[-3, 0, 0]} />
          <Earth position={[3, 0, 0]} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={20}
        />
      </Canvas>
    </div>
  )
}