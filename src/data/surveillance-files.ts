export type ArchiveFile = {
  id: string
  kind: 'video'
  filename: string
  recordedAt: string
  time: string
  location: string
  locked: boolean
  answer?: string
  duration: number
  sceneLabel: string
  description: string
}

export type SystemFile = {
  id: string
  kind: 'system'
  filename: string
  category: string
  updatedAt: string
  lines: string[]
}

export type SurveillanceFile = ArchiveFile | SystemFile

export const archiveFiles: ArchiveFile[] = [
  {
    id: 'archive-2000',
    kind: 'video',
    filename: '20261120-2000',
    recordedAt: '2026/11/20 20:00',
    time: '20:00',
    location: '社長室 / EXECUTIVE OFFICE',
    locked: true,
    answer: 'UNIVERSE',
    duration: 38,
    sceneLabel: 'CAM 01 · EXECUTIVE OFFICE',
    description: '暗号化された監視映像。認証後に再生できます。',
  },
  {
    id: 'archive-2015',
    kind: 'video',
    filename: '20261120-2015',
    recordedAt: '2026/11/20 20:15',
    time: '20:15',
    location: '社長室 / EXECUTIVE OFFICE',
    locked: true,
    answer: 'TAIATARI',
    duration: 42,
    sceneLabel: 'CAM 01 · EXECUTIVE OFFICE',
    description: '暗号化された監視映像。認証後に再生できます。',
  },
  {
    id: 'archive-2030',
    kind: 'video',
    filename: '20261120-2030',
    recordedAt: '2026/11/20 20:30',
    time: '20:30',
    location: '社長室 / EXECUTIVE OFFICE',
    locked: false,
    duration: 35,
    sceneLabel: 'CAM 01 · CLEANING RECORD',
    description: '清掃担当者が社長室へ入室した時間帯の記録。',
  },
  {
    id: 'archive-2045',
    kind: 'video',
    filename: '20261120-2045',
    recordedAt: '2026/11/20 20:45',
    time: '20:45',
    location: '社長室 / EXECUTIVE OFFICE',
    locked: false,
    duration: 31,
    sceneLabel: 'CAM 01 · CLEANING RECORD',
    description: '清掃担当者が社長室を退室した時間帯の記録。',
  },
  {
    id: 'archive-2355',
    kind: 'video',
    filename: '20261120-2355',
    recordedAt: '2026/11/20 23:55',
    time: '23:55',
    location: '社長室 / EXECUTIVE OFFICE',
    locked: false,
    duration: 40,
    sceneLabel: 'CAM 01 · NIGHT RECORD',
    description: '深夜帯の暗い社長室を記録した映像。',
  },
]

export const systemFiles: SystemFile[] = [
  {
    id: 'access-history',
    kind: 'system',
    filename: 'ACCESS_HISTORY.LOG',
    category: 'ACCESS TRACE',
    updatedAt: '2026/11/21 00:04:12',
    lines: [
      '[19:58:12] CAM-01 archive session initialized',
      '[20:00:00] motion flag raised / executive_office',
      '[20:15:00] secure storage zone motion detected',
      '[20:29:43] employee cleaning window started',
      '[20:46:08] employee cleaning window closed',
      '[23:55:00] no motion / luminance below threshold',
    ],
  },
  {
    id: 'camera-status',
    kind: 'system',
    filename: 'CAMERA_STATUS.SYS',
    category: 'DEVICE HEALTH',
    updatedAt: '2026/11/21 00:05:20',
    lines: [
      'CAM-01 ........ ONLINE',
      'CAM-02 ........ ONLINE',
      'ARCHIVE NODE ... READY',
      'FRAME LOSS ..... 0.02%',
      'AUDIO CHANNEL .. DISABLED',
      'RETENTION ...... LOCAL / 30 DAYS',
    ],
  },
  {
    id: 'archive-index',
    kind: 'system',
    filename: 'ARCHIVE_INDEX.DAT',
    category: 'ARCHIVE MAP',
    updatedAt: '2026/11/21 00:06:02',
    lines: [
      'INDEX VERSION: 4.1.7',
      'FILES FOUND: 005',
      'ENCRYPTED: 002',
      'READABLE: 003',
      'CORRUPTED: 000',
      'ORDER: TIMESTAMP ASCENDING',
    ],
  },
  {
    id: 'network-diagnostics',
    kind: 'system',
    filename: 'NETWORK_DIAGNOSTICS.LOG',
    category: 'NETWORK TEST',
    updatedAt: '2026/11/21 00:07:41',
    lines: [
      'INTERNAL BUS ......... CONNECTED',
      'REMOTE UPLINK ........ DEGRADED',
      'LOCAL ARCHIVE ........ AVAILABLE',
      'OFFLINE FALLBACK ..... ARMED',
      'PACKET LOSS .......... 1.4%',
      'LAST DIAGNOSTIC ...... PASS',
    ],
  },
]

export const surveillanceFiles: SurveillanceFile[] = [
  ...archiveFiles,
  ...systemFiles,
]

export function findSurveillanceFile(fileId: string | null) {
  return surveillanceFiles.find((file) => file.id === fileId) ?? null
}
