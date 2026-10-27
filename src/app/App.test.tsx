import { act } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { App } from './App'

describe('App', () => {
  it('shows both applications on the desktop', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: /監視カメラ/ })).toBeVisible()
    expect(screen.getByRole('button', { name: /入退室ログ/ })).toBeVisible()
  })

  it('makes the desktop taskbar controls interactive', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'スタート' }))
    expect(screen.getByRole('region', { name: 'スタートメニュー' })).toBeVisible()

    await user.type(screen.getByRole('searchbox', { name: 'アプリを検索' }), '入退室')
    const startMenu = screen.getByRole('region', { name: 'スタートメニュー' })
    expect(within(startMenu).getByRole('button', { name: /入退室ログ/ })).toBeVisible()
    expect(within(startMenu).queryByRole('button', { name: /監視カメラ/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'スタートメニューを閉じる' }))
    expect(screen.queryByRole('region', { name: 'スタートメニュー' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'CIAネットワーク情報' }))
    expect(screen.getByRole('region', { name: 'CIAネットワーク情報' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'ネットワーク情報を閉じる' }))
    expect(screen.queryByRole('region', { name: 'CIAネットワーク情報' })).not.toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'CIA社内デスクトップ' })).toBeVisible()
  })

  it('opens the access log without authentication', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /入退室ログ/ }))

    expect(
      screen.getByRole('heading', { name: '入退室ログ記録' }),
    ).toBeVisible()
  })

  it('denies a wrong camera answer and accepts maintenance in hiragana', async () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /監視カメラ/ }))
    const input = screen.getByLabelText('SYSTEM PASSWORD')

    fireEvent.change(input, { target: { value: 'ちがいます' } })
    fireEvent.click(screen.getByRole('button', { name: '認証' }))
    expect(screen.getByText('ACCESS DENIED')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2_000))

    expect(screen.getByLabelText('SYSTEM PASSWORD')).toHaveValue('')
    fireEvent.change(screen.getByLabelText('SYSTEM PASSWORD'), {
      target: { value: 'めんてなんす' },
    })
    fireEvent.click(screen.getByRole('button', { name: '認証' }))
    expect(screen.getByText('ACCESS GRANTED')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2_000))

    expect(screen.getByText('ARCHIVE BROWSER')).toBeVisible()
    vi.useRealTimers()
  })

  it('prevents home navigation while an authentication result is pending', () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /監視カメラ/ }))
    fireEvent.change(screen.getByLabelText('SYSTEM PASSWORD'), {
      target: { value: 'めんてなんす' },
    })
    fireEvent.click(screen.getByRole('button', { name: '認証' }))

    expect(screen.getByRole('button', { name: 'ホーム' })).toBeDisabled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(2_000))
    expect(screen.getByRole('button', { name: 'ホーム' })).toBeEnabled()
    vi.useRealTimers()
  })

  it('warns and returns to a clean desktop after inactivity', () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /入退室ログ/ }))

    act(() => vi.advanceTimersByTime(20_000))
    expect(screen.getByRole('alert')).toHaveTextContent(
      '残り10秒でホーム画面に戻ります',
    )

    act(() => vi.advanceTimersByTime(10_000))
    expect(
      screen.getByRole('heading', { name: 'CIA社内デスクトップ' }),
    ).toBeVisible()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    vi.useRealTimers()
  })
})
