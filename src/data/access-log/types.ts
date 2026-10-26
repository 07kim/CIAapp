export type AccessDirection = '入室' | '退室' | '巡回'
export type AccessStatus = '許可' | '記録のみ'

export type AccessLogEntry = {
  id: string
  timestamp: string
  time: string
  personId: string
  personName: string
  department: string
  direction: AccessDirection
  checkpoint: string
  status: AccessStatus
}

export interface AccessLogRepository {
  list(): Promise<AccessLogEntry[]>
}
