import { useEffect, useRef } from 'react'

import type { BackdropVariant } from '../DynamicBackdrop/DynamicBackdrop'
import styles from './CinematicOverlay.module.css'

type CinematicOverlayProps = {
  variant: BackdropVariant
}

export function CinematicOverlay({ variant }: CinematicOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    const reduceMotion = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null
    let frame = 0

    const updatePointer = (event: PointerEvent) => {
      if (reduceMotion?.matches) return
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        overlay.style.setProperty('--pointer-x', `${event.clientX}px`)
        overlay.style.setProperty('--pointer-y', `${event.clientY}px`)
        overlay.style.setProperty(
          '--pointer-rx',
          `${((event.clientY / window.innerHeight) - 0.5) * -8}deg`,
        )
        overlay.style.setProperty(
          '--pointer-ry',
          `${((event.clientX / window.innerWidth) - 0.5) * 10}deg`,
        )
      })
    }

    window.addEventListener('pointermove', updatePointer, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', updatePointer)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className={styles.overlay}
      data-variant={variant}
      ref={overlayRef}
    >
      <div className={styles.pointerField} />
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
