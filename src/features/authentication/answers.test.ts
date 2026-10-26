import {
  isArchiveAnswerCorrect,
  isGateAnswerCorrect,
  normalizeJapaneseAnswer,
} from './answers'

describe('authentication answers', () => {
  it('accepts hiragana, katakana, width variants, and surrounding spaces', () => {
    expect(isGateAnswerCorrect(' めんてなんす ')).toBe(true)
    expect(isGateAnswerCorrect('メンテナンス')).toBe(true)
    expect(normalizeJapaneseAnswer('　めんてなんす　')).toBe('メンテナンス')
  })

  it('rejects an incorrect gate answer', () => {
    expect(isGateAnswerCorrect('メンテナン')).toBe(false)
  })

  it('matches archive answers without case or width differences', () => {
    expect(isArchiveAnswerCorrect(' universe ', 'UNIVERSE')).toBe(true)
    expect(isArchiveAnswerCorrect('ＴＡＩＡＴＡＲＩ', 'TAIATARI')).toBe(true)
    expect(isArchiveAnswerCorrect('TITAN', 'TAIATARI')).toBe(false)
  })
})
