import { LoadingBox } from '@/components/common/LoadingBox'
import { AnswerCard } from '@/components/qna/AnswerCard'
import type { GetAnswerItem } from '@/features/qna/answers'

// ── AnswerSection ─────────────────────────────────────────────────────────────

interface AnswerSectionProps {
  sortedAnswers: GetAnswerItem[]
  isLoading: boolean
  isError: boolean
  isQuestionOwner: boolean
  anyAdopted: boolean
  isAcceptPending: boolean
  confirmAcceptId: number | null
  numericQuestionId: number
  isAuthenticated: boolean
  userId: number | null | undefined
  answers: GetAnswerItem[] | undefined
  onAccept: (answerId: number) => void
}

export function AnswerSection({
  sortedAnswers,
  isLoading,
  isError,
  isQuestionOwner,
  anyAdopted,
  isAcceptPending,
  confirmAcceptId,
  numericQuestionId,
  isAuthenticated,
  userId,
  answers,
  onAccept,
}: AnswerSectionProps) {
  return (
    <section aria-labelledby="answers-heading" className="mt-[100px]">
      {isLoading && <LoadingBox label="답변을 불러오는 중..." />}
      {isError && (
        <p className="text-error text-sm">
          답변을 불러오지 못했습니다. 다시 시도해 주세요.
        </p>
      )}
      {!isLoading && !isError && answers && (
        <>
          {/* A 원형 뱃지 + 답변 수 */}
          <div className="mb-10 flex items-center gap-4">
            <span className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[28px] leading-none font-bold tracking-[-0.03em] text-white">
              A
            </span>
            <h2
              id="answers-heading"
              className="text-[32px] leading-normal font-bold tracking-[-0.03em] text-[#121212]"
            >
              {sortedAnswers.length}개의 답변이 있어요
            </h2>
          </div>

          {sortedAnswers.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center text-[#9D9D9D]">
              <p className="text-base font-medium">
                아직 등록된 답변이 없습니다.
              </p>
              <p className="mt-1 text-base">첫 번째 답변을 작성해 보세요.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {sortedAnswers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  isQuestionOwner={isQuestionOwner}
                  anyAdopted={anyAdopted}
                  isAcceptPending={isAcceptPending}
                  confirmAcceptId={confirmAcceptId}
                  numericQuestionId={numericQuestionId}
                  isAuthenticated={isAuthenticated}
                  userId={userId}
                  onAccept={onAccept}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
