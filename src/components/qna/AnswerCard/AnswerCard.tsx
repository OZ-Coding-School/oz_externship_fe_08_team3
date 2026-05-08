import type { GetAnswerItem } from '@/features/qna/answers'
import { MarkdownViewer } from '@/components/qna/MarkdownViewer'
import { UserAvatar } from '@/components/common/UserAvatar'
import { CommentForm } from '@/components/qna/CommentForm'
import { CommentList } from '@/components/qna/CommentList'
import { getRelativeTime } from '@/utils/relativeTime'

interface AnswerCardProps {
  answer: GetAnswerItem
  isQuestionOwner: boolean
  anyAdopted: boolean
  isAcceptPending: boolean
  confirmAcceptId: number | null
  numericQuestionId: number
  isAuthenticated: boolean
  userId: number | null | undefined
  onAccept: (answerId: number) => void
  showForm: boolean
  onEditAction: () => void
}

export function AnswerCard({
  answer,
  isQuestionOwner,
  anyAdopted,
  isAcceptPending,
  confirmAcceptId,
  numericQuestionId,
  isAuthenticated,
  userId,
  onAccept,
  showForm,
  onEditAction,
}: AnswerCardProps) {
  const canShowAcceptButton =
    isQuestionOwner && !anyAdopted && answer.author.id !== userId

  // 본인 답변이고 폼이 닫혀 있을 때만 수정 버튼 표시
  const canShowEditButton =
    userId != null && answer.author.id === userId && !showForm

  return (
    <article className="rounded-[20px] border border-[#CECECE] px-[38px] py-11">
      {/* 카드 헤더: 프로필 (좌) / 채택 라벨·버튼 (우) */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <UserAvatar
            size="lg"
            profileImageUrl={answer.author.profile_image_url}
            nickname={answer.author.nickname}
          />
          <div>
            <p className="text-base leading-normal font-bold tracking-[-0.03em] text-[#4D4D4D]">
              {answer.author.nickname}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs leading-normal tracking-[-0.03em] text-[#9D9D9D]">
              <span>
                {answer.author.course_name} &lt;{answer.author.cohort_name}&gt;
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {answer.is_adopted && (
            <span className="text-primary text-xs font-bold tracking-[-0.03em]">
              채택된 답변
            </span>
          )}
          {canShowAcceptButton && (
            <button
              type="button"
              onClick={() => onAccept(answer.id)}
              disabled={isAcceptPending}
              className="bg-primary h-12 w-[112px] shrink-0 rounded-full text-base font-semibold text-white transition-colors hover:bg-[#3B0186] disabled:cursor-not-allowed disabled:bg-[#ECECEC] disabled:text-[#BDBDBD]"
            >
              {isAcceptPending && confirmAcceptId === answer.id
                ? '채택 중...'
                : '채택하기'}
            </button>
          )}
          {canShowEditButton && (
            <button
              type="button"
              onClick={onEditAction}
              className="h-12 w-[112px] shrink-0 rounded-full border border-[#6201E0] bg-[#EFE6FC] text-base font-semibold text-[#6201E0] transition-colors hover:bg-[#E0CFFA]"
            >
              답변 수정하기
            </button>
          )}
        </div>
      </div>

      {/* 답변 본문 */}
      <div className="text-base leading-normal tracking-[-0.03em] text-[#121212]">
        <MarkdownViewer content={answer.content} />
      </div>

      {/* 하단: 시간 + 디바이더 */}
      <div className="flex justify-end border-b border-[#CECECE] pt-8 pb-5">
        <time
          dateTime={answer.updated_at}
          className="text-base leading-normal tracking-[-0.03em] text-[#9D9D9D]"
        >
          {getRelativeTime(answer.updated_at)}
        </time>
      </div>

      {/* 댓글 입력 (먼저) → 댓글 목록 (나중) — Figma 순서 */}
      {isAuthenticated && (
        <CommentForm answerId={answer.id} questionId={numericQuestionId} />
      )}

      <CommentList comments={answer.comments} />
    </article>
  )
}
