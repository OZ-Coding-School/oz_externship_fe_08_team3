import { useState } from 'react'
import rehypeSanitize from 'rehype-sanitize'
import MDEditor from '@uiw/react-md-editor'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { useCreateAiFirstAnswer } from '@/features/qna/question-ai-answer'
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
  showToast: (message: string, variant: ToastVariant) => void
}

export function AiFirstAnswerSection({
  questionId,
  questionTitle,
  showToast,
}: AiFirstAnswerSectionProps) {
  const { mutate, data, isPending, status, reset } =
    useCreateAiFirstAnswer(questionId)
  const enterQna = useChatbotStore((s) => s.enterQna)
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleRequest = () => {
    setErrorMessage(null)
    mutate(undefined, {
      onSuccess: () => setIsOpen(true),
      onError: (error) => {
        const { message } = handleApiError(error, AI_ANSWER_ERROR_MESSAGES)
        setErrorMessage(message)
        showToast(message, 'error')
        reset()
      },
    })
  }

  const handleAskMore = () => {
    if (!data) return
    enterQna({
      questionId,
      questionTitle,
      firstAnswer: data.output,
    })
  }

  const toggleOpen = () => {
    if (status !== 'success') {
      handleRequest()
    } else {
      setIsOpen((v) => !v)
    }
  }

  const ChevronIcon = isOpen ? ChevronUp : ChevronDown

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

          {/* 질문 미리보기 텍스트 */}
          <p className="truncate text-base leading-normal tracking-[-0.03em] text-[#707070]">
            {questionTitle}
          </p>

          {/* 답변 보기 CTA */}
          <button
            type="button"
            onClick={toggleOpen}
            disabled={isPending}
            className="mt-2 inline-flex flex-wrap items-center gap-1 text-lg leading-normal font-bold tracking-[-0.03em] text-[#4D4D4D] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" label="AI 답변 생성 중" />
                <span>AI가 답변을 생성하고 있습니다...</span>
              </span>
            ) : (
              <>
                <span>질문에 대한</span>
                <img src={aiBotImg} alt="" className="mx-0.5 inline h-9 w-9" />
                <strong className="text-black">AI 질의응답 챗봇</strong>
                <span>답변 보기</span>
                <ChevronIcon className="ml-1 h-4 w-4 shrink-0 text-[#4D4D4D]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 펼쳐진 AI 답변 */}
      {isOpen && status === 'success' && data && (
        <div className="mt-4 rounded-2xl bg-[#F8F8F8] p-7">
          <div data-color-mode="light" className="prose max-w-none text-sm">
            <MDEditor.Markdown
              source={data.output}
              rehypePlugins={[rehypeSanitize]}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleAskMore}>
              추가 질문하기
            </Button>
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="text-error mt-2 text-xs">{errorMessage}</p>
      )}
    </div>
  )
}
