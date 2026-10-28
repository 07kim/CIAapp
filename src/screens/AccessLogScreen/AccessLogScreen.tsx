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
      <div className={styles.heading}>
        <div>
          <span>ACCESS CONTROL / LOCAL RECORD</span>
          <h1 id="access-log-title">社長室 入退室ログ</h1>
          <p>社員証による認証履歴を時系列で照合します。</p>
        </div>
        <div className={styles.headingStatus}>
          <span>RECORDS</span>
          <strong>{String(entries.length).padStart(2, '0')}</strong>
        </div>
      </div>

      <div className={styles.controlRoom}>
        <aside className={styles.contextPanel}>
          <div className={styles.dateBlock}>
            <span>2026 / FRIDAY</span>
            <strong>11 / 20</strong>
          </div>
          <dl>
            <div><dt>対象区画</dt><dd>社長室</dd></div>
            <div><dt>記録種別</dt><dd>社員証認証</dd></div>
            <div><dt>データ整合性</dt><dd>VERIFIED</dd></div>
          </dl>
          <div aria-hidden="true" className={styles.activityWave}>
            <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
          </div>
          <p>READ ONLY / ローカル保存された記録です。</p>
        </aside>

        <div className={styles.logPanel}>
          <header>
            <div><span>社員証認証履歴</span><strong>ID-0719</strong></div>
            <span>時刻順 / JST</span>
          </header>
          <div aria-hidden="true" className={styles.columnLabels}>
            <span>日時</span><span>認証</span><span>氏名 / 社員ID</span><span>状態 / 区画</span>
          </div>
          <div aria-label="社長室入退室ログ" className={styles.rows} role="list">
            {entries.map((entry, index) => (
              <article className={styles.row} key={entry.id} role="listitem" style={{ '--row-index': index } as CSSProperties}>
                <time dateTime={entry.timestamp}><small>{entry.date}</small><strong>{entry.time}</strong></time>
                <i aria-hidden="true" className={styles.timelineNode} />
                <div className={styles.person}>
                  <strong>{entry.personName}</strong>
                  <span>{entry.personId}</span>
                </div>
                <div className={styles.eventData}>
                  <strong className={styles.direction}>{entry.direction}</strong>
                  <span>{entry.room}</span>
                </div>
              </article>
            ))}
          </div>
          <footer><span>照合完了</span><strong>{entries.length}件の記録</strong></footer>
        </div>
      </div>

      <footer className={styles.notice}>
        <span>LOCAL ARCHIVE</span>
        <p>この画面は閲覧専用です。記録の編集・削除はできません。</p>
      </footer>
    </section>
  )
}
