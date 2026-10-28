import { render, screen, within } from '@testing-library/react'

import { AccessLogScreen } from './AccessLogScreen'

describe('AccessLogScreen', () => {
  it('shows the four approved access records in chronological order', async () => {
    render(<AccessLogScreen />)

    const log = await screen.findByRole('list', { name: '社長室入退室ログ' })
    const rows = within(log).getAllByRole('listitem')

    expect(rows).toHaveLength(4)
    const expected = [
      { time: '20:00', direction: '入室' },
      { time: '20:15', direction: '退室' },
      { time: '20:30', direction: '入室' },
      { time: '20:45', direction: '退室' },
    ]

    rows.forEach((row, index) => {
      const scoped = within(row)
      expect(scoped.getByText('2026/11/20')).toBeInTheDocument()
      expect(scoped.getByText(expected[index].time)).toBeInTheDocument()
      expect(scoped.getByText('一ノ瀬 なつき')).toBeInTheDocument()
      expect(scoped.getByText('ID-0719')).toBeInTheDocument()
      expect(scoped.getByText(expected[index].direction)).toBeInTheDocument()
      expect(scoped.getByText('社長室')).toBeInTheDocument()
    })
    expect(screen.queryByText('四ツ谷 はると')).not.toBeInTheDocument()
    expect(screen.queryByText('23:55')).not.toBeInTheDocument()
  })
})
