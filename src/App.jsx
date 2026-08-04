import { useEffect, useMemo, useState } from 'react'
import BottomNav from './components/BottomNav.jsx'
import Dashboard from './components/Dashboard.jsx'
import WorkoutTab from './components/WorkoutTab.jsx'
import NutritionTab from './components/NutritionTab.jsx'
import CareTab from './components/CareTab.jsx'
import ProgressTab from './components/ProgressTab.jsx'
import Auth from './components/Auth.jsx'
import ResetPassword from './components/ResetPassword.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { useCloudLog, useCloudArrayLog } from './hooks/useCloudLog.js'
import { useStartDate } from './hooks/useStartDate.js'
import { useAuthSession } from './hooks/useAuthSession.js'
import { usePedometer } from './hooks/usePedometer.js'
import { todayKey, dayNumberSince } from './utils/date.js'
import { TOTAL_DAYS } from './data/plan.js'
import { migrateLocalDataToCloud } from './utils/migrateLocalData.js'
import { supabase } from './lib/supabaseClient.js'

export default function App() {
  const { session, event } = useAuthSession()
  const [recoveryDismissed, setRecoveryDismissed] = useState(false)

  if (session === undefined) return <LoadingScreen />
  if (event === 'PASSWORD_RECOVERY' && !recoveryDismissed) {
    return <ResetPassword onDone={() => setRecoveryDismissed(true)} />
  }
  if (!session) return <Auth />

  return <AuthenticatedApp userId={session.user.id} />
}

function AuthenticatedApp({ userId }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    migrateLocalDataToCloud(userId).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [userId])

  if (!ready) return <LoadingScreen label="Синхронізую дані…" />
  return <MainApp userId={userId} />
}

function MainApp({ userId }) {
  const [tab, setTab] = useState('home')
  const startDate = useStartDate(userId)
  const [anthropicApiKey, setAnthropicApiKey] = useLocalStorage('hotfeet.anthropicApiKey', '')
  const [workoutLog, setWorkoutLog] = useCloudLog('workout', {}, userId)
  const [nutrition, setNutrition] = useCloudLog('nutrition', {}, userId)
  const [water, setWater] = useCloudLog('water', {}, userId)
  const [care, setCare] = useCloudLog('care', {}, userId)
  const [steps, setSteps] = useCloudLog('steps', {}, userId, { debounceMs: 4000 })
  const [progress, setProgress] = useCloudArrayLog('progress', userId)

  const today = todayKey()
  const dayNumber = useMemo(() => {
    if (!startDate) return 1
    const n = dayNumberSince(startDate, today)
    return Math.min(Math.max(n, 1), TOTAL_DAYS)
  }, [startDate, today])

  const pedometer = usePedometer(() => {
    setSteps((prev) => ({ ...prev, [today]: (prev[today] || 0) + 1 }))
  })

  const shared = {
    today,
    startDate,
    dayNumber,
    workoutLog,
    setWorkoutLog,
    nutrition,
    setNutrition,
    water,
    setWater,
    care,
    setCare,
    progress,
    setProgress,
    steps,
    setSteps,
    pedometer,
    anthropicApiKey,
    setAnthropicApiKey,
  }

  if (!startDate) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-char-950 font-sans text-[#f5f1ec] md:flex md:justify-center">
      <BottomNav active={tab} onChange={setTab} />
      <main className="mx-auto w-full max-w-md pb-28 md:max-w-3xl md:pb-16 md:pl-28 md:pr-6">
        {tab === 'home' && <Dashboard {...shared} onNavigate={setTab} onSignOut={() => supabase.auth.signOut()} />}
        {tab === 'workout' && <WorkoutTab {...shared} />}
        {tab === 'nutrition' && <NutritionTab {...shared} />}
        {tab === 'care' && <CareTab {...shared} />}
        {tab === 'progress' && <ProgressTab {...shared} />}
      </main>
    </div>
  )
}

function LoadingScreen({ label = 'Завантаження…' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-char-950 font-sans text-[#f5f1ec]">
      <p className="text-sm text-[#a89a8c]">{label}</p>
    </div>
  )
}
