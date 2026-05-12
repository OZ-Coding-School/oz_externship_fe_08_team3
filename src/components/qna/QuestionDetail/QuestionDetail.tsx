import { Button } from '@/components/common/Button'
import { MarkdownViewer } from '@/components/qna/MarkdownViewer'
import { UserAvatar } from '@/components/common/UserAvatar'
import { LoadingBox } from '@/components/common/LoadingBox'
import { AiFirstAnswerSection } from '@/components/qna/AiFirstAnswerSection'
import { getRelativeTime } from '@/utils/relativeTime'
import type { GetQuestionDetailResponse } from '@/features/qna/question-detail'
import type { ToastVariant } from '@/components'

// ── 아이콘 ────────────────────────────────────────────────────────────────────

function QBadgeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="42"
      viewBox="0 0 38 42"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M 19 0 C 29.493 0 38 8.507 38 19 L 38 23 C 38 27.164 36.659 31.014 34.388 34.145 L 36.264 36.021 C 37.435 37.192 37.435 39.091 36.264 40.263 C 35.092 41.434 33.192 41.434 32.021 40.263 L 30.145 38.387 C 27.014 40.658 23.164 42 19 42 C 8.507 42 0 33.493 0 23 L 0 19 C 0 8.507 8.507 0 19 0 Z M 19 7 C 12.373 7 7 12.373 7 19 L 7 23 C 7 29.627 12.373 35 19 35 C 21.225 35 23.307 34.391 25.094 33.336 L 22.121 30.363 C 20.95 29.192 20.95 27.293 22.121 26.121 C 23.293 24.95 25.193 24.95 26.364 26.121 L 29.336 29.093 C 30.391 27.306 31 25.225 31 23 L 31 19 C 31 12.373 25.627 7 19 7 Z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg
      width="16"
      height="16"
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

function QuestionHeader({
  questionDetail,
}: {
  questionDetail: GetQuestionDetailResponse
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-[60px]">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <QBadgeIcon className="text-primary mt-1 w-10 shrink-0 sm:w-12" />
        <h1 className="text-2xl leading-normal font-bold tracking-[-0.03em] text-[#121212] sm:text-[32px]">
          {questionDetail.title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <UserAvatar
          size="lg"
          profileImageUrl={questionDetail.author.profile_image_url}
          nickname={questionDetail.author.nickname}
        />
        <span className="text-base leading-normal font-bold tracking-[-0.03em] text-[#4D4D4D]">
          {questionDetail.author.nickname}
        </span>
      </div>
    </div>
  )
}

function QuestionMeta({
  viewCount,
  createdAt,
}: {
  viewCount: number
  createdAt: string
}) {
  return (
    <div className="mt-5 flex items-center gap-[19px] text-base leading-normal tracking-[-0.03em] text-[#9D9D9D]">
      <span>조회수 {viewCount.toLocaleString()}</span>
      <span className="text-[#CECECE]" aria-hidden="true">
        ·
      </span>
      <time dateTime={createdAt}>{getRelativeTime(createdAt)}</time>
    </div>
  )
}

function AttachedImages({
  images,
}: {
  images: GetQuestionDetailResponse['images']
}) {
  if (images.length === 0) return null

  return (
    <div className="mt-20 flex flex-wrap gap-2">
      {images.map((img, idx) => (
        <img
          key={img.id}
          src={img.img_url}
          alt={`첨부 이미지 ${idx + 1}`}
          loading="lazy"
          decoding="async"
          className="max-h-64 max-w-full rounded-md object-contain"
        />
      ))}
    </div>
  )
}

function QuestionActions({
  isQuestionOwner,
  onShare,
  onEdit,
}: Pick<QuestionDetailProps, 'isQuestionOwner' | 'onShare' | 'onEdit'>) {
  return (
    <div className="mt-6 flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onShare}
        className="hover:border-primary hover:text-primary inline-flex items-center gap-1.5 rounded-full border border-[#CECECE] px-4 py-2 text-sm text-[#4D4D4D] transition-colors"
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
  )
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
    <section>
      {isLoading && <LoadingBox label="질문을 불러오는 중..." />}
      {isError && (
        <p className="text-error text-sm">
          질문을 불러오지 못했습니다. 다시 시도해 주세요.
        </p>
      )}
      {questionDetail && (
        <>
          <QuestionHeader questionDetail={questionDetail} />
          <QuestionMeta
            viewCount={questionDetail.view_count}
            createdAt={questionDetail.created_at}
          />

          <hr className="mt-5 mb-10 h-px border-0 bg-[#CECECE]" />
          <MarkdownViewer content={questionDetail.content} />
          <AttachedImages images={questionDetail.images} />

          {isAuthenticated && (
            <AiFirstAnswerSection
              questionId={questionDetail.id}
              questionTitle={questionDetail.title}
              showToast={showToast}
            />
          )}

          <QuestionActions
            isQuestionOwner={isQuestionOwner}
            onShare={onShare}
            onEdit={onEdit}
          />

          <hr className="mt-6 h-px border-0 bg-[#CECECE]" />
        </>
      )}
    </section>
  )
}
