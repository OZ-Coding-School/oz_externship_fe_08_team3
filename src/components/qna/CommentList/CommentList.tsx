import { useState, useMemo } from 'react'
import type { AnswerComment } from '@/features/qna/answer-comments'
import { formatDate } from '@/utils/formatDate'

type SortOrder = 'oldest' | 'latest'

interface CommentListProps {
  comments: AnswerComment[]
}

export function CommentList({ comments }: CommentListProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('oldest')
  const [isSortOpen, setIsSortOpen] = useState(false)

  const sorted = useMemo(() => {
    const copy = [...comments]
    if (sortOrder === 'latest') {
      return copy.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }
    return copy.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  }, [comments, sortOrder])

  if (comments.length === 0) return null

  const sortLabel = sortOrder === 'latest' ? '최신순' : '오래된순'

  return (
    <div className="border-border-base mt-4 border-t pt-4">
      {/* 정렬 버튼 */}
      <div className="relative mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setIsSortOpen((v) => !v)}
          className="text-text-muted hover:text-text-body flex items-center gap-1 text-xs"
        >
          {sortLabel} ↕
        </button>
        {isSortOpen && (
          <div className="border-border-base bg-bg-base absolute top-6 right-0 z-10 min-w-[100px] rounded-md border shadow-md">
            {(['oldest', 'latest'] as const).map((order) => (
              <button
                key={order}
                type="button"
                onClick={() => {
                  setSortOrder(order)
                  setIsSortOpen(false)
                }}
                className={[
                  'hover:bg-bg-muted block w-full px-3 py-2 text-left text-xs',
                  sortOrder === order
                    ? 'text-primary font-semibold'
                    : 'text-text-body',
                ].join(' ')}
              >
                {order === 'oldest' ? '오래된순' : '최신순'}
              </button>
            ))}
          </div>
        )}
      </div>

      <ul className="space-y-2">
        {sorted.map((comment) => (
          <li key={comment.id} className="flex items-start gap-2 text-sm">
            <span className="text-text-heading shrink-0 font-medium">
              {comment.author.nickname}
            </span>
            <span className="text-text-body flex-1">{comment.content}</span>
            <time
              dateTime={comment.created_at}
              className="text-text-muted shrink-0 text-xs"
            >
              {formatDate(comment.created_at)}
            </time>
          </li>
        ))}
      </ul>
    </div>
  )
}
