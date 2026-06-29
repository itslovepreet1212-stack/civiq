import { useState, useEffect, useMemo } from 'react'

export function usePoints() {
  const [points, setPoints] = useState(() => {
    return parseInt(localStorage.getItem('nagarai_points') || '0')
  })

  const badge = useMemo(() => {
    if (points >= 100) return '🏆 City Champion'
    if (points >= 50) return '🏅 Community Hero'
    if (points >= 20) return '⭐ Active Citizen'
    return '🌱 Contributor'
  }, [points])

  useEffect(() => {
    localStorage.setItem('nagarai_points', points.toString())
  }, [points])

  const addPoints = (amount) => setPoints(prev => prev + amount)

  return { points, badge, addPoints }
}