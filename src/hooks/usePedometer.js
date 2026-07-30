import { useEffect, useRef, useState } from 'react'

const PEAK_OFFSET = 1.3
const VALLEY_OFFSET = 0.5
const MIN_STEP_INTERVAL_MS = 280
const SMOOTHING = 0.9

export function usePedometer(onStep) {
  const [supported] = useState(() => typeof window !== 'undefined' && 'DeviceMotionEvent' in window)
  const [permission, setPermission] = useState('unknown')
  const [active, setActive] = useState(false)

  const onStepRef = useRef(onStep)
  onStepRef.current = onStep

  const detectorRef = useRef({ waitingForPeak: false, lastStepAt: 0, smoothed: 9.81 })
  const handlerRef = useRef(null)

  useEffect(() => {
    handlerRef.current = (event) => {
      const acc = event.accelerationIncludingGravity
      if (!acc || acc.x == null) return
      const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2)
      const d = detectorRef.current
      d.smoothed = d.smoothed * SMOOTHING + magnitude * (1 - SMOOTHING)

      if (!d.waitingForPeak && magnitude > d.smoothed + PEAK_OFFSET) {
        d.waitingForPeak = true
      } else if (d.waitingForPeak && magnitude < d.smoothed - VALLEY_OFFSET) {
        const now = Date.now()
        if (now - d.lastStepAt > MIN_STEP_INTERVAL_MS) {
          d.lastStepAt = now
          onStepRef.current?.()
        }
        d.waitingForPeak = false
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (handlerRef.current) window.removeEventListener('devicemotion', handlerRef.current)
    }
  }, [])

  async function start() {
    if (!supported) return
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const result = await DeviceMotionEvent.requestPermission()
        setPermission(result)
        if (result !== 'granted') return
      } catch {
        setPermission('denied')
        return
      }
    } else {
      setPermission('granted')
    }
    window.addEventListener('devicemotion', handlerRef.current)
    setActive(true)
  }

  function stop() {
    if (handlerRef.current) window.removeEventListener('devicemotion', handlerRef.current)
    setActive(false)
  }

  return { supported, permission, active, start, stop }
}
