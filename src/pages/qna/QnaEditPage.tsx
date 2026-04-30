/**
 * @figma 질문 수정  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-9246&m=dev
 */
import { Suspense, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Button, Dropdown, AlertModal } from '@/components'
import { MarkdownEditor } from '@/components/qna/MarkdownEditor'
import { useQnaCategories } from '@/features/qna/categories'
import type { UserCategory } from '@/features/qna/categories'
import {
  useSuspenseGetQuestionDetail,
  useUpdateQuestion,
  useGetQuestionPresignedUrl,
} from '@/features/qna/question-edit'
import type { GetQuestionDetailResponse } from '@/features/qna/question-detail'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants/routes'

const MIN_CONTENT_LENGTH = 5
const MIN_TITLE_LENGTH = 3
const MAX_TITLE_LENGTH = 100

function findCategoryPath(
  categories: UserCategory[],
  targetId: number
): { largeId: string; mediumId: string; smallId: string } {
  for (const large of categories) {
    if (large.id === targetId) {
      return { largeId: String(large.id), mediumId: '', smallId: '' }
    }
    for (const medium of large.children) {
      if (medium.id === targetId) {
        return {
          largeId: String(large.id),
          mediumId: String(medium.id),
          smallId: '',
        }
      }
      for (const small of medium.children) {
        if (small.id === targetId) {
          return {
            largeId: String(large.id),
            mediumId: String(medium.id),
            smallId: String(small.id),
          }
        }
      }
    }
  }
  return { largeId: '', mediumId: '', smallId: '' }
}

interface QnaEditFormInnerProps {
  questionId: number
  question: GetQuestionDetailResponse
}

