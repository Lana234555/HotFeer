import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabaseClient.js'

// undefined = still checking, null = logged out, object = logged in
export function useAuthSession() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    if (!supabaseConfigured) {
      setSession(null)
      return
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return session
}
