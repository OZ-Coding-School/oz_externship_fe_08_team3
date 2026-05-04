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
        className="bg-bg-base fixed right-6 bottom-[120px] z-50 flex h-[608px] max-h-[calc(100vh-9rem)] w-[360px] flex-col overflow-hidden rounded-xl border border-gray-200"
        style={{ boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)' }}
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
