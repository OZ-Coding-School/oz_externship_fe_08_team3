import { FocusTrap } from 'focus-trap-react'
import { useChatbotStore } from '@/stores/chatbotStore'
import { CsChatView } from '@/features/chatbot/cs'
import { HubView } from '@/features/chatbot/hub'
import { QnaChatView } from '@/features/chatbot/qna'

export function ChatbotWidget() {
  const { isOpen, currentView, activeQnaQuestionId, close } = useChatbotStore()

  if (!isOpen) return null

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      close()
    }
  }

  return (
    <FocusTrap
      active={isOpen}
      focusTrapOptions={{
        initialFocus: '#chatbot-close-button',
        fallbackFocus: '#chatbot-widget',
        escapeDeactivates: false,
        allowOutsideClick: true,
        returnFocusOnDeactivate: true,
      }}
    >
      <div
        id="chatbot-widget"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chatbot-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="bg-bg-base fixed right-6 bottom-24 z-50 flex h-[600px] max-h-[calc(100vh-7rem)] w-96 flex-col overflow-clip rounded-2xl border border-gray-200 shadow-xl"
      >
        {currentView === 'hub' && <HubView />}
        {currentView === 'cs' && <CsChatView />}
        {currentView === 'qna' && activeQnaQuestionId != null && (
          <QnaChatView
            key={activeQnaQuestionId}
            questionId={activeQnaQuestionId}
          />
        )}
      </div>
    </FocusTrap>
  )
}
