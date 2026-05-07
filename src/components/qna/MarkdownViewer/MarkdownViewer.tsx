import MDEditor from '@uiw/react-md-editor'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkBreaks from 'remark-breaks'

// style 속성 허용, blob: 이미지 src 허용, 스크립트/이벤트 핸들러는 차단
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
        rehypePlugins={[[rehypeRaw], [rehypeSanitize, sanitizeSchema]]}
      />
    </div>
  )
}
