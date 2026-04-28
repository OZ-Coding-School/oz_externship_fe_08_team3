/**
 * @figma 질의응답 상세 페이지 - @https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-7744&m=dev
 */

import { useRef, useState, useMemo } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router'
import rehypeSanitize from 'rehype-sanitize'
import MDEditor from '@uiw/react-md-editor'
import { Button, Spinner } from '@/components'
import { ConfirmModal } from '@/components/common/Modal'
import { Toast } from '@/components/common/Toast'
import { AnswerForm } from '@/components/qna/AnswerForm'
import type { AnswerFormHandle } from '@/components/qna/AnswerForm'
import { useAuthStore } from '@/stores/authStore'
import { ANSWER_ALLOWED_ROLES } from '@/constants/roles'
import {
  usePostAnswer,
  useGetAnswers,
  usePutAnswer,
} from '@/features/qna/answers'
import { useAcceptAnswer } from '@/features/qna/answer-accept'
import { useGetQuestionDetail } from '@/features/qna/question-detail'
import { usePostComment } from '@/features/qna/answer-comments'
import type { AnswerComment } from '@/features/qna/answer-comments'
import { useToast } from '@/hooks/useToast'
import { formatDate } from '@/utils/formatDate'
import { handleApiError } from '@/utils/handleApiError'
import { ROUTES } from '@/constants/routes'

// ── 댓글 폼 ──────────────────────────────────────────────────────────────────

function CommentForm({
  answerId,
  questionId,
}: {
  answerId: number
  questionId: number
}) {
  const [content, setContent] = useState('')
  const { mutate, isPending } = usePostComment(answerId, questionId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    mutate({ content: content.trim() }, { onSuccess: () => setContent('') })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex items-start gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
        aria-label="댓글 입력"
        rows={2}
        disabled={isPending}
        className="border-border-base focus:border-primary flex-1 resize-none rounded-md border px-3 py-2 text-sm outline-none disabled:opacity-50"
      />
      <Button
        type="submit"
        size="sm"
        disabled={!content.trim() || isPending}
        loading={isPending}
      >
        등록
      </Button>
    </form>
  )
}

// ── 댓글 목록 ─────────────────────────────────────────────────────────────────

function CommentList({ comments }: { comments: AnswerComment[] }) {
  const sorted = useMemo(
    () =>
      [...comments].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    [comments]
  )

  if (sorted.length === 0) return null

  return (
    <ul className="border-border-base mt-4 space-y-2 border-t pt-4">
      {sorted.map((comment) => (
        <li key={comment.id} className="flex items-start gap-2 text-sm">
          <span className="text-text-heading shrink-0 font-medium">
            {comment.author.nickname}
          </span>
          <span className="text-text-body flex-1">{comment.content}</span>
          <time
            dateTime={comment.created_at}
            className="text-text-muted shrink-0 text-xs"
          >
            {formatDate(comment.created_at)}
          </time>
        </li>
      ))}
    </ul>
  )
}

// ── QnaDetailPage ─────────────────────────────────────────────────────────────

