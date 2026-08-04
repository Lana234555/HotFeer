import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabaseClient.js'

// session: undefined = still checking, null = logged out, object = logged in
// event: last auth event name (e.g. 'PASSWORD_RECOVERY' when the user opened a reset-password link)
export function useAuthSession() {
  const [session, setSession] = useState(undefined)
  const [event, setEvent] = useState(null)

  useEffect(() => {
    if (!supabaseConfigured) {
      setSession(null)
      return
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((evt, newSession) => {
      setEvent(evt)
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return { session, event }
}
