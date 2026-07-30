import { STEPS_TARGET } from '../data/plan.js'

export default function StepsTracker({ today, steps, pedometer }) {
  const value = steps[today] || 0
  const pct = Math.min(100, Math.round((value / STEPS_TARGET) * 100))

  const auto = pedometer

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

      {auto?.supported ? (
        <div className="mt-3 rounded-xl bg-char-800/70 p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-white/90">Автопідрахунок кроків</p>
              <p className="text-xs text-[#a89a8c]">
                {auto.active
                  ? 'Увімкнено — рахує, поки додаток відкритий на екрані'
                  : auto.permission === 'denied'
                    ? 'Доступ до руху відхилено. Дозволь у налаштуваннях браузера.'
                    : 'Використовує акселерометр телефону. Не рахує у фоні.'}
              </p>
            </div>
            <button
              onClick={auto.active ? auto.stop : auto.start}
              className={`shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                auto.active ? 'bg-ember-500 text-white' : 'bg-char-700 text-[#e7ded4]'
              }`}
            >
              {auto.active ? 'Увімкнено ✓' : 'Увімкнути'}
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 rounded-xl bg-char-800/70 p-3 text-xs text-[#a89a8c]">
          Цей браузер не підтримує автопідрахунок кроків.
        </p>
      )}
    </div>
  )
}
