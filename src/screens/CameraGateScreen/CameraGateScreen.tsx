import styles from './CameraGateScreen.module.css'

export function CameraGateScreen() {
  return (
    <section aria-labelledby="camera-gate-title" className={styles.gate}>
      <div aria-hidden="true" className={styles.lockGraphic}>
        <span />
      </div>
      <span className={styles.classification}>RESTRICTED SYSTEM</span>
      <h1 id="camera-gate-title">監視カメラ認証</h1>
      <p>このシステムへのアクセスにはセキュリティ認証が必要です。</p>
      <div className={styles.phaseNotice}>
        <span>AUTHENTICATION MODULE</span>
        <strong>PHASE 3 で接続予定</strong>
      </div>
    </section>
  )
}
