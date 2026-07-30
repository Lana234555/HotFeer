import { CARE_ITEMS } from '../data/plan.js'
import { CheckIcon } from './icons.jsx'

const GROUPS = ['Ранок', 'День', 'Вечір']

export default function CareTab({ today, care, setCare }) {
  const todaysCare = care[today] || {}
  const doneCount = CARE_ITEMS.filter((i) => todaysCare[i.id]).length

  function toggle(id) {
    setCare({ ...care, [today]: { ...todaysCare, [id]: !todaysCare[id] } })
  }

  return (
    <div className="px-4 pt-8 md:px-0 md:pt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Домашній догляд</h1>
        <span className="text-base text-[#a89a8c]">{doneCount}/{CARE_ITEMS.length}</span>
      </div>

      <div className="progress-track mt-3 h-2 w-full overflow-hidden rounded-full">
        <div
          className="h-full rounded-full bg-gradient-to-r from-ember-600 to-ember-300"
          style={{ width: `${Math.round((doneCount / CARE_ITEMS.length) * 100)}%` }}
        />
      </div>

      <div className="md:grid md:grid-cols-3 md:items-start md:gap-5">
        {GROUPS.map((group) => {
          const items = CARE_ITEMS.filter((i) => i.time === group)
          if (!items.length) return null
          return (
            <div key={group} className="ember-card-soft mt-4 rounded-3xl border border-char-600/50 p-4">
              <h2 className="mb-3 text-sm font-semibold text-white/90">{group}</h2>
              <div className="space-y-2">
                {items.map((item) => {
                  const done = Boolean(todaysCare[item.id])
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className="flex w-full items-center justify-between rounded-xl bg-char-800/70 px-3 py-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                            done ? 'border-ember-400 bg-ember-500 text-white' : 'border-char-600 text-transparent'
                          }`}
                        >
                          <CheckIcon />
                        </div>
                        <div>
                          <p className={`text-sm ${done ? 'text-white/60 line-through' : 'text-white/90'}`}>{item.label}</p>
                          <p className="text-sm text-[#a89a8c]">{item.hint}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
