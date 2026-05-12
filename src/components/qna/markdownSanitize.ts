import type { Root, Element } from 'hast'
import { visit } from 'unist-util-visit'

/**
 * 에디터가 생성하는 CSS 프로퍼티 + 값만 허용하는 rehype 플러그인.
 *
 * 허용 값은 markdownEditorConstants.ts의 상수와 동기화 필요:
 * - ALLOWED_COLORS <-> TEXT_PALETTE_COLORS / BG_PALETTE_COLORS
 * - ALLOWED_FONT_SIZES <-> FONT_SIZES
 * - ALLOWED_FONT_FAMILIES <-> FONT_FAMILIES
 * - ALLOWED_TEXT_ALIGNS <-> alignLeftCommand 등 하드코딩 값
 * - ALLOWED_LINE_HEIGHTS <-> lineHeightCmd 하드코딩 값
 */

// TEXT_PALETTE_COLORS / BG_PALETTE_COLORS (markdownEditorConstants.ts)
const ALLOWED_COLORS = new Set([
  '#ffffff',
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#b7b7b7',
  '#ff0000',
  '#ff7700',
  '#ffff00',
  '#00ff00',
  '#0000ff',
  '#9900ff',
  '#ff00ff',
  '#00ffff',
  '#ff6d6d',
  '#ffd966',
  '#93c47d',
  '#76a5af',
  '#4a86e8',
  '#8e7cc3',
  '#c27ba0',
])

// FONT_SIZES (markdownEditorConstants.ts) + "px"
const ALLOWED_FONT_SIZES = new Set([
  '10px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '28px',
  '32px',
])

// FONT_FAMILIES value (markdownEditorConstants.ts)
const ALLOWED_FONT_FAMILIES = new Set([
  'inherit',
  "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
  "'Nanum Gothic', 'Dotum', '돋움', sans-serif",
  "'Nanum Myeongjo', 'Batang', '바탕', serif",
  "'Roboto', Arial, Helvetica, sans-serif",
  "'Merriweather', Georgia, 'Times New Roman', serif",
  "'Source Code Pro', 'Courier New', Consolas, monospace",
])

// alignLeftCommand ~ alignJustifyCommand (markdownEditorCommands.ts)
const ALLOWED_TEXT_ALIGNS = new Set(['left', 'center', 'right', 'justify'])

// lineHeightCmd (markdownEditorCommands.ts)
const ALLOWED_LINE_HEIGHTS = new Set(['1', '1.5', '2', '2.5', '3'])

const VALIDATORS: Record<string, (value: string) => boolean> = {
  color: (v) => ALLOWED_COLORS.has(v.trim().toLowerCase()),
  'background-color': (v) => ALLOWED_COLORS.has(v.trim().toLowerCase()),
  'font-size': (v) => ALLOWED_FONT_SIZES.has(v.trim().toLowerCase()),
  'font-family': (v) => ALLOWED_FONT_FAMILIES.has(v.trim()),
  'text-align': (v) => ALLOWED_TEXT_ALIGNS.has(v.trim().toLowerCase()),
  'line-height': (v) => ALLOWED_LINE_HEIGHTS.has(v.trim()),
}

function filterStyleValue(raw: string): string | null {
  const filtered = raw
    .split(';')
    .map((decl) => decl.trim())
    .filter((decl) => {
      if (!decl) return false
      const colonIdx = decl.indexOf(':')
      if (colonIdx < 0) return false
      const prop = decl.slice(0, colonIdx).trim().toLowerCase()
      const value = decl.slice(colonIdx + 1).trim()
      const validator = VALIDATORS[prop]
      return validator ? validator(value) : false
    })
    .join('; ')

  return filtered || null
}

/** rehype 플러그인: style 속성 내부의 CSS 프로퍼티+값을 allowlist로 필터링 */
export function rehypeSanitizeStyle() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const properties = node.properties
      const style = properties?.style
      if (typeof style !== 'string') return

      const filtered = filterStyleValue(style)
      if (filtered) {
        properties.style = filtered
      } else {
        delete properties.style
      }
    })
  }
}
