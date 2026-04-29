import { ChatbotHeader } from '@/components/chatbot/ChatbotHeader'
import { MessageList } from '@/components/chatbot/MessageList'
import { ChatInput } from '@/components/chatbot/ChatInput'
import { useChatbotStore } from '@/stores/chatbotStore'
import { useCsChat } from './hooks/useCsChat'

export function CsChatView() {
  const {
    messages,
    isStreaming,
    isLoading,
    isError,
    refetch,
    sendMessage,
    abort,
  } = useCsChat()
  const { setView, close } = useChatbotStore()

  const handleBack = () => {
    abort()
    setView('hub')
  }

  const handleClose = () => {
    abort()
    close()
  }

  const getPlaceholder = () => {
    if (isError) return '대화를 불러온 뒤 이용할 수 있습니다'
    if (isStreaming) return '응답 중입니다...'
    return 'CS 상담 메시지를 입력하세요'
  }

  const getDisabledReason = () => {
    if (isStreaming) return 'streaming' as const
    if (isLoading) return 'loading' as const
    return undefined
  }

  return (
    <div className="flex h-full flex-col">
      {/* PDF 기준 제목: "AI OZ 시스템 챗봇". 공통 헤더 정책이 따로 있으면 그것을 우선 */}
      <ChatbotHeader
        title="AI OZ 시스템 챗봇"
        showBack
        onBack={handleBack}
        onClose={handleClose}
      />

      <div className="min-h-0 flex-1">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        ) : isError ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <p className="text-text-muted text-sm">
              대화를 불러오지 못했습니다
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-text-body hover:bg-bg-muted rounded-lg border border-gray-200 px-4 py-2 text-sm transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>

      <ChatInput
        onSend={sendMessage}
        disabled={isStreaming || isLoading || isError}
        disabledReason={getDisabledReason()}
        placeholder={getPlaceholder()}
      />
    </div>
  )
}
