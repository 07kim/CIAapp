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
    expect(screen.getByText('CAMERA FABRIC / LIVE TOPOLOGY')).toBeInTheDocument()
    expect(screen.getByText('24 NODES ONLINE')).toBeInTheDocument()
    expect(screen.getByText('CAM-01 / ACTIVE')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'CAM-01 / ACTIVEノードへ接続' })).toBeInTheDocument()
    expect(screen.getByText('SELECT NODES / BUILD ROUTES')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'OFFICEノードへ接続' }))
    expect(screen.getByText('LINKS / 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'OFFICEノードへ接続' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'STORAGEノードへ接続' }))
    expect(screen.getByText('LINKS / 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'STORAGEノードへ接続' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('OPERATOR UNLISTED')).toBeInTheDocument()
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
