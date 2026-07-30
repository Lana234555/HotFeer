import { HomeIcon, DumbbellIcon, AppleIcon, DropletIcon, ChartIcon } from './icons.jsx'

const TABS = [
  { id: 'home', label: 'Головна', Icon: HomeIcon },
  { id: 'workout', label: 'Тренування', Icon: DumbbellIcon },
  { id: 'nutrition', label: 'Харчування', Icon: AppleIcon },
  { id: 'care', label: 'Догляд', Icon: DropletIcon },
  { id: 'progress', label: 'Прогрес', Icon: ChartIcon },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md px-3 pb-3
        md:inset-y-0 md:left-0 md:right-auto md:mx-0 md:w-28 md:max-w-none md:px-4 md:py-6"
    >
      <div
        className="flex items-center justify-between rounded-3xl border border-char-600/60 bg-char-900/90 px-2 py-2 shadow-glow backdrop-blur
          md:h-full md:flex-col md:justify-start md:gap-3 md:rounded-[28px] md:px-2 md:py-5"
      >
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-colors md:flex-none md:w-full md:py-3 ${
                isActive ? 'bg-ember-500/15 text-ember-300' : 'text-char-600 text-opacity-100'
              }`}
              style={!isActive ? { color: '#847c73' } : undefined}
            >
              <Icon />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
