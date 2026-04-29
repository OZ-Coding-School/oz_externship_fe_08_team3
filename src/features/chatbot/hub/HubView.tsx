import { ChatbotHeader } from '@/components/chatbot/ChatbotHeader'
import { useChatbotStore } from '@/stores/chatbotStore'
import { useGetSessions } from '@/features/chatbot/sessions'
import type { ChatSession } from '@/features/chatbot/sessions'

export function HubView() {
  const { setView, enterQna, close } = useChatbotStore()
  const { data, isLoading, isError, refetch } = useGetSessions()

  const handleCsClick = () => {
    setView('cs')
  }

  const handleSessionClick = (session: ChatSession) => {
    enterQna({
      questionId: session.question_id,
      questionTitle: session.question_title,
      firstAnswer: session.first_answer,
    })
  }

  return (
    <div className="flex h-full flex-col">
      <ChatbotHeader
        title="AI OZ 시스템 챗봇"
        showBack={false}
        onClose={close}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
        {/* CS 항목 — 항상 표시, Q&A 로딩/에러와 무관 */}
        <button
          type="button"
          onClick={handleCsClick}
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
            <p className="text-text-muted text-xs">
              궁금한 점을 챗봇에게 물어보세요
            </p>
          </div>
        </button>

        {/* Q&A 세션 목록 — 로딩/에러/빈 상태는 이 섹션 내부에서만 처리 */}
        <section className="flex flex-col gap-2">
          <h3 className="text-text-heading px-1 text-xs font-semibold">
            Q&A 상담
          </h3>

          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <div className="border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-2 py-6">
              <p className="text-text-muted text-sm">
                Q&A 목록을 불러오지 못했습니다
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-text-body hover:bg-bg-muted rounded-lg border border-gray-200 px-4 py-2 text-sm transition-colors"
              >
                다시 시도
              </button>
            </div>
          )}

          {!isLoading && !isError && data?.results?.length === 0 && (
            <p className="text-text-muted py-6 text-center text-sm">
              진행 중인 Q&A 상담이 없습니다.
            </p>
          )}

          {!isLoading &&
            !isError &&
            data?.results?.map((session) => (
              <button
                key={session.session_id}
                type="button"
                onClick={() => handleSessionClick(session)}
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
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#6201e0"
                      strokeWidth="2"
                    />
                    <path
                      d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"
                      stroke="#6201e0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="17"
                      r="0.5"
                      fill="#6201e0"
                      stroke="#6201e0"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-text-heading truncate text-sm font-medium">
                    {session.question_title ?? 'Q&A 상담'}
                  </p>
                  <p className="text-text-muted text-xs">
                    {new Date(session.updated_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </button>
            ))}
        </section>
      </div>
    </div>
  )
}
