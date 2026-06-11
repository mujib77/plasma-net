import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function createAsteroidGlow(color) {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, color)
  gradient.addColorStop(0.3, color.replace('1.0', '0.6'))
  gradient.addColorStop(0.6, color.replace('1.0', '0.15'))
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

const hazardTex = createAsteroidGlow('rgba(255,60,60,1.0)')
const safeTex = createAsteroidGlow('rgba(60,255,120,1.0)')

export default function Asteroids({ earthPosition = [3.5, 0, 0], onData }) {
  const [asteroids, setAsteroids] = useState([])
  const groupRef = useRef()

  useEffect(() => {
    const fetch2 = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const res = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=DEMO_KEY`
        )
        const data = await res.json()
        const neos = data.near_earth_objects[today] || []

        const parsed = neos.slice(0, 12).map((neo, i) => {
          const hazardous = neo.is_potentially_hazardous_asteroid
          const dia = neo.estimated_diameter.kilometers.estimated_diameter_max
          const dist = parseFloat(neo.close_approach_data[0].miss_distance.lunar)

          const angle = (i / 12) * Math.PI * 2
          const radius = 1.4 + (dist / 100) * 0.4
          const spread = (Math.random() - 0.5) * 0.6

          return {
            id: neo.id,
            name: neo.name.replace('(', '').replace(')', ''),
            hazardous,
            dia,
            dist: Math.round(dist),
            x: earthPosition[0] + Math.cos(angle) * radius,
            y: earthPosition[1] + spread,
            z: earthPosition[2] + Math.sin(angle) * radius * 0.4,
            size: Math.max(0.035, Math.min(0.08, dia * 0.04))
          }
        })

     setAsteroids(parsed)
        if (onData) onData({
         hazardous: parsed.filter(a => a.hazardous).length,
         safe: parsed.filter(a => !a.hazardous).length,
         total: parsed.length
        })

      } catch (e) {
        console.error('NEO fetch failed:', e)
      }
    }

    fetch2()
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0008
    }
  })

  if (asteroids.length === 0) return null

  return (
    <group ref={groupRef}>
      {asteroids.map((ast) => (
        <sprite
          key={ast.id}
          position={[ast.x, ast.y, ast.z]}
          scale={[ast.size * 4, ast.size * 4, ast.size * 4]}
        >
          <spriteMaterial
            map={ast.hazardous ? hazardTex : safeTex}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  )
}