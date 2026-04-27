import { Link } from 'react-router'
import type { QuestionListItem } from '@/features/qna/questions'
import { formatDate } from '@/utils/formatDate'
import { ROUTES } from '@/constants/routes'

export function QuestionCard({ question }: { question: QuestionListItem }) {
  const detailPath = ROUTES.QNA.DETAIL.replace(
    ':questionId',
    String(question.id)
  )
  const categoryPath = question.category.names.join(' > ')
  const isAnswered = question.answer_count > 0

  return (
    <li>
      <Link
        to={detailPath}
        className="border-border-base bg-bg-base hover:border-primary block rounded-lg border p-5 transition-colors duration-150"
      >
        <div className="flex">
          {/* 텍스트 영역 */}
          <div className="min-w-0 flex-1 pr-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-text-muted truncate text-xs">
                {categoryPath}
              </span>
            </div>

            <h2 className="text-text-heading mb-1 truncate text-base font-semibold">
              {question.title}
            </h2>

            <p className="text-text-body mb-3 line-clamp-2 text-sm">
              {question.content_preview}
            </p>

            {/* 하단: A 마크 + 조회수 / 작성자 + 날짜 */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span
                    className={[
                      'inline-flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold',
                      isAnswered
                        ? 'bg-success text-white'
                        : 'text-text-muted bg-gray-100',
                    ].join(' ')}
                  >
                    A
                  </span>
                  <span
                    className={
                      isAnswered
                        ? 'text-success font-medium'
                        : 'text-text-muted'
                    }
                  >
                    {question.answer_count}
                  </span>
                </span>
                <span className="text-text-muted">
                  조회 {question.view_count}
                </span>
              </div>
              <div className="text-text-muted flex items-center gap-1.5">
                <span>{question.author.nickname}</span>
                {question.author.course_name && (
                  <>
                    <span>·</span>
                    <span>{question.author.course_name}</span>
                  </>
                )}
                <span>·</span>
                <time dateTime={question.created_at}>
                  {formatDate(question.created_at)}
                </time>
              </div>
            </div>
          </div>

          {/* 구분선 + 썸네일 (우측) */}
          {question.thumbnail_img_url && (
            <div className="border-border-base flex shrink-0 items-center border-l pl-4">
              <img
                src={question.thumbnail_img_url}
                alt={`${question.title} 썸네일`}
                loading="lazy"
                decoding="async"
                width={80}
                height={80}
                className="h-20 w-20 rounded-md object-cover"
              />
            </div>
          )}
        </div>
      </Link>
    </li>
  )
}
