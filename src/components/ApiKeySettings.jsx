import { useState } from 'react'

export default function ApiKeySettings({ apiKey, setApiKey }) {
  const [draft, setDraft] = useState(apiKey)
  const [visible, setVisible] = useState(false)

  function save() {
    setApiKey(draft.trim())
  }

  return (
    <div className="rounded-xl bg-char-800/70 p-3">
      <p className="text-sm text-white/90">Claude API ключ</p>
      <p className="mt-0.5 text-sm text-[#a89a8c]">
        Зберігається лише у твоєму браузері. Використовується тільки для прямих запитів до
        api.anthropic.com при аналізі фото.
      </p>
      <div className="mt-2 flex gap-2">
        <input
          type={visible ? 'text' : 'password'}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="sk-ant-..."
          className="min-w-0 flex-1 rounded-xl border border-char-600/60 bg-char-900/70 px-3 py-2 text-sm text-white outline-none focus:border-ember-400"
        />
        <button
          onClick={() => setVisible((v) => !v)}
          className="shrink-0 rounded-xl bg-char-700 px-3 py-2 text-xs font-semibold text-white"
        >
          {visible ? 'Сховати' : 'Показати'}
        </button>
      </div>
      <button
        onClick={save}
        className="mt-2 w-full rounded-xl bg-ember-500 py-2 text-sm font-semibold text-white"
      >
        Зберегти ключ
      </button>
    </div>
  )
}
