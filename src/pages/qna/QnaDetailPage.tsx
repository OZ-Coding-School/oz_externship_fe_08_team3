/**
 * @figma 질의응답 상세 페이지 - @https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-7744&m=dev
 */

import { useRef, useState, useMemo } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router'
import rehypeSanitize from 'rehype-sanitize'
import MDEditor from '@uiw/react-md-editor'
import {
  Button,
  Spinner,
  ConfirmModal,
  Toast,
  AnswerForm,
  AnswerCard,
} from '@/components'
import type { AnswerFormHandle } from '@/components'
import { useAuthStore } from '@/stores/authStore'
import { ANSWER_ALLOWED_ROLES } from '@/constants/roles'
import {
  usePostAnswer,
  useGetAnswers,
  usePutAnswer,
} from '@/features/qna/answers'
import { useAcceptAnswer } from '@/features/qna/answer-accept'
import { useGetQuestionDetail } from '@/features/qna/question-detail'
import { useToast } from '@/hooks/useToast'
import { formatDate } from '@/utils/formatDate'
import { handleApiError } from '@/utils/handleApiError'
import { ROUTES } from '@/constants/routes'

// ── 아이콘 ────────────────────────────────────────────────────────────────────

function LinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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
      {/* Breadcrumb */}
      {questionDetail && (
        <nav
          aria-label="breadcrumb"
          className="mb-4 flex items-center gap-1.5 text-sm"
        >
          <Link
            to={ROUTES.QNA.LIST}
            className="text-text-muted hover:text-primary transition-colors"
          >
            Q&amp;A
          </Link>
          <span className="text-text-muted">›</span>
          <span className="text-text-body font-medium">
            {questionDetail.category.name}
          </span>
        </nav>
      )}

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
            {/* 제목 행: Q아이콘 + 제목 + 작성자 프로필 */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-2">
                <span className="bg-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                  Q
                </span>
                <h1 className="text-text-heading text-xl leading-snug font-bold">
                  {questionDetail.title}
                </h1>
              </div>

              {/* 작성자 프로필 — 우측 */}
              <div className="flex shrink-0 items-center gap-2">
                {questionDetail.author.profile_image_url ? (
                  <img
                    src={questionDetail.author.profile_image_url}
                    alt={questionDetail.author.nickname}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-bg-subtle text-text-body flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                    {[...questionDetail.author.nickname][0] ?? '?'}
                  </div>
                )}
                <div className="text-right">
                  <p className="text-text-heading text-sm leading-tight font-medium">
                    {questionDetail.author.nickname}
                  </p>
                  <p className="text-text-muted text-xs">
                    {questionDetail.author.course_name} ·{' '}
                    {questionDetail.author.cohort_name}
                  </p>
                </div>
              </div>
            </div>

            {/* 메타 정보 행: 조회수 · 시간 좌측 / 버튼 우측 */}
            <div className="mt-2 flex items-center justify-between">
              <div className="text-text-muted flex flex-wrap items-center gap-1.5 text-sm">
                <span>조회 {questionDetail.view_count.toLocaleString()}</span>
                <span>·</span>
                <time dateTime={questionDetail.created_at}>
                  {formatDate(questionDetail.created_at)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(window.location.href)
                      .then(() =>
                        showToast('링크가 복사되었습니다.', 'success')
                      )
                      .catch(() =>
                        showToast('링크 복사에 실패했습니다.', 'error')
                      )
                  }}
                  className="text-text-muted hover:text-primary flex items-center gap-1 text-sm transition-colors"
                >
                  <LinkIcon />
                  공유하기
                </button>
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

            {/* AI 챗봇 답변 미리보기 박스 */}
            <div className="bg-primary-50 border-primary-200 mt-6 flex items-center justify-between rounded-lg border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-primary">
                  <RobotIcon />
                </span>
                <span className="text-primary text-sm font-medium">
                  질문에 대한 AI 질의응답 챗봇 답변 보기
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.CHATBOT.HOME)}
                className="text-primary text-sm font-semibold"
              >
                ▼
              </button>
            </div>
          </>
        )}
      </section>

      {/* 답변하기 버튼 */}
      {canAnswer && !isAnswersLoading && !isAnswersError && !showForm && (
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={() => setShowForm(true)}
            disabled={anyAdopted}
          >
            {isEdit ? '답변 수정하기' : '답변하기'}
          </Button>
        </div>
      )}

      {/* 답변 작성 / 수정 폼 */}
      {canAnswer && !isAnswersLoading && !isAnswersError && showForm && (
        <div className="mt-4">
          {isEdit ? (
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
            {/* A 아이콘 + 답변 수 */}
            <div className="flex items-center gap-2">
              <span className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
                A
              </span>
              <h2
                id="answers-heading"
                className="text-text-heading text-base font-semibold"
              >
                {sortedAnswers.length}개의 답변이 있어요
              </h2>
            </div>

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
                  <AnswerCard
                    key={answer.id}
                    answer={answer}
                    isQuestionOwner={isQuestionOwner}
                    anyAdopted={anyAdopted}
                    isAcceptPending={isAcceptPending}
                    confirmAcceptId={confirmAcceptId}
                    numericQuestionId={numericQuestionId}
                    isAuthenticated={isAuthenticated}
                    userId={user?.id}
                    onAccept={setConfirmAcceptId}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

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
