/**
 * @figma 질의응답 상세 페이지 - @https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-7744&m=dev
 */

import { useState, useRef } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router'
import axios from 'axios'
import { Markdown } from '@uiw/react-md-editor'
import { Button } from '@/components/common/Button'
import { Toast } from '@/components/common/Toast'
import { AnswerForm } from '@/components/qna/AnswerForm'
import type { AnswerFormHandle } from '@/components/qna/AnswerForm'
import { useAuthStore, ANSWER_ALLOWED_ROLES } from '@/stores/authStore'
import { usePostAnswer, useGetAnswers } from '@/features/qna/answers'
import { usePutAnswer } from '@/features/qna/answer-edit'
import { useGetQuestionDetail } from '@/features/qna/question-detail'
import { ROUTES } from '@/constants/routes'

type ToastState =
  | { visible: false }
  | {
      visible: true
      message: string
      variant: 'success' | 'error' | 'info' | 'warning'
    }

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function QnaDetailPage() {
  const { questionId } = useParams<{ questionId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()

  // RBAC: 로그인 + 허용 role인 경우에만 답변 버튼 노출
  const canAnswer =
    isAuthenticated &&
    user?.role != null &&
    ANSWER_ALLOWED_ROLES.includes(user.role)

  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<ToastState>({ visible: false })
  const answerFormRef = useRef<AnswerFormHandle>(null)

  const numericQuestionId = questionId ? Number(questionId) : 0

  // hooks는 조건부 호출 불가 — questionId 없을 때 0으로 fallback 후 early return
  const { data: questionDetail } = useGetQuestionDetail(numericQuestionId)
  const { data: answers } = useGetAnswers(numericQuestionId)
  const { mutate: postAnswer, isPending: isPostPending } =
    usePostAnswer(numericQuestionId)

  const questionTitle = questionDetail?.title ?? '질문 내용을 불러오는 중...'

  // 현재 로그인 유저가 작성한 답변 찾기
  const myAnswer = answers?.find(
    (a) => user?.id != null && a.author.id === user.id
  )
  const isEdit = !!myAnswer

  const { mutate: putAnswer, isPending: isPutPending } = usePutAnswer(
    myAnswer?.id ?? 0,
    numericQuestionId
  )

  if (!questionId) return <Navigate to={ROUTES.QNA.LIST} />

  const showToast = (
    message: string,
    variant: 'success' | 'error' | 'info' | 'warning'
  ) => {
    setToast({ visible: true, message, variant })
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
          if (axios.isAxiosError(error)) {
            const status = error.response?.status
            if (status === 400) {
              showToast('유효하지 않은 답변 등록 요청입니다.', 'error')
              answerFormRef.current?.focusEditor()
            } else if (status === 401) {
              showToast('로그인한 사용자만 답변을 작성할 수 있습니다.', 'error')
              navigate(ROUTES.AUTH.LOGIN ?? '/')
            } else if (status === 403) {
              showToast('답변 작성 권한이 없습니다.', 'error')
            } else if (status === 404) {
              showToast('해당 질문을 찾을 수 없습니다.', 'error')
              navigate(ROUTES.QNA.LIST)
            } else {
              showToast(
                '일시적인 오류가 발생했습니다. 다시 시도해 주세요.',
                'error'
              )
            }
          } else {
            showToast(
              '일시적인 오류가 발생했습니다. 다시 시도해 주세요.',
              'error'
            )
          }
        },
      }
    )
  }

  const handleEditSubmit = (content: string, imageUrls: string[]) => {
    putAnswer(
      { content, img_urls: imageUrls },
      {
        onSuccess: () => {
          if (myAnswer) {
            localStorage.removeItem(`answer-draft-${myAnswer.id}`)
          }
          showToast('모든 변경 사항이 저장되었습니다.', 'success')
          setShowForm(false)
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            const status = error.response?.status
            if (status === 400) {
              showToast('유효하지 않은 답변 수정 요청입니다.', 'error')
              answerFormRef.current?.focusEditor()
            } else if (status === 401) {
              showToast('로그인한 사용자만 답변을 수정할 수 있습니다.', 'error')
              navigate(ROUTES.AUTH.LOGIN ?? '/')
            } else if (status === 403) {
              showToast('본인이 작성한 답변만 수정할 수 있습니다.', 'error')
              navigate(-1)
            } else if (status === 404) {
              showToast('해당 답변을 찾을 수 없습니다.', 'error')
              navigate(ROUTES.QNA.LIST)
            } else {
              showToast(
                '일시적인 오류가 발생했습니다. 다시 시도해 주세요.',
                'error'
              )
            }
          } else {
            showToast(
              '일시적인 오류가 발생했습니다. 다시 시도해 주세요.',
              'error'
            )
          }
        },
      }
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 질문 상세 영역 (추후 구현) */}
      <div className="border-border-base bg-bg-base rounded-lg border p-6">
        <p className="text-text-muted">질의응답 상세</p>
      </div>

      {/* 답변 목록 */}
      {answers && answers.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-text-heading text-base font-semibold">
            답변 {answers.length}개
          </h2>
          {answers.map((answer) => (
            <div
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
                    {answer.author.course_name} · {answer.author.cohort_name}
                  </span>
                </div>
                <span className="text-text-muted text-xs">
                  수정일: {formatDate(answer.updated_at)}
                </span>
              </div>

              {/* 답변 내용 (마크다운 렌더링) */}
              <div data-color-mode="light">
                <Markdown source={answer.content} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 답변 섹션 */}
      {canAnswer && (
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
          onClose={() => setToast({ visible: false })}
        />
      )}
    </div>
  )
}
