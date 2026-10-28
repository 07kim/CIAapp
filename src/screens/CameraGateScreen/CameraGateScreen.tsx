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
        <span>ARCHIVE STORAGE</span>
        <span>ARCHIVE NODE</span>
        <span>AUTH REQUIRED</span>
      </div>
      <div aria-hidden="true" className={styles.signalField}>
        <div className={styles.signalSweep} />
        <div className={styles.signalRail}><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <span>ARCHIVE NODE / CREDENTIAL TRACE / LOCAL CHANNEL / ACTIVE</span>
      </div>
      <AuthPanel
        containedResult
        eyebrow="RESTRICTED SURVEILLANCE NETWORK"
        hint="監視アーカイブへ接続するためのシステムパスワードを入力してください。"
        onSubmit={onAuthenticate}
        status={status}
        title="監視カメラ認証"
      />
    </section>
  )
}
