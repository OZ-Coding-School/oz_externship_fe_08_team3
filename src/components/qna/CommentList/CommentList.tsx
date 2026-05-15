import { useState } from 'react'
import { MessageCircle, ArrowDownUp } from 'lucide-react'
import { UserAvatar } from '@/components/common/UserAvatar'
import type { AnswerComment } from '@/features/qna/answer-comments'
/** ISO 날짜를 '2025년 6월 13일' 형식으로 변환 */
function formatKoreanDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

type SortOrder = 'oldest' | 'latest'

interface CommentListProps {
  comments: AnswerComment[]
}

export function CommentList({ comments }: CommentListProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')
  const [isSortOpen, setIsSortOpen] = useState(false)

  // React Compiler가 자동 메모이제이션 처리
  const sorted = [...comments].sort((a, b) =>
    sortOrder === 'latest'
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  if (comments.length === 0) return null

  const sortLabel = sortOrder === 'latest' ? '최신순' : '오래된순'

  return (
    <div className="mt-10">
      {/* 댓글 헤더: 💬 댓글 N개 + 정렬 */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-3 text-xl leading-[1.1] font-bold text-[#121212]"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          <MessageCircle className="h-6 w-6" />
          <span>
            댓글 <strong>{comments.length}</strong>개
          </span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSortOpen((v) => !v)}
            className="flex items-center gap-1 text-base leading-normal tracking-[-0.03em] text-[#4D4D4D]"
          >
            {sortLabel}
            <ArrowDownUp className="h-5 w-5" />
          </button>
          {isSortOpen && (
            <div className="absolute top-8 right-0 z-10 min-w-[120px] rounded-xl border border-[#CECECE] bg-white shadow-md">
              {(['latest', 'oldest'] as const).map((order) => (
                <button
                  key={order}
                  type="button"
                  onClick={() => {
                    setSortOrder(order)
                    setIsSortOpen(false)
                  }}
                  className={[
                    'block w-full px-4 py-2.5 text-left text-sm',
                    sortOrder === order
                      ? 'text-primary font-semibold'
                      : 'text-[#4D4D4D]',
                    'hover:bg-[#F5F5F5]',
                  ].join(' ')}
                >
                  {order === 'oldest' ? '오래된순' : '최신순'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 댓글 목록 — 2단 레이아웃 */}
      <ul className="mt-5 flex flex-col gap-5">
        {sorted.map((comment) => (
          <li key={comment.id} className="group flex gap-[17px]">
            <UserAvatar
              size="lg"
              profileImageUrl={comment.author.profile_img_url}
              nickname={comment.author.nickname}
            />
            <div className="flex flex-1 flex-col gap-3 border-b border-[#CECECE] pb-5 group-last:border-b-0">
              {/* 닉네임 + 시간 */}
              <div className="flex items-center gap-2">
                <span className="text-base leading-normal font-bold tracking-[-0.03em] text-[#4D4D4D]">
                  {comment.author.nickname}
                </span>
                <time
                  dateTime={comment.created_at}
                  className="text-xs leading-normal tracking-[-0.03em] text-[#9D9D9D]"
                >
                  {formatKoreanDate(comment.created_at)}
                </time>
              </div>
              {/* 댓글 내용 */}
              <p className="text-base leading-normal tracking-[-0.03em] text-black">
                {comment.content}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
