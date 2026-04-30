import { useChatbotStore } from '@/stores/chatbotStore'
import { CsChatView } from '@/features/chatbot/cs'
import { HubView } from '@/features/chatbot/hub'
import { QnaChatView } from '@/features/chatbot/qna'

export function ChatbotWidget() {
  const { isOpen, currentView, activeQnaQuestionId } = useChatbotStore()

  if (!isOpen) return null

  return (
    <div className="bg-bg-base fixed right-6 bottom-24 z-50 flex h-[600px] w-96 flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
      {currentView === 'hub' && <HubView />}
      {currentView === 'cs' && <CsChatView />}
      {currentView === 'qna' && activeQnaQuestionId != null && (
        <QnaChatView
          key={activeQnaQuestionId}
          questionId={activeQnaQuestionId}
        />
      )}
    </div>
  )
}
