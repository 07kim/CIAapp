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
      <div className={styles.desktopBar}>
        <div>
          <span className={styles.statusLight} />
          <strong>CIA SECURE DESKTOP</strong>
        </div>
        <span>NODE 07 / INTERNAL NETWORK</span>
      </div>

      <div className={styles.workspace}>
        <div className={styles.wallpaper}>
          <span>AUTHORIZED INTERNAL TERMINAL</span>
          <h1 id="desktop-title">セキュアデスクトップ</h1>
          <p>CIA INTERNET CO. / CORPORATE SECURITY NETWORK</p>
          <div aria-hidden="true" className={styles.orbitalMark}>
            <i /><i /><i />
          </div>
        </div>

        <div aria-label="社内システム" className={styles.appGrid} role="group">
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

        <aside className={styles.systemPanel} aria-label="端末情報">
          <span>WORKSTATION STATUS</span>
          <dl>
            <div><dt>NETWORK</dt><dd>INTERNAL</dd></div>
            <div><dt>SECURITY</dt><dd>LEVEL 04</dd></div>
            <div><dt>APPLICATIONS</dt><dd>02 READY</dd></div>
          </dl>
          <p>SECURE SESSION ACTIVE</p>
        </aside>
      </div>

      <div className={styles.taskbar}>
        <span>▦&nbsp; CIA NET</span>
        <span>SECURE CHANNEL&nbsp; ●</span>
      </div>
    </section>
  )
}
