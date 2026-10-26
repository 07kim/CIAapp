import { useReducer } from 'react'

import { AppShell } from '../components/AppShell/AppShell'
import { HomeConfirmation } from '../components/HomeConfirmation/HomeConfirmation'
import { AccessLogScreen } from '../screens/AccessLogScreen/AccessLogScreen'
import { CameraGateScreen } from '../screens/CameraGateScreen/CameraGateScreen'
import { DesktopScreen } from '../screens/DesktopScreen/DesktopScreen'
import { appReducer, initialAppState } from './app-reducer'

export function App() {
  const [state, dispatch] = useReducer(appReducer, initialAppState)

  const screen = (() => {
    switch (state.screen) {
      case 'desktop':
        return (
          <AppShell title="社内端末" subtitle="INTERNAL OPERATIONS TERMINAL">
            <DesktopScreen
              onOpenAccessLog={() => dispatch({ type: 'open-access-log' })}
              onOpenCamera={() => dispatch({ type: 'open-camera' })}
            />
          </AppShell>
        )
      case 'camera-gate':
        return (
          <AppShell
            title="監視カメラ認証"
            subtitle="SURVEILLANCE AUTHENTICATION"
            onRequestHome={() => dispatch({ type: 'request-home' })}
          >
            <CameraGateScreen />
          </AppShell>
        )
      case 'access-log':
        return (
          <AppShell
            title="入退室ログ記録"
            subtitle="ACCESS CONTROL LOG"
            onRequestHome={() => dispatch({ type: 'request-home' })}
          >
            <AccessLogScreen />
          </AppShell>
        )
    }
  })()

  return (
    <>
      {screen}
      {state.isHomeConfirmationOpen ? (
        <HomeConfirmation
          onCancel={() => dispatch({ type: 'cancel-home' })}
          onConfirm={() => dispatch({ type: 'confirm-home' })}
        />
      ) : null}
    </>
  )
}
