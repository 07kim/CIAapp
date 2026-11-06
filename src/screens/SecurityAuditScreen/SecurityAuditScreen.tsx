import { useState } from 'react'

import { securityAuditRecords, type SecurityAuditRecord } from '../../data/security-audit'
import styles from './SecurityAuditScreen.module.css'

type AuditFilter = 'all' | SecurityAuditRecord['category']

const filters: { id: AuditFilter; label: string }[] = [
  { id: 'all', label: '相関表示' },
  { id: 'payment', label: '決済認証' },
  { id: 'remote-access', label: '遠隔操作' },
]

export function SecurityAuditScreen() {
  const [filter, setFilter] = useState<AuditFilter>('all')
  const records = securityAuditRecords.filter(
    (record) => filter === 'all' || record.category === filter,
  )

  return (
    <section aria-labelledby="security-audit-title" className={styles.layout}>
      <header className={styles.heading}>
        <div>
          <span>SECURITY CORRELATION / LOCAL RECORD</span>
          <h1 id="security-audit-title">セキュリティ監査</h1>
          <p>決済認証と社内端末の操作記録を、事件発生時刻で照合します。</p>
        </div>
        <div className={styles.incidentTime}>
          <small>INCIDENT WINDOW</small>
          <strong>20:15</strong>
          <span>2026 / 11 / 20</span>
        </div>
      </header>

      <nav aria-label="監査記録の表示種別" className={styles.filters}>
        {filters.map((item) => (
          <button
            aria-pressed={filter === item.id}
            key={item.id}
            onClick={() => setFilter(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className={styles.workspace}>
        <div aria-label="20時15分の監査記録" className={styles.records} role="list">
          {records.map((record) => (
            <article className={styles.record} key={record.id} role="listitem">
              <div className={styles.recordTime}>
                <small>JST</small>
                <time dateTime={`2026-11-20T${record.time}:00+09:00`}>{record.time}</time>
              </div>
              <div className={`${styles.sourceIcon} ${styles[record.category]}`} aria-hidden="true">
                <i /><i /><i />
              </div>
              <div className={styles.recordBody}>
                <span>{record.source}</span>
                <h2>{record.primary}</h2>
                <strong>{record.subject}</strong>
                <p>{record.secondary}</p>
              </div>
              <span className={`${styles.status} ${styles[record.status]}`}>
                {record.status === 'verified' ? 'VERIFIED' : 'DETECTED'}
              </span>
            </article>
          ))}
        </div>

        <aside className={styles.correlation}>
          <span>CORRELATION RESULT</span>
          <strong>同時刻に2系統の記録</strong>
          <div className={styles.timeline} aria-hidden="true">
            <i /><b>20:15</b><i />
          </div>
          <ul>
            <li>一ノ瀬の売店利用を決済媒体で確認</li>
            <li>四ツ谷PCから社長室サーバーへの接続試行を検出</li>
          </ul>
          <p>この画面は記録された事実のみを表示します。人物の関与は自動判定しません。</p>
        </aside>
      </div>
    </section>
  )
}

