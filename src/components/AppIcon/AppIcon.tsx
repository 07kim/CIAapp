import styles from './AppIcon.module.css'

type AppIconProps = {
  badge?: string
  description: string
  icon: 'camera' | 'log'
  label: string
  onOpen: () => void
  onSelect: () => void
  selected: boolean
  systemLabel: string
}

function CameraIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64">
      <path d="M9 18h31a6 6 0 0 1 6 6v19a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6Z" />
      <path d="m46 27 15-8v29l-15-8Z" />
      <circle cx="24" cy="33.5" r="9" />
      <circle cx="24" cy="33.5" r="3" />
    </svg>
  )
}

function LogIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64">
      <path d="M13 5h38a6 6 0 0 1 6 6v42a6 6 0 0 1-6 6H13a6 6 0 0 1-6-6V11a6 6 0 0 1 6-6Z" />
      <path d="M18 20h28M18 32h28M18 44h18" />
      <circle cx="46" cy="44" r="3" />
    </svg>
  )
}

export function AppIcon({
  badge,
  description,
  icon,
  label,
  onOpen,
  onSelect,
  selected,
  systemLabel,
}: AppIconProps) {
  return (
    <button
      aria-pressed={selected}
      className={`${styles.app} ${selected ? styles.selected : ''}`}
      onClick={onSelect}
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
