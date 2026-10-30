import { useCallback, useEffect, useRef } from 'react'

export type UiSound =
  | 'launch'
  | 'select'
  | 'auth-start'
  | 'granted'
  | 'denied'
  | 'unlock'
  | 'play'
  | 'pause'
  | 'warning'

type WebkitWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }
type Note = [frequency: number, offset: number, duration: number, type: OscillatorType, volume?: number]

const patterns: Record<UiSound, Note[]> = {
  launch: [[92, 0, 0.18, 'sine', 0.08], [184, 0.12, 0.26, 'sine', 0.07], [368, 0.28, 0.16, 'triangle', 0.05]],
  select: [[420, 0, 0.045, 'triangle', 0.045]],
  'auth-start': [[160, 0, 0.08, 'square', 0.035], [240, 0.12, 0.08, 'square', 0.035], [320, 0.24, 0.1, 'square', 0.035]],
  granted: [[330, 0, 0.1, 'sine', 0.07], [495, 0.11, 0.12, 'sine', 0.07], [740, 0.24, 0.2, 'sine', 0.08]],
  denied: [[190, 0, 0.14, 'sawtooth', 0.055], [132, 0.15, 0.2, 'sawtooth', 0.06]],
  unlock: [[220, 0, 0.08, 'triangle', 0.05], [440, 0.09, 0.12, 'triangle', 0.065], [880, 0.22, 0.22, 'sine', 0.07]],
  play: [[520, 0, 0.06, 'sine', 0.045], [780, 0.07, 0.08, 'sine', 0.04]],
  pause: [[560, 0, 0.05, 'sine', 0.04], [420, 0.07, 0.07, 'sine', 0.04]],
  warning: [[310, 0, 0.08, 'square', 0.04], [310, 0.18, 0.08, 'square', 0.04]],
}
export function useUiSounds() {
  const contextRef = useRef<AudioContext | null>(null)

  const unlockAudio = useCallback(async () => {
    if (!contextRef.current) {
      const Context = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext
      if (!Context) return
      contextRef.current = new Context()
    }
    if (contextRef.current.state === 'suspended') await contextRef.current.resume()
  }, [])

  useEffect(() => {
    const unlock = () => void unlockAudio()
    window.addEventListener('pointerdown', unlock, { capture: true, once: true })
    window.addEventListener('keydown', unlock, { capture: true, once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock, true)
      window.removeEventListener('keydown', unlock, true)
    }
  }, [unlockAudio])

  const playSound = useCallback((sound: UiSound) => {
    const context = contextRef.current
    if (!context || context.state !== 'running') return
    for (const [frequency, offset, duration, type, volume = 0.05] of patterns[sound]) {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const start = context.currentTime + offset
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, start)
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(start)
      oscillator.stop(start + duration + 0.03)
    }
  }, [])

  return { playSound, unlockAudio }
}
