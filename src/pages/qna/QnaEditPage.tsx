/**
 * @figma 질문 수정  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-9246&m=dev
 */
import { Suspense } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { QuestionForm, AlertModal } from '@/components'
import { useQnaCategories } from '@/features/qna/categories'
import {
  useSuspenseGetQuestionDetail,
  useUpdateQuestion,
} from '@/features/qna/question-edit'
import type { GetQuestionDetailResponse } from '@/features/qna/question-detail'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'
import { ROUTES } from '@/constants/routes'
import { extractImageUrls } from '@/utils/extractImageUrls'

interface QnaEditFormInnerProps {
  questionId: number
  question: GetQuestionDetailResponse
}

function QnaEditFormInner({ questionId, question }: QnaEditFormInnerProps) {
  const navigate = useNavigate()
  const { mutate: updateQuestion, isPending } = useUpdateQuestion(questionId)
  const [alertMessage, setAlertMessage] = useState('')

  const handleSubmit = (data: {
    categoryId: number
    title: string
    content: string
  }) => {
    updateQuestion(
      {
        category_id: data.categoryId,
        title: data.title,
        content: data.content,
        image_urls: extractImageUrls(data.content),
      },
      {
        onSuccess: () => {
          navigate(ROUTES.QNA.DETAIL.replace(':questionId', String(questionId)))
        },
        onError: () => {
          setAlertMessage('질문 수정에 실패했습니다. 다시 시도해 주세요.')
        },
      }
    )
  }

  return (
    <>
      <QuestionForm
        initialValues={{
          title: question.title,
          content: question.content,
          categoryId: question.category.id,
        }}
        isPending={isPending}
        submitLabel="수정하기"
        onSubmit={handleSubmit}
        onCancel={() =>
          navigate(ROUTES.QNA.DETAIL.replace(':questionId', String(questionId)))
        }
      />
      <AlertModal
        isOpen={alertMessage !== ''}
        onClose={() => setAlertMessage('')}
        message={alertMessage}
      />
    </>
  )
}

function QnaEditForm({ questionId }: { questionId: number }) {
  const currentUser = useAuthStore((state) => state.user)
  useQnaCategories()
  const { data: question } = useSuspenseGetQuestionDetail(questionId)

  const isOwner =
    currentUser?.id !== undefined && currentUser.id === question.author.id

  if (!isOwner) {
    return (
      <Navigate
        to={ROUTES.QNA.DETAIL.replace(':questionId', String(questionId))}
        replace
      />
    )
  }

  return <QnaEditFormInner questionId={questionId} question={question} />
}

export function QnaEditPage() {
  const { questionId: questionIdParam } = useParams<{ questionId: string }>()
  const questionId = Number(questionIdParam)

  if (!questionIdParam || Number.isNaN(questionId)) {
    return <Navigate to={ROUTES.QNA.LIST} replace />
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-text-heading mb-8 text-2xl font-bold">질문 수정</h1>
      <Suspense
        fallback={
          <div className="text-text-muted flex h-40 items-center justify-center">
            로딩 중...
          </div>
        }
      >
        <QnaEditForm questionId={questionId} />
      </Suspense>
    </div>
  )
}
