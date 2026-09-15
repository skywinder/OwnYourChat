// ChatGPT's original citation syntax and its current private-use Unicode markers.
export const CHATGPT_CITATION_PATTERN = /【\d+†[^】]+】|\uE200cite\uE202[^\uE200\uE201]*\uE201/g

// File references stay in archived text because their IDs are not web URLs.
export const CHATGPT_DISPLAY_CITATION_PATTERN = new RegExp(
  `${CHATGPT_CITATION_PATTERN.source}|\\uE200filecite\\uE202[^\\uE200\\uE201]*\\uE201`,
  'g'
)

export function isWebSourceUrl(value: string | undefined): value is string {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}
