import type { CSSProperties } from 'react'

import type { AuthenticationStatus, VideoStatus } from '../../app/app-state'
import { AuthPanel } from '../../components/AuthPanel/AuthPanel'
import { SystemFileViewer } from '../../components/SystemFileViewer/SystemFileViewer'
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer'
import {
  archiveFiles,
  findSurveillanceFile,
  systemFiles,
  type ArchiveFile,
} from '../../data/surveillance-files'
import styles from './CameraSystemScreen.module.css'

type CameraSystemScreenProps = {
  authenticationStatus: AuthenticationStatus
  pendingArchiveId: string | null
  selectedFileId: string | null
  unlockedArchiveIds: string[]
  onAuthenticateArchive: (file: ArchiveFile, answer: string) => void
  onCancelArchiveAuth: () => void
  onSelectArchive: (file: ArchiveFile) => void
  onSelectSystemFile: (fileId: string) => void
  onVideoStatusChange: (status: VideoStatus) => void
}

export function CameraSystemScreen({
  authenticationStatus,
  onAuthenticateArchive,
  onCancelArchiveAuth,
  onSelectArchive,
  onSelectSystemFile,
  onVideoStatusChange,
  pendingArchiveId,
  selectedFileId,
  unlockedArchiveIds,
}: CameraSystemScreenProps) {
  const selectedFile = findSurveillanceFile(selectedFileId)
  const pendingFile = archiveFiles.find((file) => file.id === pendingArchiveId) ?? null

  return (
    <section className={styles.system} aria-label="監視映像アーカイブ">
      <div aria-hidden="true" className={styles.systemAmbient}>
        <span className={styles.scanBeam} />
        <span className={styles.dataRibbon}>CAM-01 · ARCHIVE LINK · PACKET 0X3A · LOCAL NODE · SECURE CHANNEL · </span>
      </div>
      <aside className={styles.browser}>
        <header>
          <span>LOCAL NODE / CAM-01</span>
          <strong>端末内記録</strong>
        </header>

        <section>
          <h2>LOCAL CACHE / 5 RECORDS</h2>
          {archiveFiles.map((file, index) => {
            const isUnlocked = !file.locked || unlockedArchiveIds.includes(file.id)
            return (
              <button
                className={
                  selectedFileId === file.id || pendingArchiveId === file.id
                    ? styles.selected
                    : ''
                }
                key={file.id}
                onClick={() => onSelectArchive(file)}
                style={{ '--file-index': index } as CSSProperties}
                type="button"
              >
                <span
                  className={`${styles.fileIcon} ${styles.videoIcon} ${
                    isUnlocked ? styles.readyIcon : styles.lockedIcon
                  }`}
                >
                  {isUnlocked ? (
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M8.5 6.7 17 12l-8.5 5.3Z" />
                    </svg>
                  ) : (
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M7.4 10V7.7a4.6 4.6 0 0 1 9.2 0V10" />
                      <rect height="9.2" rx="1.4" width="13.6" x="5.2" y="10" />
                      <path d="M12 13.2v2.8" />
                    </svg>
                  )}
                  <b>V{index + 1}</b>
                </span>
                <span>
                  <strong>{file.filename}</strong>
                  <small>{file.time} / CAM-01</small>
                </span>
                <i>{isUnlocked ? 'READY' : 'LOCK'}</i>
              </button>
            )
          })}
        </section>

        <section>
          <h2>システム / SYSTEM</h2>
          {systemFiles.map((file, index) => (
            <button
              className={selectedFileId === file.id ? styles.selected : ''}
              key={file.id}
              onClick={() => onSelectSystemFile(file.id)}
              style={{ '--file-index': archiveFiles.length + index } as CSSProperties}
              type="button"
            >
              <span className={`${styles.fileIcon} ${styles.systemIcon}`}>
                <i aria-hidden="true" />
                <b>SYS</b>
              </span>
              <span>
                <strong>{file.filename}</strong>
                <small>{file.category}</small>
              </span>
            </button>
          ))}
        </section>
      </aside>

      <main className={styles.workspace}>
        {selectedFile?.kind === 'video' ? (
          <VideoPlayer
            file={selectedFile}
            key={selectedFile.id}
            onStatusChange={onVideoStatusChange}
          />
        ) : selectedFile?.kind === 'system' ? (
          <SystemFileViewer file={selectedFile} />
        ) : (
          <div className={styles.standby}>
            <header className={styles.standbyHeader}>
              <span>UNREGISTERED OPERATOR SESSION</span>
              <span><i aria-hidden="true" /> LOCAL ROUTE / CAM-01</span>
            </header>

            <div className={styles.standbyConsole}>
              <div className={styles.nodeFabric} aria-hidden="true">
                <header><span>CAMERA FABRIC</span><b>24 NODES</b></header>
                <div className={styles.nodeField}>
                  <i /><i /><i /><i /><i /><i /><i /><i />
                  <span>CORE</span>
                  <strong>CAM-01</strong>
                </div>
                <footer><span>ACTIVE ROUTE</span><b>LOCAL</b></footer>
              </div>

              <div className={styles.standbyCore}>
                <div className={styles.brandMark} aria-hidden="true">
                  <img src="/assets/brand/cia-logo-official.png" alt="" />
                </div>
                <span>LOCAL CACHE INTERCEPT</span>
                <strong>端末内の監視記録を選択してください</strong>
                <p>CAM-01 / EXECUTIVE OFFICE / BUFFER MOUNTED</p>
              </div>

              <div className={styles.cacheLedger} aria-hidden="true">
                <header><span>LOCAL BUFFER</span><b>5 RECORDS</b></header>
                {archiveFiles.map((file, index) => (
                  <div
                    key={file.id}
                    style={{ '--cache-index': index } as CSSProperties}
                  >
                    <i />
                    <span>{file.time}</span>
                    <small>{file.locked ? 'ENCRYPTED' : 'INDEXED'}</small>
                  </div>
                ))}
                <footer>LAST WRITE / 23:55:00</footer>
              </div>
            </div>

            <div className={styles.standbyTelemetry}>
              <div><span>ACTIVE NODE</span><strong>CAM-01</strong><small>LOCAL SESSION</small></div>
              <div><span>CAMERA FABRIC</span><strong>24 NODES</strong><small>NETWORK ONLINE</small></div>
              <div><span>LOCAL BUFFER</span><strong>5 RECORDS</strong><small>2 ENCRYPTED</small></div>
              <div className={styles.standbyWave} aria-hidden="true">
                <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
              </div>
            </div>
          </div>
        )}
      </main>

      <aside className={styles.diagnostics}>
        <header>
          <span>SYSTEM DIAGNOSTICS</span>
          <strong>稼働状況</strong>
        </header>
        <dl>
          <div><dt>CAM-01</dt><dd>ONLINE</dd></div>
          <div><dt>NODE FABRIC</dt><dd>24 ONLINE</dd></div>
          <div><dt>LOCAL CACHE</dt><dd>5 RECORDS</dd></div>
          <div><dt>SESSION</dt><dd>UNLISTED</dd></div>
        </dl>
        <div className={styles.meter}>
          <span>STORAGE LOAD</span>
          <i><b /></i>
          <small>61.4%</small>
        </div>
        <div aria-hidden="true" className={styles.liveWave}>
          <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
        </div>
        <div className={styles.eventLog}>
          <span>LIVE SYSTEM LOG</span>
          <p>00:04 archive index mounted</p>
          <p>00:05 camera nodes verified</p>
          <p>00:06 local fallback armed</p>
          <p>00:07 operator session active</p>
        </div>
        {selectedFile ? (
          <div className={styles.fileInfo}>
            <span>SELECTED FILE</span>
            <strong>{selectedFile.filename}</strong>
            <small>
              {selectedFile.kind === 'video'
                ? selectedFile.recordedAt
                : selectedFile.updatedAt}
            </small>
          </div>
        ) : null}
      </aside>

      {pendingFile ? (
        <div
          aria-label={`${pendingFile.filename}の認証`}
          className={styles.authOverlay}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && authenticationStatus === 'idle') {
              onCancelArchiveAuth()
            }
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && authenticationStatus === 'idle') {
              onCancelArchiveAuth()
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <AuthPanel
            compact
            eyebrow={`ENCRYPTED ARCHIVE / ${pendingFile.filename}`}
            hint="この映像は暗号化されています。閲覧権限を確認するパスワードを入力してください。"
            onSubmit={(answer) => onAuthenticateArchive(pendingFile, answer)}
            status={authenticationStatus}
            title="映像ファイル認証"
          />
        </div>
      ) : null}
    </section>
  )
}
