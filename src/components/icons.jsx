const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...stroke} {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
    </svg>
  )
}

export function DumbbellIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...stroke} {...props}>
      <path d="M6.5 8.5v7M17.5 8.5v7" />
      <path d="M3.5 10.5v3M20.5 10.5v3" />
      <path d="M6.5 12h11" />
    </svg>
  )
}

export function AppleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...stroke} {...props}>
      <path d="M12 9c-2.8 0-5 2-5 5.2C7 17.8 9.3 20 11.4 20c.9 0 1.2-.4 2-.4s1.1.4 2 .4c2.1 0 4.6-2.4 4.6-5.6C20 11 17.8 9 15 9c-1 0-1.6.4-2 .4S13 9 12 9Z" />
      <path d="M12.6 8.4c.2-1.3 1.2-2.2 2.4-2.4" />
    </svg>
  )
}

export function DropletIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...stroke} {...props}>
      <path d="M12 3.5S6 10 6 14.2A6 6 0 0 0 18 14.2C18 10 12 3.5 12 3.5Z" />
    </svg>
  )
}

export function ChartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...stroke} {...props}>
      <path d="M4 20V10M11 20V4M18 20v-7" />
    </svg>
  )
}

export function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...stroke} {...props}>
      <path d="M4 12.5 9 17.5 20 6" />
    </svg>
  )
}

export function FlameIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke} {...props}>
      <path d="M12 3c1 3-3 4-3 7.5a3 3 0 0 0 6 0c0-1.2-.6-1.8-.9-2.6.9.4 2.4 1.7 2.4 4.3a4.5 4.5 0 0 1-9 0C7.5 8 12 6.5 12 3Z" />
    </svg>
  )
}
