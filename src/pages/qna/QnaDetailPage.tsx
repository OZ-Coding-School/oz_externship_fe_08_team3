/**
 * @figma 질의응답 상세 페이지 - @https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-7744&m=dev
 */

import { useRef, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router'
import axios from 'axios'
import rehypeSanitize from 'rehype-sanitize'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/common/Button'
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
import { useGetQuestionDetail } from '@/features/qna/question-detail'
import { useToast } from '@/hooks/useToast'
import { formatDate } from '@/utils/formatDate'
import { ROUTES } from '@/constants/routes'

function handleApiError(
  error: unknown,
  messages: Partial<Record<number, string>>,
  actions?: Partial<Record<number, () => void>>
) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status != null && messages[status] != null) {
      actions?.[status]?.()
      return messages[status]!
    }
  }
  return '일시적인 오류가 발생했습니다. 다시 시도해 주세요.'
}

export function QnaDetailPage() {
  const { questionId } = useParams<{ questionId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { toast, showToast, hideToast } = useToast()

  // RBAC: 로그인 + 허용 role인 경우에만 답변 버튼 노출
  const canAnswer =
    isAuthenticated &&
    user?.role != null &&
    ANSWER_ALLOWED_ROLES.includes(user.role)

  const [showForm, setShowForm] = useState(false)
  const answerFormRef = useRef<AnswerFormHandle>(null)

  const numericQuestionId = questionId ? Number(questionId) : 0

  // hooks는 조건부 호출 불가 — questionId 없거나 NaN일 때 early return은 hooks 아래에서 처리
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

  const questionTitle = questionDetail?.title ?? '질문 내용을 불러오는 중...'

  // 현재 로그인 유저가 작성한 답변 찾기
  const myAnswer = answers?.find(
    (a) => user?.id != null && a.author.id === user.id
  )
  const isEdit = !!myAnswer

  const { mutate: putAnswer, isPending: isPutPending } = usePutAnswer(
    myAnswer?.id,
    numericQuestionId
  )

  if (!questionId || Number.isNaN(numericQuestionId)) {
    return <Navigate to={ROUTES.QNA.LIST} />
  }

  const handleCreateSubmit = (content: string, imageUrls: string[]) => {
    postAnswer(
      { content, img_urls: imageUrls },
      {
        onSuccess: () => {
          showToast('답변이 등록되었습니다.', 'success')
          setShowForm(false)
        },
        onError: (error) => {
          const message = handleApiError(
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
          const message = handleApiError(
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
        },
      }
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 질문 상세 영역 (추후 구현) */}
      <div className="border-border-base bg-bg-base rounded-lg border p-6">
        {isQuestionLoading && (
          <p className="text-text-muted text-sm">질문을 불러오는 중...</p>
        )}
        {isQuestionError && (
          <p className="text-error text-sm">
            질문을 불러오지 못했습니다. 다시 시도해 주세요.
          </p>
        )}
        {!isQuestionLoading && !isQuestionError && (
          <p className="text-text-muted">질의응답 상세</p>
        )}
      </div>

      {/* 답변 목록 */}
      <section aria-labelledby="answers-heading" className="mt-6">
        {isAnswersLoading && (
          <p className="text-text-muted text-sm">답변을 불러오는 중...</p>
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
              답변 {answers.length}개
            </h2>

            {answers.length === 0 ? (
              <p className="text-text-muted mt-4 text-center text-sm">
                아직 등록된 답변이 없습니다.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {answers.map((answer) => (
                  <article
                    key={answer.id}
                    className="border-border-base bg-bg-base rounded-lg border p-6"
                  >
                    {/* 작성자 정보 + 수정 시각 */}
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
                      <time
                        dateTime={answer.updated_at}
                        className="text-text-muted text-xs"
                      >
                        수정일: {formatDate(answer.updated_at)}
                      </time>
                    </div>

                    {/* 답변 내용 (마크다운 렌더링) */}
                    <div data-color-mode="light">
                      <MDEditor.Markdown
                        source={answer.content}
                        rehypePlugins={[rehypeSanitize]}
                      />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* 답변 섹션 */}
      {canAnswer && !isAnswersLoading && (
        <div className="mt-6">
          {!showForm ? (
            <Button onClick={() => setShowForm(true)}>
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
