/**
 * @figma 질문 등록페이지 (내용O)  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-9533&m=dev
 * @figma 질문 등록페이지 (내용X)  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-9690&m=dev
 */
import { Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import MDEditor from '@uiw/react-md-editor'
import { Button, Dropdown, Input, AlertModal } from '@/components'
import { useQnaCategories } from '@/features/qna/categories'
import { useCreateQuestion } from '@/features/qna/question-write'
import { ROUTES } from '@/constants/routes'

const MIN_CONTENT_LENGTH = 5
const MIN_TITLE_LENGTH = 3
const MAX_TITLE_LENGTH = 100

function QnaWriteForm() {
  const navigate = useNavigate()
  const { data: categories } = useQnaCategories()
  const { mutate: createQuestion, isPending } = useCreateQuestion()

  const [largeCategoryId, setLargeCategoryId] = useState<string>('')
  const [mediumCategoryId, setMediumCategoryId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
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

  const hasChildren = mediumOptions.length > 0
  // 대분류 변경/카테고리 refetch 시 mediumCategoryId가 orphan이 되는 경우를 렌더 타임에 파생
  const isMediumValid = mediumOptions.some((o) => o.value === mediumCategoryId)
  const validMediumCategoryId = isMediumValid ? mediumCategoryId : ''

  const handleLargeChange = (value: string) => {
    setLargeCategoryId(value)
    setMediumCategoryId('')
  }

  const isDirty = title.trim().length > 0 || content.length > 0

  useEffect(() => {
    if (!isDirty) return
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const isCategoryMissing =
      !largeCategoryId || (hasChildren && !validMediumCategoryId)
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

    const categoryId = hasChildren
      ? Number(validMediumCategoryId)
      : Number(largeCategoryId)

    createQuestion(
      {
        category_id: categoryId,
        title: title.trim(),
        content: content.trim(),
      },
      {
        onSuccess: (data) => {
          navigate(
            ROUTES.QNA.DETAIL.replace(':questionId', String(data.question_id))
          )
        },
        onError: () => {
          setAlertMessage('질문 등록에 실패했습니다. 다시 시도해 주세요.')
          setIsAlertOpen(true)
        },
      }
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 카테고리 선택 */}
        <div className="flex flex-col gap-3">
          <label className="text-text-heading text-sm font-medium">
            카테고리
            <span className="text-error ml-1">*</span>
          </label>
          <div className="flex gap-3">
            <Dropdown
              options={largeOptions}
              value={largeCategoryId}
              onChange={handleLargeChange}
              placeholder="대분류 선택"
              className="flex-1"
            />
            {hasChildren && (
              <Dropdown
                options={mediumOptions}
                value={validMediumCategoryId}
                onChange={setMediumCategoryId}
                placeholder="중분류 선택"
                disabled={!largeCategoryId}
                className="flex-1"
              />
            )}
          </div>
        </div>

        {/* 제목 */}
        <Input
          label="제목"
          placeholder={`제목을 입력해 주세요. (${MIN_TITLE_LENGTH}~${MAX_TITLE_LENGTH}자)`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_TITLE_LENGTH}
        />

        {/* 내용 */}
        <div className="flex flex-col gap-3">
          <label className="text-text-heading text-sm font-medium">
            내용
            <span className="text-error ml-1">*</span>
          </label>
          <div data-color-mode="light">
            <MDEditor
              value={content}
              onChange={(v) => setContent(v ?? '')}
              height={400}
              preview="live"
              visibleDragbar={false}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(ROUTES.QNA.LIST)}
            disabled={isPending}
          >
            취소
          </Button>
          <Button type="submit" variant="primary" loading={isPending}>
            등록하기
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

export function QnaWritePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
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
