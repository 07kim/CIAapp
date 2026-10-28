import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { CameraSystemScreen } from './CameraSystemScreen'

describe('CameraSystemScreen', () => {
  it('keeps the surveillance workspace visible behind its authentication dialog', () => {
    render(
      <CameraSystemScreen
        authenticationStatus="idle"
        onAuthenticateArchive={vi.fn()}
        onCancelArchiveAuth={vi.fn()}
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
    expect(screen.getByText('監視記録を選択してください')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /20261120-2000/ }).className,
    ).toMatch(/selected/)
    expect(screen.queryByText('ENCRYPTED ARCHIVE SELECTED')).not.toBeInTheDocument()
  })
})
