import { useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { FlameIcon } from './icons.jsx'

export default function ResetPassword({ onDone }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) throw err
      onDone()
    } catch (err) {
      setError(err?.message?.includes('Password should be') ? 'Пароль замалий — мінімум 6 символів.' : 'Щось пішло не так. Спробуй ще раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-char-950 px-4 font-sans text-[#f5f1ec]">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember-500/15 text-ember-300">
            <FlameIcon />
          </div>
          <h1 className="text-xl font-semibold">Новий пароль</h1>
          <p className="text-sm text-[#a89a8c]">Придумай новий пароль для входу</p>
        </div>

        <form onSubmit={submit} className="ember-card-soft rounded-3xl border border-char-600/50 p-5">
          <label className="block">
            <span className="text-sm text-white/80">Новий пароль</span>
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

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-ember-500 py-2.5 text-sm font-semibold text-white shadow-glow disabled:opacity-60"
          >
            {loading ? 'Зачекай…' : 'Зберегти пароль'}
          </button>
        </form>
      </div>
    </div>
  )
}
