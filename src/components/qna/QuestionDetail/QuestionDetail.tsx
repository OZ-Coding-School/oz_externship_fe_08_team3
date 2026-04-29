import { Button } from '@/components/common/Button'
import { MarkdownViewer } from '@/components/qna/MarkdownViewer'
import { UserAvatar } from '@/components/common/UserAvatar'
import { LoadingBox } from '@/components/common/LoadingBox'
import { QaBadge } from '@/components/qna/QaBadge'
import { AiFirstAnswerSection } from '@/components/qna/AiFirstAnswerSection'
import { formatDate } from '@/utils/formatDate'
import type { GetQuestionDetailResponse } from '@/features/qna/question-detail'
import type { ToastVariant } from '@/components'

// ── 아이콘 ────────────────────────────────────────────────────────────────────

function LinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── QuestionDetail ─────────────────────────────────────────────────────────────

interface QuestionDetailProps {
  questionDetail: GetQuestionDetailResponse | undefined
  isLoading: boolean
  isError: boolean
  isQuestionOwner: boolean
  isAuthenticated: boolean
  onShare: () => void
  onEdit: () => void
  showToast: (message: string, variant: ToastVariant) => void
}

export function QuestionDetail({
  questionDetail,
  isLoading,
  isError,
  isQuestionOwner,
  isAuthenticated,
  onShare,
  onEdit,
  showToast,
}: QuestionDetailProps) {
  return (
    <section className="border-border-base bg-bg-base rounded-lg border p-6">
      {isLoading && <LoadingBox label="질문을 불러오는 중..." />}
      {isError && (
        <p className="text-error text-sm">
          질문을 불러오지 못했습니다. 다시 시도해 주세요.
        </p>
      )}
      {questionDetail && (
        <>
          {/* 제목 행: Q아이콘 + 제목 + 작성자 프로필 */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-2">
              <QaBadge type="Q" className="mt-0.5 shrink-0" />
              <h1 className="text-text-heading text-xl leading-snug font-bold">
                {questionDetail.title}
              </h1>
            </div>

            {/* 작성자 프로필 — 우측 */}
            <div className="flex shrink-0 items-center gap-2">
              <UserAvatar
                profileImageUrl={questionDetail.author.profile_image_url}
                nickname={questionDetail.author.nickname}
              />
              <div className="text-right">
                <p className="text-text-heading text-sm leading-tight font-medium">
                  {questionDetail.author.nickname}
                </p>
                <p className="text-text-muted text-xs">
                  {questionDetail.author.course_name} ·{' '}
                  {questionDetail.author.cohort_name}
                </p>
              </div>
            </div>
          </div>

          {/* 메타 정보 행: 조회수 · 시간 좌측 / 버튼 우측 */}
          <div className="mt-2 flex items-center justify-between">
            <div className="text-text-muted flex flex-wrap items-center gap-1.5 text-sm">
              <span>조회 {questionDetail.view_count.toLocaleString()}</span>
              <span>·</span>
              <time dateTime={questionDetail.created_at}>
                {formatDate(questionDetail.created_at)}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onShare}
                className="text-text-muted hover:text-primary flex items-center gap-1 text-sm transition-colors"
              >
                <LinkIcon />
                공유하기
              </button>
              {isQuestionOwner && (
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  수정
                </Button>
              )}
            </div>
          </div>

          <hr className="border-border-base my-4" />

          {/* 본문 — 마크다운 렌더링 */}
          <MarkdownViewer content={questionDetail.content} />

          {/* 첨부 이미지 */}
          {questionDetail.images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {questionDetail.images.map((img, idx) => (
                <img
                  key={img.id}
                  src={img.img_url}
                  alt={`첨부 이미지 ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="max-h-64 rounded-md object-contain"
                />
              ))}
            </div>
          )}

          {/* AI 1차 답변 */}
          {isAuthenticated && (
            <AiFirstAnswerSection
              questionId={questionDetail.id}
              questionTitle={questionDetail.title}
              showToast={showToast}
            />
          )}
        </>
      )}
    </section>
  )
}
