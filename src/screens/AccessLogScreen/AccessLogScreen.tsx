import styles from './AccessLogScreen.module.css'

const modules = [
  ['DATA SOURCE', 'NOT CONNECTED'],
  ['SYNC STATUS', 'PENDING SPECIFICATION'],
  ['LOCAL CACHE', 'STANDBY'],
] as const

export function AccessLogScreen() {
  return (
    <section aria-labelledby="access-log-title" className={styles.layout}>
      <div className={styles.heading}>
        <span>ACCESS CONTROL DATABASE</span>
        <h1 id="access-log-title">入退室ログ記録</h1>
        <p>詳細仕様とデータ接続は後続フェーズで追加します。</p>
      </div>

      <div className={styles.moduleGrid}>
        {modules.map(([label, value]) => (
          <article className={styles.module} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className={styles.emptyState}>
        <div aria-hidden="true" className={styles.pulse} />
        <strong>MODULE STANDBY</strong>
        <span>入退室ログ資料の受領待ち</span>
      </div>
    </section>
  )
}
