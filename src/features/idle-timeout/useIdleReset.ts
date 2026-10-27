import { useCallback, useEffect, useRef } from 'react'

type UseIdleResetOptions = {
  enabled: boolean
  paused: boolean
  onReset: () => void
  onWarning: () => void
  onActivity: () => void
  warningAfterMs?: number
  resetAfterMs?: number
}

export function useIdleReset({
  enabled,
  onActivity,
  onReset,
  onWarning,
  paused,
  resetAfterMs = 20_000,
  warningAfterMs = 10_000,
}: UseIdleResetOptions) {
  const warningTimer = useRef<number | null>(null)
  const resetTimer = useRef<number | null>(null)
  const lastMouseMove = useRef(0)

  const clearTimers = useCallback(() => {
    if (warningTimer.current !== null) window.clearTimeout(warningTimer.current)
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current)
    warningTimer.current = null
    resetTimer.current = null
  }, [])

  const startTimers = useCallback(() => {
    clearTimers()
    if (!enabled || paused) return
    warningTimer.current = window.setTimeout(onWarning, warningAfterMs)
    resetTimer.current = window.setTimeout(onReset, resetAfterMs)
  }, [clearTimers, enabled, onReset, onWarning, paused, resetAfterMs, warningAfterMs])

  useEffect(() => {
    startTimers()
    return clearTimers
  }, [clearTimers, startTimers])

  useEffect(() => {
    if (!enabled) return

    const handleActivity = (event: Event) => {
      if (event.type === 'mousemove') {
        const now = Date.now()
        if (now - lastMouseMove.current < 500) return
        lastMouseMove.current = now
      }
      onActivity()
      startTimers()
    }

    const events: Array<keyof WindowEventMap> = ['mousemove', 'mousedown', 'keydown', 'touchstart']
    events.forEach((eventName) => window.addEventListener(eventName, handleActivity))
    return () => events.forEach((eventName) => window.removeEventListener(eventName, handleActivity))
  }, [enabled, onActivity, startTimers])
}
