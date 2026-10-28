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

  it('uses semantic screen labels instead of decorative chapter numbers', () => {
    vi.useFakeTimers()
    const { container } = render(<App />)

    expect(container.querySelector('[data-transition="desktop"]')).toBeInTheDocument()
    expect(screen.getByText('DESKTOP SESSION')).toBeInTheDocument()

    fireEvent.doubleClick(screen.getByRole('button', { name: /監視カメラ/ }))
    act(() => vi.advanceTimersByTime(900))

    expect(container.querySelector('[data-transition="authentication"]')).toBeInTheDocument()
    expect(screen.getByText('CREDENTIAL GATE')).toBeInTheDocument()
    vi.useRealTimers()
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

    await user.click(screen.getByRole('button', { name: 'クイック状態' }))
    expect(screen.getByRole('region', { name: 'クイック状態' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'クイック状態を閉じる' }))
    expect(screen.queryByRole('region', { name: 'クイック状態' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '日時とカレンダー' }))
    expect(screen.getByRole('region', { name: '日時とカレンダー' })).toBeVisible()
    expect(screen.getByLabelText(/月のカレンダー/)).toBeVisible()
    await user.click(screen.getByRole('button', { name: '日時とカレンダーを閉じる' }))
    expect(screen.queryByRole('region', { name: '日時とカレンダー' })).not.toBeInTheDocument()
  })

  it('keeps a single click neutral and opens a shortcut on double click', async () => {
    const user = userEvent.setup()
    render(<App />)

    const cameraShortcut = screen.getByRole('button', { name: /監視カメラ/ })
    await user.click(cameraShortcut)
    expect(cameraShortcut).not.toHaveAttribute('aria-pressed')
    expect(screen.queryByRole('heading', { name: '監視カメラ認証' })).not.toBeInTheDocument()

    await user.dblClick(cameraShortcut)
    expect(screen.getByRole('status', { name: '監視カメラを起動中' })).toBeVisible()
    expect(
      await screen.findByRole('heading', { name: '監視カメラ認証' }),
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

    await user.dblClick(screen.getByRole('button', { name: /入退室ログ/ }))

    expect(
      await screen.findByRole('heading', { name: '社長室 入退室ログ' }),
    ).toBeVisible()
  })

  it('denies a wrong camera answer and accepts maintenance in hiragana', async () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.doubleClick(screen.getByRole('button', { name: /監視カメラ/ }))
    act(() => vi.advanceTimersByTime(900))
    const input = screen.getByLabelText('SYSTEM PASSWORD')

    fireEvent.change(input, { target: { value: 'ちがいます' } })
    fireEvent.click(screen.getByRole('button', { name: '認証' }))
    const gateWindow = screen.getByRole('heading', { name: '監視カメラ認証' }).closest('section')
    expect(gateWindow).not.toBeNull()
    expect(within(gateWindow!).getByText('ACCESS DENIED')).toBeInTheDocument()
    expect(within(gateWindow!).getByRole('status').className).toMatch(/popupResult/)
    act(() => vi.advanceTimersByTime(2_800))

    expect(screen.getByLabelText('SYSTEM PASSWORD')).toHaveValue('')
    fireEvent.change(screen.getByLabelText('SYSTEM PASSWORD'), {
      target: { value: 'めんてなんす' },
    })
    fireEvent.click(screen.getByRole('button', { name: '認証' }))
    expect(within(gateWindow!).getByText('ACCESS GRANTED')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2_800))

    expect(screen.getByText('ARCHIVE BROWSER')).toBeVisible()
    expect(screen.getByText('ACCESS GRANTED / ARCHIVE ONLINE')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('prevents home navigation while an authentication result is pending', () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.doubleClick(screen.getByRole('button', { name: /監視カメラ/ }))
    act(() => vi.advanceTimersByTime(900))
    fireEvent.change(screen.getByLabelText('SYSTEM PASSWORD'), {
      target: { value: 'めんてなんす' },
    })
    fireEvent.click(screen.getByRole('button', { name: '認証' }))

    expect(screen.getByRole('button', { name: 'ホーム' })).toBeDisabled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(2_800))
    expect(screen.getByRole('button', { name: 'ホーム' })).toBeEnabled()
    vi.useRealTimers()
  })

  it('warns and returns to a clean desktop after inactivity', () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.doubleClick(screen.getByRole('button', { name: /入退室ログ/ }))
    act(() => vi.advanceTimersByTime(900))

    act(() => vi.advanceTimersByTime(10_000))
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
