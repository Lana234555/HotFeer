import { useMemo, useState } from 'react'
import BottomNav from './components/BottomNav.jsx'
import Dashboard from './components/Dashboard.jsx'
import WorkoutTab from './components/WorkoutTab.jsx'
import NutritionTab from './components/NutritionTab.jsx'
import CareTab from './components/CareTab.jsx'
import ProgressTab from './components/ProgressTab.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { todayKey, dayNumberSince } from './utils/date.js'
import { TOTAL_DAYS } from './data/plan.js'

export default function App() {
  const [tab, setTab] = useState('home')
  const [startDate] = useLocalStorage('hotfeet.startDate', todayKey())
  const [workoutLog, setWorkoutLog] = useLocalStorage('hotfeet.workoutLog', {})
  const [nutrition, setNutrition] = useLocalStorage('hotfeet.nutrition', {})
  const [water, setWater] = useLocalStorage('hotfeet.water', {})
  const [care, setCare] = useLocalStorage('hotfeet.care', {})
  const [progress, setProgress] = useLocalStorage('hotfeet.progress', [])

  const today = todayKey()
  const dayNumber = useMemo(() => {
    const n = dayNumberSince(startDate, today)
    return Math.min(Math.max(n, 1), TOTAL_DAYS)
  }, [startDate, today])

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
  }

  return (
    <div className="min-h-screen bg-char-950 font-sans text-[#f5f1ec] md:flex md:justify-center">
      <BottomNav active={tab} onChange={setTab} />
      <main className="mx-auto w-full max-w-md pb-28 md:max-w-3xl md:pb-16 md:pl-28 md:pr-6">
        {tab === 'home' && <Dashboard {...shared} onNavigate={setTab} />}
        {tab === 'workout' && <WorkoutTab {...shared} />}
        {tab === 'nutrition' && <NutritionTab {...shared} />}
        {tab === 'care' && <CareTab {...shared} />}
        {tab === 'progress' && <ProgressTab {...shared} />}
      </main>
    </div>
  )
}
