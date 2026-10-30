import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import type { ArchiveFile } from '../../data/surveillance-files'
import {
  formatPlaybackTime,
  formatRecordingTimestamp,
} from './format-playback-time'
import { VideoPlayer } from './VideoPlayer'

const longArchive: ArchiveFile = {
  id: 'long-archive',
  kind: 'video',
  filename: '20261120-2355',
  recordedAt: '2026/11/20 23:55',
  time: '23:55',
  location: '社長室 / EXECUTIVE OFFICE',
  locked: false,
  duration: 90,
  sceneLabel: 'CAM 01 · NIGHT RECORD',
  description: '長時間表示の確認用',
  media: {
    kind: 'placeholder-image',
    src: '/assets/surveillance/placeholders/archive-2355.png',
    alt: '映像5の仮素材',
  },
}

describe('VideoPlayer', () => {
  it('formats playback time across minute boundaries', () => {
    expect(formatPlaybackTime(0)).toBe('00:00')
    expect(formatPlaybackTime(59)).toBe('00:59')
    expect(formatPlaybackTime(59.82)).toBe('00:59')
    expect(formatPlaybackTime(90)).toBe('01:30')
    expect(formatRecordingTimestamp('2026/11/20 23:55', 12.84)).toBe(
      '2026/11/20 23:55:12',
    )
    expect(formatRecordingTimestamp('2026/11/20 23:55', 90)).toBe(
      '2026/11/20 23:56:30',
    )
  })

  it('shows a minute-based duration for longer media', () => {
    render(<VideoPlayer file={longArchive} onStatusChange={vi.fn()} />)

    expect(screen.getByText('01:30')).toBeVisible()
    expect(screen.getByRole('slider', { name: '再生位置' })).toHaveAttribute(
      'step',
      '0.01',
    )
  })

  it('shows the configured temporary still image', () => {
    render(<VideoPlayer file={longArchive} onStatusChange={vi.fn()} />)

    expect(screen.getByRole('img', { name: '映像5の仮素材' })).toHaveAttribute(
      'src',
      '/assets/surveillance/placeholders/archive-2355.png',
    )
    expect(screen.getByText('TEMPORARY STILL / LOCAL CACHE')).toBeVisible()
  })

  it('requests fullscreen playback from its control', () => {
    const requestFullscreen = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
      configurable: true,
      value: requestFullscreen,
    })
    render(<VideoPlayer file={longArchive} onStatusChange={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: '全画面で表示' }))

    expect(requestFullscreen).toHaveBeenCalledOnce()
    Reflect.deleteProperty(HTMLElement.prototype, 'requestFullscreen')
  })
})
