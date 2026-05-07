import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import type { QuestionListItem } from '@/features/qna/questions'
import { getRelativeTime } from '@/utils/relativeTime'
import { ROUTES } from '@/constants/routes'
import defaultProfile from '@/assets/default-profile.png'

export function QuestionCard({ question }: { question: QuestionListItem }) {
  const detailPath = ROUTES.QNA.DETAIL.replace(
    ':questionId',
    String(question.id)
  )
  const isAnswered = question.answer_count > 0
  const categories = question.category.names

  return (
    <li>
      <Link
        to={detailPath}
        className="group block h-[211px] rounded-xl p-6 transition hover:shadow-sm"
      >
        <div className="flex h-full gap-10">
          {/* 좌측 텍스트 영역 */}
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            {/* 상단: 카테고리 + 제목 + 본문 */}
            <div className="flex flex-col gap-5">
              {/* 카테고리 브레드크럼 */}
              <div className="flex items-center text-xs text-[#4D4D4D]">
                {categories.map((name, i) => (
                  <span key={i} className="flex items-center">
                    <span className="group-hover:text-[#6201E0]">{name}</span>
                    {i < categories.length - 1 && (
                      <ChevronRight className="mx-1 h-3 w-3 text-[#707070]" />
                    )}
                  </span>
                ))}
              </div>

              {/* 제목 + 본문 미리보기 */}
              <div className="flex flex-col gap-3">
                <h2 className="truncate text-lg leading-[1.4] font-bold tracking-[-0.03em] text-black group-hover:text-[#6201E0]">
                  {question.title}
                </h2>
                <p className="line-clamp-2 text-sm leading-[1.4] tracking-[-0.03em] text-[#9D9D9D]">
                  {question.content_preview}
                </p>
              </div>
            </div>

            {/* 하단: 좌(답변/조회수) + 우(작성자/시간) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                {/* A 뱃지 + 답변수 */}
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      'flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-white',
                      isAnswered ? 'bg-[#04C73D]' : 'bg-gray-300',
                    ].join(' ')}
                  >
                    A
                  </span>
                  <span className="text-xs text-[#4D4D4D]">
                    답변 {question.answer_count}
                  </span>
                </div>
                {/* 조회수 */}
                <span className="text-xs text-[#9D9D9D]">
                  조회수 {question.view_count}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#9D9D9D]">
                <img
                  src={question.author.profile_img_url ?? defaultProfile}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span className="text-[#4D4D4D]">
                  {question.author.nickname}
                </span>
                <time dateTime={question.created_at}>
                  {getRelativeTime(question.created_at)}
                </time>
              </div>
            </div>
          </div>

          {/* 우측 썸네일 — 228×163 */}
          {question.thumbnail_img_url && (
            <img
              src={question.thumbnail_img_url}
              alt=""
              loading="lazy"
              className="h-[163px] w-[228px] shrink-0 rounded-lg object-cover"
            />
          )}
        </div>
      </Link>
    </li>
  )
}
