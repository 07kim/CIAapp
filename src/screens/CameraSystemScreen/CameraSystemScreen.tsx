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
                className={selectedFileId === file.id ? styles.selected : ''}
                key={file.id}
                onClick={() => onSelectArchive(file)}
                type="button"
              >
                <span className={styles.fileIcon}>0{index + 1}</span>
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
          {systemFiles.map((file) => (
            <button
              className={selectedFileId === file.id ? styles.selected : ''}
              key={file.id}
              onClick={() => onSelectSystemFile(file.id)}
              type="button"
            >
              <span className={styles.fileIcon}>SYS</span>
              <span>
                <strong>{file.filename}</strong>
                <small>{file.category}</small>
              </span>
            </button>
          ))}
        </section>
      </aside>

      <main className={styles.workspace}>
        {pendingFile ? (
          <div className={styles.lockedPreview} aria-hidden="true">
            <span>ENCRYPTED ARCHIVE SELECTED</span>
            <strong>{pendingFile.filename}</strong>
            <dl>
              <div><dt>RECORDED</dt><dd>{pendingFile.recordedAt}</dd></div>
              <div><dt>LOCATION</dt><dd>{pendingFile.location}</dd></div>
              <div><dt>STATUS</dt><dd>AUTHORIZATION REQUIRED</dd></div>
            </dl>
          </div>
        ) : selectedFile?.kind === 'video' ? (
          <VideoPlayer
            file={selectedFile}
            key={selectedFile.id}
            onStatusChange={onVideoStatusChange}
          />
        ) : selectedFile?.kind === 'system' ? (
          <SystemFileViewer file={selectedFile} />
        ) : (
          <div className={styles.standby}>
            <div className={styles.brandMark} aria-hidden="true">
              <img src="/assets/brand/cia-logo-source.png" alt="" />
            </div>
            <span>SURVEILLANCE ARCHIVE NETWORK</span>
            <strong>監視記録を選択してください</strong>
            <p>CAM-01 / EXECUTIVE OFFICE / LOCAL ARCHIVE READY</p>
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
          <div><dt>ENCRYPTED</dt><dd>02</dd></div>
          <div><dt>NETWORK</dt><dd>STABLE</dd></div>
        </dl>
        <div className={styles.meter}>
          <span>STORAGE LOAD</span>
          <i><b /></i>
          <small>61.4%</small>
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
          role="dialog"
          aria-modal="true"
        >
          <AuthPanel
            compact
            eyebrow={`ENCRYPTED ARCHIVE / ${pendingFile.filename}`}
            hint="この映像は暗号化されています。閲覧権限を確認するパスワードを入力してください。"
            onCancel={onCancelArchiveAuth}
            onSubmit={(answer) => onAuthenticateArchive(pendingFile, answer)}
            status={authenticationStatus}
            title="映像ファイル認証"
          />
        </div>
      ) : null}
    </section>
  )
}
