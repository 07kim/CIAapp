import { useEffect, useState, type MouseEvent } from 'react'

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

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date)
}

function getCalendarDays(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  return [
    ...Array.from<null>({ length: firstWeekday }).fill(null),
    ...Array.from({ length: lastDate }, (_, index) => index + 1),
  ]
}

export function DesktopScreen({ onOpenAccessLog, onOpenCamera }: DesktopScreenProps) {
  const [now, setNow] = useState(() => new Date())
  const [startOpen, setStartOpen] = useState(false)
  const [networkOpen, setNetworkOpen] = useState(false)
  const [quickOpen, setQuickOpen] = useState(false)
  const [clockOpen, setClockOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), 1_000)
    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    const closePanels = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setStartOpen(false)
        setNetworkOpen(false)
        setQuickOpen(false)
        setClockOpen(false)
      }
    }

    window.addEventListener('keydown', closePanels)
    return () => window.removeEventListener('keydown', closePanels)
  }, [])

  const showCamera = searchQuery.length === 0 || '監視カメラ surveillance'.includes(searchQuery.toLowerCase())
  const showAccessLog = searchQuery.length === 0 || '入退室ログ access log'.includes(searchQuery.toLowerCase())

  const closeDesktopPanels = (event: MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) {
      setStartOpen(false)
      setNetworkOpen(false)
      setQuickOpen(false)
      setClockOpen(false)
    }
  }

  return (
    <section
      aria-labelledby="desktop-title"
      className={styles.desktop}
      onClick={closeDesktopPanels}
    >
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

      {startOpen ? (
        <section aria-label="スタートメニュー" className={styles.startMenu}>
          <label>
            <span className={styles.visuallyHidden}>アプリを検索</span>
            <input
              autoFocus
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="アプリを検索"
              type="search"
              value={searchQuery}
            />
          </label>
          <strong>ピン留め済み</strong>
          <div className={styles.startApps}>
            {showCamera ? (
              <button onClick={onOpenCamera} type="button">
                <span className={styles.miniIcon}>◉</span>
                監視カメラ
              </button>
            ) : null}
            {showAccessLog ? (
              <button onClick={onOpenAccessLog} type="button">
                <span className={styles.miniIcon}>▤</span>
                入退室ログ
              </button>
            ) : null}
            {!showCamera && !showAccessLog ? (
              <p>一致するアプリはありません</p>
            ) : null}
          </div>
          <footer>
            <span><i className={styles.statusDot} />CIA-SEC-07</span>
            <button aria-label="スタートメニューを閉じる" onClick={() => setStartOpen(false)} type="button">×</button>
          </footer>
        </section>
      ) : null}

      {networkOpen ? (
        <section aria-label="CIAネットワーク情報" className={styles.networkPanel}>
          <header>
            <strong>CIA NETWORK</strong>
            <button aria-label="ネットワーク情報を閉じる" onClick={() => setNetworkOpen(false)} type="button">×</button>
          </header>
          <dl>
            <div><dt>端末</dt><dd>CIA-SEC-07</dd></div>
            <div><dt>接続</dt><dd>INTERNAL</dd></div>
            <div><dt>キャッシュ</dt><dd>READY</dd></div>
            <div><dt>暗号化</dt><dd>ACTIVE</dd></div>
          </dl>
        </section>
      ) : null}

      {quickOpen ? (
        <section aria-label="クイック状態" className={styles.quickPanel}>
          <header>
            <strong>QUICK STATUS</strong>
            <button aria-label="クイック状態を閉じる" onClick={() => setQuickOpen(false)} type="button">×</button>
          </header>
          <div className={styles.quickGrid}>
            <div><span>▮▮</span><strong>ネットワーク</strong><small>接続中</small></div>
            <div><span>▰</span><strong>ローカル保存</strong><small>準備完了</small></div>
            <div><span>◆</span><strong>セキュリティ</strong><small>有効</small></div>
          </div>
        </section>
      ) : null}

      {clockOpen ? (
        <section aria-label="日時とカレンダー" className={styles.clockPanel}>
          <header>
            <div>
              <strong>{formatTime(now)}</strong>
              <span>{formatLongDate(now)}</span>
            </div>
            <button aria-label="日時とカレンダーを閉じる" onClick={() => setClockOpen(false)} type="button">×</button>
          </header>
          <div className={styles.calendarHeader}>
            {now.getFullYear()}年 {now.getMonth() + 1}月
          </div>
          <div aria-label={`${now.getFullYear()}年${now.getMonth() + 1}月のカレンダー`} className={styles.calendarGrid}>
            {['日', '月', '火', '水', '木', '金', '土'].map((weekday) => <b key={weekday}>{weekday}</b>)}
            {getCalendarDays(now).map((day, index) => (
              <span className={day === now.getDate() ? styles.today : ''} key={`${day ?? 'empty'}-${index}`}>
                {day ?? ''}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <footer className={styles.taskbar}>
        <div className={styles.taskbarLeft}>
          <button
            aria-expanded={startOpen}
            aria-label="スタート"
            className={`${styles.startButton} ${startOpen ? styles.activeTaskButton : ''}`}
            onClick={() => {
              setStartOpen((open) => !open)
              setNetworkOpen(false)
              setQuickOpen(false)
              setClockOpen(false)
              setSearchQuery('')
            }}
            type="button"
          >
            <i /><i /><i /><i />
          </button>
          <button
            className={styles.search}
            onClick={() => {
              setStartOpen(true)
              setNetworkOpen(false)
              setQuickOpen(false)
              setClockOpen(false)
            }}
            type="button"
          >⌕&nbsp; 社内システムを検索</button>
          <button
            aria-expanded={networkOpen}
            aria-label="CIAネットワーク情報"
            className={`${styles.pinnedApp} ${networkOpen ? styles.activeTaskButton : ''}`}
            onClick={() => {
              setNetworkOpen((open) => !open)
              setStartOpen(false)
              setQuickOpen(false)
              setClockOpen(false)
            }}
            type="button"
          >CIA</button>
        </div>
        <div className={styles.taskbarRight}>
          <button
            aria-expanded={quickOpen}
            aria-label="クイック状態"
            className={`${styles.trayButton} ${quickOpen ? styles.activeTaskButton : ''}`}
            onClick={() => {
              setQuickOpen((open) => !open)
              setClockOpen(false)
              setStartOpen(false)
              setNetworkOpen(false)
            }}
            type="button"
          >⌃ · ▮▮ · ▰</button>
          <button
            aria-expanded={clockOpen}
            aria-label="日時とカレンダー"
            className={`${styles.clockButton} ${clockOpen ? styles.activeTaskButton : ''}`}
            onClick={() => {
              setClockOpen((open) => !open)
              setQuickOpen(false)
              setStartOpen(false)
              setNetworkOpen(false)
            }}
            type="button"
          >
            <time dateTime={now.toISOString()}>
              <strong>{formatTime(now)}</strong>
              <small>{formatDate(now)}</small>
            </time>
          </button>
        </div>
      </footer>
    </section>
  )
}
