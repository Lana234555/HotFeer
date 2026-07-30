import { STEPS_TARGET } from '../data/plan.js'

const STEP_QUICK_ADD = [1000, 2000, 5000]

export default function StepsTracker({ today, steps, setSteps }) {
  const value = steps[today] || 0
  const pct = Math.min(100, Math.round((value / STEPS_TARGET) * 100))

  function addSteps(amount) {
    setSteps({ ...steps, [today]: Math.max(0, value + amount) })
  }

  function setExact(raw) {
    const n = Number(raw)
    setSteps({ ...steps, [today]: Number.isFinite(n) ? Math.max(0, n) : 0 })
  }

  return (
    <div className="ember-card-soft rounded-3xl border border-char-600/50 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/90">Кроки сьогодні</h2>
        <span className="text-sm font-semibold text-white">
          {value.toLocaleString('uk-UA')} / {STEPS_TARGET.toLocaleString('uk-UA')}
        </span>
      </div>
      <div className="progress-track mt-3 h-2 w-full overflow-hidden rounded-full">
        <div className="h-full rounded-full bg-gradient-to-r from-ember-600 to-ember-300" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 flex gap-2">
        {STEP_QUICK_ADD.map((amount) => (
          <button
            key={amount}
            onClick={() => addSteps(amount)}
            className="flex-1 rounded-xl bg-char-800/70 py-2 text-xs font-semibold text-white hover:bg-char-700/70"
          >
            +{amount.toLocaleString('uk-UA')}
          </button>
        ))}
        <input
          type="number"
          inputMode="numeric"
          placeholder="Вручну"
          value={value === 0 ? '' : value}
          onChange={(e) => setExact(e.target.value)}
          className="w-20 rounded-xl border border-char-600/60 bg-char-800/70 px-2 text-center text-xs text-white outline-none focus:border-ember-400"
        />
      </div>
    </div>
  )
}
