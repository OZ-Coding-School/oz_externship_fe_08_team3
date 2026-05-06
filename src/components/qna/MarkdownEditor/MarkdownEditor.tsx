import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import MDEditor, {
  commands as mdCommands,
  type ICommand,
} from '@uiw/react-md-editor'
import {
  Undo2,
  Redo2,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ChevronDown,
  ArrowUpDown,
  RemoveFormatting,
  IndentIncrease,
  IndentDecrease,
} from 'lucide-react'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import './MarkdownEditor.css'
import { useGetPresignedUrl } from '@/features/qna/presigned-url'

export interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  error?: string
  actions?: React.ReactNode
}

// style 속성 허용, blob: 이미지 src 허용, 스크립트/이벤트 핸들러는 차단
const editorSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'style'],
  },
  tagNames: [...(defaultSchema.tagNames ?? []), 'u', 'mark'],
  protocols: {
    ...defaultSchema.protocols,
    src: [...(defaultSchema.protocols?.src ?? ['http', 'https']), 'blob'],
  },
}

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

// 웹폰트 로드 실패 시 시스템 폰트(fallback)로 자동 대체됨
const FONT_FAMILIES = [
  { label: '기본서체', value: 'inherit' },
  {
    label: '노토 산스',
    value: "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
  },
  {
    label: '나눔고딕',
    value: "'Nanum Gothic', 'Dotum', '돋움', sans-serif",
  },
  {
    label: '나눔명조',
    value: "'Nanum Myeongjo', 'Batang', '바탕', serif",
  },
  {
    label: 'Roboto',
    value: "'Roboto', Arial, Helvetica, sans-serif",
  },
  {
    label: 'Merriweather',
    value: "'Merriweather', Georgia, 'Times New Roman', serif",
  },
  {
    label: 'Source Code Pro',
    value: "'Source Code Pro', 'Courier New', Consolas, monospace",
  },
]

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32]

const TEXT_PALETTE_COLORS = [
  '#ffffff', // 흰색 (배경이 어두울 때 사용)
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
]

// 배경색 전용 팔레트: 흰색 + 배경 제거(투명) 포함
const BG_PALETTE_COLORS = ['#ffffff', ...TEXT_PALETTE_COLORS]

// 버튼 클릭 시 textarea 포커스/선택 영역 유지를 위한 공통 props
const NO_BLUR_PROPS = {
  onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault(),
}

const PILL: React.CSSProperties = {
  borderRadius: 6,
  background: '#f0f2f5',
  border: '1px solid #e2e8f0',
  padding: '0 10px',
  height: 26,
  width: 'auto',
  minWidth: 'auto',
  fontSize: 12,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  cursor: 'pointer',
  color: '#374151',
  fontWeight: 400,
}

type EditorState = {
  selectedText: string
  text: string
  selection: { start: number; end: number }
}

/** getState() 결과에서 전체 상태를 안전하게 꺼냅니다. */
function safeGetState(
  getState?: () => false | EditorState
): EditorState | null {
  const s = getState?.()
  return s && 'text' in s ? s : null
}

/** 커서가 HTML 태그 내부(<...> 사이)에 있는지 확인합니다. */
function isCursorInsideTag(text: string, cursor: number): boolean {
  const lastOpen = text.lastIndexOf('<', cursor - 1)
  if (lastOpen === -1) return false
  const lastClose = text.lastIndexOf('>', cursor - 1)
  return lastOpen > lastClose
}

/** 커서 위치 기준 현재 단어 범위를 반환합니다 (인라인 서식용).
 *  HTML 태그 문자(<, >)에서 단어 경계로 처리해 태그 내용 선택을 방지합니다. */
function getWordRange(
  text: string,
  cursor: number
): { start: number; end: number } | null {
  if (isCursorInsideTag(text, cursor)) return null
  let start = cursor
  let end = cursor
  while (start > 0 && /[^\s<>]/.test(text[start - 1])) start--
  while (end < text.length && /[^\s<>]/.test(text[end])) end++
  return start < end ? { start, end } : null
}

/** 커서를 감싸는 가장 가까운 <span style="...">...</span> 의 범위를 반환합니다.
 *  이미 스타일이 적용된 span에 다시 서식을 적용할 때 중첩 방지용으로 사용합니다.
 *  커서가 </span> 바로 뒤(spanEnd)에 있는 경우도 포함합니다. */
