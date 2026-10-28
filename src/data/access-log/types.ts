export type AccessDirection = '入室' | '退室'

export type AccessLogEntry = {
  id: string
  timestamp: string
  date: string
  time: string
  personId: string
  personName: string
  direction: AccessDirection
  room: string
}

export interface AccessLogRepository {
  list(): Promise<AccessLogEntry[]>
}
