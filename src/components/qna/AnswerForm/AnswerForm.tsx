import { useState, useEffect } from 'react'
import { Button } from '@/components/common/Button'
import { MarkdownEditor } from '@/components/qna/MarkdownEditor'

export interface AnswerFormProps {
  questionTitle: string
  onSubmit: (content: string, imageUrls: string[]) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function AnswerForm({
  questionTitle,
  onSubmit,
  onCancel,
  isLoading = false,
}: AnswerFormProps) {
  const [content, setContent] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [error, setError] = useState(false)

  // 작성 중 이탈 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (content.trim()) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [content])

  const handleSubmit = () => {
    if (!content.trim()) {
      setError(true)
      return
    }
    setError(false)
    onSubmit(content, imageUrls)
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    if (error && value.trim()) setError(false)
  }

  return (
    <div className="border-border-base bg-bg-base rounded-lg border p-6">
      {/* 상단: 질문 제목 + 버튼 */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-text-muted text-xs">답변 대상 질문</p>
          <p className="text-text-heading mt-0.5 line-clamp-2 text-sm font-medium">
            {questionTitle}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {onCancel && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
            >
              취소
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          >
            등록하기
          </Button>
        </div>
      </div>

      {/* 중단: 에디터 */}
      <MarkdownEditor
        value={content}
        onChange={handleContentChange}
        imageUrls={imageUrls}
        onImageUrlsChange={setImageUrls}
        error={error}
      />

      {/* 유효성 메시지 */}
      {error && (
        <p className="text-error mt-2 text-sm">답변 내용을 입력해주세요.</p>
      )}
    </div>
  )
}