function getEnclosingSpanRange(
  text: string,
  cursor: number
): { start: number; end: number } | null {
  // 순방향으로 모든 <span>을 찾아 커서가 포함되는지 확인합니다.
  // cursor <= spanEnd 조건으로 </span> 바로 뒤에 커서가 있을 때도 매칭됩니다.
  const spanOpenRe = /<span\b[^>]*>/gi
  let match: RegExpExecArray | null
  while ((match = spanOpenRe.exec(text)) !== null) {
    const spanStart = match.index
    const openEnd = spanStart + match[0].length
    const closeIdx = text.indexOf('</span>', openEnd)
    if (closeIdx === -1) continue
    const spanEnd = closeIdx + '</span>'.length
    if (cursor >= spanStart && cursor <= spanEnd) {
      return { start: spanStart, end: spanEnd }
    }
  }
  return null
}

/** 커서 위치 기준 현재 줄 범위를 반환합니다 (블록 서식용). */
function getLineRange(
  text: string,
  cursor: number
): { start: number; end: number } | null {
  if (isCursorInsideTag(text, cursor)) return null
  let start = cursor
  let end = cursor
  while (start > 0 && text[start - 1] !== '\n') start--
  while (end < text.length && text[end] !== '\n') end++
  return start < end ? { start, end } : null
}

/**
 * execute 핸들러에서 선택 영역이 없으면 현재 단어를 자동 선택 후 wrapFn 적용.
 * 인라인 서식(밑줄, 글자색 등)에 사용합니다.
 */
function applyInline(
  state: EditorState,
  api: {
    replaceSelection: (t: string) => void
    setSelectionRange: (r: { start: number; end: number }) => void
  },
  wrapFn: (text: string) => string
) {
  if (state.selectedText) {
    api.replaceSelection(wrapFn(state.selectedText))
    return
  }
  const range = getWordRange(state.text, state.selection.start)
  if (range) {
    api.setSelectionRange(range)
    api.replaceSelection(wrapFn(state.text.slice(range.start, range.end)))
  }
}

/**
 * execute 핸들러에서 선택 영역이 없으면 현재 줄을 자동 선택 후 wrapFn 적용.
 * 블록 서식(정렬, 들여쓰기 등)에 사용합니다.
 */
function applyBlock(
  state: EditorState,
  api: {
    replaceSelection: (t: string) => void
    setSelectionRange: (r: { start: number; end: number }) => void
  },
  wrapFn: (text: string) => string
) {
  if (state.selectedText) {
    api.replaceSelection(wrapFn(state.selectedText))
    return
  }
  const range = getLineRange(state.text, state.selection.start)
  if (range) {
    api.setSelectionRange(range)
    api.replaceSelection(wrapFn(state.text.slice(range.start, range.end)))
  }
}

/**
 * 드롭다운 children 핸들러용 인라인 서식 적용.
 * 선택 영역 있음 → 선택 텍스트에 적용.
 * 선택 영역 없음 → 커서를 감싸는 기존 <span> 전체를 교체(스타일 코드 중첩 방지).
 *               → span 없으면 현재 단어를 선택해 적용.
 */
type TextApiWithElement = {
  replaceSelection: (t: string) => void
  setSelectionRange: (r: { start: number; end: number }) => void
  textArea?: HTMLTextAreaElement
}

/**
 * textarea 값을 직접 교체하고 React onChange를 트리거합니다.
 * setSelectionRange → replaceSelection 순서에서 insertTextAtPosition 내부의
 * focus() 호출이 selection을 리셋하는 문제를 우회합니다.
 *
 * React native property setter hack:
 * 원래 HTMLTextAreaElement.prototype.value setter를 호출하면 React가 변경을
 * "dirty"로 인식한 뒤 input 이벤트에서 onChange를 정상 호출합니다.
 */
function replaceInText(
  textApi: TextApiWithElement,
  fullText: string,
  start: number,
  end: number,
  replacement: string
): boolean {
  const ta = textApi.textArea
  if (!ta) return false
  const newValue = fullText.slice(0, start) + replacement + fullText.slice(end)
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value'
  )?.set
  if (!nativeSetter) return false
  nativeSetter.call(ta, newValue)
  ta.dispatchEvent(new Event('input', { bubbles: true }))
  ta.selectionStart = ta.selectionEnd = start + replacement.length
  return true
}

/**
 * 드롭다운 children 핸들러용 인라인 서식 적용.
 *
 * 우선순위:
 * 1. 커서가 기존 <span> 안에 있으면 → span 전체를 교체 (선택 여부 무관, 중첩 방지)
 * 2. 선택 영역 있음 → 선택 텍스트에 적용
 * 3. 선택 없음 → 현재 단어 선택 후 적용
 * 4. 아무것도 없으면 → 아무것도 하지 않음 (빈 span 삽입 방지)
 *
 * replaceInText를 우선 사용해 setSelectionRange + replaceSelection 패턴에서
 * 발생하는 focus() → selection 리셋 문제를 방지합니다.
 */
