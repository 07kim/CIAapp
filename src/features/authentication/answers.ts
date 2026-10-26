const hiraganaToKatakana = (value: string) =>
  value.replace(/[ぁ-ゖ]/g, (character) =>
    String.fromCharCode(character.charCodeAt(0) + 0x60),
  )

export function normalizeJapaneseAnswer(value: string) {
  return hiraganaToKatakana(value.normalize('NFKC').trim())
}

export function normalizeLatinAnswer(value: string) {
  return value.normalize('NFKC').trim().toUpperCase()
}

export function isGateAnswerCorrect(value: string) {
  return normalizeJapaneseAnswer(value) === 'メンテナンス'
}

export function isArchiveAnswerCorrect(value: string, answer: string) {
  return normalizeLatinAnswer(value) === normalizeLatinAnswer(answer)
}
