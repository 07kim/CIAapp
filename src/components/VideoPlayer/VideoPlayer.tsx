import { useEffect, useState } from 'react'

import type { VideoStatus } from '../../app/app-state'
import type { ArchiveFile } from '../../data/surveillance-files'
import styles from './VideoPlayer.module.css'

type VideoPlayerProps = {
  file: ArchiveFile
  onStatusChange: (status: VideoStatus) => void
}

const pad = (value: number) => String(value).padStart(2, '0')

export function VideoPlayer({ file, onStatusChange }: VideoPlayerProps) {
  const [position, setPosition] = useState(0)
  const [status, setStatus] = useState<VideoStatus>('idle')

  useEffect(() => {
    if (status !== 'playing') return
    const timer = window.setInterval(() => {
      setPosition((current) => {
        const next = Math.min(file.duration, current + 1)
        if (next >= file.duration) {
          setStatus('ended')
          onStatusChange('ended')
        }
        return next
      })
    }, 1_000)
    return () => window.clearInterval(timer)
  }, [file.duration, onStatusChange, status])

  const setPlaybackStatus = (nextStatus: VideoStatus) => {
    if (nextStatus === 'playing' && position >= file.duration) setPosition(0)
    setStatus(nextStatus)
    onStatusChange(nextStatus)
  }

  return (
    <div className={styles.player}>
      <div className={`${styles.viewport} ${status === 'playing' ? styles.playing : ''}`}>
        <div className={styles.noise} aria-hidden="true" />
        <div className={styles.frameGrid} aria-hidden="true" />
        <span className={styles.rec}>● REC</span>
        <span className={styles.channel}>{file.sceneLabel}</span>
        <div className={styles.placeholder}>
          <strong>ARCHIVE MEDIA SLOT</strong>
          <span>実映像を受領後、この表示と差し替えます</span>
        </div>
        <time className={styles.timestamp}>
          {file.recordedAt}:{pad(position)}
        </time>
      </div>

      <div className={styles.controls}>
        <button
          aria-label={status === 'playing' ? '一時停止' : '再生'}
          onClick={() =>
            setPlaybackStatus(status === 'playing' ? 'paused' : 'playing')
          }
          type="button"
        >
          {status === 'playing' ? 'Ⅱ' : '▶'}
        </button>
        <span>{`00:${pad(position)}`}</span>
        <input
          aria-label="再生位置"
          max={file.duration}
          min="0"
          onChange={(event) => {
            setPosition(Number(event.target.value))
            if (status === 'ended') setPlaybackStatus('paused')
          }}
          type="range"
          value={position}
        />
        <span>{`00:${pad(file.duration)}`}</span>
      </div>
    </div>
  )
}
