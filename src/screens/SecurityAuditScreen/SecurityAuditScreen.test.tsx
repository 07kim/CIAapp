import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SecurityAuditScreen } from './SecurityAuditScreen'

describe('SecurityAuditScreen', () => {
  it('correlates the two approved records at 20:15', () => {
    render(<SecurityAuditScreen />)

    expect(screen.getAllByText('20:15')).toHaveLength(4)
    expect(screen.getByText('ICOCAによる夜食購入')).toBeVisible()
    expect(screen.getByText('社長室サーバーへの遠隔アクセス試行')).toBeVisible()
    expect(screen.getByText('一ノ瀬 なつき / ID-0719')).toBeVisible()
    expect(screen.getByText('四ツ谷PC')).toBeVisible()
  })

  it('filters the records without changing their evidence', async () => {
    const user = userEvent.setup()
    render(<SecurityAuditScreen />)

    await user.click(screen.getByRole('button', { name: '決済認証' }))
    expect(screen.getByText('ICOCAによる夜食購入')).toBeVisible()
    expect(screen.queryByText('社長室サーバーへの遠隔アクセス試行')).not.toBeInTheDocument()
  })
})

