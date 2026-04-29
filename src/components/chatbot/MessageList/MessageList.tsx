import { useEffect, useRef } from 'react'
import type { ChatMessage } from '@/features/chatbot/widgetTypes'

interface MessageListProps {
  messages: ChatMessage[]
}

// TODO: 추후 react-markdown + remark-gfm + sanitize 적용 예정
function renderAssistantContent(message: ChatMessage) {
  return <p className="whitespace-pre-wrap">{message.message}</p>
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user'
        return (
          <div
            key={msg.id ?? idx}
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
