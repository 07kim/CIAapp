import { render, screen, within } from '@testing-library/react'

import { AccessLogScreen } from './AccessLogScreen'

describe('AccessLogScreen', () => {
  it('shows the four approved access records in chronological order', async () => {
    render(<AccessLogScreen />)

    const log = await screen.findByRole('list', { name: '社長室入退室ログ' })
    const rows = within(log).getAllByRole('listitem')

    expect(rows).toHaveLength(4)
    expect(rows.map((row) => row.textContent)).toEqual([
      '2026/11/2020:00一ノ瀬 なつきID-0719入室社長室',
      '2026/11/2020:15一ノ瀬 なつきID-0719退室社長室',
      '2026/11/2020:30一ノ瀬 なつきID-0719入室社長室',
      '2026/11/2020:45一ノ瀬 なつきID-0719退室社長室',
    ])
    expect(screen.queryByText('四ツ谷 はると')).not.toBeInTheDocument()
    expect(screen.queryByText('23:55')).not.toBeInTheDocument()
  })
})
