export type SecurityAuditRecord = {
  id: string
  time: string
  source: string
  subject: string
  primary: string
  secondary: string
  status: 'verified' | 'detected'
  category: 'payment' | 'remote-access'
}

export const securityAuditRecords: SecurityAuditRecord[] = [
  {
    id: 'payment-2015',
    time: '20:15',
    source: 'CIA MART / PAYMENT AUTH',
    subject: '一ノ瀬 なつき / ID-0719',
    primary: 'ICOCAによる夜食購入',
    secondary: '本人所有の交通系IC媒体を照合',
    status: 'verified',
    category: 'payment',
  },
  {
    id: 'remote-2015',
    time: '20:15',
    source: 'INTERNAL NETWORK / REMOTE TRACE',
    subject: '四ツ谷PC',
    primary: '社長室サーバーへの遠隔アクセス試行',
    secondary: '接続要求を検出 / 実行結果は未確定',
    status: 'detected',
    category: 'remote-access',
  },
]

