import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

/**
 * Cloud-backed replacement for useLocalStorage, for data shaped as
 * { [dateKey]: value } — one row per (user, date, domain) in daily_logs.
 * Same [value, setValue] signature as useLocalStorage.
 */
export function useCloudLog(domain, defaultValue, userId, { debounceMs = 0 } = {}) {
  const [value, setValue] = useState(defaultValue)
  const dirtyRef = useRef(new Map())
  const timerRef = useRef(null)

  useEffect(() => {
    if (!userId) {
      setValue(defaultValue)
      return
    }
    let cancelled = false
    supabase
      .from('daily_logs')
      .select('date, data')
      .eq('user_id', userId)
      .eq('domain', domain)
      .then(({ data, error }) => {
        if (cancelled || error) return
        const obj = {}
        for (const row of data) obj[row.date] = row.data
        setValue(obj)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, domain])

  const flush = useCallback(() => {
    if (!userId || dirtyRef.current.size === 0) return
    const rows = Array.from(dirtyRef.current.entries()).map(([date, data]) => ({
      user_id: userId,
      domain,
      date,
      data,
    }))
    dirtyRef.current = new Map()
    supabase.from('daily_logs').upsert(rows, { onConflict: 'user_id,date,domain' })
  }, [userId, domain])

  const update = useCallback(
    (updater) => {
      setValue((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        for (const key of Object.keys(next)) {
          if (JSON.stringify(next[key]) !== JSON.stringify(prev[key])) {
            dirtyRef.current.set(key, next[key])
          }
        }
        if (debounceMs <= 0) {
          flush()
        } else {
          if (timerRef.current) clearTimeout(timerRef.current)
          timerRef.current = setTimeout(flush, debounceMs)
        }
        return next
      })
    },
    [flush, debounceMs]
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      flush()
    }
  }, [flush])

  return [value, update]
}

/**
 * Cloud-backed hook for array-shaped data where each entry carries its own
 * unique `date` field (e.g. progress measurements) — one row per entry.
 */
export function useCloudArrayLog(domain, userId) {
  const [list, setList] = useState([])

  useEffect(() => {
    if (!userId) {
      setList([])
      return
    }
    let cancelled = false
    supabase
      .from('daily_logs')
      .select('date, data')
      .eq('user_id', userId)
      .eq('domain', domain)
      .then(({ data, error }) => {
        if (cancelled || error) return
        setList(data.map((row) => row.data))
      })
    return () => {
      cancelled = true
    }
  }, [userId, domain])

  const update = useCallback(
    (updaterOrValue) => {
      setList((prev) => {
        const next = typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue
        if (userId) {
          const prevByDate = Object.fromEntries(prev.map((e) => [e.date, e]))
          const rows = next
            .filter((e) => JSON.stringify(prevByDate[e.date]) !== JSON.stringify(e))
            .map((e) => ({ user_id: userId, domain, date: e.date, data: e }))
          if (rows.length) {
            supabase.from('daily_logs').upsert(rows, { onConflict: 'user_id,date,domain' })
          }
        }
        return next
      })
    },
    [userId, domain]
  )

  return [list, update]
}
