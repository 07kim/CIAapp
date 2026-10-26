import { AppIcon } from '../../components/AppIcon/AppIcon'
import styles from './DesktopScreen.module.css'

type DesktopScreenProps = {
  onOpenAccessLog: () => void
  onOpenCamera: () => void
}

export function DesktopScreen({
  onOpenAccessLog,
  onOpenCamera,
}: DesktopScreenProps) {
  return (
    <section aria-labelledby="desktop-title" className={styles.desktop}>
      <div className={styles.intro}>
        <span className={styles.kicker}>AUTHORIZED WORKSTATION</span>
        <h1 id="desktop-title">業務アプリケーション</h1>
        <p>使用するシステムを選択してください。</p>
      </div>

      <div className={styles.appGrid}>
        <AppIcon
          badge="LOCKED"
          description="録画映像アーカイブおよびカメラシステム診断"
          icon="camera"
          label="監視カメラシステム"
          onOpen={onOpenCamera}
          systemLabel="SURVEILLANCE SYSTEM"
        />
        <AppIcon
          description="社員IDによる入室・退室履歴の照会"
          icon="log"
          label="入退室ログ記録"
          onOpen={onOpenAccessLog}
          systemLabel="ACCESS CONTROL LOG"
        />
      </div>

      <aside className={styles.statusStrip} aria-label="端末情報">
        <span>NETWORK: INTERNAL</span>
        <span>APPLICATIONS: 02</span>
        <span>SECURITY LEVEL: 04</span>
      </aside>
    </section>
  )
}
