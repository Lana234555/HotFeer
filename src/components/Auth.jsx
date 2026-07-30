import { useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabaseClient.js'
import { FlameIcon } from './icons.jsx'

export default function Auth() {
  const [mode, setMode] = useState('signIn') // 'signIn' | 'signUp'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      if (mode === 'signIn') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
      } else {
        const { error: err } = await supabase.auth.signUp({ email, password })
        if (err) throw err
        setInfo('Перевір пошту — надіслали лист для підтвердження акаунта.')
      }
    } catch (err) {
      setError(translateError(err?.message))
    } finally {
      setLoading(false)
    }
  }

  if (!supabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-char-950 px-4 text-center font-sans text-[#f5f1ec]">
        <div className="max-w-sm">
          <p className="text-lg font-semibold">База даних не налаштована</p>
          <p className="mt-2 text-sm text-[#a89a8c]">
            Додай VITE_SUPABASE_URL і VITE_SUPABASE_ANON_KEY у .env, щоб увімкнути вхід і збереження даних.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-char-950 px-4 font-sans text-[#f5f1ec]">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember-500/15 text-ember-300">
            <FlameIcon />
          </div>
          <h1 className="text-xl font-semibold">HotFeet</h1>
          <p className="text-sm text-[#a89a8c]">
            {mode === 'signIn' ? 'Увійди, щоб продовжити свій план' : 'Створи акаунт для 30-денного плану'}
          </p>
        </div>

        <form onSubmit={submit} className="ember-card-soft rounded-3xl border border-char-600/50 p-5">
          <label className="block">
            <span className="text-sm text-white/80">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-char-600/60 bg-char-800/70 px-3 py-2.5 text-sm text-white outline-none focus:border-ember-400"
              placeholder="you@example.com"
            />
          </label>

          <label className="mt-3 block">
            <span className="text-sm text-white/80">Пароль</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-char-600/60 bg-char-800/70 px-3 py-2.5 text-sm text-white outline-none focus:border-ember-400"
              placeholder="мінімум 6 символів"
            />
          </label>

          {error && <p className="mt-3 text-sm text-ember-300">{error}</p>}
          {info && <p className="mt-3 text-sm text-[#a89a8c]">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-ember-500 py-2.5 text-sm font-semibold text-white shadow-glow disabled:opacity-60"
          >
            {loading ? 'Зачекай…' : mode === 'signIn' ? 'Увійти' : 'Зареєструватися'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode((m) => (m === 'signIn' ? 'signUp' : 'signIn'))
            setError('')
            setInfo('')
          }}
          className="mt-4 w-full text-center text-sm font-medium text-ember-300"
        >
          {mode === 'signIn' ? 'Ще немає акаунта? Зареєструватися' : 'Вже є акаунт? Увійти'}
        </button>
      </div>
    </div>
  )
}

function translateError(message) {
  if (!message) return 'Щось пішло не так. Спробуй ще раз.'
  if (message.includes('Invalid login credentials')) return 'Невірний email або пароль.'
  if (message.includes('User already registered')) return 'Акаунт з таким email вже існує.'
  if (message.includes('Password should be')) return 'Пароль замалий — мінімум 6 символів.'
  return message
}