function applyInlineFromDropdown(
  getState: (() => false | EditorState) | undefined,
  textApi: TextApiWithElement | undefined,
  wrapFn: (text: string) => string
) {
  const s = safeGetState(getState)
  if (!s || !textApi) return

  // 1. 커서 시작 위치가 기존 <span> 안이면 span 전체를 교체 (중첩 방지)
  const spanRange = getEnclosingSpanRange(s.text, s.selection.start)
  if (spanRange) {
    const innerText = s.text.slice(spanRange.start, spanRange.end)
    const replacement = wrapFn(innerText)
    if (
      !replaceInText(
        textApi,
        s.text,
        spanRange.start,
        spanRange.end,
        replacement
      )
    ) {
      textApi.setSelectionRange(spanRange)
      textApi.replaceSelection(replacement)
    }
    return
  }

  // 2. 선택 영역이 있으면 선택 텍스트에 적용
  if (s.selectedText) {
    const replacement = wrapFn(s.selectedText)
    if (
      !replaceInText(
        textApi,
        s.text,
        s.selection.start,
        s.selection.end,
        replacement
      )
    ) {
      textApi.replaceSelection(replacement)
    }
    return
  }

  // 3. 선택 없음 → 현재 단어를 선택 후 적용
  const wordRange = getWordRange(s.text, s.selection.start)
  if (wordRange) {
    const innerText = s.text.slice(wordRange.start, wordRange.end)
    const replacement = wrapFn(innerText)
    if (
      !replaceInText(
        textApi,
        s.text,
        wordRange.start,
        wordRange.end,
        replacement
      )
    ) {
      textApi.setSelectionRange(wordRange)
      textApi.replaceSelection(replacement)
    }
  }
  // 4. 아무것도 없으면 종료 (빈 <span></span> 삽입 안 함)
}

/**
 * 드롭다운 children 핸들러용 블록 서식 적용.
 * 선택 있음 → 선택 텍스트에 적용.
 * 선택 없음 → wrapFn('') 를 커서 위치에 삽입.
 */
function applyBlockFromDropdown(
  getState: (() => false | EditorState) | undefined,
  textApi: TextApiWithElement | undefined,
  wrapFn: (text: string) => string
) {
  const s = safeGetState(getState)
  if (!s || !textApi) return
  if (s.selectedText) {
    textApi.replaceSelection(wrapFn(s.selectedText))
    return
  }
  textApi.replaceSelection(wrapFn(''))
}

/**
 * 목록 전용 삽입 함수.
 * 선택 있음 → 각 줄 앞에 prefix 추가.
 * 선택 없음 → 현재 줄의 맨 앞으로 커서 이동 후 prefix 삽입.
 *   textarea.selectionStart/End 를 직접 수정해 setSelectionRange(→ focus()) 호출을 피합니다.
 */
function insertListPrefix(
  getState: (() => false | EditorState) | undefined,
  textApi: TextApiWithElement | undefined,
  prefix: string
) {
  const s = safeGetState(getState)
  if (!s || !textApi) return

  if (s.selectedText) {
    const lines = s.selectedText
      .split('\n')
      .map((l) => `${prefix}${l}`)
      .join('\n')
    textApi.replaceSelection(lines)
    return
  }

  // 선택 없음: 줄 시작 위치를 계산하고 직접 selectionStart/End 설정
  const lineStart = s.text.lastIndexOf('\n', s.selection.start - 1) + 1
  const ta = (textApi as TextApiWithElement).textArea
  if (ta) {
    ta.selectionStart = lineStart
    ta.selectionEnd = lineStart
  }
  textApi.replaceSelection(prefix)
}

/**
 * 선택 텍스트가 이미 <span style="..."> 이면 해당 CSS 속성만 교체/추가하고,
 * 그렇지 않으면 새 <span>으로 감쌉니다.
 * 중첩 span 누적을 방지합니다.
 */
