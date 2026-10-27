import { act, renderHook } from '@testing-library/react'
import { vi } from 'vitest'

import { useIdleReset } from './useIdleReset'

describe('useIdleReset', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('warns after 10 seconds and resets after 20 seconds', () => {
    const onWarning = vi.fn()
    const onReset = vi.fn()

    renderHook(() =>
      useIdleReset({
        enabled: true,
        paused: false,
        onActivity: vi.fn(),
        onReset,
        onWarning,
      }),
    )

    act(() => vi.advanceTimersByTime(10_000))
    expect(onWarning).toHaveBeenCalledOnce()
    expect(onReset).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(10_000))
    expect(onReset).toHaveBeenCalledOnce()
  })

  it('does not count while paused', () => {
    const onReset = vi.fn()
    renderHook(() =>
      useIdleReset({
        enabled: true,
        paused: true,
        onActivity: vi.fn(),
        onReset,
        onWarning: vi.fn(),
      }),
    )

    act(() => vi.advanceTimersByTime(60_000))
    expect(onReset).not.toHaveBeenCalled()
  })
})
