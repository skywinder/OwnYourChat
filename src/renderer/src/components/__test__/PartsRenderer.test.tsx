import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { PartsRenderer } from '../PartsRenderer'
import type { MessagePart } from '@shared/types'

const render = (parts: MessagePart[]) =>
  renderToStaticMarkup(<PartsRenderer parts={parts} messageId="test" />)
const source: MessagePart = {
  type: 'source-url',
  sourceId: 'source',
  url: 'https://example.com/paper',
  title: 'A paper'
}

describe('PartsRenderer citations', () => {
  it('renders clickable inline sources without breaking Markdown around them', () => {
    const html = render([
      { type: 'text', text: '**Evidence ' },
      source,
      { type: 'text', text: ' continues**.' }
    ])
    expect(html).toMatch(/<strong>Evidence <a[^>]*href="https:\/\/example.com\/paper"/)
    expect(html).toContain(' continues</strong>.')
    expect(html).not.toContain('#ownyourchat-source-')
  })
  it('replaces archived unresolved markers in paragraphs, headings, lists and tables', () => {
    const marker = '\uE200cite\uE202turn608629search0\uE202turn608629search1\uE201'
    const html = render([
      {
        type: 'text',
        text: `# Heading ${marker}\n\nText ${marker}\n\n- Item ${marker}\n\n| Source |\n| --- |\n| ${marker} |`
      }
    ])
    expect(html).not.toContain(marker)
    expect(html).not.toContain('turn608629')
    expect(html.match(/\[Source unavailable\]/g)).toHaveLength(4)
  })
  it('preserves literal markers in inline and fenced code', () => {
    const marker = '\uE200cite\uE202turn608629search0\uE201'
    const html = render([
      { type: 'text', text: `Example: \`${marker}\`\n\n\`\`\`text\n${marker}\n\`\`\`` }
    ])
    expect(html.split(marker)).toHaveLength(3)
    expect(html).not.toContain('Source unavailable')
  })
  it('does not create clickable citations for invalid or executable URLs', () => {
    const html = render([{ ...source, url: 'javascript:alert(1)' }])
    expect(html).toContain('[Source unavailable]')
    expect(html).not.toContain('javascript:')
  })
})
