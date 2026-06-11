import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'


export default function Earth({ position }) {
  const meshRef = useRef()
  const texture = useTexture('/plasma-net/EarthColor.jpg')

  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y += 0.001
  })

  return (
    <group position={position}>
  
  <Sphere ref={meshRef} args={[0.8, 64, 64]}>
    <meshStandardMaterial
      map={texture}
      roughness={0.8}
      metalness={0.0}
    />
  </Sphere>
<Sphere args={[0.87, 64, 64]}>
  <meshStandardMaterial
    color="#4488ff"
    transparent
    opacity={0.12}
    side={THREE.BackSide}
    depthWrite={false}
  />
</Sphere>

<Sphere args={[0.95, 64, 64]}>
  <meshStandardMaterial
    color="#2255cc"
    transparent
    opacity={0.06}
    side={THREE.BackSide}
    depthWrite={false}
  />
</Sphere>
    </group>
  )
}