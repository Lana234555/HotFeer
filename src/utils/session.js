export const DEFAULT_REST_SECONDS = 45
export const LAST_SETS_INTENSE_COUNT = 5

function parseSets(setsStr) {
  const rangeSeconds = setsStr.match(/(\d+)[–-](\d+)×\s*\(?(\d+)?\s*сек/)
  if (rangeSeconds) {
    return { count: Number(rangeSeconds[2]), timedSeconds: rangeSeconds[3] ? Number(rangeSeconds[3]) : 30 }
  }

  const setsWithMinutes = setsStr.match(/^(\d+)×(\d+)\s*хв/)
  if (setsWithMinutes) {
    return { count: Number(setsWithMinutes[1]), timedSeconds: Number(setsWithMinutes[2]) * 60 }
  }

  const simpleReps = setsStr.match(/^(\d+)×(\d+)/)
  if (simpleReps) {
    return { count: Number(simpleReps[1]), timedSeconds: null }
  }

  const minutesOnly = setsStr.match(/(\d+)\s*хв/)
  if (minutesOnly) {
    return { count: 1, timedSeconds: Number(minutesOnly[1]) * 60 }
  }

  return { count: 1, timedSeconds: null }
}

export function buildSessionQueue(exercises) {
  const queue = []
  exercises.forEach((ex, exerciseIndex) => {
    const { count, timedSeconds } = parseSets(ex.sets)
    for (let i = 0; i < count; i++) {
      queue.push({
        exerciseIndex,
        exerciseName: ex.name,
        setsLabel: ex.sets,
        setNumber: i + 1,
        totalSetsForExercise: count,
        timedSeconds,
      })
    }
  })
  return queue
}

export function isIntenseSet(index, totalSets) {
  return totalSets - index <= LAST_SETS_INTENSE_COUNT
}

export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`
}
