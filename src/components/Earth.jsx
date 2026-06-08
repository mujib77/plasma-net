import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function createAtmosTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(128, 128, 80, 128, 128, 128)
  gradient.addColorStop(0, 'rgba(0,0,0,0)')
  gradient.addColorStop(0.7, 'rgba(50,120,255,0.15)')
  gradient.addColorStop(0.85, 'rgba(80,160,255,0.35)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(canvas)
}

export default function Earth({ position }) {
  const meshRef = useRef()
  const atmosRef = useRef()
  const texture = useTexture('/EarthColor.jpg')
  const atmosTex = createAtmosTexture()

  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y += 0.001
    if (atmosRef.current) {
      const s = 1.9 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02
      atmosRef.current.scale.set(s, s, s)
    }
  })

  return (
    <group position={position}>
      <sprite ref={atmosRef} scale={[1.9, 1.9, 1.9]}>
        <spriteMaterial map={atmosTex} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <Sphere ref={meshRef} args={[0.8, 64, 64]}>
        <meshStandardMaterial map={texture} roughness={0.8} metalness={0.0} />
      </Sphere>
    </group>
  )
}