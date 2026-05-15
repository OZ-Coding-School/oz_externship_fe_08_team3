import { useState } from 'react'
import rehypeSanitize from 'rehype-sanitize'
import MDEditor from '@uiw/react-md-editor'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import {
  useGetAiFirstAnswer,
  useCreateAiFirstAnswer,
} from '@/features/qna/question-ai-answer'
import { AI_FIRST_ANSWER_QUERY_KEY } from '@/features/qna/question-ai-answer/queries'
import { useChatbotStore } from '@/stores/chatbotStore'
import { handleApiError } from '@/utils/handleApiError'
import type { ToastVariant } from '@/components'
import aiBotImg from '@/assets/ai-bot.png'

// ── 에러 메시지 매핑 ──────────────────────────────────────────────────────────

const AI_ANSWER_ERROR_MESSAGES: Partial<Record<number, string>> = {
  403: 'AI 답변 생성 권한이 없습니다',
  404: '질문을 찾을 수 없습니다',
  409: 'AI 답변 요청 처리 중 문제가 발생했습니다',
  500: 'AI 답변을 가져올 수 없습니다. 잠시 후 다시 시도해주세요',
  503: 'AI 답변을 가져올 수 없습니다. 잠시 후 다시 시도해주세요',
}

// ── AiFirstAnswerSection ──────────────────────────────────────────────────────

interface AiFirstAnswerSectionProps {
  questionId: number
  questionTitle: string
  isAuthenticated: boolean
  showToast: (message: string, variant: ToastVariant) => void
}

export function AiFirstAnswerSection({
  questionId,
  questionTitle,
  isAuthenticated,
  showToast,
}: AiFirstAnswerSectionProps) {
  const queryClient = useQueryClient()

  // GET: 기존 답변 조회 (로그인 유저만)
  const {
    data: existingAnswer,
    isLoading: isGetLoading,
    isError: isGetError,
  } = useGetAiFirstAnswer(questionId, isAuthenticated)

  // POST: 답변 생성
  const {
    mutate,
    data: createdAnswer,
    isPending: isCreatePending,
    reset,
  } = useCreateAiFirstAnswer(questionId)

  const enterQna = useChatbotStore((s) => s.enterQna)

  // 기존 답변이 있으면 자동으로 펼침
  const [isOpen, setIsOpen] = useState(false)
  const showAnswer = isOpen

  const answerData = existingAnswer ?? createdAnswer
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleRequest = () => {
    if (!isAuthenticated) {
      showToast('로그인이 필요합니다', 'error')
      return
    }
    setErrorMessage(null)
    mutate(undefined, {
      onSuccess: (data) => {
        setIsOpen(true)
        // GET 캐시도 갱신
        queryClient.setQueryData(AI_FIRST_ANSWER_QUERY_KEY(questionId), data)
      },
      onError: (error) => {
        const { message } = handleApiError(error, AI_ANSWER_ERROR_MESSAGES)
        setErrorMessage(message)
        showToast(message, 'error')
        reset()
      },
    })
  }

  const handleAskMore = () => {
    if (!answerData) return
    enterQna({
      questionId,
      questionTitle,
      firstAnswer: answerData.output,
    })
  }

  const toggleOpen = () => {
    // 이미 답변 데이터가 있으면 토글만
    if (answerData) {
      setIsOpen((v) => !v)
      return
    }
    // 없으면 생성 요청
    handleRequest()
  }

  const isPending = isCreatePending || isGetLoading
  const ChevronIcon = showAnswer ? ChevronUp : ChevronDown

  return (
    <div className="mt-16">
      {/* 말풍선 레이아웃: 로봇 + 버블 */}
      <div className="flex items-start gap-4">
        {/* 로봇 일러스트 */}
        <img
          src={aiBotImg}
          alt="AI 챗봇"
          className="h-[83px] w-[83px] shrink-0"
        />

        {/* 말풍선 */}
        <div className="relative flex-1 rounded-2xl bg-[#F8F8F8] px-7 py-6 shadow-[0_4px_4px_rgba(0,0,0,0.25),4px_4px_4px_rgba(0,0,0,0.10)]">
          {/* 말풍선 테일 — 좌측 상단 */}
          <div
            aria-hidden
            className="absolute top-4 -left-[12px] border-y-[6px] border-r-[12px] border-y-transparent border-r-[#F8F8F8]"
          />

          {showAnswer && answerData ? (
            /* 펼쳐진 상태 (이미지 3) — 답변 표시, 버튼 없음 */
            <div className="animate-fade-in">
              <p className="text-lg leading-normal font-bold tracking-[-0.03em] text-[#121212]">
                AI 질의응답 챗봇 답변
              </p>
              <div
                data-color-mode="light"
                className="prose mt-3 max-w-none text-sm [&_.wmde-markdown]:!bg-transparent [&_.wmde-markdown_*]:!bg-transparent"
              >
                <MDEditor.Markdown
                  source={answerData.output}
                  rehypePlugins={[rehypeSanitize]}
                />
              </div>
              {isAuthenticated && (
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleAskMore}>
                    추가 질문하기
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* 접힌 상태 (이미지 2) — 질문 제목 + 답변 보기 버튼 */
            <>
              <p className="truncate text-base leading-normal tracking-[-0.03em] text-[#707070]">
                {questionTitle}
              </p>
              <button
                type="button"
                onClick={toggleOpen}
                disabled={isPending}
                className="mt-2 inline-flex flex-wrap items-center gap-1 text-lg leading-normal font-bold tracking-[-0.03em] text-[#4D4D4D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="sm" label="AI 답변 로딩 중" />
                    <span>
                      AI가 답변을 {isGetLoading ? '불러오고' : '생성하고'}{' '}
                      있습니다...
                    </span>
                  </span>
                ) : (
                  <>
                    <span>질문에 대한</span>
                    <img
                      src={aiBotImg}
                      alt=""
                      className="mx-0.5 inline h-9 w-9"
                    />
                    <strong className="text-black">AI 질의응답 챗봇</strong>
                    <span>답변 보기</span>
                    <ChevronIcon className="ml-1 h-4 w-4 shrink-0 text-[#4D4D4D]" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* GET 조회 실패 시 안내 (네트워크 등) */}
      {isGetError && !answerData && isAuthenticated && (
        <p className="text-error mt-2 text-xs">
          AI 답변을 불러오지 못했습니다. 다시 시도해주세요.
        </p>
      )}

      {errorMessage && (
        <p className="text-error mt-2 text-xs">{errorMessage}</p>
      )}
    </div>
  )
}
