let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function playTone({ freq = 880, duration = 0.15, gain = 0.2, type = 'sine', delay = 0 } = {}) {
  const audioCtx = getCtx()
  const osc = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()
  osc.type = type
  osc.frequency.value = freq
  const startTime = audioCtx.currentTime + delay
  gainNode.gain.setValueAtTime(0.0001, startTime)
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.012)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
  osc.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration + 0.03)
}

export function playTick() {
  playTone({ freq: 660, duration: 0.08, gain: 0.16, type: 'square' })
}

export function playWaterDrop() {
  playTone({ freq: 1200, duration: 0.09, gain: 0.18, type: 'sine' })
  playTone({ freq: 700, duration: 0.12, gain: 0.14, type: 'sine', delay: 0.04 })
}

export function playTaskDone() {
  playTone({ freq: 880, duration: 0.14, gain: 0.22, type: 'sine' })
  playTone({ freq: 1320, duration: 0.22, gain: 0.24, type: 'sine', delay: 0.1 })
}

export function playPhaseEnd({ intense = false } = {}) {
  if (intense) {
    playTone({ freq: 1180, duration: 0.24, gain: 0.42, type: 'sawtooth' })
    playTone({ freq: 1560, duration: 0.24, gain: 0.42, type: 'sawtooth', delay: 0.16 })
    playTone({ freq: 1960, duration: 0.28, gain: 0.42, type: 'sawtooth', delay: 0.32 })
  } else {
    playTone({ freq: 1046, duration: 0.2, gain: 0.18, type: 'sine' })
  }
}

let musicTimer = null
let musicNextTime = 0

function scheduleMusicBeats() {
  const audioCtx = getCtx()
  const bpm = 122
  const beatLen = 60 / bpm
  const lookahead = 0.6
  if (musicNextTime < audioCtx.currentTime) musicNextTime = audioCtx.currentTime
  while (musicNextTime < audioCtx.currentTime + lookahead) {
    const delay = musicNextTime - audioCtx.currentTime
    playTone({ freq: 85, duration: 0.14, gain: 0.22, type: 'sine', delay })
    playTone({ freq: 4200, duration: 0.02, gain: 0.05, type: 'square', delay: delay + beatLen / 2 })
    musicNextTime += beatLen
  }
}

export function startMusic() {
  const audioCtx = getCtx()
  musicNextTime = audioCtx.currentTime
  scheduleMusicBeats()
  if (musicTimer) clearInterval(musicTimer)
  musicTimer = setInterval(scheduleMusicBeats, 250)
}

export function stopMusic() {
  if (musicTimer) clearInterval(musicTimer)
  musicTimer = null
}
