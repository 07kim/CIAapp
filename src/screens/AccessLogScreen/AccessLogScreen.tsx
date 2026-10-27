import { useEffect, useState, type CSSProperties } from 'react'

import { accessLogRepository } from '../../data/access-log/static-access-log-repository'
import type { AccessLogEntry, AccessLogRepository } from '../../data/access-log/types'
import styles from './AccessLogScreen.module.css'

type AccessLogScreenProps = {
  repository?: AccessLogRepository
}

export function AccessLogScreen({ repository = accessLogRepository }: AccessLogScreenProps) {
  const [entries, setEntries] = useState<AccessLogEntry[]>([])

  useEffect(() => {
    let active = true
    void repository.list().then((logs) => {
      if (active) setEntries(logs)
    })
    return () => {
      active = false
    }
  }, [repository])

  return (
    <section aria-labelledby="access-log-title" className={styles.layout}>
      <div aria-hidden="true" className={styles.ambientIndex}>03</div>
      <div className={styles.heading}>
        <div>
          <span>03 / ACCESS CONTROL DATABASE</span>
          <h1 id="access-log-title">入退室ログ記録</h1>
          <p>2026年11月20日・役員フロア周辺の認証記録</p>
        </div>
        <div className={styles.activityPanel}>
          <div className={styles.status}>
            <span>LOCAL RECORD</span>
            <strong>{String(entries.length).padStart(2, '0')} ENTRIES</strong>
          </div>
          <div aria-hidden="true" className={styles.activityWave}>
            <i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
          </div>
        </div>
      </div>

      <div className={styles.summary}>
        <article><i aria-hidden="true" className={styles.calendarIcon} /><span>対象日</span><strong>2026 / 11 / 20</strong></article>
        <article><i aria-hidden="true" className={styles.zoneIcon} /><span>対象区画</span><strong>役員フロア</strong></article>
        <article><i aria-hidden="true" className={styles.verifyIcon} /><span>データ整合性</span><strong>VERIFIED</strong></article>
      </div>

      <div className={styles.tableFrame}>
        <div className={styles.tableHeader}>
          <span>TIME</span><span>PERSON</span><span>ACTION</span><span>CHECKPOINT</span><span>STATUS</span>
        </div>
        <div className={styles.rows}>
          {entries.map((entry, index) => (
            <article className={styles.row} key={entry.id} style={{ '--row-index': index } as CSSProperties}>
              <time dateTime={entry.timestamp}>{entry.time}</time>
              <div className={styles.person}>
                <strong>{entry.personName}</strong>
                <small>{entry.personId} / {entry.department}</small>
              </div>
              <span className={styles.direction}>{entry.direction}</span>
              <span>{entry.checkpoint}</span>
              <span className={entry.status === '許可' ? styles.allowed : styles.recorded}>
                {entry.status}
              </span>
            </article>
          ))}
        </div>
      </div>

      <footer className={styles.notice}>
        <span>ANALYSIS NOTE</span>
        <p>監視映像の時刻と入退室時刻を照合してください。巡回記録は社員証の入退室を示すものではありません。</p>
      </footer>
    </section>
  )
}
