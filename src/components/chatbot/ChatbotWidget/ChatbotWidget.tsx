import { useChatbotStore } from '@/stores/chatbotStore'
import { ChatbotHeader } from '../ChatbotHeader'
import { MessageList } from '../MessageList'
import { ChatInput } from '../ChatInput'
import { CsChatView } from '@/features/chatbot/cs'
import type { ChatMessage } from '@/features/chatbot/widgetTypes'

const QNA_PLACEHOLDER_MESSAGES: ChatMessage[] = [
  {
    id: 'qna-1',
    role: 'assistant',
    message: 'Q&A 챗봇입니다. 궁금한 점을 질문해주세요.',
  },
]

function HubView() {
  const { setView, enterQna } = useChatbotStore()

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
      {/* CS default item */}
      <button
        type="button"
        onClick={() => setView('cs')}
        className="hover:bg-bg-muted flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors"
      >
        <div className="bg-primary-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              stroke="#6201e0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-text-heading text-sm font-medium">CS 상담</p>
          <p className="text-text-muted text-xs">고객 지원 챗봇과 대화하기</p>
        </div>
      </button>

      {/* QnA placeholder item — 임시 테스트용 */}
      <button
        type="button"
        onClick={() =>
          enterQna({
            questionId: 42,
            questionTitle: 'Q&A 챗봇',
            firstAnswer: null,
          })
        }
        className="hover:bg-bg-muted flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors"
      >
        <div className="bg-primary-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="#6201e0" strokeWidth="2" />
            <path
              d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"
              stroke="#6201e0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="17" r="0.5" fill="#6201e0" stroke="#6201e0" />
          </svg>
        </div>
        <div>
          <p className="text-text-heading text-sm font-medium">Q&A 챗봇</p>
          <p className="text-text-muted text-xs">질문에 대한 AI 답변 받기</p>
        </div>
      </button>
    </div>
  )
}

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
      {currentView === 'hub' && (
        <>
          <ChatbotHeader title="AI 챗봇" showBack={false} />
          <HubView />
        </>
      )}
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
