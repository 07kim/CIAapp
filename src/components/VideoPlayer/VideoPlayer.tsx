import { useEffect, useRef, useState } from 'react'

import type { VideoStatus } from '../../app/app-state'
import type { ArchiveFile } from '../../data/surveillance-files'
import {
  formatPlaybackTime,
  formatRecordingTimestamp,
} from './format-playback-time'
import styles from './VideoPlayer.module.css'

type VideoPlayerProps = {
  file: ArchiveFile
  onStatusChange: (status: VideoStatus) => void
}

export function VideoPlayer({ file, onStatusChange }: VideoPlayerProps) {
  const [position, setPosition] = useState(0)
  const [status, setStatus] = useState<VideoStatus>('idle')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === playerRef.current)
    }
    document.addEventListener('fullscreenchange', updateFullscreenState)
    return () =>
      document.removeEventListener('fullscreenchange', updateFullscreenState)
  }, [])

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

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    await playerRef.current?.requestFullscreen()
  }

  return (
    <div className={styles.player} ref={playerRef}>
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
          {formatRecordingTimestamp(file.recordedAt, position)}
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
        <span>{formatPlaybackTime(position)}</span>
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
        <span>{formatPlaybackTime(file.duration)}</span>
        <button
          aria-label={isFullscreen ? '全画面を終了' : '全画面で表示'}
          className={styles.fullscreenButton}
          onClick={() => void toggleFullscreen()}
          type="button"
        >
          {isFullscreen ? '×' : '⛶'}
        </button>
      </div>
    </div>
  )
}
