import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import type { AuthenticationStatus } from '../../app/app-state'
import { AuthPanel } from './AuthPanel'

const renderPanel = (status: AuthenticationStatus = 'idle') =>
  render(
    <AuthPanel
      eyebrow="SECURITY TEST"
      hint="パスワードを入力してください。"
      onSubmit={vi.fn()}
      status={status}
      title="認証テスト"
    />,
  )

describe('AuthPanel', () => {
  it('masks the entered password', () => {
    renderPanel()

    expect(screen.getByLabelText('SYSTEM PASSWORD')).toHaveAttribute(
      'type',
      'password',
    )
  })

  it('clears an incorrect password when returning to the input screen', () => {
    const view = renderPanel()
    const input = screen.getByLabelText('SYSTEM PASSWORD')
    fireEvent.change(input, { target: { value: 'incorrect' } })

    view.rerender(
      <AuthPanel
        eyebrow="SECURITY TEST"
        hint="パスワードを入力してください。"
        onSubmit={vi.fn()}
        status="denied"
        title="認証テスト"
      />,
    )
    view.rerender(
      <AuthPanel
        eyebrow="SECURITY TEST"
        hint="パスワードを入力してください。"
        onSubmit={vi.fn()}
        status="idle"
        title="認証テスト"
      />,
    )

    expect(screen.getByLabelText('SYSTEM PASSWORD')).toHaveValue('')
  })
})
