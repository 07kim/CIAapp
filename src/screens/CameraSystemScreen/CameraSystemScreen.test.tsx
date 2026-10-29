import { fireEvent, render, screen, within } from '@testing-library/react'
import { vi } from 'vitest'

import { CameraSystemScreen } from './CameraSystemScreen'

describe('CameraSystemScreen', () => {
  it('keeps the surveillance workspace visible and closes from the backdrop', () => {
    const onCancelArchiveAuth = vi.fn()
    const view = render(
      <CameraSystemScreen
        authenticationStatus="idle"
        onAuthenticateArchive={vi.fn()}
        onCancelArchiveAuth={onCancelArchiveAuth}
        onSelectArchive={vi.fn()}
        onSelectSystemFile={vi.fn()}
        onVideoStatusChange={vi.fn()}
        pendingArchiveId="archive-2000"
        selectedFileId={null}
        unlockedArchiveIds={[]}
      />,
    )

    expect(
      screen.getByRole('dialog', { name: '20261120-2000の認証' }),
    ).toBeVisible()
    expect(screen.getByText('端末内の監視記録を選択してください')).toBeInTheDocument()
    expect(screen.getByText('UNREGISTERED OPERATOR SESSION')).toBeInTheDocument()
    expect(screen.getAllByText('24 NODES')).toHaveLength(2)
    expect(screen.getAllByText('5 RECORDS').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('2 ENCRYPTED')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /20261120-2000/ }).className,
    ).toMatch(/selected/)
    expect(screen.queryByRole('button', { name: 'キャンセル' })).not.toBeInTheDocument()
    expect(screen.queryByText('ENCRYPTED ARCHIVE SELECTED')).not.toBeInTheDocument()

    const dialog = screen.getByRole('dialog', { name: '20261120-2000の認証' })
    fireEvent.mouseDown(within(dialog).getByRole('heading', { name: '映像ファイル認証' }))
    expect(onCancelArchiveAuth).not.toHaveBeenCalled()

    fireEvent.mouseDown(dialog)
    expect(onCancelArchiveAuth).toHaveBeenCalledOnce()

    view.rerender(
      <CameraSystemScreen
        authenticationStatus="denied"
        onAuthenticateArchive={vi.fn()}
        onCancelArchiveAuth={onCancelArchiveAuth}
        onSelectArchive={vi.fn()}
        onSelectSystemFile={vi.fn()}
        onVideoStatusChange={vi.fn()}
        pendingArchiveId="archive-2000"
        selectedFileId={null}
        unlockedArchiveIds={[]}
      />,
    )

    const busyDialog = screen.getByRole('dialog', { name: '20261120-2000の認証' })
    expect(within(busyDialog).getByRole('status')).toBeVisible()
    fireEvent.mouseDown(busyDialog)
    expect(onCancelArchiveAuth).toHaveBeenCalledOnce()
  })
})
