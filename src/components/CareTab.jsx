import { useState } from 'react'
import { CARE_ITEMS } from '../data/plan.js'
import { CARE_ONBOARDING_QUESTIONS, CARE_WEEKLY_CHECKIN_QUESTIONS } from '../data/careQuestions.js'
import { CheckIcon } from './icons.jsx'
import CareAssistantChat from './CareAssistantChat.jsx'
import ApiKeySettings from './ApiKeySettings.jsx'

const GROUPS = ['Ранок', 'День', 'Вечір']
const CHECKIN_DAYS = 7
const FULL_REFRESH_DAYS = 30

export default function CareTab({ today, care, setCare, careProfile, setCareProfile, anthropicApiKey, setAnthropicApiKey }) {
  const [showSettings, setShowSettings] = useState(false)
  const [chatMode, setChatMode] = useState(null) // null | 'onboarding' | 'checkin'

  const items = careProfile?.items?.length ? careProfile.items : CARE_ITEMS
  const todaysCare = care[today] || {}
  const doneCount = items.filter((i) => todaysCare[i.id]).length

  function toggle(id) {
    setCare({ ...care, [today]: { ...todaysCare, [id]: !todaysCare[id] } })
  }

  const daysSinceUpdate = careProfile?.updatedAt ? daysBetween(careProfile.updatedAt, today) : -1
  const daysSinceFull = careProfile?.fullAt ? daysBetween(careProfile.fullAt, today) : -1
  const dueForFull = careProfile && daysSinceFull >= FULL_REFRESH_DAYS
  const dueForCheckin = careProfile && (dueForFull || daysSinceUpdate >= CHECKIN_DAYS)

  function openAssistant() {
    if (!anthropicApiKey) {
      setShowSettings(true)
      return
    }
    setChatMode('onboarding')
  }

  function openCheckin() {
    if (!anthropicApiKey) {
      setShowSettings(true)
      return
    }
    setChatMode(dueForFull ? 'onboarding' : 'checkin')
  }

  function handleComplete(plan, answers) {
    setCareProfile({
      items: plan.items,
      summary: plan.summary,
      cautions: plan.cautions,
      answers,
      updatedAt: today,
      fullAt: chatMode === 'onboarding' ? today : careProfile?.fullAt || today,
      createdAt: careProfile?.createdAt || today,
    })
    setChatMode(null)
  }

  return (
    <div className="px-4 pt-8 md:px-0 md:pt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Домашній догляд</h1>
        <span className="text-base text-[#a89a8c]">{doneCount}/{items.length}</span>
      </div>

      <div className="progress-track mt-3 h-2 w-full overflow-hidden rounded-full">
        <div
          className="h-full rounded-full bg-gradient-to-r from-ember-600 to-ember-300"
          style={{ width: `${Math.round((doneCount / items.length) * 100)}%` }}
        />
      </div>

      <div className="ember-card-soft mt-4 rounded-3xl border border-char-600/50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/90">AI-асистент з догляду</h2>
          <button onClick={() => setShowSettings((v) => !v)} className="text-sm font-medium text-ember-300">
            ⚙ Ключ
          </button>
        </div>

        {showSettings && (
          <div className="mt-3">
            <ApiKeySettings apiKey={anthropicApiKey} setApiKey={setAnthropicApiKey} />
          </div>
        )}

        {careProfile ? (
          <>
            <p className="mt-3 text-sm text-white/80">{careProfile.summary}</p>
            {careProfile.cautions?.length > 0 && (
              <div className="mt-2 rounded-xl bg-ember-500/10 p-3">
                {careProfile.cautions.map((c, i) => (
                  <p key={i} className="text-sm text-white/80">• {c}</p>
                ))}
              </div>
            )}
            <button onClick={openAssistant} className="mt-3 w-full rounded-xl bg-char-700 py-2.5 text-sm font-semibold text-white">
              Пройти анкету заново
            </button>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-white/80">
              Пройди коротку анкету (20 питань) — AI складе персональний план догляду з урахуванням твоїх алергій та здоров'я.
            </p>
            <button
              onClick={openAssistant}
              className="mt-3 w-full rounded-xl bg-ember-500 py-2.5 text-sm font-semibold text-white shadow-glow"
            >
              Почати анкету
            </button>
          </>
        )}
      </div>

      {dueForCheckin && (
        <button onClick={openCheckin} className="ember-card mt-4 w-full rounded-3xl p-4 text-left shadow-glow">
          <p className="text-sm font-semibold text-white">
            {dueForFull ? 'Час для щомісячного оновлення плану' : 'Що змінилось за тиждень?'}
          </p>
          <p className="mt-1 text-sm text-white/80">Дай знати про зміни — оновимо план догляду під тебе.</p>
        </button>
      )}

      <div className="md:grid md:grid-cols-3 md:items-start md:gap-5">
        {GROUPS.map((group) => {
          const groupItems = items.filter((i) => i.time === group)
          if (!groupItems.length) return null
          return (
            <div key={group} className="ember-card-soft mt-4 rounded-3xl border border-char-600/50 p-4">
              <h2 className="mb-3 text-sm font-semibold text-white/90">{group}</h2>
              <div className="space-y-2">
                {groupItems.map((item) => {
                  const done = Boolean(todaysCare[item.id])
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className="flex w-full items-center justify-between rounded-xl bg-char-800/70 px-3 py-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                            done ? 'border-ember-400 bg-ember-500 text-white' : 'border-char-600 text-transparent'
                          }`}
                        >
                          <CheckIcon />
                        </div>
                        <div>
                          <p className={`text-sm ${done ? 'text-white/60 line-through' : 'text-white/90'}`}>{item.label}</p>
                          <p className="text-sm text-[#a89a8c]">{item.hint}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {chatMode && (
        <CareAssistantChat
          apiKey={anthropicApiKey}
          questions={chatMode === 'onboarding' ? CARE_ONBOARDING_QUESTIONS : CARE_WEEKLY_CHECKIN_QUESTIONS}
          title={chatMode === 'onboarding' ? 'Анкета догляду' : 'Що змінилось?'}
          intro={
            chatMode === 'onboarding'
              ? "Дай відповіді на кілька питань — і я складу персональний план догляду."
              : 'Коротко розкажи, що змінилось — оновлю план під тебе.'
          }
          previousPlan={careProfile}
          onComplete={handleComplete}
          onClose={() => setChatMode(null)}
        />
      )}
    </div>
  )
}

function daysBetween(dateStr, todayStr) {
  const a = new Date(dateStr)
  const b = new Date(todayStr)
  return Math.floor((b - a) / (1000 * 60 * 60 * 24))
}
