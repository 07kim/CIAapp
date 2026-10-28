import type { BackdropVariant } from '../DynamicBackdrop/DynamicBackdrop'
import styles from './CinematicOverlay.module.css'

type CinematicOverlayProps = {
  variant: BackdropVariant
}

export function CinematicOverlay({ variant }: CinematicOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={styles.overlay}
      data-variant={variant}
    >
      <div className={styles.depthField}>
        <i /><i /><i />
      </div>
      <div className={styles.scanBeam} />

      <div className={`${styles.telemetry} ${styles.telemetryLeft}`}>
        <span>SECURE / LOCAL</span>
        <b>NODE CIA-SEC-07</b>
        <i /><i /><i /><i /><i />
      </div>
      <div className={`${styles.telemetry} ${styles.telemetryRight}`}>
        <span>SIGNAL INTEGRITY</span>
        <b>99.98%</b>
        <i /><i /><i /><i /><i />
      </div>

      <div className={styles.cornerIndex}>
        <span>ENCRYPTED CHANNEL</span>
        <strong>INTERNAL</strong>
      </div>

      <div className={styles.dataMarquee}>
        <div>
          <span>LOCAL ARCHIVE READY</span>
          <span>IDENTITY TRACE ACTIVE</span>
          <span>CAMERA NODE ONLINE</span>
          <span>ACCESS CONTROL VERIFIED</span>
          <span>PACKET INTEGRITY 99.98%</span>
          <span>LOCAL ARCHIVE READY</span>
          <span>IDENTITY TRACE ACTIVE</span>
          <span>CAMERA NODE ONLINE</span>
          <span>ACCESS CONTROL VERIFIED</span>
          <span>PACKET INTEGRITY 99.98%</span>
        </div>
      </div>
    </div>
  )
}
