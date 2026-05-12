/**
 * @figma 질문 수정  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-9246&m=dev
 */
import { Suspense, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Button, Dropdown, AlertModal } from '@/components'
import { MarkdownEditor } from '@/components/qna/MarkdownEditor'
import { useQnaCategories } from '@/features/qna/categories'
import {
  useSuspenseGetQuestionDetail,
  useUpdateQuestion,
} from '@/features/qna/question-edit'
import type { GetQuestionDetailResponse } from '@/features/qna/question-detail'
import { useAuthStore } from '@/stores/authStore'
import { useCategorySelector } from '@/hooks/useCategorySelector'
import { ROUTES } from '@/constants/routes'
import { extractImageUrls } from '@/utils/extractImageUrls'

const MIN_CONTENT_LENGTH = 5
const MIN_TITLE_LENGTH = 3
const MAX_TITLE_LENGTH = 100

function getValidationMessage({
  categoryId,
  title,
  content,
}: {
  categoryId: number | undefined
  title: string
  content: string
}) {
  if (categoryId == null) return '카테고리를 선택해 주세요.'
  if (!title.trim()) return '제목을 입력해 주세요.'
  if (title.trim().length < MIN_TITLE_LENGTH) {
    return `제목을 ${MIN_TITLE_LENGTH}자 이상 입력해 주세요.`
  }
  if (content.trim().length < MIN_CONTENT_LENGTH) {
    return `내용을 ${MIN_CONTENT_LENGTH}자 이상 입력해 주세요.`
  }
  return null
}

function useBeforeUnloadDirty(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])
}

function CategoryFields({
  selector,
}: {
  selector: ReturnType<typeof useCategorySelector>
}) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row">
      <Dropdown
        options={selector.largeOptions}
        value={selector.largeCategoryId}
        onChange={selector.handleLargeChange}
        placeholder="대분류 선택"
        className="flex-1"
      />
      <Dropdown
        options={selector.mediumOptions}
        value={selector.validMediumCategoryId}
        onChange={selector.handleMediumChange}
        placeholder="중분류 선택"
        disabled={!selector.largeCategoryId || !selector.hasMedium}
        className="flex-1"
      />
      <Dropdown
        options={selector.smallOptions}
        value={selector.validSmallCategoryId}
        onChange={selector.handleSmallChange}
        placeholder="소분류 선택"
        disabled={!selector.validMediumCategoryId || !selector.hasSmall}
        className="flex-1"
      />
    </div>
  )
}

function TitleInput({
  title,
  onChange,
}: {
  title: string
  onChange: (value: string) => void
}) {
  return (
    <input
      type="text"
      placeholder={`제목을 입력해 주세요. (${MIN_TITLE_LENGTH}~${MAX_TITLE_LENGTH}자)`}
      value={title}
      onChange={(e) => onChange(e.target.value)}
      maxLength={MAX_TITLE_LENGTH}
      className="placeholder:text-text-muted text-text-heading border-border-base bg-primary-50 focus:border-primary h-12 w-full rounded-sm border px-4 text-base transition-colors duration-150 outline-none"
    />
  )
}

function EditActions({
  isPending,
  onCancel,
}: {
  isPending: boolean
  onCancel: () => void
}) {
  return (
    <div className="flex justify-end gap-3">
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        disabled={isPending}
      >
        취소
      </Button>
      <Button type="submit" variant="primary" loading={isPending}>
        수정하기
      </Button>
    </div>
  )
}

interface QnaEditFormInnerProps {
  questionId: number
  question: GetQuestionDetailResponse
}

function QnaEditFormInner({ questionId, question }: QnaEditFormInnerProps) {
  const navigate = useNavigate()
  const { mutate: updateQuestion, isPending } = useUpdateQuestion(questionId)
  const categorySelector = useCategorySelector(question.category.id)
  const currentCategoryId = categorySelector.resolvedCategoryId
  const [title, setTitle] = useState(question.title)
  const [content, setContent] = useState(question.content)
  const [alertMessage, setAlertMessage] = useState('')

  const isDirty =
    title !== question.title ||
    content !== question.content ||
    currentCategoryId !== question.category.id

  useBeforeUnloadDirty(isDirty)

  const showAlert = (message: string) => setAlertMessage(message)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validationMessage = getValidationMessage({
      categoryId: currentCategoryId,
      title,
      content,
    })
    if (validationMessage) return showAlert(validationMessage)
    if (currentCategoryId == null) return

    updateQuestion(
      {
        category_id: currentCategoryId,
        title: title.trim(),
        content: content.trim(),
        image_urls: extractImageUrls(content),
      },
      {
        onSuccess: () => {
          navigate(ROUTES.QNA.DETAIL.replace(':questionId', String(questionId)))
        },
        onError: () => {
          showAlert('질문 수정에 실패했습니다. 다시 시도해 주세요.')
        },
      }
    )
  }

  const handleCancel = () => {
    navigate(ROUTES.QNA.DETAIL.replace(':questionId', String(questionId)))
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="border-border-base rounded-xl border">
          <CategoryFields selector={categorySelector} />
          <div className="border-border-base border-t" />
          <div className="p-4">
            <TitleInput title={title} onChange={setTitle} />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl">
          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        <EditActions isPending={isPending} onCancel={handleCancel} />
      </form>

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
