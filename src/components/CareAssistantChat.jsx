import { useState } from 'react'
import { generateCarePlan } from '../utils/careAssistant.js'
import { FlameIcon } from './icons.jsx'

export default function CareAssistantChat({ apiKey, questions, title, intro, previousPlan, onComplete, onClose }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [phase, setPhase] = useState('asking') // asking | loading | result | error
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const currentQuestion = questions[stepIndex]
  const isLast = stepIndex === questions.length - 1

  function submitAnswer(skip) {
    const answer = skip ? '' : inputValue.trim()
    const nextAnswers = [...answers, { question: currentQuestion.text, answer }]
    setAnswers(nextAnswers)
    setInputValue('')
    if (isLast) {
      finish(nextAnswers)
    } else {
      setStepIndex((i) => i + 1)
    }
  }

  async function finish(finalAnswers) {
    setPhase('loading')
    setError('')
    try {
      const plan = await generateCarePlan({ apiKey, answers: finalAnswers, previousPlan })
      setResult(plan)
      setPhase('result')
    } catch (err) {
      setError(err?.message || 'Не вдалося згенерувати план. Спробуй ще раз.')
      setPhase('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-char-950 font-sans text-[#f5f1ec]">
      <div className="flex items-center justify-between border-b border-char-600/50 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ember-500/15 text-ember-300">
            <FlameIcon width={18} height={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold">{title}</h1>
            {phase === 'asking' && (
              <p className="text-sm text-[#a89a8c]">Питання {stepIndex + 1} з {questions.length}</p>
            )}
          </div>
        </div>
        <button onClick={onClose} className="text-sm font-medium text-[#a89a8c] hover:text-white">
          Закрити
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {intro && answers.length === 0 && (
          <div className="mb-4 max-w-[85%] rounded-2xl rounded-bl-sm bg-char-800/70 px-4 py-2.5 text-sm text-white/80">
            {intro}
          </div>
        )}

        {answers.map((a, i) => (
          <div key={i} className="mb-3">
            <div className="mb-1 max-w-[85%] rounded-2xl rounded-bl-sm bg-char-800/70 px-4 py-2.5 text-sm text-white/90">
              {a.question}
            </div>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-ember-500/90 px-4 py-2.5 text-right text-sm text-white">
              {a.answer || '—'}
            </div>
          </div>
        ))}

        {phase === 'asking' && currentQuestion && (
          <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-char-800/70 px-4 py-2.5 text-sm text-white/90">
            {currentQuestion.text}
          </div>
        )}

        {phase === 'loading' && <p className="mt-4 text-center text-sm text-[#a89a8c]">Складаю персональний план…</p>}

        {phase === 'error' && <p className="mt-4 text-sm text-ember-300">{error}</p>}

        {phase === 'result' && result && (
          <div className="mt-2 rounded-3xl border border-char-600/50 bg-char-800/60 p-4">
            <p className="text-sm text-white/90">{result.summary}</p>
            {result.cautions.length > 0 && (
              <div className="mt-3 rounded-xl bg-ember-500/10 p-3">
                <p className="mb-1 text-sm font-semibold text-ember-300">Застереження</p>
                {result.cautions.map((c, i) => (
                  <p key={i} className="text-sm text-white/80">• {c}</p>
                ))}
              </div>
            )}
            <div className="mt-3 space-y-2">
              {result.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl bg-char-900/60 px-3 py-2.5">
                  <div>
                    <p className="text-sm text-white/90">{item.label}</p>
                    <p className="text-sm text-[#a89a8c]">{item.hint}</p>
                  </div>
                  <span className="text-sm text-[#a89a8c]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-char-600/50 px-4 py-4">
        {phase === 'asking' && (
          <>
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue.trim()) submitAnswer(false)
                }}
                placeholder="Твоя відповідь…"
                className="flex-1 rounded-xl border border-char-600/60 bg-char-800/70 px-3 py-2.5 text-sm text-white outline-none focus:border-ember-400"
              />
              <button
                onClick={() => submitAnswer(false)}
                disabled={!inputValue.trim()}
                className="rounded-xl bg-ember-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
              >
                {isLast ? 'Завершити' : 'Далі'}
              </button>
            </div>
            <button onClick={() => submitAnswer(true)} className="mt-2 text-sm font-medium text-[#a89a8c] hover:text-white">
              Пропустити питання
            </button>
          </>
        )}

        {phase === 'error' && (
          <button
            onClick={() => finish(answers)}
            className="w-full rounded-xl bg-ember-500 py-2.5 text-sm font-semibold text-white"
          >
            Спробувати ще раз
          </button>
        )}

        {phase === 'result' && (
          <button
            onClick={() => onComplete(result, answers)}
            className="w-full rounded-xl bg-ember-500 py-2.5 text-sm font-semibold text-white shadow-glow"
          >
            Зберегти план
          </button>
        )}
      </div>
    </div>
  )
}
