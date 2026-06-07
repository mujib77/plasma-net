import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Sun({ position }) {
  const meshRef = useRef()
  const texture = useTexture(
    '/2k_sun.jpg'
  )

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          map={texture}
          emissive="#ff4400"
          emissiveIntensity={2}
          emissiveMap={texture}
        />
      </Sphere>

      <Sphere args={[1.1, 32, 32]}>
        <meshStandardMaterial
          color="#ff6600"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      <Sphere args={[1.4, 32, 32]}>
        <meshStandardMaterial
          color="#ff4400"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  )
}