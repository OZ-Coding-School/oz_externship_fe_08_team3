import type { RefObject } from 'react'
import type { NavigateFunction } from 'react-router'
import type { AnswerFormHandle } from '@/components'
import type { ToastVariant } from '@/components'
import type { GetAnswerItem } from '@/features/qna/answers'
import { usePostAnswer, usePutAnswer } from '@/features/qna/answers'
import { useAcceptAnswer } from '@/features/qna/answer-accept'
import { handleApiError } from '@/utils/handleApiError'
import { ROUTES } from '@/constants/routes'

interface UseAnswerActionsParams {
  questionId: number
  myAnswer: GetAnswerItem | undefined
  navigate: NavigateFunction
  showToast: (message: string, variant: ToastVariant) => void
  setShowForm: (show: boolean) => void
  setConfirmAcceptId: (id: number | null) => void
  answerFormRef: RefObject<AnswerFormHandle | null>
  confirmAcceptId: number | null
}

/**
 * QnaDetailPage의 답변 생성/수정/채택 mutation 핸들러를 캡슐화한 훅
 */
export function useAnswerActions({
  questionId,
  myAnswer,
  navigate,
  showToast,
  setShowForm,
  setConfirmAcceptId,
  answerFormRef,
  confirmAcceptId,
}: UseAnswerActionsParams) {
  const { mutate: postAnswer, isPending: isPostPending } =
    usePostAnswer(questionId)

  const { mutate: putAnswer, isPending: isPutPending } = usePutAnswer(
    myAnswer?.id,
    questionId
  )

  const { mutate: acceptAnswer, isPending: isAcceptPending } =
    useAcceptAnswer(questionId)

  // 답변 생성
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

  // 답변 수정
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

  // 답변 채택
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

  return {
    handleCreateSubmit,
    handleEditSubmit,
    handleConfirmAccept,
    isPostPending,
    isPutPending,
    isAcceptPending,
  }
}
