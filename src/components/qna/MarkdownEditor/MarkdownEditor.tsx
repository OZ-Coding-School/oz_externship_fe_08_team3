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
import './MarkdownEditor.css'
import { useGetPresignedUrl } from '@/features/qna/presigned-url'

export interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

const FONT_FAMILIES = [
  { label: '기본서체', value: 'inherit' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: '돋움', value: 'Dotum, sans-serif' },
  { label: '맑은 고딕', value: "'Malgun Gothic', sans-serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: "'Courier New', monospace" },
]

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32]

const PALETTE_COLORS = [
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

function safeSelected(
  getState?: () => false | { selectedText: string }
): string {
  const s = getState?.()
  return (s && 'selectedText' in s ? s.selectedText : '') || ''
}

const fontFamilyCommand: ICommand = {
  name: 'font-family',
  keyCommand: 'group',
  groupName: 'font-family',
  buttonProps: { 'aria-label': '글꼴', title: '글꼴', style: PILL },
  icon: (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      기본서체 <ChevronDown size={10} />
    </span>
  ),
  children: ({ close, getState, textApi }) => (
    <div className="toolbar-popup">
      {FONT_FAMILIES.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          style={{ fontFamily: value === 'inherit' ? undefined : value }}
          onClick={() => {
            const inner = safeSelected(getState)
            textApi?.replaceSelection(
              `<span style="font-family: ${value}">${inner}</span>`
            )
            close()
          }}
        >
          {label}
        </button>
      ))}
    </div>
  ),
  execute: () => {},
}

const fontSizeCommand: ICommand = {
  name: 'font-size',
  keyCommand: 'group',
  groupName: 'font-size',
  buttonProps: { 'aria-label': '글자 크기', title: '글자 크기', style: PILL },
  icon: (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      16 <ChevronDown size={10} />
    </span>
  ),
  children: ({ close, getState, textApi }) => (
    <div className="toolbar-popup" style={{ minWidth: 60 }}>
      {FONT_SIZES.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => {
            const inner = safeSelected(getState)
            textApi?.replaceSelection(
              `<span style="font-size: ${size}px">${inner}</span>`
            )
            close()
          }}
        >
          {size}
        </button>
      ))}
    </div>
  ),
  execute: () => {},
}

const underlineCommand: ICommand = {
  name: 'underline',
  keyCommand: 'underline',
  buttonProps: { 'aria-label': '밑줄', title: '밑줄' },
  icon: <Underline size={14} />,
  execute: (state, api) => {
    api.replaceSelection(`<u>${state.selectedText}</u>`)
  },
}

function makeColorCommand(
  name: string,
  label: string,
  icon: React.ReactElement,
  wrap: (color: string, text: string) => string
): ICommand {
  return {
    name,
    keyCommand: 'group',
    groupName: name,
    buttonProps: { 'aria-label': label, title: label },
    icon,
    children: ({ close, getState, textApi }) => (
      <div className="color-palette">
        {PALETTE_COLORS.map((color) => (
          <div
            key={color}
            className="color-swatch"
            style={{ background: color }}
            title={color}
            onClick={() => {
              const selected = safeSelected(getState)
              textApi?.replaceSelection(wrap(color, selected))
              close()
            }}
          />
        ))}
      </div>
    ),
    execute: () => {},
  }
}

const bgColorCommand = makeColorCommand(
  'bg-color',
  '배경색',
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
  </span>,
  (color, text) => `<mark style="background-color: ${color}">${text}</mark>`
)

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
  (color, text) => `<span style="color: ${color}">${text}</span>`
)

const alignLeftCommand: ICommand = {
  name: 'align-left',
  keyCommand: 'align-left',
  buttonProps: { 'aria-label': '왼쪽 정렬', title: '왼쪽 정렬' },
  icon: <AlignLeft size={14} />,
  execute: (state, api) =>
    api.replaceSelection(
      `<div style="text-align: left">${state.selectedText}</div>`
    ),
}

const alignCenterCommand: ICommand = {
  name: 'align-center',
  keyCommand: 'align-center',
  buttonProps: { 'aria-label': '가운데 정렬', title: '가운데 정렬' },
  icon: <AlignCenter size={14} />,
  execute: (state, api) =>
    api.replaceSelection(
      `<div style="text-align: center">${state.selectedText}</div>`
    ),
}

const alignRightCommand: ICommand = {
  name: 'align-right',
  keyCommand: 'align-right',
  buttonProps: { 'aria-label': '오른쪽 정렬', title: '오른쪽 정렬' },
  icon: <AlignRight size={14} />,
  execute: (state, api) =>
    api.replaceSelection(
      `<div style="text-align: right">${state.selectedText}</div>`
    ),
}

const alignJustifyCommand: ICommand = {
  name: 'align-justify',
  keyCommand: 'align-justify',
  buttonProps: { 'aria-label': '양쪽 정렬', title: '양쪽 정렬' },
  icon: <AlignJustify size={14} />,
  execute: (state, api) =>
    api.replaceSelection(
      `<div style="text-align: justify">${state.selectedText}</div>`
    ),
}

