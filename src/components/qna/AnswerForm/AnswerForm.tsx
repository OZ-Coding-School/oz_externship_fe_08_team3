import { useState, useEffect, useRef, useImperativeHandle } from 'react'
import { Button } from '@/components/common/Button'
import { MarkdownEditor } from '@/components/qna/MarkdownEditor'
import type { MarkdownEditorHandle } from '@/components/qna/MarkdownEditor'

export interface AnswerFormProps {
  onSubmit: (content: string, imageUrls: string[]) => void
  isLoading?: boolean
  mode?: 'create' | 'edit'
  initialContent?: string
  initialImgUrls?: string[]
  answerId?: number
  ref?: React.Ref<AnswerFormHandle>
}

export interface AnswerFormHandle {
  focusEditor: () => void
  submit: () => void
}

const DEBOUNCE_DELAY_MS = 500

function getDraftKey(answerId: number) {
  return `answer-draft-${answerId}`
}

function getPendingDraft(
  isEdit: boolean,
  draftKey: string | null,
  initialContent: string
) {
  if (!isEdit || !draftKey) return null
  const saved = localStorage.getItem(draftKey)
  return saved != null && saved !== initialContent ? saved : null
}

function useDraftAutosave({
  content,
  draftKey,
  isDirty,
  isEdit,
}: {
  content: string
  draftKey: string | null
  isDirty: boolean
  isEdit: boolean
}) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isEdit || !draftKey || !isDirty) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      localStorage.setItem(draftKey, content)
    }, DEBOUNCE_DELAY_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [content, draftKey, isDirty, isEdit])
}

function useBeforeUnloadDirty(isDirty: boolean, content: string) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && content.trim()) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [content, isDirty])
}

function RestoreDraftPrompt({
  isLoading,
  onReject,
  onAccept,
}: {
  isLoading: boolean
  onReject: () => void
  onAccept: () => void
}) {
  return (
    <div className="bg-bg-subtle border-border-base mx-8 mt-4 flex items-center justify-between rounded-md border px-4 py-3">
      <p className="text-text-body text-sm">
        이전에 작성 중이던 내용이 있습니다. 복원할까요?
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onReject}
          disabled={isLoading}
        >
          버리기
        </Button>
        <Button size="sm" onClick={onAccept} disabled={isLoading}>
          복원하기
        </Button>
      </div>
    </div>
  )
}

// React 19: ref를 일반 prop으로 받음 (forwardRef 불필요)
export function AnswerForm({
  onSubmit,
  isLoading = false,
  mode = 'create',
  initialContent = '',
  initialImgUrls = [],
  answerId,
  ref,
}: AnswerFormProps) {
  const isEdit = mode === 'edit'
  const draftKey = isEdit && answerId != null ? getDraftKey(answerId) : null

  const [pendingDraft, setPendingDraft] = useState<string | null>(() => {
    return getPendingDraft(isEdit, draftKey, initialContent)
  })
  const [showRestorePrompt, setShowRestorePrompt] = useState(
    pendingDraft != null
  )
  const [content, setContent] = useState(initialContent)
  const [imgUrls] = useState(initialImgUrls)
  const [error, setError] = useState(false)
  const editorRef = useRef<MarkdownEditorHandle>(null)
  const isDirty = content !== initialContent

  useDraftAutosave({ content, draftKey, isDirty, isEdit })
  useBeforeUnloadDirty(isDirty, content)

  const handleSubmit = () => {
    if (!content.trim()) {
      setError(true)
      return
    }
    setError(false)
    onSubmit(content, imgUrls)
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

  useImperativeHandle(ref, () => ({
    focusEditor: () => editorRef.current?.focus(),
    submit: () => handleSubmit(),
  }))

  return (
    <>
      {showRestorePrompt && (
        <RestoreDraftPrompt
          isLoading={isLoading}
          onReject={handleRestoreReject}
          onAccept={handleRestoreAccept}
        />
      )}

      <MarkdownEditor
        ref={editorRef}
        value={content}
        onChange={handleContentChange}
        error={error ? '답변 내용을 입력해주세요.' : undefined}
        wrapperClassName="bg-bg-base relative border-t border-[#cdcdcd]"
      />
    </>
  )
}
