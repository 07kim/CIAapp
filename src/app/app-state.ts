export type AppScreen = 'desktop' | 'camera-gate' | 'access-log'

export type AppState = {
  screen: AppScreen
  isHomeConfirmationOpen: boolean
}

export type AppAction =
  | { type: 'open-camera' }
  | { type: 'open-access-log' }
  | { type: 'request-home' }
  | { type: 'cancel-home' }
  | { type: 'confirm-home' }
