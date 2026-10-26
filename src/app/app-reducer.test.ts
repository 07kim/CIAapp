import { appReducer, initialAppState } from './app-reducer'

describe('appReducer', () => {
  it('opens the camera gate from the desktop', () => {
    expect(appReducer(initialAppState, { type: 'open-camera' })).toEqual({
      screen: 'camera-gate',
      isHomeConfirmationOpen: false,
    })
  })

  it('returns to a clean desktop state after confirmation', () => {
    const cameraState = {
      screen: 'camera-gate' as const,
      isHomeConfirmationOpen: true,
    }

    expect(appReducer(cameraState, { type: 'confirm-home' })).toEqual(
      initialAppState,
    )
  })
})
