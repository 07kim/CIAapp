import type { AppAction, AppState } from './app-state'

export const initialAppState: AppState = {
  screen: 'desktop',
  isHomeConfirmationOpen: false,
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'open-camera':
      return { ...state, screen: 'camera-gate' }
    case 'open-access-log':
      return { ...state, screen: 'access-log' }
    case 'request-home':
      if (state.screen === 'desktop') {
        return state
      }
      return { ...state, isHomeConfirmationOpen: true }
    case 'cancel-home':
      return { ...state, isHomeConfirmationOpen: false }
    case 'confirm-home':
      return initialAppState
  }
}
