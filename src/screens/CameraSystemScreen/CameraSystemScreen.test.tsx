import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { CameraSystemScreen } from './CameraSystemScreen'

describe('CameraSystemScreen', () => {
  it('keeps the selected encrypted file details behind its authentication dialog', () => {
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
    expect(screen.getByText('ENCRYPTED ARCHIVE SELECTED')).toBeInTheDocument()
    expect(screen.getByText('2026/11/20 20:00')).toBeInTheDocument()
    expect(screen.getByText('AUTHORIZATION REQUIRED')).toBeInTheDocument()
  })
})
