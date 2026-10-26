import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { App } from './App'

describe('App', () => {
  it('shows both applications on the desktop', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: /監視カメラ/ })).toBeVisible()
    expect(screen.getByRole('button', { name: /入退室ログ/ })).toBeVisible()
  })

  it('opens the camera gate and returns home after confirmation', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /監視カメラ/ }))
    expect(
      screen.getByRole('heading', { name: '監視カメラ認証' }),
    ).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'ホーム' }))
    expect(screen.getByRole('dialog')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'キャンセル' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'ホーム' }))
    await user.click(screen.getByRole('button', { name: '戻る' }))
    expect(screen.getByRole('heading', { name: '業務アプリケーション' })).toBeVisible()
  })

  it('opens the access log without authentication', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /入退室ログ/ }))

    expect(
      screen.getByRole('heading', { name: '入退室ログ記録' }),
    ).toBeVisible()
  })
})
