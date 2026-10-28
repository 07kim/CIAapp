import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'

import type { AuthenticationStatus } from '../../app/app-state'
import styles from './AuthPanel.module.css'

type AuthPanelProps = {
  compact?: boolean
  containedResult?: boolean
  eyebrow: string
  hint: string
  status: AuthenticationStatus
  title: string
  onCancel?: () => void
  onSubmit: (answer: string) => void
}

export function AuthPanel({
  compact = false,
  containedResult = false,
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
  const showResultInPanel = compact || containedResult

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

  const resultPanel = status !== 'idle' ? (
    <div
      aria-live="assertive"
      className={`${styles.result} ${showResultInPanel ? styles.inlineResult : ''} ${styles[status]}`}
      role="status"
    >
      <span aria-hidden="true" className={styles.handoffBloom} />
      <div aria-hidden="true" className={styles.securityMatrix}>
        <div className={styles.orbit}><i /></div>
        <div className={styles.verificationBox}>
          {status === 'granted' ? (
            <span className={styles.grantedMark}>✓</span>
          ) : (
            <span className={styles.deniedMark}><b>!</b></span>
          )}
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
  ) : null

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
      <header className={styles.panelHeader}>
        <span>{eyebrow}</span>
        <span>ENCRYPTED LINK / LOCAL</span>
      </header>

      <div className={styles.consoleBody}>
        <div aria-hidden="true" className={styles.scannerCell}>
          <div className={styles.reticle}>
            <span />
            <i />
          </div>
          <span className={styles.scannerStatus}>CREDENTIAL TRACE ACTIVE</span>
          <div className={styles.scannerWave}><i /><i /><i /><i /><i /><i /></div>
        </div>

        <div className={styles.credentialCell}>
          <span className={styles.eyebrow}>SECURITY CREDENTIAL</span>
          <h1>{title}</h1>
          <p>{hint}</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor={compact ? 'archive-answer' : 'gate-answer'}>
              SYSTEM PASSWORD
              <span>PLAIN TEXT INPUT</span>
            </label>
            <div className={styles.inputRow}>
              <input
                aria-label="SYSTEM PASSWORD"
                autoComplete="off"
                autoFocus
                disabled={isBusy}
                id={compact ? 'archive-answer' : 'gate-answer'}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="＊＊＊＊＊＊＊＊"
                ref={inputRef}
                spellCheck={false}
                type="text"
                value={answer}
              />
              <button disabled={isBusy || answer.trim().length === 0} type="submit">
                <span>認証</span><i aria-hidden="true">→</i>
              </button>
            </div>
          </form>

          <footer className={styles.credentialMeta}>
            <span>CHANNEL: INTERNAL</span>
            <span>TRACE: ARMED</span>
          </footer>
        </div>
      </div>

      {onCancel ? (
        <button className={styles.cancel} disabled={isBusy} onClick={onCancel} type="button">
          キャンセル
        </button>
      ) : null}

      {resultPanel
        ? showResultInPanel
          ? resultPanel
          : createPortal(resultPanel, document.body)
        : null}
    </section>
  )
}
