import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'

export interface MarkdownViewerProps {
  content: string
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div data-color-mode="light">
      <MDEditor.Markdown source={content} rehypePlugins={[rehypeSanitize]} />
    </div>
  )
}
