import type { AccessLogEntry, AccessLogRepository } from './types'

export const eventAccessLogs: AccessLogEntry[] = [
  {
    id: 'log-2000',
    timestamp: '2026-11-20T20:00:00+09:00',
    date: '2026/11/20',
    time: '20:00',
    personId: 'ID-0719',
    personName: '一ノ瀬 なつき',
    direction: '入室',
    room: '社長室',
  },
  {
    id: 'log-2015',
    timestamp: '2026-11-20T20:15:00+09:00',
    date: '2026/11/20',
    time: '20:15',
    personId: 'ID-0719',
    personName: '一ノ瀬 なつき',
    direction: '退室',
    room: '社長室',
  },
  {
    id: 'log-2030',
    timestamp: '2026-11-20T20:30:00+09:00',
    date: '2026/11/20',
    time: '20:30',
    personId: 'ID-0719',
    personName: '一ノ瀬 なつき',
    direction: '入室',
    room: '社長室',
  },
  {
    id: 'log-2045',
    timestamp: '2026-11-20T20:45:00+09:00',
    date: '2026/11/20',
    time: '20:45',
    personId: 'ID-0719',
    personName: '一ノ瀬 なつき',
    direction: '退室',
    room: '社長室',
  },
]

export class StaticAccessLogRepository implements AccessLogRepository {
  async list() {
    return eventAccessLogs
  }
}

export const accessLogRepository: AccessLogRepository =
  new StaticAccessLogRepository()
