import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import type { GetAnswerItem } from '@/features/qna/answers'
import { Button } from '@/components/common/Button'
import { UserAvatar } from '@/components/common/UserAvatar'
import { CommentList } from '@/components/qna/CommentList'
import { CommentForm } from '@/components/qna/CommentForm'
import { formatDate } from '@/utils/formatDate'

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
}: AnswerCardProps) {
  const canShowAcceptButton =
    isQuestionOwner && !anyAdopted && answer.author.id !== userId

  return (
    <div className={answer.is_adopted ? 'relative mt-4' : undefined}>
      {answer.is_adopted && (
        <div
          aria-label="질문자가 채택한 답변"
          className="bg-primary absolute top-0 left-3 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-bold text-white"
        >
          질문자 채택
        </div>
      )}

      <article
        className={[
          'bg-bg-base rounded-lg border p-6',
          answer.is_adopted ? 'border-primary' : 'border-border-base',
        ].join(' ')}
      >
        {/* 카드 헤더: 프로필 좌측 / 채택 버튼 우측 */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <UserAvatar
              profileImageUrl={answer.author.profile_image_url}
              nickname={answer.author.nickname}
            />
            <div>
              <span className="text-text-heading text-sm font-medium">
                {answer.author.nickname}
              </span>
              <span className="text-text-muted ml-1 text-xs">
                {answer.author.course_name} · {answer.author.cohort_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <time
              dateTime={answer.updated_at}
              className="text-text-muted text-xs"
            >
              수정일: {formatDate(answer.updated_at)}
            </time>
            {canShowAcceptButton && (
              <Button
                size="sm"
                type="button"
                onClick={() => onAccept(answer.id)}
                disabled={isAcceptPending}
                loading={isAcceptPending && confirmAcceptId === answer.id}
              >
                채택하기
              </Button>
            )}
          </div>
        </div>

        <div data-color-mode="light">
          <MDEditor.Markdown
            source={answer.content}
            rehypePlugins={[rehypeSanitize]}
          />
        </div>

        <CommentList comments={answer.comments} />

        {isAuthenticated && (
          <CommentForm answerId={answer.id} questionId={numericQuestionId} />
        )}
      </article>
    </div>
  )
}
