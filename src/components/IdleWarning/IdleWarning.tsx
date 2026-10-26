import styles from './IdleWarning.module.css'

export function IdleWarning() {
  return (
    <div aria-live="assertive" className={styles.warning} role="alert">
      <span>INACTIVITY WARNING</span>
      <strong>残り10秒でホーム画面に戻ります</strong>
      <small>マウスまたはキーボードを操作すると継続します</small>
    </div>
  )
}