export function QnaDetailPage() {
  const { questionId } = useParams<{ questionId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { toast, showToast, hideToast } = useToast()

  const canAnswer =
    isAuthenticated &&
    user?.role != null &&
    ANSWER_ALLOWED_ROLES.includes(user.role)

  const [showForm, setShowForm] = useState(false)
  const [confirmAcceptId, setConfirmAcceptId] = useState<number | null>(null)
  const answerFormRef = useRef<AnswerFormHandle>(null)

  const numericQuestionId = questionId ? Number(questionId) : 0

  // ── hooks는 조건부 호출 불가 — early return은 아래에서 처리 ──────────────
  const {
    data: questionDetail,
    isLoading: isQuestionLoading,
    isError: isQuestionError,
  } = useGetQuestionDetail(numericQuestionId)

  const {
    data: answers,
    isLoading: isAnswersLoading,
    isError: isAnswersError,
  } = useGetAnswers(numericQuestionId)

  const { mutate: postAnswer, isPending: isPostPending } =
    usePostAnswer(numericQuestionId)

  const myAnswer = answers?.find(
    (a) => user?.id != null && a.author.id === user.id
  )
  const isEdit = !!myAnswer

  const { mutate: acceptAnswer, isPending: isAcceptPending } =
    useAcceptAnswer(numericQuestionId)

  const { mutate: putAnswer, isPending: isPutPending } = usePutAnswer(
    myAnswer?.id,
    numericQuestionId
  )

  const sortedAnswers = useMemo(
    () =>
      answers
        ? [...answers].sort((a, b) => {
            const byAdopted = Number(b.is_adopted) - Number(a.is_adopted)
            if (byAdopted !== 0) return byAdopted
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            )
          })
        : [],
    [answers]
  )
  // ──────────────────────────────────────────────────────────────────────────

  if (
    !questionId ||
    Number.isNaN(numericQuestionId) ||
    numericQuestionId <= 0
  ) {
    return <Navigate to={ROUTES.QNA.LIST} />
  }

  const questionTitle = questionDetail?.title ?? '질문 내용을 불러오는 중...'
  const anyAdopted = answers?.some((a) => a.is_adopted) ?? false
  const isQuestionOwner =
    user?.id != null && questionDetail?.author.id === user.id

  const handleCreateSubmit = (content: string, imageUrls: string[]) => {
    postAnswer(
      { content, img_urls: imageUrls },
      {
        onSuccess: () => {
          showToast('답변이 등록되었습니다.', 'success')
          setShowForm(false)
        },
        onError: (error) => {
          const { message, action } = handleApiError(
            error,
            {
              400: '유효하지 않은 답변 등록 요청입니다.',
              401: '로그인한 사용자만 답변을 작성할 수 있습니다.',
              403: '답변 작성 권한이 없습니다.',
              404: '해당 질문을 찾을 수 없습니다.',
            },
            {
              400: () => answerFormRef.current?.focusEditor(),
              401: () => navigate(ROUTES.AUTH.LOGIN),
              404: () => navigate(ROUTES.QNA.LIST),
            }
          )
          showToast(message, 'error')
          action?.()
        },
      }
    )
  }

  const handleEditSubmit = (content: string, imageUrls: string[]) => {
    if (!myAnswer) return
    putAnswer(
      { content, img_urls: imageUrls },
      {
        onSuccess: () => {
          localStorage.removeItem(`answer-draft-${myAnswer.id}`)
          showToast('모든 변경 사항이 저장되었습니다.', 'success')
          setShowForm(false)
        },
        onError: (error: unknown) => {
          const { message, action } = handleApiError(
            error,
            {
              400: '유효하지 않은 답변 수정 요청입니다.',
              401: '로그인한 사용자만 답변을 수정할 수 있습니다.',
              403: '본인이 작성한 답변만 수정할 수 있습니다.',
              404: '해당 답변을 찾을 수 없습니다.',
            },
            {
              400: () => answerFormRef.current?.focusEditor(),
              401: () => navigate(ROUTES.AUTH.LOGIN),
              403: () => navigate(-1),
              404: () => navigate(ROUTES.QNA.LIST),
            }
          )
          showToast(message, 'error')
          action?.()
        },
      }
    )
  }

  const handleConfirmAccept = () => {
    if (confirmAcceptId === null) return
    acceptAnswer(confirmAcceptId, {
      onSuccess: () => {
        showToast('답변이 채택되었습니다.', 'success')
        setConfirmAcceptId(null)
      },
      onError: (error) => {
        const { message, action } = handleApiError(
          error,
          {
            400: '유효하지 않은 답변 채택 요청입니다.',
            401: '로그인한 사용자만 답변을 채택할 수 있습니다.',
            403: '본인이 작성한 질문의 답변만 채택할 수 있습니다.',
            404: '해당 질문 또는 답변을 찾을 수 없습니다.',
            409: '이미 채택된 답변이 존재합니다.',
          },
          {
            401: () => navigate(ROUTES.AUTH.LOGIN),
            404: () => navigate(ROUTES.QNA.LIST),
          }
        )
        setConfirmAcceptId(null)
        showToast(message, 'error')
        action?.()
      },
    })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 질문 상세 */}
      <section className="border-border-base bg-bg-base rounded-lg border p-6">
        {isQuestionLoading && (
          <div className="flex justify-center py-10">
            <Spinner label="질문을 불러오는 중..." />
          </div>
        )}
        {isQuestionError && (
          <p className="text-error text-sm">
            질문을 불러오지 못했습니다. 다시 시도해 주세요.
          </p>
        )}
        {questionDetail && (
          <>
            {/* 카테고리 */}
            <span className="text-text-muted text-xs font-medium">
              {questionDetail.category.name}
            </span>

            {/* 제목 */}
            <h1 className="text-text-heading mt-1.5 text-xl leading-snug font-bold">
              {questionDetail.title}
            </h1>

            {/* 메타 정보 */}
            <div className="mt-3 flex items-center justify-between">
              <div className="text-text-muted flex flex-wrap items-center gap-1.5 text-sm">
                <span className="text-text-heading font-medium">
                  {questionDetail.author.nickname}
                </span>
                <span>·</span>
                <span>
                  {questionDetail.author.course_name}{' '}
                  {questionDetail.author.cohort_name}
                </span>
                <span>·</span>
                <time dateTime={questionDetail.created_at}>
                  {formatDate(questionDetail.created_at)}
                </time>
                <span>·</span>
                <span>조회 {questionDetail.view_count.toLocaleString()}</span>
              </div>
              {isQuestionOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigate(
                      ROUTES.QNA.EDIT.replace(
                        ':questionId',
                        String(numericQuestionId)
                      ),
                      { replace: true }
                    )
                  }
                >
                  수정
                </Button>
              )}
            </div>

            <hr className="border-border-base my-4" />

            {/* 본문 — 마크다운 렌더링 */}
            <div data-color-mode="light">
              <MDEditor.Markdown
                source={questionDetail.content}
                rehypePlugins={[rehypeSanitize]}
              />
            </div>

            {/* 첨부 이미지 */}
            {questionDetail.images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {questionDetail.images.map((img, idx) => (
                  <img
                    key={img.id}
                    src={img.img_url}
                    alt={`첨부 이미지 ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="max-h-64 rounded-md object-contain"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* 답변 목록 */}
      <section aria-labelledby="answers-heading" className="mt-8">
        {isAnswersLoading && (
          <div className="flex justify-center py-10">
            <Spinner label="답변을 불러오는 중..." />
          </div>
        )}
        {isAnswersError && (
          <p className="text-error text-sm">
            답변을 불러오지 못했습니다. 다시 시도해 주세요.
          </p>
        )}
        {!isAnswersLoading && !isAnswersError && answers && (
          <>
            <h2
              id="answers-heading"
              className="text-text-heading text-base font-semibold"
            >
              답변 {sortedAnswers.length}개
            </h2>

            {sortedAnswers.length === 0 ? (
              <div className="text-text-muted mt-6 flex flex-col items-center py-12 text-center">
                <p className="text-base font-medium">
                  아직 등록된 답변이 없습니다.
                </p>
                <p className="mt-1 text-sm">첫 번째 답변을 작성해 보세요.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-6">
                {sortedAnswers.map((answer) => (
                  <div
                    key={answer.id}
                    className={answer.is_adopted ? 'relative mt-4' : undefined}
                  >
                    {/* 채택 배지 — 카드 상단 테두리에 반 걸쳐서 표시 */}
                    {answer.is_adopted && (
                      <div
                        role="status"
                        aria-label="질문자가 채택한 답변"
                        className="bg-primary absolute top-0 left-3 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-bold text-white"
                      >
                        질문자 채택
                      </div>
                    )}

                    <article
                      className={[
                        'bg-bg-base rounded-lg border p-6',
                        answer.is_adopted
                          ? 'border-primary'
                          : 'border-border-base',
                      ].join(' ')}
                    >
                      {/* 작성자 정보 + 채택하기 버튼 */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-text-heading text-sm font-medium">
                            {answer.author.nickname}
                          </span>
                          <span className="text-text-muted text-xs">
                            {answer.author.course_name} ·{' '}
                            {answer.author.cohort_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <time
                            dateTime={answer.updated_at}
                            className="text-text-muted text-xs"
                          >
                            수정일: {formatDate(answer.updated_at)}
                          </time>
                          {/* 채택하기 — 질문 작성자 + 미채택 + 본인 답변 제외 */}
                          {isQuestionOwner &&
                            !anyAdopted &&
                            answer.author.id !== user?.id && (
                              <Button
                                size="sm"
                                type="button"
                                onClick={() => setConfirmAcceptId(answer.id)}
                                disabled={isAcceptPending}
                                loading={
                                  isAcceptPending &&
                                  confirmAcceptId === answer.id
                                }
                              >
                                채택하기
                              </Button>
                            )}
                        </div>
                      </div>

                      {/* 답변 내용 — 마크다운 렌더링 */}
                      <div data-color-mode="light">
                        <MDEditor.Markdown
                          source={answer.content}
                          rehypePlugins={[rehypeSanitize]}
                        />
                      </div>

                      {/* 댓글 목록 (오래된순 정렬) */}
                      <CommentList comments={answer.comments} />

                      {/* 댓글 폼 — 로그인 유저만 */}
                      {isAuthenticated && (
                        <CommentForm
                          answerId={answer.id}
                          questionId={numericQuestionId}
                        />
                      )}
                    </article>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* 답변 작성 / 수정 섹션 */}
      {canAnswer && !isAnswersLoading && !isAnswersError && (
        <div className="mt-6">
          {!showForm ? (
            <Button
              type="button"
              onClick={() => setShowForm(true)}
              disabled={isEdit && !!myAnswer?.is_adopted}
            >
              {isEdit ? '답변 수정하기' : '답변하기'}
            </Button>
          ) : isEdit ? (
            <AnswerForm
              ref={answerFormRef}
              questionTitle={questionTitle}
              onSubmit={handleEditSubmit}
              onCancel={() => setShowForm(false)}
              isLoading={isPutPending}
              mode="edit"
              initialContent={myAnswer.content}
              initialImgUrls={myAnswer.images.map((img) => img.img_url)}
              answerId={myAnswer.id}
            />
          ) : (
            <AnswerForm
              ref={answerFormRef}
              questionTitle={questionTitle}
              onSubmit={handleCreateSubmit}
              onCancel={() => setShowForm(false)}
              isLoading={isPostPending}
            />
          )}
        </div>
      )}

      {/* 채택 확인 모달 */}
      <ConfirmModal
        isOpen={confirmAcceptId !== null}
        onClose={() => setConfirmAcceptId(null)}
        message="이 답변을 채택하시겠습니까?"
        confirmLabel="채택"
        onConfirm={handleConfirmAccept}
      />

      {/* 토스트 알림 */}
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
