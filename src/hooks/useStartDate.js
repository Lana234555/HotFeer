import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { todayKey } from '../utils/date.js'

export function useStartDate(userId) {
  const [startDate, setStartDate] = useState(null)

  useEffect(() => {
    if (!userId) {
      setStartDate(null)
      return
    }
    let cancelled = false

    async function load() {
      const { data } = await supabase
        .from('user_settings')
        .select('start_date')
        .eq('user_id', userId)
        .maybeSingle()

      if (cancelled) return

      if (data?.start_date) {
        setStartDate(data.start_date)
      } else {
        const today = todayKey()
        await supabase.from('user_settings').upsert({ user_id: userId, start_date: today })
        if (!cancelled) setStartDate(today)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  return startDate
}
