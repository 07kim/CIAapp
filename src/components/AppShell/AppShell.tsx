import { useEffect, useState, type ReactNode } from 'react'

import styles from './AppShell.module.css'

type AppShellProps = {
  children: ReactNode
  compact?: boolean
  desktop?: boolean
  homeDisabled?: boolean
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
  desktop = false,
  homeDisabled = false,
  onRequestHome,
  subtitle,
  title,
}: AppShellProps) {
  const [now, setNow] = useState(() => new Date())
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  const [offlineReady, setOfflineReady] = useState(
    () => 'serviceWorker' in navigator && Boolean(navigator.serviceWorker.controller),
  )

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), 1_000)
    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    const updateConnection = () => setIsOnline(navigator.onLine)
    const updateOfflineReadiness = () => setOfflineReady(true)

    window.addEventListener('online', updateConnection)
    window.addEventListener('offline', updateConnection)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener(
        'controllerchange',
        updateOfflineReadiness,
      )
      void navigator.serviceWorker.ready.then(updateOfflineReadiness)
    }

    return () => {
      window.removeEventListener('online', updateConnection)
      window.removeEventListener('offline', updateConnection)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener(
          'controllerchange',
          updateOfflineReadiness,
        )
      }
    }
  }, [])

  const systemStatus = !isOnline
    ? 'OFFLINE LOCAL'
    : offlineReady
      ? 'LOCAL READY'
      : 'SYSTEM ONLINE'

  return (
    <div className={`${styles.shell} ${compact ? styles.compact : ''} ${desktop ? styles.desktop : ''}`}>
      <div aria-hidden="true" className={styles.shellMotion}>
        <span /><span />
      </div>
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
          <span
            className={`${styles.online} ${!isOnline ? styles.offline : ''}`}
          >
            {systemStatus}
          </span>
          <time dateTime={now.toISOString()}>{formatClock(now)}</time>
          {onRequestHome ? (
            <button disabled={homeDisabled} onClick={onRequestHome} type="button">
              <span aria-hidden="true" className={styles.homeGlyph}><i /></span>
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
