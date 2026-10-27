import { render, screen } from '@testing-library/react'
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
}

describe('VideoPlayer', () => {
  it('formats playback time across minute boundaries', () => {
    expect(formatPlaybackTime(0)).toBe('00:00')
    expect(formatPlaybackTime(59)).toBe('00:59')
    expect(formatPlaybackTime(90)).toBe('01:30')
    expect(formatRecordingTimestamp('2026/11/20 23:55', 90)).toBe(
      '2026/11/20 23:56:30',
    )
  })

  it('shows a minute-based duration for longer media', () => {
    render(<VideoPlayer file={longArchive} onStatusChange={vi.fn()} />)

    expect(screen.getByText('01:30')).toBeVisible()
  })
})
