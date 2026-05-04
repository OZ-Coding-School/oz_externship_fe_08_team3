import { useState } from 'react'
import type { ChatInputDisabledReason } from '@/features/chatbot/widgetTypes'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  disabledReason?: ChatInputDisabledReason // 추후 disabled 사유별 UI 분기 시 사용
  placeholder?: string
  notice?: string
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = '메시지를 입력하세요',
  notice,
}: ChatInputProps) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-200 p-3">
      {notice && (
        <p id="chatbot-input-notice" className="text-text-muted mb-2 text-xs">
          {notice}
        </p>
      )}
      <div className="flex items-end gap-2">
        <textarea
          id="chatbot-message-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="메시지 입력"
          aria-disabled={disabled || undefined}
          aria-describedby={notice ? 'chatbot-input-notice' : undefined}
          rows={1}
          className="focus:border-primary-400 disabled:text-text-muted flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm transition-colors outline-none disabled:bg-gray-100"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label="메시지 전송"
          aria-disabled={disabled || !value.trim() || undefined}
          className="bg-primary text-text-inverse hover:bg-primary-700 disabled:text-text-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors disabled:bg-gray-200"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M22 2L11 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
