import { useEffect, useState } from 'react'

import { AppIcon } from '../../components/AppIcon/AppIcon'
import styles from './DesktopScreen.module.css'

type DesktopScreenProps = {
  onOpenAccessLog: () => void
  onOpenCamera: () => void
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function DesktopScreen({ onOpenAccessLog, onOpenCamera }: DesktopScreenProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), 1_000)
    return () => window.clearInterval(timerId)
  }, [])

  return (
    <section aria-labelledby="desktop-title" className={styles.desktop}>
      <h1 className={styles.visuallyHidden} id="desktop-title">CIA社内デスクトップ</h1>

      <div aria-hidden="true" className={styles.wallpaperBrand}>
        <span>CIA</span>
        <strong>INTERNAL NETWORK</strong>
        <small>AUTHORIZED PERSONNEL ONLY</small>
      </div>

      <div aria-label="デスクトップのアプリ" className={styles.shortcuts} role="group">
        <AppIcon
          badge="LOCKED"
          description="録画映像とカメラ診断"
          icon="camera"
          label="監視カメラ"
          onOpen={onOpenCamera}
          systemLabel="SURVEILLANCE"
        />
        <AppIcon
          description="社員IDの入退室履歴"
          icon="log"
          label="入退室ログ"
          onOpen={onOpenAccessLog}
          systemLabel="ACCESS LOG"
        />
      </div>

      <aside className={styles.desktopWidget} aria-label="端末状態">
        <div><span className={styles.statusDot} />CIA-SEC-07</div>
        <strong>INTERNAL NETWORK</strong>
        <small>LOCAL CACHE READY</small>
      </aside>

      <footer className={styles.taskbar}>
        <div className={styles.taskbarLeft}>
          <button aria-label="スタート" className={styles.startButton} type="button">
            <i /><i /><i /><i />
          </button>
          <div className={styles.search}>⌕&nbsp; 社内システムを検索</div>
          <span className={styles.pinnedApp}>CIA</span>
        </div>
        <div className={styles.taskbarRight}>
          <span className={styles.tray}>⌃ · ▮▮ · ▰</span>
          <time dateTime={now.toISOString()}>
            <strong>{formatTime(now)}</strong>
            <small>{formatDate(now)}</small>
          </time>
        </div>
      </footer>
    </section>
  )
}
