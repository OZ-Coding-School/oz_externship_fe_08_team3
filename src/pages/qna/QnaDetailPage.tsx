/**
 * @figma 질의응답 상세 페이지 - @https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-7744&m=dev
 */

import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router'
import axios from 'axios'
import { Button } from '@/components/common/Button'
import { Toast } from '@/components/common/Toast'
import { AnswerForm } from '@/components/qna/AnswerForm'
import { useAuthStore } from '@/stores/authStore'
import { usePostAnswer } from '@/features/qna/answers'
import { ROUTES } from '@/constants/routes'

type ToastState =
  | { visible: false }
  | {
      visible: true
      message: string
      variant: 'success' | 'error' | 'info' | 'warning'
    }

export function QnaDetailPage() {
  const { questionId } = useParams<{ questionId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<ToastState>({ visible: false })

  // hooks는 조건부 호출 불가 — questionId 없을 때 0으로 fallback 후 early return
  const { mutate: postAnswer, isPending } = usePostAnswer(
    questionId ? Number(questionId) : 0
  )

  if (!questionId) return <Navigate to={ROUTES.QNA.LIST} />

  const showToast = (
    message: string,
    variant: 'success' | 'error' | 'info' | 'warning'
  ) => {
    setToast({ visible: true, message, variant })
  }

  const handleSubmit = (content: string, imageUrls: string[]) => {
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 질문 상세 영역 (추후 구현) */}
      <div className="border-border-base bg-bg-base rounded-lg border p-6">
        <p className="text-text-muted">질의응답 상세</p>
      </div>

      {/* 답변 등록 섹션 */}
      {isAuthenticated && (
        <div className="mt-6">
          {!showForm ? (
            <Button onClick={() => setShowForm(true)}>답변하기</Button>
          ) : (
            <AnswerForm
              // TODO: question-detail 구현 후 실제 질문 제목으로 교체
              questionTitle="질문 내용을 불러오는 중..."
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              isLoading={isPending}
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
