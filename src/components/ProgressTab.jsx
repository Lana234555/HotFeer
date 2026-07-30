import { useState } from 'react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { MACRO_TARGETS } from '../data/plan.js'
import { sumMacros } from '../utils/score.js'

const EMBER = '#ff7a2e'

export default function ProgressTab({ today, dayNumber, nutrition, progress, setProgress }) {
  const [form, setForm] = useState({ visibility: 7, elasticity: 4, confidence: 5, thigh: '', pinch: '' })

  const macros = sumMacros(nutrition[today] || [])
  const radarData = [
    { metric: 'Білок', value: Math.round(Math.min(100, (macros.protein / MACRO_TARGETS.protein) * 100)) },
    { metric: 'Жири', value: Math.round(Math.min(100, (macros.fat / MACRO_TARGETS.fat) * 100)) },
    { metric: 'Вуглеводи', value: Math.round(Math.min(100, (macros.carbs / MACRO_TARGETS.carbs) * 100)) },
    { metric: 'Ккал', value: Math.round(Math.min(100, (macros.kcal / MACRO_TARGETS.kcal) * 100)) },
  ]

  const lineData = [...progress]
    .sort((a, b) => a.day - b.day)
    .map((p) => ({ day: `Д${p.day}`, Видимість: p.visibility, Еластичність: p.elasticity, Впевненість: p.confidence }))

  function saveEntry() {
    const entry = {
      day: dayNumber,
      date: today,
      visibility: Number(form.visibility),
      elasticity: Number(form.elasticity),
      confidence: Number(form.confidence),
      thigh: form.thigh === '' ? null : Number(form.thigh),
      pinch: form.pinch === '' ? null : Number(form.pinch),
    }
    const withoutToday = progress.filter((p) => p.date !== today)
    setProgress([...withoutToday, entry])
  }

  return (
    <div className="px-4 pt-8 md:px-0 md:pt-10">
      <h1 className="text-xl font-semibold md:text-2xl">Прогрес</h1>
      <p className="mt-1 text-sm text-[#a89a8c]">День {dayNumber} · щотижневі виміри</p>

      <div className="md:grid md:grid-cols-2 md:items-start md:gap-6">
        <div className={`ember-card-soft mt-4 rounded-3xl border border-char-600/50 p-4 ${lineData.length === 0 ? 'md:col-span-2' : ''}`}>
          <h2 className="mb-2 text-sm font-semibold text-white/90">Макронутрієнти сьогодні (% від цілі)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} outerRadius="75%">
              <PolarGrid stroke="#332e29" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#c9bfb3', fontSize: 11 }} />
              <Radar dataKey="value" stroke={EMBER} fill={EMBER} fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {lineData.length > 0 && (
          <div className="ember-card-soft mt-4 rounded-3xl border border-char-600/50 p-4">
            <h2 className="mb-2 text-sm font-semibold text-white/90">Динаміка за тижнями</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData} margin={{ left: -20, top: 5, right: 10 }}>
                <CartesianGrid stroke="#262320" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#a89a8c', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fill: '#a89a8c', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1b1917', border: '1px solid #332e29', borderRadius: 12 }} />
                <Line type="monotone" dataKey="Видимість" stroke="#ff5a1a" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Еластичність" stroke="#ffb37a" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Впевненість" stroke="#fff2e6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="ember-card-soft mt-4 mb-4 rounded-3xl border border-char-600/50 p-4 md:mx-auto md:max-w-md">
        <h2 className="mb-3 text-sm font-semibold text-white/90">Додати вимір за сьогодні</h2>
        <Slider label="Видимість целюліту (1-10)" value={form.visibility} onChange={(v) => setForm({ ...form, visibility: v })} />
        <Slider label="Еластичність шкіри (1-10)" value={form.elasticity} onChange={(v) => setForm({ ...form, elasticity: v })} />
        <Slider label="Впевненість (1-10)" value={form.confidence} onChange={(v) => setForm({ ...form, confidence: v })} />

        <div className="mt-3 grid grid-cols-2 gap-3">
          <NumberField label="Обхват стегна, см" value={form.thigh} onChange={(v) => setForm({ ...form, thigh: v })} />
          <NumberField label="Pinch-тест, мм" value={form.pinch} onChange={(v) => setForm({ ...form, pinch: v })} />
        </div>

        <button onClick={saveEntry} className="mt-4 w-full rounded-xl bg-ember-500 py-2.5 text-sm font-semibold text-white">
          Зберегти вимір
        </button>
      </div>
    </div>
  )
}

function Slider({ label, value, onChange }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/80">{label}</span>
        <span className="text-ember-300 font-semibold">{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full accent-ember-500"
      />
    </div>
  )
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs text-white/80">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-char-600/60 bg-char-800/70 px-3 py-2 text-sm text-white outline-none focus:border-ember-400"
      />
    </label>
  )
}
