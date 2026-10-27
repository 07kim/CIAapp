import type { AuthenticationStatus } from '../../app/app-state'
import { AuthPanel } from '../../components/AuthPanel/AuthPanel'
import styles from './CameraGateScreen.module.css'

type CameraGateScreenProps = {
  status: AuthenticationStatus
  onAuthenticate: (answer: string) => void
}

export function CameraGateScreen({ status, onAuthenticate }: CameraGateScreenProps) {
  return (
    <section aria-labelledby="camera-gate-title" className={styles.gate}>
      <div className={styles.backdrop} aria-hidden="true">
        <span>CAM-01</span>
        <span>CAM-02</span>
        <span>ARCHIVE NODE</span>
        <span>AUTH REQUIRED</span>
      </div>
      <div aria-hidden="true" className={styles.signalField}>
        <div className={styles.signalSweep} />
        <div className={styles.signalRail}><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <span>NODE 01 / BIOMETRIC FALLBACK / CREDENTIAL TRACE / ACTIVE</span>
      </div>
      <AuthPanel
        eyebrow="RESTRICTED SURVEILLANCE NETWORK"
        hint="監視アーカイブへ接続するためのシステムパスワードを入力してください。"
        onSubmit={onAuthenticate}
        status={status}
        title="監視カメラ認証"
      />
    </section>
  )
}
