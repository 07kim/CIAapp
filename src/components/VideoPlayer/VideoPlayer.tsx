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
  const positionRef = useRef(0)

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
    let animationFrame = 0
    let previousFrame: number | null = null
    const update = (timestamp: number) => {
      if (previousFrame === null) previousFrame = timestamp
      const elapsed = (timestamp - previousFrame) / 1_000
      previousFrame = timestamp
      const next = Math.min(file.duration, positionRef.current + elapsed)
      positionRef.current = next
      setPosition(next)
      if (next >= file.duration) {
        setStatus('ended')
        onStatusChange('ended')
        return
      }
      animationFrame = window.requestAnimationFrame(update)
    }
    animationFrame = window.requestAnimationFrame(update)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [file.duration, onStatusChange, status])

  const setPlaybackStatus = (nextStatus: VideoStatus) => {
    if (nextStatus === 'playing' && position >= file.duration) {
      positionRef.current = 0
      setPosition(0)
    }
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
        <div className={styles.mediaFrame}>
          {file.media.kind === 'placeholder-image' ? (
            <img
              alt={file.media.alt}
              className={styles.mediaImage}
              draggable="false"
              src={file.media.src}
            />
          ) : (
            <div aria-label={file.media.alt} className={styles.signalLoss} role="img">
              <div aria-hidden="true" className={styles.signalGlyph}><i /><i /><i /></div>
              <strong>{file.media.message}</strong>
              <span>{file.media.code}</span>
              <small>20:15—20:18 / RECORDING SUSPENDED</small>
            </div>
          )}
        </div>
        <div className={styles.mediaShade} aria-hidden="true" />
        <div className={styles.noise} aria-hidden="true" />
        <div className={styles.frameGrid} aria-hidden="true" />
        <span className={styles.rec}>
          {file.media.kind === 'placeholder-image' ? '● REC' : '■ RECORDING STOPPED'}
        </span>
        <span className={styles.channel}>{file.sceneLabel}</span>
        <span className={styles.mediaStatus}>
          {file.media.kind === 'placeholder-image'
            ? 'TEMPORARY STILL / LOCAL CACHE'
            : 'NO VIDEO DATA / LOCAL EVENT LOG'}
        </span>
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
            const nextPosition = Number(event.target.value)
            positionRef.current = nextPosition
            setPosition(nextPosition)
            if (status === 'ended') setPlaybackStatus('paused')
          }}
          step="0.01"
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
