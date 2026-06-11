import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState } from 'react'  // ← add useState
import Sun from './components/Sun'
import Earth from './components/Earth'
import ISS from './components/ISS'
import HUD from './components/HUD'
import StarField from './components/StarField'
import useSolarWind from './hooks/useSolarWind'
import SolarWind from './components/Particles'
import Asteroids from './components/Asteroids'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

export default function App() {
  const [issData, setIssData] = useState(null) 
  const solarWind = useSolarWind() 
  const [asteroidsData, setAsteroidsData] = useState(null)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <HUD issData={issData} solarWind={solarWind} asteroidsData={asteroidsData} />  
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ position: 'absolute', top: 0, left: 0 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[-4, 0, 0]} intensity={2} color="#ff8800" distance={25} />
        <directionalLight position={[-5, 2, 0]} intensity={2} color="#ffffff" />
        <StarField />
        <Suspense fallback={null}>
          <Sun position={[-3, 0, 0]} />
        </Suspense>
        <Suspense fallback={null}>
          <Earth position={[3.5, 0, 0]} />
        </Suspense>
        <SolarWind solarWind={solarWind} sunPosition={[-3, 0, 0]} earthPosition={[3.5, 0, 0]} />
        <ISS earthPosition={[3.5, 0, 0]} onData={setIssData} /> 
        <Asteroids earthPosition={[3.5, 0, 0]} onData={setAsteroidsData} />
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.3} luminanceSmoothing={0.9} />
        </EffectComposer>
        <OrbitControls enablePan={false} minDistance={3} maxDistance={20} />
      </Canvas>
    </div>
  )
}