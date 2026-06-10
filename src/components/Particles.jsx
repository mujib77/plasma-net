import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SolarWind({ solarWind, sunPosition = [-3, 0, 0], earthPosition = [3.5, 0, 0] }) {
  const particlesRef = useRef()

  const COUNT = 1500

  const { positions, velocities, lifetimes } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const velocities = new Float32Array(COUNT)
    const lifetimes = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = sunPosition[0] + (Math.random() - 0.5) * 0.5
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8
      velocities[i] = 0.5 + Math.random() * 0.5
      lifetimes[i] = Math.random() 
    }

    return { positions, velocities, lifetimes }
  }, [])

useFrame((state, delta) => {
  if (!particlesRef.current) return

  const pos = particlesRef.current.geometry.attributes.position.array
  const speed = solarWind ? (solarWind.speed / 400) : 0.8

  for (let i = 0; i < COUNT; i++) {
    lifetimes[i] += delta * speed * velocities[i] * 0.4

    const t = lifetimes[i] % 1

    const spreadY = (Math.sin(i * 2.3) * 0.8) * (1 - t * 0.6)
    const spreadZ = (Math.cos(i * 1.7) * 0.8) * (1 - t * 0.6)

    pos[i * 3]     = sunPosition[0] + (earthPosition[0] - sunPosition[0]) * t
    pos[i * 3 + 1] = spreadY * (1 - t) + (Math.random() - 0.5) * 0.05
    pos[i * 3 + 2] = spreadZ * (1 - t) + (Math.random() - 0.5) * 0.05
  }

  particlesRef.current.geometry.attributes.position.needsUpdate = true

  const speed2 = solarWind ? solarWind.speed : 400
  let color
  if (speed2 > 600)      color = new THREE.Color('#ff4400')
  else if (speed2 > 500) color = new THREE.Color('#ffaa00')
  else if (speed2 > 400) color = new THREE.Color('#ffff44')
  else                   color = new THREE.Color('#4488ff')

  particlesRef.current.material.color = color
})

  const opacity = solarWind ? Math.min(0.8, (solarWind.speed / 400) * 0.6) : 0.4

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#ffaa00"
      />
    </points>
  )
}