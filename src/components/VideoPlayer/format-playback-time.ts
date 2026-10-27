const pad = (value: number) => String(value).padStart(2, '0')

export const formatPlaybackTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${pad(minutes)}:${pad(seconds)}`
}

export const formatRecordingTimestamp = (
  recordedAt: string,
  offsetSeconds: number,
) => {
  const match = recordedAt.match(/^(.*\s)(\d{2}):(\d{2})$/)
  if (!match) return `${recordedAt}:${pad(offsetSeconds)}`

  const [, prefix, hours, minutes] = match
  const baseSeconds = Number(hours) * 3_600 + Number(minutes) * 60
  const timeOfDay = (baseSeconds + offsetSeconds) % 86_400
  const displayedHours = Math.floor(timeOfDay / 3_600)
  const displayedMinutes = Math.floor((timeOfDay % 3_600) / 60)
  const displayedSeconds = timeOfDay % 60

  return `${prefix}${pad(displayedHours)}:${pad(displayedMinutes)}:${pad(displayedSeconds)}`
}
