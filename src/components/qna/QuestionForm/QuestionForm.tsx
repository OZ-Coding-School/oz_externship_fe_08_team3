import { useEffect, useState } from 'react'
import { Button } from '@/components/common/Button'
import { MarkdownEditor } from '@/components/qna/MarkdownEditor'
import { Dropdown } from '@/components/common/Dropdown'
import { AlertModal } from '@/components/common/Modal'
import { useCategorySelector } from '@/hooks/useCategorySelector'

const MIN_CONTENT_LENGTH = 5
const MIN_TITLE_LENGTH = 3
const MAX_TITLE_LENGTH = 100

interface QuestionFormData {
  categoryId: number
  title: string
  content: string
}

interface QuestionFormProps {
  initialValues?: {
    title?: string
    content?: string
    categoryId?: number
  }
  isPending: boolean
  submitLabel?: string
  onSubmit: (data: QuestionFormData) => void
  onCancel: () => void
}

export function QuestionForm({
  initialValues,
  isPending,
  submitLabel = '등록하기',
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  const {
    largeCategoryId,
    largeOptions,
    mediumOptions,
    smallOptions,
    validMediumCategoryId,
    validSmallCategoryId,
    hasMedium,
    hasSmall,
    handleLargeChange,
    handleMediumChange,
    handleSmallChange,
    resolvedCategoryId,
  } = useCategorySelector(initialValues?.categoryId)

  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [alertMessage, setAlertMessage] = useState('')
  const [isAlertOpen, setIsAlertOpen] = useState(false)

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

    if (!resolvedCategoryId) return

    onSubmit({
      categoryId: resolvedCategoryId,
      title: title.trim(),
      content: content.trim(),
    })
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

          {/* 제목 입력 */}
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
        <MarkdownEditor
          value={content}
          onChange={setContent}
          imageUrls={imageUrls}
          onImageUrlsChange={setImageUrls}
          height={400}
        />

        {/* 버튼 */}
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
            {submitLabel}
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
