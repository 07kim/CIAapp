import { useState, type CSSProperties } from 'react'

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

type NetworkNode = {
  id: string
  label: string
  x: number
  y: number
  active?: boolean
}

const initialNetworkNodes: NetworkNode[] = [
  { id: 'entry', label: 'ENTRY', x: 92, y: 98 },
  { id: 'floor-2', label: 'FLOOR-2', x: 210, y: 76 },
  { id: 'lobby', label: 'LOBBY', x: 166, y: 164 },
  { id: 'office', label: 'OFFICE', x: 188, y: 244 },
  { id: 'cam-01', label: 'CAM-01 / ACTIVE', x: 318, y: 134, active: true },
  { id: 'storage', label: 'STORAGE', x: 430, y: 78 },
  { id: 'relay-a', label: 'RELAY-A', x: 480, y: 166 },
  { id: 'executive', label: 'EXECUTIVE', x: 520, y: 250 },
  { id: 'vault', label: 'VAULT', x: 356, y: 304 },
  { id: 'backup', label: 'BACKUP', x: 590, y: 112 },
  { id: 'service', label: 'SERVICE', x: 604, y: 210 },
  { id: 'perimeter', label: 'PERIMETER', x: 682, y: 304 },
]

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
  const [connectedNetworkNodeIds, setConnectedNetworkNodeIds] = useState<string[]>([])
  const selectedFile = findSurveillanceFile(selectedFileId)
  const pendingFile = archiveFiles.find((file) => file.id === pendingArchiveId) ?? null
  const cameraNode = initialNetworkNodes.find((item) => item.id === 'cam-01')!
  const connectedNetworkNodes = connectedNetworkNodeIds
    .map((id) => initialNetworkNodes.find((item) => item.id === id))
    .filter((item): item is NetworkNode => Boolean(item))
  const toggleNetworkNode = (networkNode: NetworkNode) => {
    if (networkNode.active) {
      setConnectedNetworkNodeIds([])
      return
    }
    setConnectedNetworkNodeIds((current) => current.includes(networkNode.id)
      ? current.filter((id) => id !== networkNode.id)
      : [...current, networkNode.id])
  }

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
              <aside className={styles.editorialRail} aria-hidden="true">
                <strong>SURVEILLANCE</strong>
                <div>
                  <span>UNLISTED</span>
                  <b>SESSION</b>
                </div>
                <div>
                  <span>ROUTE</span>
                  <b>CAM-01</b>
                </div>
              </aside>

              <section className={styles.networkMap} aria-label="社内監視カメラネットワーク">
                <header>
                  <span>CAMERA FABRIC / LIVE TOPOLOGY</span>
                  <b><i aria-hidden="true" /> {connectedNetworkNodes.length ? `LINKS / ${connectedNetworkNodes.length}` : '24 NODES ONLINE'}</b>
                </header>
                <div
                  aria-label="監視ネットワークノード。選択するとCAM-01から経路を接続します"
                  className={styles.graphStage}
                >
                  <svg aria-label="監視ネットワーク構成" role="group" viewBox="0 0 760 420">
                    <g className={styles.graphRoutes}>
                      <path d="M92 98 210 76 318 134 430 78 590 112 690 72" />
                      <path d="M70 280 188 244 318 134 356 304 520 250 682 304" />
                      <path d="M188 244 126 350 356 304 500 354 682 304" />
                      <path d="M210 76 166 164 318 134 356 304 430 78 520 250 590 112" />
                      <path d="M70 280 166 164 92 98M430 78 480 166 590 112M520 250 604 210 682 304" />
                    </g>
                    <g className={styles.graphNodes}>
                      <circle cx="92" cy="98" r="5" /><circle cx="70" cy="280" r="4" />
                      <circle cx="126" cy="350" r="3" /><circle cx="166" cy="164" r="4" />
                      <circle cx="210" cy="76" r="5" /><circle cx="188" cy="244" r="5" />
                      <circle cx="244" cy="336" r="3" /><circle cx="270" cy="196" r="3" />
                      <circle cx="318" cy="134" r="7" /><circle cx="356" cy="304" r="5" />
                      <circle cx="396" cy="208" r="3" /><circle cx="430" cy="78" r="5" />
                      <circle cx="480" cy="166" r="4" /><circle cx="500" cy="354" r="3" />
                      <circle cx="520" cy="250" r="6" /><circle cx="556" cy="322" r="3" />
                      <circle cx="590" cy="112" r="5" /><circle cx="604" cy="210" r="4" />
                      <circle cx="634" cy="158" r="3" /><circle cx="650" cy="252" r="3" />
                      <circle cx="682" cy="304" r="5" /><circle cx="690" cy="72" r="3" />
                      <circle cx="716" cy="190" r="3" /><circle cx="724" cy="354" r="3" />
                    </g>
                    <g className={styles.graphActive}>
                      <circle cx={cameraNode.x} cy={cameraNode.y} r="19" />
                      <circle cx={cameraNode.x} cy={cameraNode.y} r="5" />
                      {connectedNetworkNodes.map((networkNode, index) => (
                        <g key={networkNode.id}>
                          <path d={`M${cameraNode.x} ${cameraNode.y} L${networkNode.x} ${networkNode.y}`} />
                          <circle className={styles.linkPulse} cx={networkNode.x} cy={networkNode.y} r="11" />
                          <circle className={styles.routePacket} data-route-packet="true" r="2.8">
                            <animateMotion
                              begin={`${index * -0.19}s`}
                              dur={`${1.35 + (index % 4) * 0.16}s`}
                              path={`M${cameraNode.x} ${cameraNode.y} L${networkNode.x} ${networkNode.y}`}
                              repeatCount="indefinite"
                            />
                          </circle>
                        </g>
                      ))}
                    </g>
                    <g className={styles.interactiveNodes}>
                      {initialNetworkNodes.map((networkNode) => (
                        <circle
                          aria-label={networkNode.active ? 'すべてのノード接続を解除' : `${networkNode.label}ノードへ接続`}
                          aria-pressed={networkNode.active ? undefined : connectedNetworkNodeIds.includes(networkNode.id)}
                          className={`${networkNode.active ? styles.activeNode : ''} ${connectedNetworkNodeIds.includes(networkNode.id) ? styles.linkedNode : ''}`}
                          cx={networkNode.x}
                          cy={networkNode.y}
                          key={networkNode.id}
                          onClick={() => toggleNetworkNode(networkNode)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault()
                              toggleNetworkNode(networkNode)
                            }
                          }}
                          r={networkNode.active ? 8 : 6}
                          role="button"
                          tabIndex={0}
                        />
                      ))}
                    </g>
                  </svg>
                  {initialNetworkNodes.map((networkNode) => (
                    <span
                      className={`${styles.nodeLabel} ${networkNode.active ? styles.activeLabel : ''} ${connectedNetworkNodeIds.includes(networkNode.id) ? styles.linkedLabel : ''}`}
                      key={networkNode.id}
                      style={{ '--x': `${(networkNode.x / 760) * 100}%`, '--y': `${(networkNode.y / 420) * 100}%` } as CSSProperties}
                    >
                      {networkNode.label}
                    </span>
                  ))}
                  <span className={styles.dragHint}>SELECT NODES / BUILD ROUTES</span>
                </div>
                <div className={styles.graphPrompt}>
                  <span>LOCAL CACHE INTERCEPT</span>
                  <strong>端末内の監視記録を選択してください</strong>
                  <p>CAM-01 / EXECUTIVE OFFICE / BUFFER MOUNTED</p>
                </div>
              </section>

              <aside className={styles.signalStack}>
                <div className={styles.signalModule}>
                  <span>CAMERA FABRIC</span>
                  <strong>24</strong>
                  <small>NODES ONLINE</small>
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
                <div className={styles.signalModule}>
                  <span>IDENTITY TRACE</span>
                  <strong>NONE</strong>
                  <small>OPERATOR UNLISTED</small>
                </div>
              </aside>
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
