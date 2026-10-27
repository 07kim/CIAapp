import type { CSSProperties } from 'react'

import type { SystemFile } from '../../data/surveillance-files'
import styles from './SystemFileViewer.module.css'

export function SystemFileViewer({ file }: { file: SystemFile }) {
  return (
    <div className={styles.viewer}>
      <header>
        <span>{file.category}</span>
        <strong>{file.filename}</strong>
      </header>
      <div className={styles.terminal} role="log">
        {file.lines.map((line, index) => (
          <p
            key={`${file.id}-${line}`}
            style={{ '--line-index': index } as CSSProperties}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {line}
          </p>
        ))}
        <i aria-hidden="true" />
      </div>
    </div>
  )
}
