import { useCallback, useEffect, useReducer, useRef } from 'react'

import { AppShell } from '../components/AppShell/AppShell'
import { DynamicBackdrop, type BackdropVariant } from '../components/DynamicBackdrop/DynamicBackdrop'
import { HomeConfirmation } from '../components/HomeConfirmation/HomeConfirmation'
import { IdleWarning } from '../components/IdleWarning/IdleWarning'
import type { ArchiveFile } from '../data/surveillance-files'
import {
  isArchiveAnswerCorrect,
  isGateAnswerCorrect,
} from '../features/authentication/answers'
import { useIdleReset } from '../features/idle-timeout/useIdleReset'
import { AccessLogScreen } from '../screens/AccessLogScreen/AccessLogScreen'
import { CameraGateScreen } from '../screens/CameraGateScreen/CameraGateScreen'
import { CameraSystemScreen } from '../screens/CameraSystemScreen/CameraSystemScreen'
import { DesktopScreen } from '../screens/DesktopScreen/DesktopScreen'
import { appReducer, initialAppState } from './app-reducer'
import type { VideoStatus } from './app-state'
import styles from './App.module.css'

const AUTH_RESULT_DURATION_MS = 2_000

export function App() {
  const [state, dispatch] = useReducer(appReducer, initialAppState)
  const authenticationTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (authenticationTimer.current !== null) {
        window.clearTimeout(authenticationTimer.current)
      }
    },
    [],
  )

  const showGateResult = useCallback((answer: string) => {
    const success = isGateAnswerCorrect(answer)
    dispatch({ type: 'show-auth-result', result: success ? 'granted' : 'denied' })
    authenticationTimer.current = window.setTimeout(() => {
      dispatch({ type: 'finish-gate-auth', success })
    }, AUTH_RESULT_DURATION_MS)
  }, [])

  const showArchiveResult = useCallback((file: ArchiveFile, answer: string) => {
    const success = Boolean(file.answer && isArchiveAnswerCorrect(answer, file.answer))
    dispatch({ type: 'show-auth-result', result: success ? 'granted' : 'denied' })
    authenticationTimer.current = window.setTimeout(() => {
      dispatch({ type: 'finish-archive-auth', fileId: file.id, success })
    }, AUTH_RESULT_DURATION_MS)
  }, [])

  const selectArchive = useCallback(
    (file: ArchiveFile) => {
      const isUnlocked = !file.locked || state.unlockedArchiveIds.includes(file.id)
      dispatch(
        isUnlocked
          ? { type: 'select-file', fileId: file.id }
          : { type: 'request-archive-auth', fileId: file.id },
      )
    },
    [state.unlockedArchiveIds],
  )

  const setVideoStatus = useCallback((status: VideoStatus) => {
    dispatch({ type: 'set-video-status', status })
  }, [])

  const showIdleWarning = useCallback(() => {
    dispatch({ type: 'show-idle-warning' })
  }, [])
  const clearIdleWarning = useCallback(() => {
    dispatch({ type: 'clear-idle-warning' })
  }, [])
  const resetForInactivity = useCallback(() => {
    dispatch({ type: 'idle-reset' })
  }, [])

  useIdleReset({
    enabled: state.screen !== 'desktop',
    paused:
      state.videoStatus === 'playing' || state.authenticationStatus !== 'idle',
    onActivity: clearIdleWarning,
    onReset: resetForInactivity,
    onWarning: showIdleWarning,
  })

  const backdropVariant: BackdropVariant = state.screen === 'desktop'
    ? 'desktop'
    : state.screen === 'camera-gate'
      ? 'authentication'
      : state.screen === 'camera-browser'
        ? 'surveillance'
        : 'access'

  const transition = state.screen === 'desktop'
    ? { mode: 'desktop', label: 'DESKTOP SESSION' }
    : state.screen === 'camera-gate'
      ? { mode: 'authentication', label: 'CREDENTIAL GATE' }
      : state.screen === 'camera-browser'
        ? { mode: 'surveillance', label: 'ARCHIVE MOUNT' }
        : { mode: 'access', label: 'ACCESS TRACE' }

  const screen = (() => {
    switch (state.screen) {
      case 'desktop':
        return (
          <AppShell desktop title="CIAデスクトップ" subtitle="CIA INTERNAL NETWORK">
            <DesktopScreen
              onOpenAccessLog={() => dispatch({ type: 'open-access-log' })}
              onOpenCamera={() => dispatch({ type: 'open-camera' })}
            />
          </AppShell>
        )
      case 'camera-gate':
        return (
          <AppShell
            homeDisabled={state.authenticationStatus !== 'idle'}
            title="監視カメラ認証"
            subtitle="SURVEILLANCE AUTHENTICATION"
            onRequestHome={() => dispatch({ type: 'request-home' })}
          >
            <CameraGateScreen
              onAuthenticate={showGateResult}
              status={state.authenticationStatus}
            />
          </AppShell>
        )
      case 'camera-browser':
        return (
          <AppShell
            compact
            homeDisabled={state.authenticationStatus !== 'idle'}
            title="監視カメラシステム"
            subtitle="SURVEILLANCE ARCHIVE"
            onRequestHome={() => dispatch({ type: 'request-home' })}
          >
            <CameraSystemScreen
              authenticationStatus={state.authenticationStatus}
              onAuthenticateArchive={showArchiveResult}
              onCancelArchiveAuth={() => dispatch({ type: 'cancel-archive-auth' })}
              onSelectArchive={selectArchive}
              onSelectSystemFile={(fileId) =>
                dispatch({ type: 'select-file', fileId })
              }
              onVideoStatusChange={setVideoStatus}
              pendingArchiveId={state.pendingArchiveId}
              selectedFileId={state.selectedFileId}
              unlockedArchiveIds={state.unlockedArchiveIds}
            />
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
      <DynamicBackdrop variant={backdropVariant} />
      <div className={styles.screenStage} data-transition={transition.mode} key={state.screen}>
        <div aria-hidden="true" className={styles.transitionCurtain}>
          <span className={styles.transitionCore}><i /></span>
          <span className={styles.transitionLine} />
          <span className={styles.transitionLabel}>{transition.label}</span>
          <span className={styles.transitionFragments}>
            <i /><i /><i /><i /><i /><i /><i /><i />
          </span>
        </div>
        {screen}
      </div>
      {state.isIdleWarningOpen ? <IdleWarning /> : null}
      {state.isHomeConfirmationOpen ? (
        <HomeConfirmation
          onCancel={() => dispatch({ type: 'cancel-home' })}
          onConfirm={() => dispatch({ type: 'confirm-home' })}
        />
      ) : null}
    </>
  )
}
