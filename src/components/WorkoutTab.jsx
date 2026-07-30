import { useState } from 'react'
import { getWorkoutForDay, TOTAL_DAYS, WORKOUT_SCHEDULE } from '../data/plan.js'
import { dateKeyForDay } from '../utils/date.js'
import { CheckIcon } from './icons.jsx'
import StepsTracker from './StepsTracker.jsx'
import WorkoutSession from './WorkoutSession.jsx'

export default function WorkoutTab({ today, startDate, dayNumber, workoutLog, setWorkoutLog, steps, setSteps }) {
  const workout = getWorkoutForDay(dayNumber)
  const todaysLog = workoutLog[today] || { done: false, completed: [] }
  const [sessionOpen, setSessionOpen] = useState(false)

  function toggleExercise(name) {
    const completed = todaysLog.completed || []
    const next = completed.includes(name) ? completed.filter((n) => n !== name) : [...completed, name]
    setWorkoutLog({ ...workoutLog, [today]: { ...todaysLog, completed: next } })
  }

  function toggleDone() {
    setWorkoutLog({ ...workoutLog, [today]: { ...todaysLog, done: !todaysLog.done } })
  }

  function markDone() {
    setWorkoutLog({ ...workoutLog, [today]: { ...todaysLog, done: true } })
  }

  const weekStart = Math.max(1, dayNumber - ((dayNumber - 1) % 7))
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart + i).filter((d) => d <= TOTAL_DAYS)

  return (
    <div className="px-4 pt-8 md:px-0 md:pt-10">
      <h1 className="text-xl font-semibold md:text-2xl">Тренування</h1>
      <p className="mt-1 text-sm text-[#a89a8c]">{WORKOUT_SCHEDULE[workout.phase].label}</p>

      <div className="mt-4">
        <StepsTracker today={today} steps={steps} setSteps={setSteps} />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-7 md:overflow-visible">
        {weekDays.map((d) => {
          const key = dateKeyForDay(startDate, d)
          const done = Boolean(workoutLog[key]?.done)
          const isToday = d === dayNumber
          return (
            <div
              key={d}
              className={`flex min-w-[52px] flex-col items-center gap-1 rounded-2xl border px-2 py-2 ${
                isToday ? 'border-ember-400 bg-ember-500/15' : 'border-char-600/50 bg-char-800/60'
              }`}
            >
              <span className="text-[10px] text-[#a89a8c]">День</span>
              <span className="text-sm font-semibold text-white">{d}</span>
              <div className={`h-1.5 w-1.5 rounded-full ${done ? 'bg-ember-400' : 'bg-char-600'}`} />
            </div>
          )
        })}
      </div>

      <div className="md:grid md:grid-cols-2 md:items-start md:gap-6">
        {sessionOpen ? (
          <div className="mt-5 md:mt-6">
            <WorkoutSession exercises={workout.exercises} onFinish={markDone} onClose={() => setSessionOpen(false)} />
          </div>
        ) : (
          <div className="ember-card-soft mt-5 rounded-3xl border border-char-600/50 p-4 md:mt-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-white">{workout.title}</h2>
                <p className="text-xs text-[#a89a8c]">{workout.duration} хв · День {dayNumber}</p>
              </div>
              <button
                onClick={toggleDone}
                className={`shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  todaysLog.done ? 'bg-ember-500 text-white' : 'bg-char-700 text-[#e7ded4]'
                }`}
              >
                {todaysLog.done ? 'Виконано ✓' : 'Позначити виконаним'}
              </button>
            </div>

            <button
              onClick={() => setSessionOpen(true)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-ember-500 py-3 text-sm font-semibold text-white shadow-glow"
            >
              ▶ Почати тренування з таймером
            </button>

            <div className="mt-4 space-y-2">
              {workout.exercises.map((ex) => {
                const checked = (todaysLog.completed || []).includes(ex.name)
                return (
                  <button
                    key={ex.name}
                    onClick={() => toggleExercise(ex.name)}
                    className="flex w-full items-center justify-between rounded-xl bg-char-800/70 px-3 py-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          checked ? 'border-ember-400 bg-ember-500 text-white' : 'border-char-600 text-transparent'
                        }`}
                      >
                        <CheckIcon />
                      </div>
                      <span className={`text-sm ${checked ? 'text-white/60 line-through' : 'text-white/90'}`}>{ex.name}</span>
                    </div>
                    <span className="text-xs text-[#a89a8c]">{ex.sets}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <WeekOverview
          phase={workout.phase}
          weekDays={weekDays}
          startDate={startDate}
          workoutLog={workoutLog}
          dayNumber={dayNumber}
        />
      </div>
    </div>
  )
}

function WeekOverview({ phase, weekDays, startDate, workoutLog, dayNumber }) {
  return (
    <div className="ember-card-soft mt-4 hidden rounded-3xl border border-char-600/50 p-4 md:mt-6 md:block">
      <h2 className="mb-3 text-sm font-semibold text-white/90">Огляд тижня</h2>
      <div className="space-y-2">
        {weekDays.map((d) => {
          const key = dateKeyForDay(startDate, d)
          const dayWorkout = getWorkoutForDay(d)
          const done = Boolean(workoutLog[key]?.done)
          const isToday = d === dayNumber
          return (
            <div
              key={d}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
                isToday ? 'bg-ember-500/15' : 'bg-char-800/70'
              }`}
            >
              <div>
                <p className="text-sm text-white/90">{dayWorkout.title}</p>
                <p className="text-xs text-[#a89a8c]">День {d} · {dayWorkout.duration} хв</p>
              </div>
              <div className={`h-2.5 w-2.5 rounded-full ${done ? 'bg-ember-400' : 'bg-char-600'}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
