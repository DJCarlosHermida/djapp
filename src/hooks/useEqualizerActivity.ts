import { useEffect, useRef, useState } from 'react'
import { IDLE_TIMEOUT_MS, THROTTLE_MS } from '../data'

export function useEqualizerActivity() {
  const [equalizerActive, setEqualizerActive] = useState(false)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTriggerRef = useRef(0)

  const startIdleOffTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => setEqualizerActive(false), IDLE_TIMEOUT_MS)
  }

  const onActivity = (skipThrottle = false) => {
    const now = Date.now()
    if (!skipThrottle && now - lastTriggerRef.current < THROTTLE_MS) return
    lastTriggerRef.current = now
    setEqualizerActive(true)
    startIdleOffTimer()
  }

  useEffect(() => {
    const onMouseMove = () => onActivity(false)
    const onClick = () => onActivity(true)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onClick)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  return equalizerActive
}
