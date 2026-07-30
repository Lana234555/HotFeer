export const TOTAL_DAYS = 30

export const MACRO_TARGETS = {
  kcal: 1900,
  protein: 105,
  fat: 57,
  carbs: 235,
}

export const WATER_TARGET_ML = 2700

// 1 = Monday ... 7 = Sunday
export const WORKOUT_SCHEDULE = {
  A: {
    label: 'Тижні 1–2 · Адаптація',
    days: {
      1: { title: 'Силова нижня частина', duration: 40, exercises: [
        { name: 'Присідання', sets: '3×15' },
        { name: 'Болгарські присідання', sets: '3×12 кожна нога' },
        { name: 'Випади в ходьбі', sets: '3×20' },
        { name: 'Мостик', sets: '3×15' },
      ]},
      2: { title: 'Кардіо + рухливість', duration: 30, exercises: [
        { name: 'Швидка ходьба', sets: '20 хв' },
        { name: 'Розтягування', sets: '10 хв' },
      ]},
      3: { title: 'Силова верхня частина', duration: 35, exercises: [
        { name: 'Відтискання', sets: '3×12' },
        { name: 'Тяги', sets: '3×12' },
        { name: 'Ротації корпусу', sets: '3×15' },
      ]},
      4: { title: 'Лімфодренаж + легка аеробіка', duration: 25, exercises: [
        { name: 'Скакалка', sets: '5×1 хв' },
        { name: 'Прогулянка', sets: '15 хв' },
      ]},
      5: { title: 'Силова нижня частина', duration: 45, exercises: [
        { name: 'Мертвяки на прямих ногах', sets: '3×12' },
        { name: 'Суми', sets: '3×15 кожна' },
        { name: 'Мостик на одній нозі', sets: '3×10' },
      ]},
      6: { title: 'Активний відпочинок', duration: 45, exercises: [
        { name: 'Йога або пілатес (ноги/сідниці)', sets: '45 хв' },
      ]},
      7: { title: 'Повний відпочинок', duration: 15, exercises: [
        { name: 'Розтягування', sets: '10 хв' },
        { name: 'Дихальні вправи', sets: '5 хв' },
      ]},
    },
  },
  B: {
    label: 'Тижні 3–4 · Інтенсифікація',
    days: {
      1: { title: 'HIIT нижня частина', duration: 40, exercises: [
        { name: 'Присідання на швидкості', sets: '8–10× (30 сек/30 сек)' },
        { name: 'Мостик', sets: '3×15' },
      ]},
      2: { title: 'Кардіо за ЧСС', duration: 35, exercises: [
        { name: 'Біг підтюпцем / еліптичний (120–140 уд/хв)', sets: '35 хв' },
      ]},
      3: { title: 'Силова верхня частина', duration: 40, exercises: [
        { name: 'Відтискання (+10–15% ваги)', sets: '3×12' },
        { name: 'Тяги', sets: '3×12' },
        { name: 'Ротації корпусу', sets: '3×15' },
      ]},
      4: { title: 'Лімфодренаж HIIT', duration: 30, exercises: [
        { name: 'Ходьба в гору', sets: '15 хв' },
        { name: 'Стрибки', sets: '5×1 хв' },
      ]},
      5: { title: 'Силова нижня частина (макс)', duration: 50, exercises: [
        { name: 'Присідання (більша вага)', sets: '4×10' },
        { name: 'Болгарські присідання', sets: '3×12' },
        { name: 'Випади', sets: '3×15' },
        { name: 'Мостик', sets: '4×15' },
      ]},
      6: { title: 'Активний відпочинок', duration: 50, exercises: [
        { name: 'Пілатес або йога', sets: '35 хв' },
        { name: 'Самомасаж', sets: '15 хв' },
      ]},
      7: { title: 'Відпочинок + розтягування', duration: 30, exercises: [
        { name: 'Глибокі розтяжки', sets: '20 хв' },
        { name: 'Стабілізаційні вправи', sets: '10 хв' },
      ]},
    },
  },
}

export function getWorkoutForDay(dayNumber) {
  const phase = dayNumber <= 14 ? 'A' : 'B'
  const weekday = ((dayNumber - 1) % 7) + 1
  return { phase, ...WORKOUT_SCHEDULE[phase].days[weekday] }
}

export const CARE_ITEMS = [
  { id: 'brushing', label: 'Сухе щіткування', time: 'Ранок', hint: '5–10 хв перед душем' },
  { id: 'shower', label: 'Контрастний душ', time: 'Ранок', hint: '4–5 циклів гаряче/холодне' },
  { id: 'supplements', label: 'Добавки', time: 'Ранок', hint: 'Колаген + вітамін С + гіалурон' },
  { id: 'caffeine', label: 'Кофеїновий крем', time: 'День', hint: '2–3 рази на цільову зону' },
  { id: 'massage', label: 'Самомасаж роликом', time: 'Вечір', hint: '5–7 хв на кожну ногу' },
  { id: 'retinol', label: 'Ретинол', time: 'Вечір', hint: '2–3 рази на тиждень' },
  { id: 'hyaluronic', label: 'Гіалуронова кислота', time: 'Вечір', hint: 'Крем щодня' },
]

export const FOOD_QUICK_ADD = [
  { name: 'Курка гриль (150 г)', protein: 35, fat: 6, carbs: 0, kcal: 210 },
  { name: 'Лосось (150 г)', protein: 33, fat: 18, carbs: 0, kcal: 300 },
  { name: 'Яйце (1 шт)', protein: 6, fat: 5, carbs: 0.5, kcal: 70 },
  { name: 'Творог (150 г)', protein: 27, fat: 5, carbs: 5, kcal: 165 },
  { name: 'Вівсянка (40 г суха)', protein: 5, fat: 3, carbs: 27, kcal: 150 },
  { name: 'Батат варений (100 г)', protein: 2, fat: 0, carbs: 20, kcal: 90 },
  { name: 'Гречка варена (100 г)', protein: 4, fat: 1, carbs: 25, kcal: 110 },
  { name: 'Броколі (150 г)', protein: 4, fat: 0, carbs: 10, kcal: 55 },
  { name: 'Авокадо (½ шт)', protein: 2, fat: 15, carbs: 6, kcal: 160 },
  { name: 'Оливкова олія (1 ст.л.)', protein: 0, fat: 14, carbs: 0, kcal: 120 },
  { name: 'Грецькі горіхи (30 г)', protein: 4, fat: 20, carbs: 4, kcal: 195 },
  { name: 'Ягоди (100 г)', protein: 1, fat: 0, carbs: 12, kcal: 50 },
  { name: 'Грецький йогурт (150 г)', protein: 15, fat: 4, carbs: 6, kcal: 110 },
]

export const PROGRESS_METRICS = [
  { key: 'visibility', label: 'Видимість целюліту', invert: true },
  { key: 'elasticity', label: 'Еластичність шкіри' },
  { key: 'confidence', label: 'Впевненість' },
]
