import { render, screen } from '@testing-library/react'

import { AccessLogScreen } from './AccessLogScreen'

describe('AccessLogScreen', () => {
  it('shows provisional clue records from the repository boundary', async () => {
    render(<AccessLogScreen />)

    expect((await screen.findAllByText('四ツ谷 はると')).length).toBe(2)
    expect(screen.getAllByText('一ノ瀬 なつき')).toHaveLength(2)
    expect(screen.getByText('警備巡回端末')).toBeVisible()
    expect(screen.getByText('23:55')).toBeVisible()
  })
})
