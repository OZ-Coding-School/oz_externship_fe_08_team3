import { useChatbotStore } from '@/stores/chatbotStore'
import { ChatbotHeader } from '../ChatbotHeader'
import { MessageList } from '../MessageList'
import { ChatInput } from '../ChatInput'
import { CsChatView } from '@/features/chatbot/cs'
import { HubView } from '@/features/chatbot/hub'
import type { ChatMessage } from '@/features/chatbot/widgetTypes'

const QNA_PLACEHOLDER_MESSAGES: ChatMessage[] = [
  {
    id: 'qna-1',
    role: 'assistant',
    message: 'Q&A 챗봇입니다. 궁금한 점을 질문해주세요.',
  },
]

function QnaView() {
  return (
    <>
      <MessageList messages={QNA_PLACEHOLDER_MESSAGES} />
      <ChatInput
        onSend={() => {
          // TODO: QnA SSE 연동 시 구현
        }}
        placeholder="질문을 입력하세요"
      />
    </>
  )
}

export function ChatbotWidget() {
  const { isOpen, currentView, questionTitle } = useChatbotStore()

  if (!isOpen) return null

  return (
    <div className="bg-bg-base fixed right-6 bottom-24 z-50 flex h-[600px] w-96 flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
      {currentView === 'hub' && <HubView />}
      {currentView === 'cs' && <CsChatView />}
      {currentView === 'qna' && (
        <>
          <ChatbotHeader title={questionTitle ?? 'Q&A 챗봇'} showBack />
          <QnaView />
        </>
      )}
    </div>
  )
}
