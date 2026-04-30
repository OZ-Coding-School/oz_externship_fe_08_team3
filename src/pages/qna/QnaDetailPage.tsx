/**
 * @figma 질의응답 상세 페이지 - @https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-7744&m=dev
 */

import { useRef, useState, useMemo } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router'
import { Button, ConfirmModal, Toast, AnswerForm } from '@/components'
import type { AnswerFormHandle } from '@/components'
import { QuestionDetail } from '@/components/qna/QuestionDetail'
import { AnswerSection } from '@/components/qna/AnswerSection'
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
import { handleApiError } from '@/utils/handleApiError'
import { ROUTES } from '@/constants/routes'

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

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => showToast('링크가 복사되었습니다.', 'success'))
      .catch(() => showToast('링크 복사에 실패했습니다.', 'error'))
  }

  const handleEdit = () => {
    navigate(
      ROUTES.QNA.EDIT.replace(':questionId', String(numericQuestionId)),
      { replace: true }
    )
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
      <QuestionDetail
        questionDetail={questionDetail}
        isLoading={isQuestionLoading}
        isError={isQuestionError}
        isQuestionOwner={isQuestionOwner}
        isAuthenticated={isAuthenticated}
        onShare={handleShare}
        onEdit={handleEdit}
        showToast={showToast}
      />

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
      <AnswerSection
        sortedAnswers={sortedAnswers}
        isLoading={isAnswersLoading}
        isError={isAnswersError}
        isQuestionOwner={isQuestionOwner}
        anyAdopted={anyAdopted}
        isAcceptPending={isAcceptPending}
        confirmAcceptId={confirmAcceptId}
        numericQuestionId={numericQuestionId}
        isAuthenticated={isAuthenticated}
        userId={user?.id}
        answers={answers}
        onAccept={setConfirmAcceptId}
      />

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