function wrapWithStyle(
  selected: string,
  property: string,
  value: string
): string {
  const match = selected.match(/^<span style="([^"]*)">([\s\S]*)<\/span>$/)
  if (match) {
    const existingStyle = match[1]
    const inner = match[2]
    const propRe = new RegExp(`(^|;\\s*)${property}\\s*:[^;]*`, 'i')
    let newStyle: string
    if (propRe.test(existingStyle)) {
      newStyle = existingStyle
        .replace(
          new RegExp(`${property}\\s*:[^;]*`, 'i'),
          `${property}: ${value}`
        )
        .replace(/^;\s*/, '')
        .trim()
    } else if (existingStyle) {
      newStyle = `${existingStyle}; ${property}: ${value}`
    } else {
      newStyle = `${property}: ${value}`
    }
    return `<span style="${newStyle}">${inner}</span>`
  }
  return `<span style="${property}: ${value}">${selected}</span>`
}

/**
 * 선택 텍스트가 이미 <mark style="..."> 이면 background-color만 교체하고,
 * 그렇지 않으면 새 <mark>으로 감쌉니다.
 */
function wrapMarkWithStyle(selected: string, color: string): string {
  const match = selected.match(/^<mark style="([^"]*)">([\s\S]*)<\/mark>$/)
  if (match) {
    const existingStyle = match[1]
    const inner = match[2]
    const newStyle = existingStyle
      .replace(/background-color\s*:[^;]*/i, `background-color: ${color}`)
      .replace(/^;\s*/, '')
      .trim()
    return `<mark style="${newStyle}">${inner}</mark>`
  }
  return `<mark style="background-color: ${color}">${selected}</mark>`
}

/**
 * 선택 텍스트가 이미 <div style="..."> 이면 해당 CSS 속성만 교체/추가하고,
 * 그렇지 않으면 새 <div>로 감쌉니다.
 * 중첩 div 누적을 방지합니다.
 */
function wrapDivWithStyle(
  selected: string,
  property: string,
  value: string
): string {
  const match = selected.match(/^<div style="([^"]*)">([\s\S]*)<\/div>$/)
  if (match) {
    const existingStyle = match[1]
    const inner = match[2]
    const propRe = new RegExp(`${property}\\s*:[^;]*`, 'i')
    let newStyle: string
    if (propRe.test(existingStyle)) {
      newStyle = existingStyle
        .replace(propRe, `${property}: ${value}`)
        .replace(/^;\s*/, '')
        .trim()
    } else if (existingStyle) {
      newStyle = `${existingStyle}; ${property}: ${value}`
    } else {
      newStyle = `${property}: ${value}`
    }
    return `<div style="${newStyle}">${inner}</div>`
  }
  return `<div style="${property}: ${value}">${selected}</div>`
}

/** 커서를 감싸는 <u>...</u> 범위를 반환합니다. </u> 바로 뒤 커서도 포함합니다. */
function getEnclosingURange(
  text: string,
  cursor: number
): { start: number; end: number } | null {
  const re = /<u>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const uStart = m.index
    const closeIdx = text.indexOf('</u>', uStart + m[0].length)
    if (closeIdx === -1) continue
    const uEnd = closeIdx + '</u>'.length
    if (cursor >= uStart && cursor <= uEnd) {
      return { start: uStart, end: uEnd }
    }
  }
  return null
}

/** 밑줄 토글: 커서가 <u> 안에 있거나 선택 텍스트가 <u>로 감싸져 있으면 제거, 아니면 추가 */
const underlineCommand: ICommand = {
  name: 'underline',
  keyCommand: 'underline',
  buttonProps: {
    'aria-label': '밑줄',
    title: '밑줄',
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault(),
  },
  icon: <Underline size={14} />,
  execute: (state, api) => {
    // 선택 없이 커서가 <u>...</u> 안에 있으면 → <u> 전체 선택 후 제거
    if (!state.selectedText) {
      const uRange = getEnclosingURange(state.text, state.selection.start)
      if (uRange) {
        const inner = state.text.slice(
          uRange.start + '<u>'.length,
          uRange.end - '</u>'.length
        )
        api.setSelectionRange(uRange)
        api.replaceSelection(inner)
        return
      }
    }
    applyInline(state, api, (text) => {
      const uMatch = text.match(/^<u>([\s\S]*)<\/u>$/)
      return uMatch ? uMatch[1] : `<u>${text}</u>`
    })
  },
}

