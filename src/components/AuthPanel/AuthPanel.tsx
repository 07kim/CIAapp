import { useEffect, useRef, useState, type FormEvent } from 'react'

import type { AuthenticationStatus } from '../../app/app-state'
import styles from './AuthPanel.module.css'

type AuthPanelProps = {
  compact?: boolean
  eyebrow: string
  hint: string
  status: AuthenticationStatus
  title: string
  onCancel?: () => void
  onSubmit: (answer: string) => void
}

export function AuthPanel({
  compact = false,
  eyebrow,
  hint,
  onCancel,
  onSubmit,
  status,
  title,
}: AuthPanelProps) {
  const [answer, setAnswer] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const previousStatus = useRef(status)
  const isBusy = status !== 'idle'

  useEffect(() => {
    if (previousStatus.current === 'denied' && status === 'idle') {
      setAnswer('')
      inputRef.current?.focus()
    }
    previousStatus.current = status
  }, [status])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isBusy) onSubmit(answer)
  }

  return (
    <section
      className={`${styles.panel} ${compact ? styles.compact : ''} ${
        status === 'denied'
          ? styles.panelDenied
          : status === 'granted'
            ? styles.panelGranted
            : ''
      }`}
    >
      <div aria-hidden="true" className={styles.reticle}>
        <span />
      </div>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{hint}</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor={compact ? 'archive-answer' : 'gate-answer'}>
          SYSTEM PASSWORD
        </label>
        <div className={styles.inputRow}>
          <input
            autoComplete="off"
            autoFocus
            disabled={isBusy}
            id={compact ? 'archive-answer' : 'gate-answer'}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="パスワードを入力"
            ref={inputRef}
            spellCheck={false}
            type="password"
            value={answer}
          />
          <button disabled={isBusy || answer.trim().length === 0} type="submit">
            認証
          </button>
        </div>
      </form>

      {onCancel ? (
        <button className={styles.cancel} disabled={isBusy} onClick={onCancel} type="button">
          キャンセル
        </button>
      ) : null}

      {status !== 'idle' ? (
        <div
          aria-live="assertive"
          className={`${styles.result} ${styles[status]}`}
          role="status"
        >
          <div aria-hidden="true" className={styles.securityMatrix}>
            <div className={styles.orbit}><i /></div>
            <div className={styles.verificationBox}>
              {status === 'granted' ? '✓' : '×'}
            </div>
            <div className={styles.signalGraph}>
              <i /><i /><i /><i /><i /><i /><i />
            </div>
            <div className={styles.diagnosticWindows}>
              <span><b>IDENTITY HASH</b>ANALYZING</span>
              <span><b>ACCESS POLICY</b>VERIFYING</span>
              <span><b>SECURITY NODE</b>CONNECTED</span>
            </div>
          </div>
          <span className={styles.checking}>VERIFYING CREDENTIALS...</span>
          <div className={styles.resultMessage}>
            <strong>
              {status === 'granted' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
            </strong>
            <span>
              {status === 'granted'
                ? 'セキュリティ認証が完了しました'
                : 'パスワードが一致しません'}
            </span>
          </div>
          <div aria-hidden="true" className={styles.progress}><i /></div>
        </div>
      ) : null}
    </section>
  )
}
