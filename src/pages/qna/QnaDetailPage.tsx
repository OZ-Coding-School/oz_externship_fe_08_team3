/**
 * @figma 질의응답 상세 페이지 - @https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-7744&m=dev
 */

import { Fragment, useRef, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { ConfirmModal, Toast, AnswerForm } from '@/components'
import type { AnswerFormHandle } from '@/components'
import { QuestionDetail } from '@/components/qna/QuestionDetail'
import { AnswerSection } from '@/components/qna/AnswerSection'
import { AnswerPromptCard } from '@/components/qna/AnswerPromptCard'
import { useAuthStore } from '@/stores/authStore'
import { ANSWER_ALLOWED_ROLES } from '@/constants/roles'
import { useGetAnswers } from '@/features/qna/answers'
import { useGetQuestionDetail } from '@/features/qna/question-detail'
import { useToast } from '@/hooks/useToast'
import { ROUTES } from '@/constants/routes'
import { useAnswerActions } from './hooks/useAnswerActions'

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

  const myAnswer = answers?.find(
    (a) => user?.id != null && a.author.id === user.id
  )
  const isEdit = !!myAnswer

  const {
    handleCreateSubmit,
    handleEditSubmit,
    handleConfirmAccept,
    isPostPending,
    isPutPending,
    isAcceptPending,
  } = useAnswerActions({
    questionId: numericQuestionId,
    myAnswer,
    navigate,
    showToast,
    setShowForm,
    setConfirmAcceptId,
    answerFormRef,
    confirmAcceptId,
  })

  // React Compiler가 자동 메모이제이션 처리
  const sortedAnswers = answers
    ? [...answers].sort((a, b) => {
        const byAdopted = Number(b.is_adopted) - Number(a.is_adopted)
        if (byAdopted !== 0) return byAdopted
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      })
    : []

  if (
    !questionId ||
    Number.isNaN(numericQuestionId) ||
    numericQuestionId <= 0
  ) {
    return <Navigate to={ROUTES.QNA.LIST} />
  }

  const anyAdopted = answers?.some((a) => a.is_adopted) ?? false
  const isQuestionOwner =
    user?.id != null && questionDetail?.author.id === user.id

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
    <div className="mx-auto max-w-[944px] pt-[108px] pb-[200px]">
      {/* 브레드크럼 -- 대분류 > 중분류 > 소분류 */}
      {questionDetail && (
        <nav
          aria-label="breadcrumb"
          className="text-primary mb-10 flex items-center text-xl leading-normal font-bold tracking-[-0.03em]"
        >
          {questionDetail.category.names.map((name, i) => (
            <Fragment key={i}>
              {i > 0 && (
                <ChevronRight className="mx-1 h-5 w-5" strokeWidth={2} />
              )}
              <span>{name}</span>
            </Fragment>
          ))}
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

      {/* 답변 유도 카드 / 답변 작성/수정 폼 */}
      {canAnswer &&
        !isAnswersLoading &&
        !isAnswersError &&
        (showForm ? (
          <div className="mt-[100px] overflow-hidden rounded-[20px] border border-[#CECECE] bg-white">
            <AnswerPromptCard
              nickname={user?.nickname ?? ''}
              profileImageUrl={user?.profileImage}
              isEdit={isEdit}
              disabled={anyAdopted}
              asCardHeader
              showForm
              isLoading={isEdit ? isPutPending : isPostPending}
              onSubmit={() => answerFormRef.current?.submit()}
            />
            {isEdit ? (
              <AnswerForm
                ref={answerFormRef}
                onSubmit={handleEditSubmit}
                isLoading={isPutPending}
                mode="edit"
                initialContent={myAnswer.content}
                initialImgUrls={myAnswer.images.map((img) => img.img_url)}
                answerId={myAnswer.id}
              />
            ) : (
              <AnswerForm
                ref={answerFormRef}
                onSubmit={handleCreateSubmit}
                isLoading={isPostPending}
              />
            )}
          </div>
        ) : (
          <AnswerPromptCard
            nickname={user?.nickname ?? ''}
            profileImageUrl={user?.profileImage}
            isEdit={isEdit}
            disabled={anyAdopted}
            onAction={() => setShowForm(true)}
          />
        ))}

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
