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
          <span>ARCHIVE BROWSER</span>
          <strong>記録ファイル</strong>
        </header>

        <section>
          <h2>監視映像 / VIDEO</h2>
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
                  <i aria-hidden="true" />
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
              <span>ARCHIVE STANDBY</span>
              <span><i aria-hidden="true" /> CAM-01 CONNECTED</span>
            </header>
            <div className={styles.standbyCore}>
              <div className={styles.brandMark} aria-hidden="true">
                <img src="/assets/brand/cia-logo-official.png" alt="" />
              </div>
              <span>SURVEILLANCE ARCHIVE NETWORK</span>
              <strong>監視記録を選択してください</strong>
              <p>CAM-01 / EXECUTIVE OFFICE / LOCAL ARCHIVE READY</p>
            </div>
            <div className={styles.standbyTelemetry}>
              <div><span>CAMERA NODE</span><strong>CAM-01</strong><small>ONLINE</small></div>
              <div><span>RECORD RANGE</span><strong>20:00—23:55</strong><small>LOCAL TIME</small></div>
              <div><span>ARCHIVE FILES</span><strong>5 FILES</strong><small>2 ENCRYPTED</small></div>
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
          <div><dt>ARCHIVE</dt><dd>READY</dd></div>
          <div><dt>ENCRYPTED</dt><dd>2 FILES</dd></div>
          <div><dt>NETWORK</dt><dd>STABLE</dd></div>
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
