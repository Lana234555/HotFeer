import { useEffect, useMemo, useRef, useState } from 'react'
import { buildSessionQueue, isIntenseSet, formatClock, DEFAULT_REST_SECONDS } from '../utils/session.js'
import { useWorkoutAudio } from '../hooks/useWorkoutAudio.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

export default function WorkoutSession({ exercises, onFinish, onClose }) {
  const queue = useMemo(() => buildSessionQueue(exercises), [exercises])
  const [restSeconds, setRestSeconds] = useLocalStorage('hotfeet.restSeconds', DEFAULT_REST_SECONDS)
  const audio = useWorkoutAudio()

  const [state, setState] = useState(() => ({
    index: 0,
    phase: 'work',
    remaining: queue[0]?.timedSeconds ?? 0,
    elapsed: 0,
    paused: false,
  }))

  const stateRef = useRef(state)
  stateRef.current = state
  const queueRef = useRef(queue)
  queueRef.current = queue
  const restRef = useRef(restSeconds)
  restRef.current = restSeconds
  const audioRef = useRef(audio)
  audioRef.current = audio
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  function finishWorkPhase() {
    const s = stateRef.current
    const q = queueRef.current
    const intense = isIntenseSet(s.index, q.length)
    audioRef.current.phaseEnd({ intense })
    if (s.index >= q.length - 1) {
      setState((prev) => ({ ...prev, phase: 'done' }))
      onFinishRef.current?.()
    } else {
      setState((prev) => ({ ...prev, phase: 'rest', remaining: restRef.current }))
    }
  }

  function finishRestPhase() {
    const s = stateRef.current
    const q = queueRef.current
    const intense = isIntenseSet(s.index, q.length)
    audioRef.current.phaseEnd({ intense })
    const nextIndex = s.index + 1
    const nextSet = q[nextIndex]
    setState({
      index: nextIndex,
      phase: 'work',
      remaining: nextSet.timedSeconds ?? 0,
      elapsed: 0,
      paused: false,
    })
  }

  useEffect(() => {
    const id = setInterval(() => {
      const s = stateRef.current
      if (s.paused || s.phase === 'done') return
      const q = queueRef.current
      const current = q[s.index]

      if (s.phase === 'work') {
        if (current.timedSeconds != null) {
          const nextRemaining = s.remaining - 1
          if (nextRemaining <= 0) {
            finishWorkPhase()
          } else {
            if (nextRemaining <= 3) audioRef.current.tick()
            setState((prev) => ({ ...prev, remaining: nextRemaining }))
          }
        } else {
          setState((prev) => ({ ...prev, elapsed: prev.elapsed + 1 }))
        }
      } else if (s.phase === 'rest') {
        const nextRemaining = s.remaining - 1
        if (nextRemaining <= 0) {
          finishRestPhase()
        } else {
          if (nextRemaining <= 3) audioRef.current.tick()
          setState((prev) => ({ ...prev, remaining: nextRemaining }))
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 1000)
    return () => clearInterval(id)
  }, [])

  function togglePause() {
    setState((prev) => ({ ...prev, paused: !prev.paused }))
  }

  function skipPhase() {
    if (state.phase === 'work') finishWorkPhase()
    else if (state.phase === 'rest') finishRestPhase()
  }

  function adjustRest(delta) {
    setState((prev) => (prev.phase !== 'rest' ? prev : { ...prev, remaining: Math.max(5, prev.remaining + delta) }))
    setRestSeconds((prev) => Math.max(15, prev + delta))
  }

  const total = queue.length

  if (state.phase === 'done') {
    return (
      <div className="ember-card-soft rounded-3xl border border-char-600/50 p-6 text-center">
        <p className="text-4xl">🔥</p>
        <h2 className="mt-2 text-lg font-semibold text-white">Тренування завершено!</h2>
        <p className="mt-1 text-base text-[#a89a8c]">{total} підходів позаду. Чудова робота.</p>
        <button onClick={onClose} className="mt-5 w-full rounded-xl bg-ember-500 py-2.5 text-sm font-semibold text-white">
          Закрити
        </button>
      </div>
    )
  }

  const current = queue[state.index]
  const intense = isIntenseSet(state.index, total)
  const isTimed = current.timedSeconds != null
  const displaySeconds = state.phase === 'rest' || isTimed ? state.remaining : state.elapsed

  return (
    <div className="ember-card-soft rounded-3xl border border-char-600/50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[#a89a8c]">
            Підхід {state.index + 1} / {total}
            {intense ? ' · фінішна пряма 🔥' : ''}
          </p>
          <h2 className="truncate text-base font-semibold text-white">{current.exerciseName}</h2>
          <p className="text-sm text-[#a89a8c]">
            {current.setNumber}/{current.totalSetsForExercise} · {current.setsLabel}
          </p>
        </div>
        <button
          onClick={audio.toggleMusic}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg transition-colors ${
            audio.musicOn ? 'border-ember-400 bg-ember-500/20 text-ember-300' : 'border-char-600 text-[#a89a8c]'
          }`}
          aria-label="Музика"
        >
          🎵
        </button>
      </div>

      <div
        className={`mt-5 rounded-2xl p-6 text-center transition-shadow ${
          state.phase === 'rest' ? 'bg-char-800/70' : 'ember-card shadow-glow'
        } ${intense ? 'ring-2 ring-ember-300' : ''}`}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-white/70">
          {state.phase === 'rest' ? 'Відпочинок' : isTimed ? 'Тренування' : 'Виконуй підхід'}
        </p>
        <p className="mt-1 text-5xl font-bold tabular-nums text-white">{formatClock(displaySeconds)}</p>
      </div>

      {state.phase === 'rest' && (
        <div className="mt-3 flex gap-2">
          <button onClick={() => adjustRest(-15)} className="flex-1 rounded-xl bg-char-700 py-2 text-xs font-semibold text-white">
            −15 сек
          </button>
          <button onClick={() => adjustRest(15)} className="flex-1 rounded-xl bg-char-700 py-2 text-xs font-semibold text-white">
            +15 сек
          </button>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button onClick={togglePause} className="rounded-xl bg-char-700 py-2.5 text-sm font-semibold text-white">
          {state.paused ? 'Продовжити' : 'Пауза'}
        </button>
        {state.phase === 'work' && !isTimed ? (
          <button onClick={finishWorkPhase} className="rounded-xl bg-ember-500 py-2.5 text-sm font-semibold text-white">
            Готово ✓
          </button>
        ) : (
          <button onClick={skipPhase} className="rounded-xl bg-char-700 py-2.5 text-sm font-semibold text-white">
            Пропустити
          </button>
        )}
      </div>

      <button onClick={onClose} className="mt-3 w-full text-center text-sm font-medium text-[#a89a8c]">
        Завершити тренування достроково
      </button>

      <div className="progress-track mt-4 h-1.5 w-full overflow-hidden rounded-full">
        <div
          className="h-full rounded-full bg-gradient-to-r from-ember-600 to-ember-300"
          style={{ width: `${Math.round((state.index / total) * 100)}%` }}
        />
      </div>
    </div>
  )
}
