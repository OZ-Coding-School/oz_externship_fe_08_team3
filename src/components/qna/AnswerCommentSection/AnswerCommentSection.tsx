import { useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { AlertModal } from '@/components/common/Modal'
import { Toast } from '@/components/common/Toast'
import { Button } from '@/components/common/Button'
import { useToast } from '@/hooks/useToast'
import { formatDate } from '@/utils/formatDate'
import { handleApiError } from '@/utils/handleApiError'
import { usePostAnswerComment } from '@/features/qna/answer-comments'
import type { AnswerCommentItem } from '@/features/qna/answer-comments'
import { ROUTES } from '@/constants/routes'

const MAX_COMMENT_LENGTH = 500

type SortOrder = 'latest' | 'oldest'

export interface AnswerCommentSectionProps {
  answerId: number
  questionId: number
  initialComments: AnswerCommentItem[]
  isAuthenticated: boolean
}

export function AnswerCommentSection({
  answerId,
  questionId,
  initialComments,
  isAuthenticated,
}: AnswerCommentSectionProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast, showToast, hideToast } = useToast()

  const [content, setContent] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')
  const [showLoginModal, setShowLoginModal] = useState(false)

  const { mutate: postComment, isPending } = usePostAnswerComment(
    answerId,
    questionId
  )

  const isOverLimit = content.length > MAX_COMMENT_LENGTH
  const sortedComments = useMemo(() => {
    const sorted = [...initialComments].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    return sortOrder === 'latest' ? sorted.reverse() : sorted
  }, [initialComments, sortOrder])

  const handleTextareaClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
    }
  }

  const handleSubmit = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }
    if (!content.trim()) {
      showToast('내용을 입력해 주세요.', 'error')
      textareaRef.current?.focus()
      return
    }
    if (isOverLimit) {
      showToast(`최대 ${MAX_COMMENT_LENGTH}자까지 입력 가능합니다.`, 'error')
      return
    }

    postComment(
      { content: content.trim() },
      {
        onSuccess: () => {
          setContent('')
        },
        onError: (error) => {
          const { message, action } = handleApiError(
            error,
            {
              400: `최대 ${MAX_COMMENT_LENGTH}자까지 입력 가능합니다.`,
              401: '로그인 후 이용 가능합니다.',
              403: '댓글 작성 권한이 없습니다.',
              404: '해당 답변을 찾을 수 없습니다.',
            },
            {
              401: () => setShowLoginModal(true),
              403: () => setShowLoginModal(true),
              404: () => {
                queryClient.invalidateQueries({
                  queryKey: ['answers', questionId],
                })
              },
            }
          )
          showToast(message, 'error')
          action?.()
        },
      }
    )
  }

  return (
    <div className="border-border-base mt-4 border-t pt-4">
      {/* 댓글 헤더: 개수 + 정렬 필터 */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-text-heading text-sm font-medium">
          댓글 {initialComments.length}개
        </span>
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setSortOrder('latest')}
            className={`rounded px-2 py-1 transition-colors ${
              sortOrder === 'latest'
                ? 'text-primary font-semibold'
                : 'text-text-muted hover:text-text-body'
            }`}
          >
            최신순
          </button>
          <span className="text-border-base">|</span>
          <button
            type="button"
            onClick={() => setSortOrder('oldest')}
            className={`rounded px-2 py-1 transition-colors ${
              sortOrder === 'oldest'
                ? 'text-primary font-semibold'
                : 'text-text-muted hover:text-text-body'
            }`}
          >
            등록순
          </button>
        </div>
      </div>

      {/* 댓글 리스트 */}
      {sortedComments.length > 0 && (
        <ul className="mb-4 space-y-3">
          {sortedComments.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              {comment.author.profile_image_url ? (
                <img
                  src={comment.author.profile_image_url}
                  alt={comment.author.nickname}
                  className="h-7 w-7 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="h-7 w-7 shrink-0 rounded-full bg-gray-200" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-text-heading text-xs font-medium">
                    {comment.author.nickname}
                  </span>
                  <time
                    dateTime={comment.created_at}
                    className="text-text-muted text-xs"
                  >
                    {formatDate(comment.created_at)}
                  </time>
                </div>
                <p className="text-text-body mt-0.5 text-sm break-words">
                  {comment.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 댓글 입력 영역 */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onClick={handleTextareaClick}
            readOnly={!isAuthenticated}
            maxLength={MAX_COMMENT_LENGTH}
            placeholder={
              isAuthenticated
                ? '댓글을 입력해 주세요. (최대 500자)'
                : '로그인 후 댓글을 작성할 수 있습니다.'
            }
            rows={3}
            className={`placeholder:text-text-muted focus:ring-primary/30 w-full resize-none rounded-md border px-3 py-2 text-sm transition-colors outline-none focus:ring-2 ${
              isOverLimit
                ? 'border-error focus:border-error'
                : 'border-border-base focus:border-primary'
            } ${!isAuthenticated ? 'bg-bg-subtle cursor-pointer' : 'bg-bg-base'}`}
          />
          <span
            className={`absolute right-3 bottom-2 text-xs ${
              isOverLimit ? 'text-error font-semibold' : 'text-text-muted'
            }`}
          >
            {content.length}/{MAX_COMMENT_LENGTH}
          </span>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isPending}
            loading={isPending}
          >
            등록
          </Button>
        </div>
      </div>

      {/* 비로그인 모달 */}
      <AlertModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="로그인 후 이용 가능합니다."
        confirmLabel="로그인하러 가기"
        onConfirm={() => navigate(ROUTES.AUTH.LOGIN)}
      />

      {/* 토스트 */}
      {toast.visible && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={hideToast}
        />
      )}
    </div>
  )
}
