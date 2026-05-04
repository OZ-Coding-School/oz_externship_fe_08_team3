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
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
        {/* 박스 1: 카테고리 & 제목 (패딩 p-8, 둥글기 rounded-[16px] 적용) */}
        <div className="w-full rounded-[16px] border border-[#E5E7EB] bg-white p-8 shadow-sm">
          {/* 카테고리 드롭다운 3개 */}
          <div className="mb-6 grid w-full grid-cols-3 gap-4">
            <Dropdown
              options={largeOptions}
              value={largeCategoryId}
              onChange={handleLargeChange}
              placeholder="대분류 선택"
              className="w-full"
            />
            <Dropdown
              options={mediumOptions}
              value={validMediumCategoryId}
              onChange={handleMediumChange}
              placeholder="중분류 선택"
              disabled={!largeCategoryId || !hasMedium}
              className="w-full"
            />
            <Dropdown
              options={smallOptions}
              value={validSmallCategoryId}
              onChange={handleSmallChange}
              placeholder="소분류 선택"
              disabled={!validMediumCategoryId || !hasSmall}
              className="w-full"
            />
          </div>

          {/* 제목 입력 (테두리 제거, 연보라 배경색만 적용) */}
          <div className="w-full">
            <input
              type="text"
              placeholder="제목을 입력해 주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MAX_TITLE_LENGTH}
              className="h-[56px] w-full rounded-[8px] bg-[#F7F2FF] px-6 text-base text-gray-900 placeholder-gray-500 transition-colors outline-none focus:ring-1 focus:ring-[#6201E0]"
            />
          </div>
        </div>

        {/* 박스 2: 마크다운 에디터 (둥글기 rounded-[16px] 적용 및 placeholder 추가) */}
        <div className="w-full overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm">
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="내용을 입력해 주세요."
          />
        </div>

        {/* 하단 버튼 영역 */}
        <div className="mt-2 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            loading={isPending}
            className="rounded-[8px] bg-[#6201E0] px-10 py-3 text-base font-medium text-white transition-colors hover:bg-[#5201c0]"
          >
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
