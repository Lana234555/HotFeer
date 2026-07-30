import { useState } from 'react'
import { FOOD_QUICK_ADD, MACRO_TARGETS, WATER_TARGET_ML } from '../data/plan.js'
import { sumMacros } from '../utils/score.js'
import { DropletIcon } from './icons.jsx'

const WATER_STEPS = [200, 250, 500]

export default function NutritionTab({ today, nutrition, setNutrition, water, setWater }) {
  const [showPicker, setShowPicker] = useState(false)
  const entries = nutrition[today] || []
  const macros = sumMacros(entries)
  const waterMl = water[today] || 0

  function addFood(food) {
    const id = `${food.name}-${Date.now()}`
    setNutrition({ ...nutrition, [today]: [...entries, { ...food, id }] })
    setShowPicker(false)
  }

  function removeFood(id) {
    setNutrition({ ...nutrition, [today]: entries.filter((e) => e.id !== id) })
  }

  function addWater(ml) {
    setWater({ ...water, [today]: Math.max(0, waterMl + ml) })
  }

  return (
    <div className="px-4 pt-8 md:px-0 md:pt-10">
      <h1 className="text-xl font-semibold md:text-2xl">Харчування</h1>
      <p className="mt-1 text-sm text-[#a89a8c]">Мета: {MACRO_TARGETS.kcal} ккал · Б {MACRO_TARGETS.protein} г</p>

      <div className="md:grid md:grid-cols-2 md:items-start md:gap-6">
        <div className="ember-card-soft mt-4 rounded-3xl border border-char-600/50 p-4">
          <MacroRow label="Калорії" value={macros.kcal} target={MACRO_TARGETS.kcal} unit="ккал" />
          <MacroRow label="Білок" value={macros.protein} target={MACRO_TARGETS.protein} unit="г" />
          <MacroRow label="Жири" value={macros.fat} target={MACRO_TARGETS.fat} unit="г" />
          <MacroRow label="Вуглеводи" value={macros.carbs} target={MACRO_TARGETS.carbs} unit="г" />
        </div>

        <div className="ember-card mt-4 rounded-3xl p-4 shadow-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <DropletIcon />
              <span className="text-sm font-semibold">Вода</span>
            </div>
            <span className="text-sm font-semibold text-white">{waterMl} / {WATER_TARGET_ML} мл</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/25">
            <div
              className="h-full rounded-full bg-white/90"
              style={{ width: `${Math.min(100, Math.round((waterMl / WATER_TARGET_ML) * 100))}%` }}
            />
          </div>
          <div className="mt-3 flex gap-2">
            {WATER_STEPS.map((ml) => (
              <button
                key={ml}
                onClick={() => addWater(ml)}
                className="flex-1 rounded-xl bg-black/25 py-2 text-xs font-semibold text-white hover:bg-black/35"
              >
                +{ml} мл
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/90">Сьогодні з'їдено</h2>
        <button
          onClick={() => setShowPicker((v) => !v)}
          className="rounded-xl bg-ember-500 px-3 py-1.5 text-xs font-semibold text-white"
        >
          + Додати
        </button>
      </div>

      {showPicker && (
        <div className="mt-2 grid grid-cols-1 gap-1.5 rounded-2xl border border-char-600/50 bg-char-800/60 p-2 md:grid-cols-2">
          {FOOD_QUICK_ADD.map((food) => (
            <button
              key={food.name}
              onClick={() => addFood(food)}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-char-700/70"
            >
              <span className="text-sm text-white/90">{food.name}</span>
              <span className="text-xs text-[#a89a8c]">{food.kcal} ккал</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 space-y-2 pb-4 md:grid md:grid-cols-2 md:gap-2 md:space-y-0">
        {entries.length === 0 && (
          <p className="rounded-2xl border border-dashed border-char-600/60 p-4 text-center text-sm text-[#a89a8c] md:col-span-2">
            Ще нічого не додано сьогодні
          </p>
        )}
        {entries.map((e) => (
          <div key={e.id} className="flex items-center justify-between rounded-xl bg-char-800/70 px-3 py-2.5">
            <div>
              <p className="text-sm text-white/90">{e.name}</p>
              <p className="text-xs text-[#a89a8c]">Б{e.protein} / Ж{e.fat} / В{e.carbs}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#a89a8c]">{e.kcal} ккал</span>
              <button onClick={() => removeFood(e.id)} className="text-ember-300 text-xs font-semibold">
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MacroRow({ label, value, target, unit }) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/80">{label}</span>
        <span className="text-[#a89a8c]">
          {Math.round(value)} / {target} {unit}
        </span>
      </div>
      <div className="progress-track mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
        <div className="h-full rounded-full bg-gradient-to-r from-ember-600 to-ember-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
