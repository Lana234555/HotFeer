import { CARE_ITEMS, MACRO_TARGETS, WATER_TARGET_ML } from '../data/plan.js'

export function sumMacros(entries = []) {
  return entries.reduce(
    (acc, e) => ({
      protein: acc.protein + e.protein,
      fat: acc.fat + e.fat,
      carbs: acc.carbs + e.carbs,
      kcal: acc.kcal + e.kcal,
    }),
    { protein: 0, fat: 0, carbs: 0, kcal: 0 }
  )
}

export function computeDailyScore({ workoutDone, waterMl, nutritionEntries, care }) {
  const workoutScore = workoutDone ? 1 : 0

  const waterScore = Math.min(1, waterMl / WATER_TARGET_ML)

  const macros = sumMacros(nutritionEntries)
  const kcalRatio = macros.kcal === 0 ? 0 : Math.min(1, macros.kcal / MACRO_TARGETS.kcal)
  const proteinRatio = Math.min(1, macros.protein / MACRO_TARGETS.protein)
  const nutritionScore = (Math.min(1, kcalRatio) * 0.5 + proteinRatio * 0.5)

  const careDone = CARE_ITEMS.filter((item) => care?.[item.id]).length
  const careScore = careDone / CARE_ITEMS.length

  const total = workoutScore * 0.25 + waterScore * 0.25 + nutritionScore * 0.25 + careScore * 0.25
  return Math.round(total * 100)
}
