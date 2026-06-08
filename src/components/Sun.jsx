import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture} from '@react-three/drei'
import * as THREE from 'three'

function createGlowTexture(color1, color2) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(0.3, color2)
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(canvas)
}

export default function Sun({ position }) {
  const meshRef = useRef()
  const innerGlowRef = useRef()
  const outerGlowRef = useRef()
  const texture = useTexture('/2k_sun.jpg')

  const innerGlowTex = createGlowTexture('rgba(255,200,50,0.8)', 'rgba(255,100,0,0.3)')
  const outerGlowTex = createGlowTexture('rgba(255,80,0,0.4)', 'rgba(200,30,0,0.1)')

  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002
    if (outerGlowRef.current) {
      const s = 3.8 + Math.sin(state.clock.elapsedTime * 1.2) * 0.15
      outerGlowRef.current.scale.set(s, s, s)
    }
    if (innerGlowRef.current) {
      const s = 2.6 + Math.sin(state.clock.elapsedTime * 2.1) * 0.08
      innerGlowRef.current.scale.set(s, s, s)
    }
  })

  return (
    <group position={position}>
      <sprite ref={outerGlowRef} scale={[3.8, 3.8, 3.8]}>
        <spriteMaterial map={outerGlowTex} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite ref={innerGlowRef} scale={[2.6, 2.6, 2.6]}>
        <spriteMaterial map={innerGlowTex} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshStandardMaterial map={texture} emissive="#ff6600" emissiveIntensity={2} emissiveMap={texture} />
      </Sphere>
    </group>
  )
}