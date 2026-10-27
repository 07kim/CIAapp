import styles from './AppIcon.module.css'

type AppIconProps = {
  badge?: string
  description: string
  icon: 'camera' | 'log'
  label: string
  onOpen: () => void
  systemLabel: string
}

function CameraIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64">
      <path d="M8 14h48v36H8z" />
      <path d="M8 24h7M49 24h7M8 40h7M49 40h7" />
      <circle cx="32" cy="32" r="11" />
      <circle cx="32" cy="32" r="3" />
      <path d="M32 17v6M32 41v6M17 32h6M41 32h6" />
    </svg>
  )
}

function LogIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64">
      <path d="M10 9h44v46H10zM18 18h28" />
      <path d="M20 43V30h12v-7h12v20" />
      <circle cx="20" cy="46" r="3" />
      <circle cx="32" cy="46" r="3" />
      <circle cx="44" cy="46" r="3" />
      <path d="M20 33h12M32 28h12" />
    </svg>
  )
}

export function AppIcon({
  badge,
  description,
  icon,
  label,
  onOpen,
  systemLabel,
}: AppIconProps) {
  return (
    <button
      className={styles.app}
      onDoubleClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          onOpen()
        }
      }}
      title="ダブルクリックで起動"
      type="button"
    >
      <span className={styles.iconFrame}>
        <span aria-hidden="true" className={styles.iconIndex}>{icon === 'camera' ? '01' : '03'}</span>
        {icon === 'camera' ? <CameraIcon /> : <LogIcon />}
        {badge ? <span className={styles.badge}>!</span> : null}
      </span>
      <span className={styles.copy}>
        <strong>{label}</strong>
        <span className={styles.systemLabel}>{systemLabel}</span>
        <span className={styles.description}>{description}</span>
      </span>
    </button>
  )
}
