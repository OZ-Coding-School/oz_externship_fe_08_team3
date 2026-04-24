import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Button } from '@/components/common/Button'
import { MarkdownEditor } from '@/components/qna/MarkdownEditor'
import type { MarkdownEditorHandle } from '@/components/qna/MarkdownEditor'

export interface AnswerFormProps {
  questionTitle: string
  onSubmit: (content: string, imageUrls: string[]) => void
  onCancel?: () => void
  isLoading?: boolean
  mode?: 'create' | 'edit'
  initialContent?: string
  initialImgUrls?: string[]
  answerId?: number
}

export interface AnswerFormHandle {
  focusEditor: () => void
}

function getDraftKey(answerId: number) {
  return `answer-draft-${answerId}`
}

export const AnswerForm = forwardRef<AnswerFormHandle, AnswerFormProps>(
  function AnswerForm(
    {
      questionTitle,
      onSubmit,
      onCancel,
      isLoading = false,
      mode = 'create',
      initialContent = '',
      initialImgUrls = [],
      answerId,
    },
    ref
  ) {
    const isEdit = mode === 'edit'
    const draftKey = isEdit && answerId != null ? getDraftKey(answerId) : null

    const editorRef = useRef<MarkdownEditorHandle>(null)

    useImperativeHandle(ref, () => ({
      focusEditor: () => {
        editorRef.current?.focus()
      },
    }))

    // 수정 모드 진입 시 localStorage 임시 저장 감지 — useState initializer로 처리
    const savedDraft =
      isEdit && draftKey ? localStorage.getItem(draftKey) : null
    const hasDraft = savedDraft != null && savedDraft !== initialContent

    const [showRestorePrompt, setShowRestorePrompt] = useState(hasDraft)
    const [pendingDraft, setPendingDraft] = useState<string | null>(
      hasDraft ? savedDraft : null
    )
    const [content, setContent] = useState(initialContent)
    const [imageUrls, setImageUrls] = useState<string[]>(initialImgUrls)
    const [error, setError] = useState(false)

    // debounce 자동 저장
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    useEffect(() => {
      if (!isEdit || !draftKey) return
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        localStorage.setItem(draftKey, content)
      }, 500)
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
      }
    }, [content, isEdit, draftKey])

    // 이탈 방지
    useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (content.trim()) {
          e.preventDefault()
        }
      }
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () =>
        window.removeEventListener('beforeunload', handleBeforeUnload)
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

    const handleRestoreAccept = () => {
      if (pendingDraft) setContent(pendingDraft)
      setShowRestorePrompt(false)
      setPendingDraft(null)
    }

    const handleRestoreReject = () => {
      if (draftKey) localStorage.removeItem(draftKey)
      setShowRestorePrompt(false)
      setPendingDraft(null)
    }

    return (
      <div className="border-border-base bg-bg-base rounded-lg border p-6">
        {/* 임시 저장 복원 안내 */}
        {showRestorePrompt && (
          <div className="bg-bg-subtle border-border-base mb-4 flex items-center justify-between rounded-md border px-4 py-3">
            <p className="text-text-body text-sm">
              이전에 작성 중이던 내용이 있습니다. 복원할까요?
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRestoreReject}
                disabled={isLoading}
              >
                버리기
              </Button>
              <Button
                size="sm"
                onClick={handleRestoreAccept}
                disabled={isLoading}
              >
                복원하기
              </Button>
            </div>
          </div>
        )}

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
              {isEdit ? '수정하기' : '등록하기'}
            </Button>
          </div>
        </div>

        {/* 중단: 에디터 */}
        <MarkdownEditor
          ref={editorRef}
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
)
