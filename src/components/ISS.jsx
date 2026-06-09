import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  )
}

function createISSGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
gradient.addColorStop(0,   'rgba(255, 255, 255, 1.0)')
gradient.addColorStop(0.15, 'rgba(100, 220, 255, 1.0)')
gradient.addColorStop(0.4, 'rgba(0, 150, 255, 0.6)')
gradient.addColorStop(0.7, 'rgba(0, 80, 255, 0.2)')
gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0)')
ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

export default function ISS({ earthPosition = [3.5, 0, 0], onData }) {
  const issRef = useRef()
  const glowRef = useRef()
  const [issData, setIssData] = useState(null)
  const targetPos = useRef(new THREE.Vector3())
  const currentPos = useRef(new THREE.Vector3())
  const glowTex = createISSGlowTexture()

  useEffect(() => {
    const fetchISS = async () => {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544')
        const data = await res.json()
        setIssData(data)
        onData(data)  
        console.log('ISS position:', data.latitude, data.longitude)
        const pos = latLngToVector3(data.latitude, data.longitude, 0.95)
        targetPos.current.copy(pos)
      } catch (e) {
        console.error('ISS fetch failed:', e)
      }
    }

    fetchISS()
    const interval = setInterval(fetchISS, 5000)
    return () => clearInterval(interval)
  }, [])

  useFrame(() => {
    if (!issRef.current) {
        issRef.current.rotation.y += 0.01
    }
    currentPos.current.lerp(targetPos.current, 0.02)

    const ep = earthPosition
    issRef.current.position.set(
      ep[0] + currentPos.current.x,
      ep[1] + currentPos.current.y,
      ep[2] + currentPos.current.z
    )

    if (glowRef.current) {
      glowRef.current.position.copy(issRef.current.position)
      const s = 0.15 + Math.sin(Date.now() * 0.005) * 0.02
      glowRef.current.scale.set(s, s, s)
    }
  })


  return (
    <>
<group ref={issRef}>
  <mesh>
    <boxGeometry args={[0.07, 0.008, 0.008]} />
    <meshStandardMaterial color="#dddddd" emissive="#ffffff" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
  </mesh>
  <mesh>
    <boxGeometry args={[0.02, 0.012, 0.012]} />
    <meshStandardMaterial color="#cccccc" emissive="#ffffff" emissiveIntensity={0.2} metalness={0.7} roughness={0.3} />
  </mesh>
  <mesh position={[-0.04, 0, 0.022]}>
    <boxGeometry args={[0.035, 0.001, 0.018]} />
    <meshStandardMaterial color="#1a2a88" emissive="#2244ff" emissiveIntensity={0.4} />
  </mesh>
  <mesh position={[0.04, 0, 0.022]}>
    <boxGeometry args={[0.035, 0.001, 0.018]} />
    <meshStandardMaterial color="#1a2a88" emissive="#2244ff" emissiveIntensity={0.4} />
  </mesh>
  <mesh position={[-0.04, 0, -0.022]}>
    <boxGeometry args={[0.035, 0.001, 0.018]} />
    <meshStandardMaterial color="#1a2a88" emissive="#2244ff" emissiveIntensity={0.4} />
  </mesh>
  <mesh position={[0.04, 0, -0.022]}>
    <boxGeometry args={[0.035, 0.001, 0.018]} />
    <meshStandardMaterial color="#1a2a88" emissive="#2244ff" emissiveIntensity={0.4} />
  </mesh>
</group>

<sprite scale={[0.35, 0.35, 0.35]}>
  <spriteMaterial
    map={glowTex}
    transparent
    blending={THREE.AdditiveBlending}
    depthWrite={false}
    opacity={0.4}
  />
</sprite>

<sprite ref={glowRef} scale={[0.18, 0.18, 0.18]}>
  <spriteMaterial
    map={glowTex}
    transparent
    blending={THREE.AdditiveBlending}
    depthWrite={false}
  />
</sprite>
    </>
  )
}
