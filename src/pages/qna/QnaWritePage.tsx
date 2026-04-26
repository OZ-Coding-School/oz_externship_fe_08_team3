/**
 * @figma 질문 등록페이지 (내용O)  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-9533&m=dev
 * @figma 질문 등록페이지 (내용X)  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-9690&m=dev
 */
import { Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import { Button, Dropdown, AlertModal } from '@/components'
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
  const [smallCategoryId, setSmallCategoryId] = useState<string>('')
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

  const isDirty = title.trim().length > 0 || content.length > 0

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

    const categoryId = hasSmall
      ? Number(validSmallCategoryId)
      : hasMedium
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 카테고리 + 제목 박스 */}
        <div className="border-border-base rounded-xl border">
          {/* 카테고리 드롭다운 3개 */}
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

          {/* 구분선 */}
          <div className="border-border-base border-t" />

          {/* 제목 입력 (연한 보라색 배경) */}
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
        <div className="border-border-base overflow-hidden rounded-xl border">
          <div data-color-mode="light">
            <MDEditor
              value={content}
              onChange={(v) => setContent(v ?? '')}
              height={400}
              preview="live"
              visibleDragbar={false}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
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
