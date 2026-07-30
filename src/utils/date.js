export function toDateKey(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

export function todayKey() {
  return toDateKey(new Date())
}

export function dayNumberSince(startKey, dateKey = todayKey()) {
  const start = new Date(startKey)
  const current = new Date(dateKey)
  const diffMs = current.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)
  return Math.floor(diffMs / 86400000) + 1
}

export function formatUaDate(dateKey) {
  const d = new Date(dateKey)
  return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })
}

export function dateKeyForDay(startKey, dayNumber) {
  const d = new Date(startKey)
  d.setDate(d.getDate() + (dayNumber - 1))
  return toDateKey(d)
}
