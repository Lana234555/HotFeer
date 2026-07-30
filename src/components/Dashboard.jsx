import { getWorkoutForDay, CARE_ITEMS, MACRO_TARGETS, WATER_TARGET_ML, TOTAL_DAYS } from '../data/plan.js'
import { sumMacros, computeDailyScore } from '../utils/score.js'
import { CheckIcon, FlameIcon, DropletIcon, DumbbellIcon } from './icons.jsx'

export default function Dashboard({ today, dayNumber, workoutLog, nutrition, water, care, onNavigate, onSignOut }) {
  const workout = getWorkoutForDay(dayNumber)
  const workoutDone = Boolean(workoutLog[today]?.done)
  const waterMl = water[today] || 0
  const todaysCare = care[today] || {}
  const careDoneCount = CARE_ITEMS.filter((i) => todaysCare[i.id]).length

  const macros = sumMacros(nutrition[today] || [])
  const score = computeDailyScore({
    workoutDone,
    waterMl,
    nutritionEntries: nutrition[today] || [],
    care: todaysCare,
  })

  return (
    <div className="px-4 pt-8 md:px-0 md:pt-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-base text-[#a89a8c]">HotFeet</p>
          <h1 className="text-xl font-semibold md:text-2xl">30-денний план</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSignOut}
            className="rounded-2xl px-3 py-2 text-xs font-medium text-[#a89a8c] hover:text-white"
          >
            Вийти
          </button>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ember-500/15 text-ember-300">
            <FlameIcon />
          </div>
        </div>
      </div>

      <div className="md:grid md:grid-cols-2 md:items-start md:gap-6">
        <div>
          <div className="ember-card relative overflow-hidden rounded-3xl p-5 shadow-glow">
            <p className="text-sm font-medium text-white/80">День {dayNumber} з {TOTAL_DAYS}</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight text-white">{score}%</span>
              <span className="mb-1 text-sm text-white/80">денний скор</span>
            </div>
            <p className="mt-1 text-xs text-white/70">{workout.title} · {workout.duration} хв</p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <button
                onClick={() => onNavigate('workout')}
                className="rounded-xl bg-black/25 px-2 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-black/35"
              >
                Тренування
              </button>
              <button
                onClick={() => onNavigate('nutrition')}
                className="rounded-xl bg-black/25 px-2 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-black/35"
              >
                Харчування
              </button>
              <button
                onClick={() => onNavigate('care')}
                className="rounded-xl bg-black/25 px-2 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-black/35"
              >
                Догляд
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <StatCard label="Ккал" value={Math.round(macros.kcal)} target={MACRO_TARGETS.kcal} />
            <StatCard label="Вода, мл" value={waterMl} target={WATER_TARGET_ML} />
            <StatCard label="Догляд" value={careDoneCount} target={CARE_ITEMS.length} suffix={`/${CARE_ITEMS.length}`} />
          </div>
        </div>

        <div>
          <div className="ember-card-soft mt-4 rounded-3xl border border-char-600/50 p-4 md:mt-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white/90">Сьогоднішній план</h2>
              <button onClick={() => onNavigate('workout')} className="text-xs font-medium text-ember-300">
                Детально
              </button>
            </div>
            <div className="space-y-2">
              {workout.exercises.map((ex) => (
                <div key={ex.name} className="flex items-center justify-between rounded-xl bg-char-800/70 px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ember-500/15 text-ember-300">
                      <DumbbellIcon width={16} height={16} />
                    </div>
                    <span className="text-sm text-white/90">{ex.name}</span>
                  </div>
                  <span className="text-sm text-[#a89a8c]">{ex.sets}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ember-card-soft mt-4 mb-4 rounded-3xl border border-char-600/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white/90">Щоденний догляд</h2>
              <span className="text-sm text-[#a89a8c]">{careDoneCount}/{CARE_ITEMS.length}</span>
            </div>
            <div className="space-y-2">
              {CARE_ITEMS.slice(0, 4).map((item) => {
                const done = Boolean(todaysCare[item.id])
                return (
                  <div key={item.id} className="flex items-center justify-between rounded-xl bg-char-800/70 px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                          done ? 'border-ember-400 bg-ember-500 text-white' : 'border-char-600 text-transparent'
                        }`}
                      >
                        <CheckIcon />
                      </div>
                      <span className="text-sm text-white/90">{item.label}</span>
                    </div>
                    <span className="text-sm text-[#a89a8c]">{item.time}</span>
                  </div>
                )
              })}
              <button onClick={() => onNavigate('care')} className="w-full pt-1 text-center text-xs font-medium text-ember-300">
                Показати все →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, target, suffix }) {
  const pct = target ? Math.min(100, Math.round((value / target) * 100)) : 0
  return (
    <div className="rounded-2xl border border-char-600/50 bg-char-800/60 p-3">
      <p className="text-xs text-[#a89a8c]">{label}</p>
      <p className="mt-1 text-base font-semibold text-white">
        {value}
        {suffix ? '' : <span className="text-sm text-[#a89a8c]">/{target}</span>}
        {suffix}
      </p>
      <div className="progress-track mt-2 h-1.5 w-full overflow-hidden rounded-full">
        <div className="h-full rounded-full bg-gradient-to-r from-ember-600 to-ember-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
