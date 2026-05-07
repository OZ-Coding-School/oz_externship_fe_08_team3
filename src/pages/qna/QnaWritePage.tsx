/**
 * @figma 질문 등록페이지 (내용O)  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-9533&m=dev
 * @figma 질문 등록페이지 (내용X)  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-9690&m=dev
 */
import { Suspense } from 'react'
import { useNavigate } from 'react-router'
import { QuestionForm } from '@/components'
import { useCreateQuestion } from '@/features/qna/question-write'
import { ROUTES } from '@/constants/routes'

function QnaWriteForm() {
  const navigate = useNavigate()
  const { mutate: createQuestion, isPending } = useCreateQuestion()

  const handleSubmit = (data: {
    categoryId: number
    title: string
    content: string
  }) => {
    createQuestion(
      {
        category_id: data.categoryId,
        title: data.title,
        content: data.content,
      },
      {
        onSuccess: (res) => {
          navigate(
            ROUTES.QNA.DETAIL.replace(':questionId', String(res.question_id))
          )
        },
      }
    )
  }

  return (
    <QuestionForm
      isPending={isPending}
      submitLabel="등록하기"
      onSubmit={handleSubmit}
      onCancel={() => navigate(ROUTES.QNA.LIST)}
    />
  )
}

export function QnaWritePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-text-heading mb-8 text-2xl font-bold">질문 등록</h1>
      <Suspense
        fallback={
          <div className="text-text-muted flex h-40 items-center justify-center">
            로딩 중...
          </div>
        }
      >
        <QnaWriteForm />
      </Suspense>
    </div>
  )
}
