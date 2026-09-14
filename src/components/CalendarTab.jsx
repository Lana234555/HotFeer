import { useMemo, useState } from 'react'
import { TOTAL_DAYS, CARE_ITEMS, WATER_TARGET_ML } from '../data/plan.js'
import { computeDailyScore, sumMacros } from '../utils/score.js'
import { dateKeyForDay, formatUaDate } from '../utils/date.js'
import { CheckIcon, DropletIcon, DumbbellIcon, TrophyIcon, FlameIcon } from './icons.jsx'

export default function CalendarTab({ startDate, dayNumber, workoutLog, nutrition, water, care }) {
  const [selectedDay, setSelectedDay] = useState(dayNumber)

  const days = useMemo(() => {
    const list = []
    for (let day = 1; day <= TOTAL_DAYS; day++) {
      const dateKey = dateKeyForDay(startDate, day)
      const reached = day <= dayNumber
      const workoutDone = Boolean(workoutLog[dateKey]?.done)
      const waterMl = water[dateKey] || 0
      const waterDone = waterMl >= WATER_TARGET_ML
      const nutritionEntries = nutrition[dateKey] || []
      const dayCare = care[dateKey] || {}
      const careDoneCount = CARE_ITEMS.filter((i) => dayCare[i.id]).length
      const score = reached
        ? computeDailyScore({ workoutDone, waterMl, nutritionEntries, care: dayCare })
        : 0
      list.push({
        day,
        dateKey,
        reached,
        isToday: day === dayNumber,
        workoutDone,
        waterMl,
        waterDone,
        careDoneCount,
        macros: sumMacros(nutritionEntries),
        score,
      })
    }
    return list
  }, [startDate, dayNumber, workoutLog, nutrition, water, care])

  const reachedDays = days.filter((d) => d.reached)
  const currentStreak = useMemo(() => {
    let streak = 0
    for (let i = reachedDays.length - 1; i >= 0; i--) {
      if (reachedDays[i].score >= 60) streak++
      else break
    }
    return streak
  }, [reachedDays])

  const longestStreak = useMemo(() => {
    let best = 0
    let run = 0
    for (const d of reachedDays) {
      if (d.score >= 60) {
        run++
        best = Math.max(best, run)
      } else {
        run = 0
      }
    }
    return best
  }, [reachedDays])

  const perfectDays = reachedDays.filter((d) => d.score === 100).length
  const workoutsDone = reachedDays.filter((d) => d.workoutDone).length
  const waterGoalDays = reachedDays.filter((d) => d.waterDone).length
  const careFullDays = reachedDays.filter((d) => d.careDoneCount === CARE_ITEMS.length).length

  const achievements = [
    {
      id: 'first-step',
      label: 'Перший крок',
      hint: 'Заверши свій перший день',
      unlocked: reachedDays.length >= 1 && reachedDays[0]?.score > 0,
    },
    {
      id: 'streak-3',
      label: '3 дні поспіль',
      hint: 'Скор 60%+ три дні підряд',
      unlocked: longestStreak >= 3,
    },
    {
      id: 'streak-7',
      label: 'Тиждень вогню',
      hint: 'Скор 60%+ сім днів підряд',
      unlocked: longestStreak >= 7,
    },
    {
      id: 'perfect-day',
      label: 'Ідеальний день',
      hint: 'Досягни 100% скору за день',
      unlocked: perfectDays >= 1,
    },
    {
      id: 'workouts-10',
      label: '10 тренувань',
      hint: 'Заверши 10 тренувань',
      unlocked: workoutsDone >= 10,
    },
    {
      id: 'hydration-5',
      label: 'Гідратація',
      hint: '5 днів з нормою води',
      unlocked: waterGoalDays >= 5,
    },
    {
      id: 'care-5',
      label: 'Ритуал догляду',
      hint: '5 днів повного догляду',
      unlocked: careFullDays >= 5,
    },
    {
      id: 'halfway',
      label: 'Половина шляху',
      hint: 'Дійди до 15 дня',
      unlocked: dayNumber >= 15,
    },
    {
      id: 'finisher',
      label: 'Фіналіст',
      hint: 'Заверши всі 30 днів',
      unlocked: dayNumber >= TOTAL_DAYS && reachedDays.length === TOTAL_DAYS,
    },
  ]
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  const selected = days.find((d) => d.day === selectedDay) || days[0]

  return (
    <div className="px-4 pt-8 md:px-0 md:pt-10">
      <h1 className="text-xl font-semibold md:text-2xl">Календар</h1>
      <p className="mt-1 text-base text-[#a89a8c]">День {dayNumber} з {TOTAL_DAYS} · оновлюється в реальному часі</p>

      <div className="md:grid md:grid-cols-2 md:items-start md:gap-6">
        <div>
          <div className="ember-card-soft mt-4 rounded-3xl border border-char-600/50 p-4">
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-7">
              {days.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setSelectedDay(d.day)}
                  disabled={!d.reached}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-xs font-semibold transition
                    ${!d.reached ? 'bg-char-800/40 text-[#5a5349]' : dayScoreClasses(d.score)}
                    ${selectedDay === d.day && d.reached ? 'ring-2 ring-white/70' : ''}
                    ${d.isToday ? 'ring-2 ring-ember-300' : ''}
                  `}
                >
                  {d.day}
                  {d.isToday && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 animate-pulse rounded-full bg-ember-400" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3 text-[10px] text-[#a89a8c]">
              <LegendDot className="bg-char-800/40" label="Попереду" />
              <LegendDot className="bg-ember-900/60" label="Слабко" />
              <LegendDot className="bg-ember-600/70" label="Добре" />
              <LegendDot className="bg-ember-400" label="Ідеально" />
            </div>
          </div>

          {selected && selected.reached && (
            <div className="ember-card-soft mt-4 rounded-3xl border border-char-600/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white/90">День {selected.day} · {formatUaDate(selected.dateKey)}</h2>
                <span className="text-sm font-semibold text-ember-300">{selected.score}%</span>
              </div>
              <div className="space-y-2">
                <DetailRow
                  icon={<DumbbellIcon width={16} height={16} />}
                  label="Тренування"
                  value={selected.workoutDone ? 'Виконано' : 'Пропущено'}
                  done={selected.workoutDone}
                />
                <DetailRow
                  icon={<DropletIcon width={16} height={16} />}
                  label="Вода"
                  value={`${selected.waterMl} / ${WATER_TARGET_ML} мл`}
                  done={selected.waterDone}
                />
                <DetailRow
                  icon={<CheckIcon />}
                  label="Догляд"
                  value={`${selected.careDoneCount} / ${CARE_ITEMS.length}`}
                  done={selected.careDoneCount === CARE_ITEMS.length}
                />
                <DetailRow
                  icon={<FlameIcon width={16} height={16} />}
                  label="Ккал"
                  value={`${Math.round(selected.macros.kcal)} ккал`}
                  done={selected.macros.kcal > 0}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="ember-card-soft mt-4 rounded-3xl border border-char-600/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white/90">Досягнення</h2>
              <span className="text-sm text-[#a89a8c]">{unlockedCount}/{achievements.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-xl border px-3 py-3 text-left ${
                    a.unlocked ? 'border-ember-400/60 bg-ember-500/10' : 'border-char-600/50 bg-char-800/50'
                  }`}
                >
                  <div className={`mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg ${
                    a.unlocked ? 'bg-ember-500/20 text-ember-300' : 'bg-char-700/60 text-[#5a5349]'
                  }`}>
                    <TrophyIcon width={16} height={16} />
                  </div>
                  <p className={`text-xs font-semibold ${a.unlocked ? 'text-white' : 'text-[#8a8074]'}`}>{a.label}</p>
                  <p className="mt-0.5 text-[10px] text-[#a89a8c]">{a.hint}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 mb-4 grid grid-cols-3 gap-3">
            <MiniStat label="Поточна серія" value={currentStreak} suffix=" дн" />
            <MiniStat label="Найдовша серія" value={longestStreak} suffix=" дн" />
            <MiniStat label="Ідеальні дні" value={perfectDays} />
          </div>
        </div>
      </div>
    </div>
  )
}

function dayScoreClasses(score) {
  if (score >= 90) return 'bg-ember-400 text-char-950'
  if (score >= 60) return 'bg-ember-600/70 text-white'
  if (score > 0) return 'bg-ember-900/60 text-white/80'
  return 'bg-char-800/70 text-[#a89a8c]'
}

function LegendDot({ className, label }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
      {label}
    </span>
  )
}

function DetailRow({ icon, label, value, done }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-char-800/70 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${done ? 'bg-ember-500/15 text-ember-300' : 'bg-char-700/60 text-[#5a5349]'}`}>
          {icon}
        </div>
        <span className="text-sm text-white/90">{label}</span>
      </div>
      <span className="text-sm text-[#a89a8c]">{value}</span>
    </div>
  )
}

function MiniStat({ label, value, suffix = '' }) {
  return (
    <div className="rounded-2xl border border-char-600/50 bg-char-800/60 p-3">
      <p className="text-xs text-[#a89a8c]">{label}</p>
      <p className="mt-1 text-base font-semibold text-white">{value}{suffix}</p>
    </div>
  )
}
