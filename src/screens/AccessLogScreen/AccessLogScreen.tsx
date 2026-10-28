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
      <div aria-hidden="true" className={styles.ambientIndex}>TRACE</div>
      <div className={styles.heading}>
        <div>
          <span>ACCESS CONTROL DATABASE / LOCAL RECORD</span>
          <h1 id="access-log-title">社長室 入退室ログ</h1>
          <p>2026年11月20日・社員証による入退室記録</p>
        </div>
        <div className={styles.activityPanel}>
          <div className={styles.status}>
            <span>LOCAL RECORD</span>
            <strong>{entries.length} ENTRIES</strong>
          </div>
          <div aria-hidden="true" className={styles.activityWave}>
            <i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
          </div>
        </div>
      </div>

      <div className={styles.summary}>
        <article><i aria-hidden="true" className={styles.calendarIcon} /><span>対象日</span><strong>2026 / 11 / 20</strong></article>
        <article><i aria-hidden="true" className={styles.zoneIcon} /><span>対象区画</span><strong>社長室</strong></article>
        <article><i aria-hidden="true" className={styles.verifyIcon} /><span>データ整合性</span><strong>VERIFIED</strong></article>
      </div>

      <div className={styles.tableFrame}>
        <div className={styles.tableHeader}>
          <span>DATE / TIME</span><span>NAME</span><span>EMPLOYEE ID</span><span>EVENT</span><span>ROOM</span>
        </div>
        <div aria-label="社長室入退室ログ" className={styles.rows} role="list">
          {entries.map((entry, index) => (
            <article className={styles.row} key={entry.id} role="listitem" style={{ '--row-index': index } as CSSProperties}>
              <time dateTime={entry.timestamp}><small>{entry.date}</small><strong>{entry.time}</strong></time>
              <div className={styles.person}>
                <strong>{entry.personName}</strong>
              </div>
              <span className={styles.employeeId}>{entry.personId}</span>
              <span className={styles.direction}>{entry.direction}</span>
              <span>{entry.room}</span>
            </article>
          ))}
        </div>
      </div>

      <footer className={styles.notice}>
        <span>READ ONLY</span>
        <p>この記録は閲覧専用です。社員証を使用した社長室の入退室履歴を表示しています。</p>
      </footer>
    </section>
  )
}
