export type AppScreen =
  | 'desktop'
  | 'camera-gate'
  | 'camera-browser'
  | 'access-log'
  | 'security-audit'

export type AuthenticationStatus = 'idle' | 'granted' | 'denied'
export type VideoStatus = 'idle' | 'playing' | 'paused' | 'ended'

export type AppState = {
  screen: AppScreen
  isHomeConfirmationOpen: boolean
  cameraGateUnlocked: boolean
  unlockedArchiveIds: string[]
  selectedFileId: string | null
  pendingArchiveId: string | null
  authenticationStatus: AuthenticationStatus
  videoStatus: VideoStatus
  isIdleWarningOpen: boolean
}

export type AppAction =
  | { type: 'open-camera' }
  | { type: 'open-access-log' }
  | { type: 'open-security-audit' }
  | { type: 'show-auth-result'; result: Exclude<AuthenticationStatus, 'idle'> }
  | { type: 'finish-gate-auth'; success: boolean }
  | { type: 'select-file'; fileId: string }
  | { type: 'request-archive-auth'; fileId: string }
  | { type: 'finish-archive-auth'; fileId: string; success: boolean }
  | { type: 'cancel-archive-auth' }
  | { type: 'set-video-status'; status: VideoStatus }
  | { type: 'show-idle-warning' }
  | { type: 'clear-idle-warning' }
  | { type: 'idle-reset' }
  | { type: 'request-home' }
  | { type: 'cancel-home' }
  | { type: 'confirm-home' }
