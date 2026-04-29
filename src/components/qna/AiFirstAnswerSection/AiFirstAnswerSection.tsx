import { useState } from 'react'
import rehypeSanitize from 'rehype-sanitize'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { useCreateAiFirstAnswer } from '@/features/qna/question-ai-answer'
import { useChatbotStore } from '@/stores/chatbotStore'
import { handleApiError } from '@/utils/handleApiError'
import type { ToastVariant } from '@/components'

// ── 아이콘 ────────────────────────────────────────────────────────────────────

function RobotIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="13" r="1.5" fill="currentColor" />
      <circle cx="15" cy="13" r="1.5" fill="currentColor" />
      <path
        d="M9 4h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 4v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 20l1 2h8l1-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleRequest = () => {
    setErrorMessage(null)
    mutate(undefined, {
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

  // ── 성공 상태: 마크다운 답변 + 추가 질문하기 ─────────────────────────────
  if (status === 'success' && data) {
    return (
      <div className="bg-primary-50 border-primary-200 mt-6 rounded-lg border p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-primary">
            <RobotIcon />
          </span>
          <span className="text-primary text-sm font-medium">AI 답변</span>
        </div>

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
    )
  }

  // ── idle / pending / error 상태: 버튼 ─────────────────────────────────────
  return (
    <div className="bg-primary-50 border-primary-200 mt-6 rounded-lg border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-primary">
            <RobotIcon />
          </span>
          <span className="text-primary text-sm font-medium">
            {isPending
              ? 'AI가 답변을 생성하고 있습니다...'
              : 'AI 답변을 확인해보세요'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleRequest}
          disabled={isPending}
          className="text-primary hover:text-primary-700 disabled:text-primary/50 flex items-center gap-1.5 text-sm font-semibold disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Spinner size="sm" label="AI 답변 생성 중" />
          ) : (
            'AI 답변보기'
          )}
        </button>
      </div>

      {errorMessage && (
        <p className="text-error mt-2 text-xs">{errorMessage}</p>
      )}
    </div>
  )
}
