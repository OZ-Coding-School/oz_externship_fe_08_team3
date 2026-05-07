import { useState } from 'react'
import { usePostComment } from '@/features/qna/answer-comments'

const MAX_LENGTH = 500

interface CommentFormProps {
  answerId: number
  questionId: number
}

export function CommentForm({ answerId, questionId }: CommentFormProps) {
  const [content, setContent] = useState('')
  const { mutate, isPending } = usePostComment(answerId, questionId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || content.length > MAX_LENGTH) return
    mutate({ content: content.trim() }, { onSuccess: () => setContent('') })
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setContent(e.target.value)
    }
  }

  const hasContent = content.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="focus-within:border-primary relative h-[120px] rounded-2xl border border-[#CECECE] p-4 transition-colors">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있습니다."
          aria-label="댓글 입력"
          disabled={isPending}
          className="h-full w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-[#121212] outline-none placeholder:text-[#9D9D9D] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!hasContent || isPending}
          className="enabled:bg-primary absolute right-4 bottom-4 h-8 w-[60px] rounded-full bg-[#ECECEC] text-sm text-[#9D9D9D] transition-colors enabled:text-white"
        >
          등록
        </button>
      </div>
    </form>
  )
}
