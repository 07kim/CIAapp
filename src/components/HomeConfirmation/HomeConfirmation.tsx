import { useEffect, useRef } from 'react'

import styles from './HomeConfirmation.module.css'

type HomeConfirmationProps = {
  onCancel: () => void
  onConfirm: () => void
}

export function HomeConfirmation({
  onCancel,
  onConfirm,
}: HomeConfirmationProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelButtonRef.current?.focus()
  }, [])

  return (
    <div className={styles.backdrop} role="presentation">
      <section
        aria-labelledby="home-confirmation-title"
        aria-modal="true"
        className={styles.dialog}
        role="dialog"
      >
        <span className={styles.label}>SYSTEM NAVIGATION</span>
        <h2 id="home-confirmation-title">ホーム画面に戻りますか？</h2>
        <div className={styles.actions}>
          <button
            className={styles.secondary}
            onClick={onCancel}
            ref={cancelButtonRef}
            type="button"
          >
            キャンセル
          </button>
          <button className={styles.primary} onClick={onConfirm} type="button">
            戻る
          </button>
        </div>
      </section>
    </div>
  )
}
