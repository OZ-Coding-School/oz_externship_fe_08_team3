import MDEditor from '@uiw/react-md-editor'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkBreaks from 'remark-breaks'
import { rehypeSanitizeStyle } from './sanitizeStyle'

// style 속성 허용, blob: 이미지 src 허용, 스크립트/이벤트 핸들러는 차단
// style 내부의 CSS 프로퍼티는 rehypeSanitizeStyle에서 allowlist로 필터링
const sanitizeSchema = {
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

export interface MarkdownViewerProps {
  content: string
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div data-color-mode="light">
      <MDEditor.Markdown
        source={content}
        remarkPlugins={[[remarkBreaks]]}
        rehypePlugins={[
          [rehypeRaw],
          [rehypeSanitize, sanitizeSchema],
          [rehypeSanitizeStyle],
        ]}
      />
    </div>
  )
}
