import { useChatbotStore } from '@/stores/chatbotStore'

interface ChatbotHeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  onClose?: () => void
}

export function ChatbotHeader({
  title,
  showBack = false,
  onBack,
  onClose,
}: ChatbotHeaderProps) {
  const { setView, close } = useChatbotStore()

  const handleBack = onBack ?? (() => setView('hub'))
  const handleClose = onClose ?? (() => close())

  return (
    <div className="flex items-center border-b border-gray-200 px-4 py-3">
      {/* 좌: 뒤로가기 */}
      <div className="w-8">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="뒤로가기"
            className="text-text-body hover:bg-bg-muted flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 중앙: 타이틀 */}
      <h2
        id="chatbot-title"
        className="text-text-heading flex-1 text-center text-sm font-semibold"
      >
        {title}
      </h2>

      {/* 우: 닫기 */}
      <div className="w-8">
        <button
          id="chatbot-close-button"
          type="button"
          onClick={handleClose}
          aria-label="닫기"
          className="text-text-body hover:bg-bg-muted flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
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
