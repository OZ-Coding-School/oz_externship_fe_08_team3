import { useEffect, useRef } from 'react'
import rehypeSanitize from 'rehype-sanitize'
import MDEditor from '@uiw/react-md-editor'
import type { ChatMessage } from '@/features/chatbot/widgetTypes'

interface MessageListProps {
  messages: ChatMessage[]
}

function renderAssistantContent(message: ChatMessage) {
  return (
    <div data-color-mode="light" className="prose prose-sm max-w-none">
      <MDEditor.Markdown
        source={message.message}
        rehypePlugins={[rehypeSanitize]}
      />
    </div>
  )
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      role="log"
      aria-label="채팅 메시지 목록"
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic={false}
      className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
    >
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user'
        return (
          <div
            key={msg.id ?? idx}
            role="article"
            aria-label={isUser ? '사용자 메시지' : 'AI 답변'}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                isUser
                  ? 'bg-primary-50 text-text-heading'
                  : 'bg-bg-muted text-text-body'
              }`}
            >
              {isUser ? (
                <p className="whitespace-pre-wrap">{msg.message}</p>
              ) : (
                renderAssistantContent(msg)
              )}
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