const listDropdownCmd: ICommand = {
  name: 'list-style',
  keyCommand: 'group',
  groupName: 'list-style',
  buttonProps: { 'aria-label': '목록', title: '목록' },
  icon: (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <List size={13} />
      <ChevronDown size={10} />
    </span>
  ),
  children: ({ close, getState, textApi }) => (
    <div className="toolbar-popup">
      <button
        type="button"
        onClick={() => {
          const text = safeSelected(getState)
          const lines = text
            ? text
                .split('\n')
                .map((l) => `- ${l}`)
                .join('\n')
            : '- '
          textApi?.replaceSelection(lines)
          close()
        }}
      >
        글머리 목록
      </button>
      <button
        type="button"
        onClick={() => {
          const text = safeSelected(getState)
          const lines = text
            ? text
                .split('\n')
                .map((l, i) => `${i + 1}. ${l}`)
                .join('\n')
            : '1. '
          textApi?.replaceSelection(lines)
          close()
        }}
      >
        번호 목록
      </button>
      <button
        type="button"
        onClick={() => {
          const text = safeSelected(getState)
          const lines = text
            ? text
                .split('\n')
                .map((l) => `- [ ] ${l}`)
                .join('\n')
            : '- [ ] '
          textApi?.replaceSelection(lines)
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
  buttonProps: { 'aria-label': '줄 간격', title: '줄 간격' },
  icon: <ArrowUpDown size={14} />,
  children: ({ close, getState, textApi }) => (
    <div className="toolbar-popup" style={{ minWidth: 80 }}>
      {['1', '1.5', '2', '2.5', '3'].map((h) => (
        <button
          key={h}
          type="button"
          onClick={() => {
            const text = safeSelected(getState)
            textApi?.replaceSelection(
              `<div style="line-height: ${h}">${text}</div>`
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
  buttonProps: { 'aria-label': '내어쓰기', title: '내어쓰기' },
  icon: <IndentDecrease size={14} />,
  execute: (state, api) => {
    const lines = state.selectedText
      ? state.selectedText
          .split('\n')
          .map((l) => (l.startsWith('  ') ? l.slice(2) : l))
          .join('\n')
      : ''
    api.replaceSelection(lines)
  },
}

const indentCmd: ICommand = {
  name: 'indent',
  keyCommand: 'indent',
  buttonProps: { 'aria-label': '들여쓰기', title: '들여쓰기' },
  icon: <IndentIncrease size={14} />,
  execute: (state, api) => {
    const lines = state.selectedText
      ? state.selectedText
          .split('\n')
          .map((l) => `  ${l}`)
          .join('\n')
      : '  '
    api.replaceSelection(lines)
  },
}

const clearFormatCmd: ICommand = {
  name: 'clear-format',
  keyCommand: 'clear-format',
  buttonProps: { 'aria-label': '서식 제거', title: '서식 제거' },
  icon: <RemoveFormatting size={14} />,
  execute: (state, api) => {
    const cleaned = state.selectedText
      .replace(/\*\*(.*?)\*\*/gs, '$1')
      .replace(/\*(.*?)\*/gs, '$1')
      .replace(/~~(.*?)~~/gs, '$1')
      .replace(/<[^>]+>/gs, '')
    api.replaceSelection(cleaned)
  },
}

const UNDO_LIMIT = 50

export function MarkdownEditor({
  value,
  onChange,
  error,
}: MarkdownEditorProps) {
  const { mutateAsync: getPresignedUrl } = useGetPresignedUrl()
  const [isUploading, setIsUploading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const valueRef = useRef(value)
  const objectUrlsRef = useRef<Set<string>>(new Set())

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
      } as React.ButtonHTMLAttributes<HTMLButtonElement>,
      icon: <Redo2 size={14} />,
      execute: handleRedo,
    }),
    [redoStack.length, handleRedo]
  )

  const imageCommand: ICommand = useMemo(
    () => ({
      name: 'image',
      keyCommand: 'image',
      buttonProps: { 'aria-label': '이미지 업로드', title: '이미지 업로드' },
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
          if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            setImageError('JPG, PNG, GIF, WEBP 형식만 업로드할 수 있습니다.')
            return
          }
          setImageError(null)
          setIsUploading(true)
          const objectUrl = URL.createObjectURL(file)
          objectUrlsRef.current.add(objectUrl)
          api.replaceSelection(`![${file.name}](${objectUrl})`)
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
        }
        input.click()
      },
    }),
    [getPresignedUrl, onChange]
  )

  const editorCommands: ICommand[] = useMemo(
    () => [
      undoCommand,
      redoCommand,
      mdCommands.divider,
      fontFamilyCommand,
      fontSizeCommand,
      mdCommands.divider,
      mdCommands.bold,
      mdCommands.italic,
      underlineCommand,
      mdCommands.strikethrough,
      bgColorCommand,
      textColorCommand,
      mdCommands.divider,
      mdCommands.link,
      imageCommand,
    ],
    [imageCommand, undoCommand, redoCommand]
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
    <div className="bg-bg-base rounded-[20px] border border-[#cdcdcd]">
      <div data-color-mode="light" className="post-editor-wrap">
        <MDEditor
          value={value}
          onChange={(v) => handleChange(v ?? '')}
          preview="live"
          commands={editorCommands}
          extraCommands={editorExtraCommands}
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
    </div>
  )
}
