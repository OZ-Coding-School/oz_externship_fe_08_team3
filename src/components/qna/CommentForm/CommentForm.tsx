import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { usePostComment } from '@/features/qna/answer-comments'

interface CommentFormProps {
  answerId: number
  questionId: number
}

export function CommentForm({ answerId, questionId }: CommentFormProps) {
  const [content, setContent] = useState('')
  const { mutate, isPending } = usePostComment(answerId, questionId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    mutate({ content: content.trim() }, { onSuccess: () => setContent('') })
  }

  const hasContent = content.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="border-border-base focus-within:border-primary relative rounded-md border transition-colors">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있습니다."
          aria-label="댓글 입력"
          rows={2}
          disabled={isPending}
          className="w-full resize-none rounded-md px-3 pt-2 pb-10 text-sm outline-none disabled:opacity-50"
        />
        <div className="absolute right-2 bottom-2">
          <Button
            type="submit"
            size="sm"
            disabled={!hasContent || isPending}
            loading={isPending}
          >
            등록
          </Button>
        </div>
      </div>
    </form>
  )
}
