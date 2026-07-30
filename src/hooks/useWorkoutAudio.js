import { useEffect, useRef, useState } from 'react'
import { playTick, playPhaseEnd, startMusic, stopMusic } from '../utils/audio.js'

export function useWorkoutAudio() {
  const [musicOn, setMusicOn] = useState(false)
  const musicOnRef = useRef(musicOn)
  musicOnRef.current = musicOn

  useEffect(() => {
    return () => stopMusic()
  }, [])

  function toggleMusic() {
    setMusicOn((prev) => {
      const next = !prev
      if (next) startMusic()
      else stopMusic()
      return next
    })
  }

  return {
    musicOn,
    toggleMusic,
    tick: playTick,
    phaseEnd: playPhaseEnd,
  }
}
