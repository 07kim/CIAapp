import type { AppAction, AppState } from './app-state'

export const initialAppState: AppState = {
  screen: 'desktop',
  isHomeConfirmationOpen: false,
  cameraGateUnlocked: false,
  unlockedArchiveIds: [],
  selectedFileId: null,
  pendingArchiveId: null,
  authenticationStatus: 'idle',
  videoStatus: 'idle',
  isIdleWarningOpen: false,
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'open-camera':
      return { ...state, screen: 'camera-gate' }
    case 'open-access-log':
      return { ...state, screen: 'access-log' }
    case 'show-auth-result':
      return { ...state, authenticationStatus: action.result }
    case 'finish-gate-auth':
      return action.success
        ? {
            ...state,
            screen: 'camera-browser',
            cameraGateUnlocked: true,
            authenticationStatus: 'idle',
          }
        : { ...state, authenticationStatus: 'idle' }
    case 'select-file':
      return {
        ...state,
        selectedFileId: action.fileId,
        pendingArchiveId: null,
        authenticationStatus: 'idle',
        videoStatus: 'idle',
      }
    case 'request-archive-auth':
      return {
        ...state,
        pendingArchiveId: action.fileId,
        authenticationStatus: 'idle',
        videoStatus: 'idle',
      }
    case 'finish-archive-auth':
      if (!action.success) {
        return { ...state, authenticationStatus: 'idle' }
      }
      return {
        ...state,
        unlockedArchiveIds: state.unlockedArchiveIds.includes(action.fileId)
          ? state.unlockedArchiveIds
          : [...state.unlockedArchiveIds, action.fileId],
        selectedFileId: action.fileId,
        pendingArchiveId: null,
        authenticationStatus: 'idle',
        videoStatus: 'idle',
      }
    case 'cancel-archive-auth':
      return {
        ...state,
        pendingArchiveId: null,
        authenticationStatus: 'idle',
      }
    case 'set-video-status':
      return { ...state, videoStatus: action.status }
    case 'show-idle-warning':
      return { ...state, isIdleWarningOpen: true }
    case 'clear-idle-warning':
      return { ...state, isIdleWarningOpen: false }
    case 'idle-reset':
    case 'confirm-home':
      return initialAppState
    case 'request-home':
      if (state.screen === 'desktop') return state
      return { ...state, isHomeConfirmationOpen: true }
    case 'cancel-home':
      return { ...state, isHomeConfirmationOpen: false }
  }
}
