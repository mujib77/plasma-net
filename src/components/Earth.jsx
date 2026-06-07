import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

export default function Earth({ position }) {
  const meshRef = useRef()
  const texture = useTexture(
    '/EarthColor.jpg'
  )

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.8, 64, 64]}>
        <meshStandardMaterial map={texture} />
      </Sphere>
      <Sphere args={[0.85, 32, 32]}>
        <meshStandardMaterial
          color="#4488ff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  )
}