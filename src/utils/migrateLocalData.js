import { supabase } from '../lib/supabaseClient.js'

const DOMAIN_MAP = { workoutLog: 'workout', nutrition: 'nutrition', water: 'water', care: 'care', steps: 'steps' }

export async function migrateLocalDataToCloud(userId) {
  const flagKey = `hotfeet.migrated:${userId}`
  if (localStorage.getItem(flagKey)) return

  const rows = []

  for (const [localKey, domain] of Object.entries(DOMAIN_MAP)) {
    const raw = localStorage.getItem(`hotfeet.${localKey}`)
    if (!raw) continue
    let obj
    try {
      obj = JSON.parse(raw)
    } catch {
      continue
    }
    for (const [date, data] of Object.entries(obj)) {
      rows.push({ user_id: userId, domain, date, data })
    }
  }

  const progressRaw = localStorage.getItem('hotfeet.progress')
  if (progressRaw) {
    try {
      const list = JSON.parse(progressRaw)
      for (const entry of list) {
        if (entry?.date) rows.push({ user_id: userId, domain: 'progress', date: entry.date, data: entry })
      }
    } catch {
      // ignore malformed local data
    }
  }

  if (rows.length) {
    await supabase.from('daily_logs').upsert(rows, { onConflict: 'user_id,date,domain' })
  }

  const startDateRaw = localStorage.getItem('hotfeet.startDate')
  if (startDateRaw) {
    try {
      const startDate = JSON.parse(startDateRaw)
      if (startDate) {
        await supabase.from('user_settings').upsert({ user_id: userId, start_date: startDate })
      }
    } catch {
      // ignore malformed local data
    }
  }

  localStorage.setItem(flagKey, '1')
}