function QnaEditFormInner({ questionId, question }: QnaEditFormInnerProps) {
  const navigate = useNavigate()
  const { data: categories } = useQnaCategories()
  const { mutate: updateQuestion, isPending } = useUpdateQuestion(questionId)
  const { mutateAsync: getQuestionPresignedUrl } = useGetQuestionPresignedUrl()

  const initialPath = useMemo(
    () => findCategoryPath(categories, question.category.id),
    [categories, question.category.id]
  )

  const [largeCategoryId, setLargeCategoryId] = useState<string>(
    initialPath.largeId
  )
  const [mediumCategoryId, setMediumCategoryId] = useState<string>(
    initialPath.mediumId
  )
  const [smallCategoryId, setSmallCategoryId] = useState<string>(
    initialPath.smallId
  )
  const [title, setTitle] = useState(question.title)
  const [content, setContent] = useState(question.content)
  const [imageUrls, setImageUrls] = useState<string[]>(() =>
    question.images.map((img) => img.img_url)
  )
  const [alertMessage, setAlertMessage] = useState('')
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const largeOptions = categories.map((cat) => ({
    value: String(cat.id),
    label: cat.name,
  }))

  const selectedLarge = categories.find(
    (cat) => String(cat.id) === largeCategoryId
  )

  const mediumOptions =
    selectedLarge?.children.map((child) => ({
      value: String(child.id),
      label: child.name,
    })) ?? []

  const hasMedium = mediumOptions.length > 0
  const isMediumValid = mediumOptions.some((o) => o.value === mediumCategoryId)
  const validMediumCategoryId = isMediumValid ? mediumCategoryId : ''

  const selectedMedium = selectedLarge?.children.find(
    (c) => String(c.id) === validMediumCategoryId
  )

  const smallOptions =
    selectedMedium?.children.map((child) => ({
      value: String(child.id),
      label: child.name,
    })) ?? []

  const hasSmall = smallOptions.length > 0
  const isSmallValid = smallOptions.some((o) => o.value === smallCategoryId)
  const validSmallCategoryId = isSmallValid ? smallCategoryId : ''

  const handleLargeChange = (value: string) => {
    setLargeCategoryId(value)
    setMediumCategoryId('')
    setSmallCategoryId('')
  }

  const handleMediumChange = (value: string) => {
    setMediumCategoryId(value)
    setSmallCategoryId('')
  }

  const handleSmallChange = (value: string) => {
    setSmallCategoryId(value)
  }

  const currentCategoryId = hasSmall
    ? Number(validSmallCategoryId)
    : hasMedium
      ? Number(validMediumCategoryId)
      : Number(largeCategoryId)

  const initialImageUrls = useMemo(
    () => question.images.map((img) => img.img_url),
    [question.images]
  )

  const isDirty =
    title !== question.title ||
    content !== question.content ||
    currentCategoryId !== question.category.id ||
    JSON.stringify(imageUrls) !== JSON.stringify(initialImageUrls)

  useEffect(() => {
    if (!isDirty) return
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const isCategoryMissing =
      !largeCategoryId ||
      (hasMedium && !validMediumCategoryId) ||
      (hasSmall && !validSmallCategoryId)
    const isTitleInvalid = title.trim().length < MIN_TITLE_LENGTH
    const isContentInvalid = content.trim().length < MIN_CONTENT_LENGTH

    if (isCategoryMissing) {
      setAlertMessage('카테고리를 선택해 주세요.')
      setIsAlertOpen(true)
      return
    }
    if (!title.trim()) {
      setAlertMessage('제목을 입력해 주세요.')
      setIsAlertOpen(true)
      return
    }
    if (isTitleInvalid) {
      setAlertMessage(`제목을 ${MIN_TITLE_LENGTH}자 이상 입력해 주세요.`)
      setIsAlertOpen(true)
      return
    }
    if (isContentInvalid) {
      setAlertMessage(`내용을 ${MIN_CONTENT_LENGTH}자 이상 입력해 주세요.`)
      setIsAlertOpen(true)
      return
    }

    updateQuestion(
      {
        category_id: currentCategoryId,
        title: title.trim(),
        content: content.trim(),
        image_urls: imageUrls,
      },
      {
        onSuccess: () => {
          navigate(ROUTES.QNA.DETAIL.replace(':questionId', String(questionId)))
        },
        onError: () => {
          setAlertMessage('질문 수정에 실패했습니다. 다시 시도해 주세요.')
          setIsAlertOpen(true)
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
        {/* 카테고리 + 제목 박스 */}
        <div className="border-border-base rounded-xl border">
          <div className="flex gap-3 p-4">
            <Dropdown
              options={largeOptions}
              value={largeCategoryId}
              onChange={handleLargeChange}
              placeholder="대분류 선택"
              className="flex-1"
            />
            <Dropdown
              options={mediumOptions}
              value={validMediumCategoryId}
              onChange={handleMediumChange}
              placeholder="중분류 선택"
              disabled={!largeCategoryId || !hasMedium}
              className="flex-1"
            />
            <Dropdown
              options={smallOptions}
              value={validSmallCategoryId}
              onChange={handleSmallChange}
              placeholder="소분류 선택"
              disabled={!validMediumCategoryId || !hasSmall}
              className="flex-1"
            />
          </div>

          <div className="border-border-base border-t" />

          <div className="p-4">
            <input
              type="text"
              placeholder={`제목을 입력해 주세요. (${MIN_TITLE_LENGTH}~${MAX_TITLE_LENGTH}자)`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MAX_TITLE_LENGTH}
              className="placeholder:text-text-muted text-text-heading border-border-base bg-primary-50 focus:border-primary h-12 w-full rounded-sm border px-4 text-base transition-colors duration-150 outline-none"
            />
          </div>
        </div>

        {/* 마크다운 에디터 박스 */}
        <div className="overflow-hidden rounded-xl">
          <MarkdownEditor
            value={content}
            onChange={setContent}
            imageUrls={imageUrls}
            onImageUrlsChange={setImageUrls}
            uploadFn={getQuestionPresignedUrl}
            height={400}
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isPending}
          >
            취소
          </Button>
          <Button type="submit" variant="primary" loading={isPending}>
            수정하기
          </Button>
        </div>
      </form>

      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        message={alertMessage}
      />
    </>
  )
}

function QnaEditForm({ questionId }: { questionId: number }) {
  const currentUser = useAuthStore((state) => state.user)
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
