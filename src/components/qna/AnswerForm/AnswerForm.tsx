import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Button } from '@/components/common/Button'
import { MarkdownEditor } from '@/components/qna/MarkdownEditor'

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

const DEBOUNCE_DELAY_MS = 500

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
      answerId,
    },
    ref
  ) {
    const isEdit = mode === 'edit'
    const draftKey = isEdit && answerId != null ? getDraftKey(answerId) : null

    useImperativeHandle(ref, () => ({
      focusEditor: () => {},
    }))

    const [showRestorePrompt, setShowRestorePrompt] = useState(() => {
      if (!isEdit || !draftKey) return false
      const saved = localStorage.getItem(draftKey)
      return saved != null && saved !== initialContent
    })
    const [pendingDraft, setPendingDraft] = useState<string | null>(() => {
      if (!isEdit || !draftKey) return null
      const saved = localStorage.getItem(draftKey)
      return saved != null && saved !== initialContent ? saved : null
    })
    const [content, setContent] = useState(initialContent)
    const [error, setError] = useState(false)

    // debounce 자동 저장
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    useEffect(() => {
      if (!isEdit || !draftKey) return
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        localStorage.setItem(draftKey, content)
      }, DEBOUNCE_DELAY_MS)
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
      onSubmit(content, [])
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
          value={content}
          onChange={handleContentChange}
          error={error ? '답변 내용을 입력해주세요.' : undefined}
        />

        {/* 유효성 메시지 */}
        {error && (
          <p className="text-error mt-2 text-sm">답변 내용을 입력해주세요.</p>
        )}
      </div>
    )
  }
)
