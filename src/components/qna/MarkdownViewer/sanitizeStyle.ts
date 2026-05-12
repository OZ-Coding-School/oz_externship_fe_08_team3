import type { Root, Element } from 'hast'
import { visit } from 'unist-util-visit'

/**
 * 에디터가 생성하는 CSS 프로퍼티만 허용하는 rehype 플러그인.
 * position, display, width 등 레이아웃을 깨뜨릴 수 있는 속성을 차단한다.
 */
const ALLOWED_PROPERTIES = new Set([
  'color',
  'background-color',
  'font-size',
  'font-family',
  'text-align',
  'line-height',
  'text-decoration',
])

function filterStyleValue(raw: string): string | null {
  const filtered = raw
    .split(';')
    .map((decl) => decl.trim())
    .filter((decl) => {
      if (!decl) return false
      const colonIdx = decl.indexOf(':')
      if (colonIdx < 0) return false
      const prop = decl.slice(0, colonIdx).trim().toLowerCase()
      return ALLOWED_PROPERTIES.has(prop)
    })
    .join('; ')

  return filtered || null
}

/** rehype 플러그인: style 속성 내부의 CSS 프로퍼티를 allowlist로 필터링 */
export function rehypeSanitizeStyle() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const style = node.properties?.style
      if (typeof style !== 'string') return

      const filtered = filterStyleValue(style)
      if (filtered) {
        node.properties!.style = filtered
      } else {
        delete node.properties!.style
      }
    })
  }
}
