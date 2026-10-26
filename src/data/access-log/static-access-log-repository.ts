import type { AccessLogEntry, AccessLogRepository } from './types'

export const provisionalAccessLogs: AccessLogEntry[] = [
  {
    id: 'log-1948',
    timestamp: '2026/11/20 19:48:32',
    time: '19:48',
    personId: 'CIA-0417',
    personName: '四ツ谷 はると',
    department: 'システム管理部',
    direction: '入室',
    checkpoint: '役員フロア 東側入口',
    status: '許可',
  },
  {
    id: 'log-2022',
    timestamp: '2026/11/20 20:22:06',
    time: '20:22',
    personId: 'CIA-0417',
    personName: '四ツ谷 はると',
    department: 'システム管理部',
    direction: '退室',
    checkpoint: '役員フロア 東側入口',
    status: '許可',
  },
  {
    id: 'log-2029',
    timestamp: '2026/11/20 20:29:41',
    time: '20:29',
    personId: 'CIA-0831',
    personName: '一ノ瀬 なつき',
    department: '施設管理部',
    direction: '入室',
    checkpoint: '役員フロア 清掃員入口',
    status: '許可',
  },
  {
    id: 'log-2046',
    timestamp: '2026/11/20 20:46:11',
    time: '20:46',
    personId: 'CIA-0831',
    personName: '一ノ瀬 なつき',
    department: '施設管理部',
    direction: '退室',
    checkpoint: '役員フロア 清掃員入口',
    status: '許可',
  },
  {
    id: 'log-2355',
    timestamp: '2026/11/20 23:55:00',
    time: '23:55',
    personId: 'SEC-PATROL',
    personName: '警備巡回端末',
    department: '警備室',
    direction: '巡回',
    checkpoint: '役員フロア 廊下',
    status: '記録のみ',
  },
]

export class StaticAccessLogRepository implements AccessLogRepository {
  async list() {
    return provisionalAccessLogs
  }
}

export const accessLogRepository: AccessLogRepository =
  new StaticAccessLogRepository()
