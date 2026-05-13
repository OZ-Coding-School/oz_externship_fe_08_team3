import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import type { QuestionListItem } from '@/features/qna/questions'
import { getRelativeTime } from '@/utils/relativeTime'
import { ROUTES } from '@/constants/routes'
import defaultProfile from '@/assets/default-profile.png'

function CategoryTrail({ categories }: { categories: string[] }) {
  return (
    <div className="flex flex-wrap items-center text-xs text-[#4D4D4D]">
      {categories.map((name, i) => (
        <span key={`${name}-${i}`} className="flex items-center">
          <span className="group-hover:text-[#6201E0]">{name}</span>
          {i < categories.length - 1 && (
            <ChevronRight
              className="mx-1 h-3 w-3 text-[#707070]"
              aria-hidden="true"
            />
          )}
        </span>
      ))}
    </div>
  )
}

function QuestionStats({
  answerCount,
  viewCount,
}: {
  answerCount: number
  viewCount: number
}) {
  const isAnswered = answerCount > 0
  return (
    <div className="flex items-center gap-5">
      <div className="flex items-center gap-2">
        <span
          className={[
            'flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-white',
            isAnswered ? 'bg-[#04C73D]' : 'bg-gray-300',
          ].join(' ')}
          aria-hidden="true"
        >
          A
        </span>
        <span className="text-xs text-[#4D4D4D]">답변 {answerCount}</span>
      </div>
      <span className="text-xs text-[#9D9D9D]">조회수 {viewCount}</span>
    </div>
  )
}

function QuestionAuthorMeta({ question }: { question: QuestionListItem }) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-xs text-[#9D9D9D]">
      <img
        src={question.author.profile_img_url ?? defaultProfile}
        alt=""
        className="h-6 w-6 shrink-0 rounded-full object-cover"
      />
      <span className="truncate text-[#4D4D4D]">
        {question.author.nickname}
      </span>
      <time className="shrink-0" dateTime={question.created_at}>
        {getRelativeTime(question.created_at)}
      </time>
    </div>
  )
}

export function QuestionCard({ question }: { question: QuestionListItem }) {
  const detailPath = ROUTES.QNA.DETAIL.replace(
    ':questionId',
    String(question.id)
  )
  const categories = question.category.names

  return (
    <li>
      <Link
        to={detailPath}
        className="group block rounded-xl p-4 transition hover:shadow-sm sm:h-[211px] sm:p-6"
      >
        <div className="flex h-full gap-5 sm:gap-10">
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div className="flex flex-col gap-5">
              <CategoryTrail categories={categories} />

              <div className="flex flex-col gap-3">
                <h2 className="truncate text-lg leading-[1.4] font-bold tracking-[-0.03em] text-black group-hover:text-[#6201E0]">
                  {question.title}
                </h2>
                <p className="line-clamp-2 text-sm leading-[1.4] tracking-[-0.03em] text-[#9D9D9D]">
                  {question.content_preview}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
              <QuestionStats
                answerCount={question.answer_count}
                viewCount={question.view_count}
              />
              <QuestionAuthorMeta question={question} />
            </div>
          </div>

          {question.thumbnail_img_url && (
            <img
              src={question.thumbnail_img_url}
              alt=""
              loading="lazy"
              className="hidden h-[163px] w-[228px] shrink-0 rounded-lg object-cover sm:block"
            />
          )}
        </div>
      </Link>
    </li>
  )
}
