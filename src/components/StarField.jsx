import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function StarField() {
  const starsRef = useRef()
  const milkyWayRef = useRef()

  const starData = useMemo(() => {
    const count = 12000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    const starColors = [
      { color: new THREE.Color('#ffffff'), weight: 40 }, 
      { color: new THREE.Color('#c8d8ff'), weight: 25 }, 
      { color: new THREE.Color('#fff4d0'), weight: 20 }, 
      { color: new THREE.Color('#aac8ff'), weight: 10 }, 
      { color: new THREE.Color('#ffd090'), weight: 4  }, 
      { color: new THREE.Color('#ff9966'), weight: 1  },
    ]

    const pool = []
    starColors.forEach(({ color, weight }) => {
      for (let w = 0; w < weight; w++) pool.push(color)
    })

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 280 + Math.random() * 60

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      const c = pool[Math.floor(Math.random() * pool.length)]
      const brightness = 0.5 + Math.random() * 0.5
      colors[i * 3]     = c.r * brightness
      colors[i * 3 + 1] = c.g * brightness
      colors[i * 3 + 2] = c.b * brightness

  
      const rand = Math.random()
      if (rand > 0.998) sizes[i] = 4.5      
      else if (rand > 0.993) sizes[i] = 2.8  
      else if (rand > 0.97)  sizes[i] = 1.6  
      else if (rand > 0.75)  sizes[i] = 0.9  
      else sizes[i] = 0.4                    
    }

    return { positions, colors, sizes, count }
  }, [])

  const milkyWayData = useMemo(() => {
    const count = 18000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2

      const bandSpread = 0.18
      const gaussian = () => {
        let u = 0, v = 0
        while (u === 0) u = Math.random()
        while (v === 0) v = Math.random()
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
      }
      const phi = Math.PI / 2 + gaussian() * bandSpread
      const warpedPhi = phi
        + Math.sin(theta * 1.5 + 0.8) * 0.12
        + Math.sin(theta * 3.2) * 0.04

      const r = 270 + Math.random() * 60

      positions[i * 3]     = r * Math.sin(warpedPhi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(warpedPhi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(warpedPhi)

      const coreAngle = Math.abs(Math.atan2(
        positions[i * 3 + 1],
        positions[i * 3]
      ))
      const isCore = coreAngle < 0.6 || coreAngle > Math.PI - 0.6
      
      if (isCore) {
        colors[i * 3]     = 0.92 + Math.random() * 0.08
        colors[i * 3 + 1] = 0.82 + Math.random() * 0.12
        colors[i * 3 + 2] = 0.55 + Math.random() * 0.2
      } else {
        colors[i * 3]     = 0.75 + Math.random() * 0.25
        colors[i * 3 + 1] = 0.80 + Math.random() * 0.20
        colors[i * 3 + 2] = 0.90 + Math.random() * 0.10
      }
      const rand = Math.random()
      if (rand > 0.96) sizes[i] = 1.2
      else if (rand > 0.80) sizes[i] = 0.6
      else sizes[i] = 0.25
    }

    return { positions, colors, sizes, count }
  }, [])

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.003
    }
    if (milkyWayRef.current) {
      milkyWayRef.current.rotation.y = state.clock.elapsedTime * 0.003
    }
  })

  return (
    <>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={starData.count} array={starData.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color"    count={starData.count} array={starData.colors}    itemSize={3} />
          <bufferAttribute attach="attributes-size"     count={starData.count} array={starData.sizes}     itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={1.0}
          vertexColors
          transparent
          opacity={1.0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={milkyWayRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={milkyWayData.count} array={milkyWayData.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color"    count={milkyWayData.count} array={milkyWayData.colors}    itemSize={3} />
          <bufferAttribute attach="attributes-size"     count={milkyWayData.count} array={milkyWayData.sizes}     itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          vertexColors
          transparent
          opacity={0.45}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}