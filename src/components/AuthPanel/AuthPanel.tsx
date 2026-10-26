import { useState, type FormEvent } from 'react'

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
  const isBusy = status !== 'idle'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isBusy) onSubmit(answer)
  }

  return (
    <section className={`${styles.panel} ${compact ? styles.compact : ''}`}>
      <div aria-hidden="true" className={styles.reticle}>
        <span />
      </div>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{hint}</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor={compact ? 'archive-answer' : 'gate-answer'}>
          SECURITY KEY
        </label>
        <div className={styles.inputRow}>
          <input
            autoComplete="off"
            autoFocus
            disabled={isBusy}
            id={compact ? 'archive-answer' : 'gate-answer'}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="回答を入力"
            spellCheck={false}
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
          <strong>{status === 'granted' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}</strong>
          <span>
            {status === 'granted'
              ? '認証情報を確認しました'
              : '認証キーが一致しません'}
          </span>
        </div>
      ) : null}
    </section>
  )
}