function makeColorCommand(
  name: string,
  label: string,
  icon: React.ReactElement,
  colors: string[],
  wrap: (color: string, text: string) => string
): ICommand {
  return {
    name,
    keyCommand: 'group',
    groupName: name,
    // onMouseDown: preventDefault → 팔레트 클릭 시 에디터 포커스/선택 영역 유지
    buttonProps: {
      'aria-label': label,
      title: label,
      onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) =>
        e.preventDefault(),
    },
    icon,
    children: ({ close, getState, textApi }) => (
      <div className="color-palette" onMouseDown={(e) => e.preventDefault()}>
        {colors.map((color) => (
          <div
            key={color}
            className="color-swatch"
            style={{ background: color }}
            data-white={color === '#ffffff' ? 'true' : undefined}
            title={color === '#ffffff' ? '흰색' : color}
            onClick={() => {
              applyInlineFromDropdown(getState, textApi, (t) => wrap(color, t))
              close()
            }}
          />
        ))}
      </div>
    ),
    execute: () => {},
  }
}

const bgColorCommand: ICommand = {
  name: 'bg-color',
  keyCommand: 'group',
  groupName: 'bg-color',
  buttonProps: {
    'aria-label': '배경색',
    title: '배경색',
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault(),
  },
  icon: (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 3,
          background: '#4285f4',
          border: '1px solid rgba(0,0,0,0.12)',
          display: 'inline-block',
        }}
      />
      <ChevronDown size={10} />
    </span>
  ),
  children: ({ close, getState, textApi }) => (
    <div className="bg-color-popup" onMouseDown={(e) => e.preventDefault()}>
      {/* 배경 제거 버튼 */}
      <button
        type="button"
        className="bg-color-remove-btn"
        onClick={() => {
          applyInlineFromDropdown(getState, textApi, (t) =>
            t.replace(/<mark[^>]*>([\s\S]*?)<\/mark>/g, '$1')
          )
          close()
        }}
      >
        ✕ 배경 제거
      </button>
      {/* 색상 팔레트 */}
      <div className="color-palette">
        {BG_PALETTE_COLORS.map((color) => (
          <div
            key={color}
            className="color-swatch"
            style={{
              background: color,
              border:
                color === '#ffffff'
                  ? '1px solid #cdcdcd'
                  : '1px solid rgba(0,0,0,0.12)',
            }}
            title={color === '#ffffff' ? '흰색' : color}
            onClick={() => {
              applyInlineFromDropdown(getState, textApi, (t) =>
                wrapMarkWithStyle(t, color)
              )
              close()
            }}
          />
        ))}
      </div>
    </div>
  ),
  execute: () => {},
}

const textColorCommand = makeColorCommand(
  'text-color',
  '글자색',
  <span
    style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      lineHeight: 1,
    }}
  >
    <span style={{ fontWeight: 700, fontSize: 13 }}>A</span>
    <span
      style={{
        width: 14,
        height: 3,
        background: '#e53e3e',
        borderRadius: 1,
        display: 'block',
      }}
    />
  </span>,
  TEXT_PALETTE_COLORS,
  (color, text) => wrapWithStyle(text, 'color', color)
)

const alignLeftCommand: ICommand = {
  name: 'align-left',
  keyCommand: 'align-left',
  buttonProps: {
    'aria-label': '왼쪽 정렬',
    title: '왼쪽 정렬',
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault(),
  },
  icon: <AlignLeft size={14} />,
  execute: (state, api) =>
    applyBlock(state, api, (t) => wrapDivWithStyle(t, 'text-align', 'left')),
}

const alignCenterCommand: ICommand = {
  name: 'align-center',
  keyCommand: 'align-center',
  buttonProps: {
    'aria-label': '가운데 정렬',
    title: '가운데 정렬',
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault(),
  },
  icon: <AlignCenter size={14} />,
  execute: (state, api) =>
    applyBlock(state, api, (t) => wrapDivWithStyle(t, 'text-align', 'center')),
}

const alignRightCommand: ICommand = {
  name: 'align-right',
  keyCommand: 'align-right',
  buttonProps: {
    'aria-label': '오른쪽 정렬',
    title: '오른쪽 정렬',
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault(),
  },
  icon: <AlignRight size={14} />,
  execute: (state, api) =>
    applyBlock(state, api, (t) => wrapDivWithStyle(t, 'text-align', 'right')),
}

const alignJustifyCommand: ICommand = {
  name: 'align-justify',
  keyCommand: 'align-justify',
  buttonProps: {
    'aria-label': '양쪽 정렬',
    title: '양쪽 정렬',
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault(),
  },
  icon: <AlignJustify size={14} />,
  execute: (state, api) =>
    applyBlock(state, api, (t) => wrapDivWithStyle(t, 'text-align', 'justify')),
}

