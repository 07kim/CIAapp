import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useUiSounds } from './useUiSounds'

describe('useUiSounds', () => {
  it('keeps the interface usable when Web Audio is unavailable', async () => {
    const { result } = renderHook(() => useUiSounds())

    await act(async () => {
      await expect(result.current.unlockAudio()).resolves.toBeUndefined()
      result.current.playSound('granted')
    })
  })
})
