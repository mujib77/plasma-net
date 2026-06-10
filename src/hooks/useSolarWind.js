import { useState, useEffect } from 'react'

export default function useSolarWind() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/solar')
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error('solar fetch failed:', e)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  return data
}