const listDropdownCmd: ICommand = {
  name: 'list-style',
  keyCommand: 'group',
  groupName: 'list-style',
  buttonProps: {
    'aria-label': '목록',
    title: '목록',
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault(),
  },
  icon: (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <List size={13} />
      <ChevronDown size={10} />
    </span>
  ),
  children: ({ close, getState, textApi }) => (
    <div className="toolbar-popup" onMouseDown={(e) => e.preventDefault()}>
      <button
        type="button"
        onClick={() => {
          insertListPrefix(getState, textApi, '- ')
          close()
        }}
      >
        글머리 목록
      </button>
      <button
        type="button"
        onClick={() => {
          insertListPrefix(getState, textApi, '1. ')
          close()
        }}
      >
        번호 목록
      </button>
      <button
        type="button"
        onClick={() => {
          insertListPrefix(getState, textApi, '- [ ] ')
          close()
        }}
      >
        체크 목록
      </button>
    </div>
  ),
  execute: () => {},
}

const lineHeightCmd: ICommand = {
  name: 'line-height',
  keyCommand: 'group',
  groupName: 'line-height',
  buttonProps: {
    'aria-label': '줄 간격',
    title: '줄 간격',
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault(),
  },
  icon: <ArrowUpDown size={14} />,
  children: ({ close, getState, textApi }) => (
    <div
      className="toolbar-popup"
      style={{ minWidth: 80 }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {['1', '1.5', '2', '2.5', '3'].map((h) => (
        <button
          key={h}
          type="button"
          onClick={() => {
            applyBlockFromDropdown(getState, textApi, (t) =>
              wrapDivWithStyle(t, 'line-height', h)
            )
            close()
          }}
        >
          {h}배
        </button>
      ))}
    </div>
  ),
  execute: () => {},
}

const outdentCmd: ICommand = {
  name: 'outdent',
  keyCommand: 'outdent',
  buttonProps: {
    'aria-label': '내어쓰기',
    title: '내어쓰기',
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault(),
  },
  icon: <IndentDecrease size={14} />,
  execute: (state, api) =>
    applyBlock(state, api, (t) =>
      t
        .split('\n')
        .map((l) => (l.startsWith('  ') ? l.slice(2) : l))
        .join('\n')
    ),
}

const indentCmd: ICommand = {
  name: 'indent',
  keyCommand: 'indent',
  buttonProps: {
    'aria-label': '들여쓰기',
    title: '들여쓰기',
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault(),
  },
  icon: <IndentIncrease size={14} />,
  execute: (state, api) =>
    applyBlock(state, api, (t) =>
      t
        .split('\n')
        .map((l) => `  ${l}`)
        .join('\n')
    ),
}

const clearFormatCmd: ICommand = {
  name: 'clear-format',
  keyCommand: 'clear-format',
  buttonProps: {
    'aria-label': '서식 제거',
    title: '서식 제거',
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault(),
  },
  icon: <RemoveFormatting size={14} />,
  execute: (state, api) =>
    applyInline(state, api, (t) =>
      t
        .replace(/\*\*(.*?)\*\*/gs, '$1')
        .replace(/\*(.*?)\*/gs, '$1')
        .replace(/~~(.*?)~~/gs, '$1')
        .replace(/<[^>]+>/gs, '')
    ),
}

const UNDO_LIMIT = 50

export function MarkdownEditor({
  value,
  onChange,
  error,
  actions,
}: MarkdownEditorProps) {
  const { mutateAsync: getPresignedUrl } = useGetPresignedUrl()
  const [isUploading, setIsUploading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [selectedFontLabel, setSelectedFontLabel] = useState('기본서체')
  const [selectedFontSize, setSelectedFontSize] = useState(16)
  const valueRef = useRef(value)
  const objectUrlsRef = useRef<Set<string>>(new Set())
  const [isDragOver, setIsDragOver] = useState(false)
  const dragCounterRef = useRef(0)

  useEffect(() => {
    valueRef.current = value
  }, [value])

  useEffect(() => {
    const urls = objectUrlsRef.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const handleChange = (newValue: string) => {
    setUndoStack((prev) => {
      const next = [...prev, valueRef.current]
      return next.length > UNDO_LIMIT ? next.slice(-UNDO_LIMIT) : next
    })
    setRedoStack([])
    onChange(newValue)
  }

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    setRedoStack((r) => [...r, valueRef.current])
    setUndoStack((u) => u.slice(0, -1))
    onChange(prev)
  }, [undoStack, onChange])

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    setUndoStack((u) => [...u, valueRef.current])
    setRedoStack((r) => r.slice(0, -1))
    onChange(next)
  }, [redoStack, onChange])

  const undoCommand = useMemo<ICommand>(
    () => ({
      name: 'undo',
      keyCommand: 'undo',
      buttonProps: {
        'aria-label': '실행 취소',
        title: '실행 취소',
        'data-inactive': undoStack.length === 0 ? 'true' : undefined,
        onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) =>
          e.preventDefault(),
      } as React.ButtonHTMLAttributes<HTMLButtonElement>,
      icon: <Undo2 size={14} />,
      execute: handleUndo,
    }),
    [undoStack.length, handleUndo]
  )

  const redoCommand = useMemo<ICommand>(
    () => ({
      name: 'redo',
      keyCommand: 'redo',
      buttonProps: {
        'aria-label': '다시 실행',
        title: '다시 실행',
        'data-inactive': redoStack.length === 0 ? 'true' : undefined,
        onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) =>
          e.preventDefault(),
      } as React.ButtonHTMLAttributes<HTMLButtonElement>,
      icon: <Redo2 size={14} />,
      execute: handleRedo,
    }),
    [redoStack.length, handleRedo]
  )

  const fontFamilyCommand = useMemo<ICommand>(
    () => ({
      name: 'font-family',
      keyCommand: 'group',
      groupName: 'font-family',
      buttonProps: {
        'aria-label': '글꼴',
        title: '글꼴',
        style: PILL,
        onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) =>
          e.preventDefault(),
      },
      icon: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          {selectedFontLabel} <ChevronDown size={10} />
        </span>
      ),
      children: ({ close, getState, textApi }) => (
        <div className="toolbar-popup" onMouseDown={(e) => e.preventDefault()}>
          {FONT_FAMILIES.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              style={{ fontFamily: value === 'inherit' ? undefined : value }}
              onClick={() => {
                applyInlineFromDropdown(getState, textApi, (t) =>
                  wrapWithStyle(t, 'font-family', value)
                )
                close()
                setTimeout(() => setSelectedFontLabel(label), 0)
              }}
            >
              {label}
            </button>
          ))}
        </div>
      ),
      execute: () => {},
    }),
    [selectedFontLabel]
  )

  const fontSizeCommand = useMemo<ICommand>(
    () => ({
      name: 'font-size',
      keyCommand: 'group',
      groupName: 'font-size',
      buttonProps: {
        'aria-label': '글자 크기',
        title: '글자 크기',
        style: PILL,
        onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) =>
          e.preventDefault(),
      },
      icon: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          {selectedFontSize} <ChevronDown size={10} />
        </span>
      ),
      children: ({ close, getState, textApi }) => (
        <div
          className="toolbar-popup"
          style={{ minWidth: 60 }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                applyInlineFromDropdown(getState, textApi, (t) =>
                  wrapWithStyle(t, 'font-size', `${size}px`)
                )
                close()
                setTimeout(() => setSelectedFontSize(size), 0)
              }}
            >
              {size}
            </button>
          ))}
        </div>
      ),
      execute: () => {},
    }),
    [selectedFontSize]
  )

  const uploadImageFile = useCallback(
    async (file: File, insertFn: (md: string) => void) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setImageError('JPG, PNG, GIF, WEBP 형식만 업로드할 수 있습니다.')
        return
      }
      setImageError(null)
      setIsUploading(true)
      const objectUrl = URL.createObjectURL(file)
      objectUrlsRef.current.add(objectUrl)
      insertFn(`![${file.name}](${objectUrl})`)
      try {
        const { presigned_url, img_url } = await getPresignedUrl({
          file_name: file.name,
        })
        try {
          await fetch(presigned_url, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          })
        } catch (err) {
          if (!import.meta.env.DEV) throw err
          // DEV(MSW) 환경에서는 S3 업로드 실패 무시 — objectUrl로 미리보기 유지
        }
        if (!import.meta.env.DEV) {
          onChange(valueRef.current.replaceAll(objectUrl, img_url))
          URL.revokeObjectURL(objectUrl)
          objectUrlsRef.current.delete(objectUrl)
        }
      } catch {
        URL.revokeObjectURL(objectUrl)
        objectUrlsRef.current.delete(objectUrl)
        setImageError('이미지 업로드에 실패했습니다. 다시 시도해 주세요.')
      } finally {
        setIsUploading(false)
      }
    },
    [getPresignedUrl, onChange]
  )

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      dragCounterRef.current = 0
      setIsDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      const imageFiles = files.filter((f) =>
        ACCEPTED_IMAGE_TYPES.includes(f.type)
      )
      if (imageFiles.length === 0) {
        if (files.length > 0)
          setImageError('JPG, PNG, GIF, WEBP 형식만 업로드할 수 있습니다.')
        return
      }
      for (const file of imageFiles) {
        await uploadImageFile(file, (md) => {
          const current = valueRef.current
          const sep = current.length > 0 && !current.endsWith('\n') ? '\n' : ''
          setUndoStack((prev) => {
            const next = [...prev, current]
            return next.length > UNDO_LIMIT ? next.slice(-UNDO_LIMIT) : next
          })
          setRedoStack([])
          onChange(current + sep + md)
        })
      }
    },
    [uploadImageFile, onChange]
  )

  const imageCommand: ICommand = useMemo(
    () => ({
      name: 'image',
      keyCommand: 'image',
      buttonProps: {
        'aria-label': '이미지 업로드',
        title: '이미지 업로드',
        onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) =>
          e.preventDefault(),
      },
      icon: (
        <svg width="14" height="14" viewBox="0 0 20 20">
          <path
            fill="currentColor"
            d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 6V4h16v11z"
          />
        </svg>
      ),
      execute: (_state, api) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = ACCEPTED_IMAGE_TYPES.join(',')
        input.onchange = async () => {
          const file = input.files?.[0]
          if (!file) return
          await uploadImageFile(file, (md) => api.replaceSelection(md))
        }
        input.click()
      },
    }),
    [uploadImageFile]
  )

  const editorCommands: ICommand[] = useMemo(
    () => [
      undoCommand,
      redoCommand,
      mdCommands.divider,
      fontFamilyCommand,
      fontSizeCommand,
      mdCommands.divider,
      {
        ...mdCommands.bold,
        buttonProps: { ...mdCommands.bold.buttonProps, ...NO_BLUR_PROPS },
      },
      {
        ...mdCommands.italic,
        buttonProps: { ...mdCommands.italic.buttonProps, ...NO_BLUR_PROPS },
      },
      underlineCommand,
      {
        ...mdCommands.strikethrough,
        buttonProps: {
          ...mdCommands.strikethrough.buttonProps,
          ...NO_BLUR_PROPS,
        },
      },
      bgColorCommand,
      textColorCommand,
      mdCommands.divider,
      {
        ...mdCommands.link,
        buttonProps: { ...mdCommands.link.buttonProps, ...NO_BLUR_PROPS },
      },
      imageCommand,
    ],
    [imageCommand, undoCommand, redoCommand, fontFamilyCommand, fontSizeCommand]
  )

  const editorExtraCommands: ICommand[] = useMemo(
    () => [
      listDropdownCmd,
      mdCommands.divider,
      alignLeftCommand,
      alignCenterCommand,
      alignRightCommand,
      alignJustifyCommand,
      lineHeightCmd,
      outdentCmd,
      indentCmd,
      clearFormatCmd,
    ],
    []
  )

  return (
    <div
      className={`bg-bg-base relative rounded-[20px] border ${isDragOver ? 'border-primary border-2' : 'border-[#cdcdcd]'}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => {
        e.preventDefault()
        dragCounterRef.current++
        setIsDragOver(true)
      }}
      onDragLeave={() => {
        dragCounterRef.current--
        if (dragCounterRef.current === 0) setIsDragOver(false)
      }}
    >
      {isDragOver && (
        <div className="border-primary bg-primary/5 pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[20px] border-2 border-dashed">
          <p className="text-primary font-medium">이미지를 여기에 놓으세요</p>
        </div>
      )}
      <div data-color-mode="light" className="post-editor-wrap">
        <MDEditor
          value={value}
          onChange={(v) => handleChange(v ?? '')}
          preview="live"
          commands={editorCommands}
          extraCommands={editorExtraCommands}
          previewOptions={{
            remarkPlugins: [[remarkBreaks]],
            remarkRehypeOptions: { allowDangerousHtml: true },
            rehypePlugins: [
              [rehypeRaw],
              [rehypeSanitize, editorSanitizeSchema],
            ],
          }}
        />
      </div>
      {isUploading && (
        <p className="text-text-muted px-4 pb-2 text-xs" aria-live="polite">
          이미지 업로드 중...
        </p>
      )}
      {imageError && (
        <p className="text-error px-4 pb-2 text-xs" role="alert">
          {imageError}
        </p>
      )}
      {error && (
        <p className="text-error px-4 pb-2 text-xs" role="alert">
          {error}
        </p>
      )}
      {actions && <div className="flex justify-end px-4 pb-3">{actions}</div>}
    </div>
  )
}
