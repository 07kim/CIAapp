import { useEffect, useState, type ReactNode } from 'react'

import styles from './AppShell.module.css'

type AppShellProps = {
  children: ReactNode
  compact?: boolean
  onRequestHome?: () => void
  subtitle: string
  title: string
}

function formatClock(date: Date) {
  return new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

export function AppShell({
  children,
  compact = false,
  onRequestHome,
  subtitle,
  title,
}: AppShellProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), 1_000)
    return () => window.clearInterval(timerId)
  }, [])

  return (
    <div className={`${styles.shell} ${compact ? styles.compact : ''}`}>
      <header className={styles.header}>
        <div className={styles.brand} aria-label="CIA Internet Co.">
          <span aria-hidden="true" className={styles.brandMark}>
            <img src="/assets/brand/cia-logo-source.png" alt="" />
          </span>
          <span>
            <strong>CIA Internet Co.</strong>
            <small>CORPORATE SECURITY NETWORK</small>
          </span>
        </div>

        <div className={styles.screenTitle}>
          <span>{subtitle}</span>
          <strong>{title}</strong>
        </div>

        <div className={styles.controls}>
          <span className={styles.online}>SYSTEM ONLINE</span>
          <time dateTime={now.toISOString()}>{formatClock(now)}</time>
          {onRequestHome ? (
            <button onClick={onRequestHome} type="button">
              ホーム
            </button>
          ) : null}
        </div>
      </header>
      <main className={styles.content}>{children}</main>
      <footer className={styles.footer}>
        <span>TERMINAL ID: CIA-SEC-07</span>
        <span>ENCRYPTED INTERNAL ACCESS</span>
      </footer>
    </div>
  )
}
