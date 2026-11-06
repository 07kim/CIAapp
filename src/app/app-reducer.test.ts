import { appReducer, initialAppState } from './app-reducer'

describe('appReducer', () => {
  it('opens the camera gate from the desktop', () => {
    expect(appReducer(initialAppState, { type: 'open-camera' })).toEqual({
      ...initialAppState,
      screen: 'camera-gate',
    })
  })

  it('opens the security audit from the desktop', () => {
    expect(appReducer(initialAppState, { type: 'open-security-audit' })).toEqual({
      ...initialAppState,
      screen: 'security-audit',
    })
  })

  it('unlocks the camera gate only after successful authentication', () => {
    const gateState = appReducer(initialAppState, { type: 'open-camera' })
    expect(
      appReducer(gateState, { type: 'finish-gate-auth', success: false }),
    ).toEqual(gateState)

    expect(
      appReducer(gateState, { type: 'finish-gate-auth', success: true }),
    ).toMatchObject({
      screen: 'camera-browser',
      cameraGateUnlocked: true,
    })
  })

  it('keeps unlocked archives inside the camera application', () => {
    const cameraState = {
      ...initialAppState,
      screen: 'camera-browser' as const,
      cameraGateUnlocked: true,
      pendingArchiveId: 'archive-2000',
    }
    const unlocked = appReducer(cameraState, {
      type: 'finish-archive-auth',
      fileId: 'archive-2000',
      success: true,
    })

    expect(unlocked.unlockedArchiveIds).toEqual(['archive-2000'])
    expect(unlocked.selectedFileId).toBe('archive-2000')
  })

  it('returns to a clean desktop state after confirmation or inactivity', () => {
    const cameraState = {
      ...initialAppState,
      screen: 'camera-browser' as const,
      cameraGateUnlocked: true,
      unlockedArchiveIds: ['archive-2000'],
      selectedFileId: 'archive-2000',
      isHomeConfirmationOpen: true,
    }

    expect(appReducer(cameraState, { type: 'confirm-home' })).toEqual(
      initialAppState,
    )
    expect(appReducer(cameraState, { type: 'idle-reset' })).toEqual(
      initialAppState,
    )
  })
})
