/**
 * @figma 질의응답 - 질문 목록페이지 https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-5893&m=dev
 */

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router'
import {
  Tabs,
  TabList,
  Tab,
  SearchInput,
  Modal,
  Button,
  Spinner,
  Dropdown,
} from '@/components'
import { useQnaQuestions } from '@/features/qna/questions'
import { useQnaCategories } from '@/features/qna/categories'
import type { UserCategory } from '@/features/qna/categories'
import type { QuestionListItem } from '@/features/qna/questions'
import { formatDate } from '@/utils/formatDate'
import { ROUTES } from '@/constants/routes'

type AnswerStatus = 'all' | 'answered' | 'unanswered'
type SortOption = 'latest' | 'oldest'

const ANSWER_STATUSES = ['all', 'answered', 'unanswered'] as const
const SORT_OPTIONS = ['latest', 'oldest'] as const

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 300

const SORT_LABEL: Record<SortOption, string> = {
  latest: '최신순',
  oldest: '오래된순',
}

function findCategoryPath(
  categories: UserCategory[],
  targetId: number | undefined
): { large: string; medium: string; small: string } {
  if (!targetId) return { large: '', medium: '', small: '' }
  for (const large of categories) {
    if (large.id === targetId)
      return { large: String(large.id), medium: '', small: '' }
    for (const medium of large.children) {
      if (medium.id === targetId)
        return { large: String(large.id), medium: String(medium.id), small: '' }
      for (const small of medium.children) {
        if (small.id === targetId)
          return {
            large: String(large.id),
            medium: String(medium.id),
            small: String(small.id),
          }
      }
    }
  }
  return { large: '', medium: '', small: '' }
}

// ── 카테고리 필터 모달 콘텐츠 ─────────────────────────────────────────

function CategoryFilterModalContent({
  initialCategoryId,
  onApply,
  onClose,
}: {
  initialCategoryId?: number
  onApply: (id: number | undefined) => void
  onClose: () => void
}) {
  const { data: categories } = useQnaCategories()

  const initialPath = findCategoryPath(categories, initialCategoryId)
  const [largeCategoryId, setLargeCategoryId] = useState(initialPath.large)
  const [mediumCategoryId, setMediumCategoryId] = useState(initialPath.medium)
  const [smallCategoryId, setSmallCategoryId] = useState(initialPath.small)

  const largeOptions = categories.map((cat: UserCategory) => ({
    value: String(cat.id),
    label: cat.name,
  }))

  const selectedLarge = categories.find(
    (cat: UserCategory) => String(cat.id) === largeCategoryId
  )

  const mediumOptions =
    selectedLarge?.children.map((child: UserCategory) => ({
      value: String(child.id),
      label: child.name,
    })) ?? []

  const hasMedium = mediumOptions.length > 0
  const isMediumValid = mediumOptions.some((o) => o.value === mediumCategoryId)
  const validMediumCategoryId = isMediumValid ? mediumCategoryId : ''

  const selectedMedium = selectedLarge?.children.find(
    (c: UserCategory) => String(c.id) === validMediumCategoryId
  )

  const smallOptions =
    selectedMedium?.children.map((child: UserCategory) => ({
      value: String(child.id),
      label: child.name,
    })) ?? []

  const hasSmall = smallOptions.length > 0
  const isSmallValid = smallOptions.some((o) => o.value === smallCategoryId)
  const validSmallCategoryId = isSmallValid ? smallCategoryId : ''

  const handleLargeChange = (value: string) => {
    setLargeCategoryId(value)
    setMediumCategoryId('')
    setSmallCategoryId('')
  }

  const handleMediumChange = (value: string) => {
    setMediumCategoryId(value)
    setSmallCategoryId('')
  }

  const handleSmallChange = (value: string) => {
    setSmallCategoryId(value)
  }

  const handleReset = () => {
    setLargeCategoryId('')
    setMediumCategoryId('')
    setSmallCategoryId('')
  }

  const handleApply = () => {
    const leafId =
      validSmallCategoryId || validMediumCategoryId || largeCategoryId
    onApply(leafId ? Number(leafId) : undefined)
    onClose()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Dropdown
          options={largeOptions}
          value={largeCategoryId}
          onChange={handleLargeChange}
          placeholder="대분류 선택"
        />
        <Dropdown
          options={mediumOptions}
          value={validMediumCategoryId}
          onChange={handleMediumChange}
          placeholder="중분류 선택"
          disabled={!largeCategoryId || !hasMedium}
        />
        <Dropdown
          options={smallOptions}
          value={validSmallCategoryId}
          onChange={handleSmallChange}
          placeholder="소분류 선택"
          disabled={!validMediumCategoryId || !hasSmall}
        />
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <Button variant="ghost" size="sm" onClick={handleReset}>
          선택 초기화
        </Button>
        <Button variant="primary" size="sm" onClick={handleApply}>
          필터 적용하기
        </Button>
      </div>
    </div>
  )
}

// ── 질문 카드 ────────────────────────────────────────────────────────

function QuestionCard({ question }: { question: QuestionListItem }) {
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
          <div className="border-border-base flex shrink-0 items-center border-l pl-4">
            <div className="h-20 w-20">
              {question.thumbnail_img_url && (
                <img
                  src={question.thumbnail_img_url}
                  alt={`${question.title} 썸네일`}
                  loading="lazy"
                  decoding="async"
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-md object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}

// ── 페이지네이션 ──────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 12L6 8L10 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number
  total: number
  onChange: (page: number) => void
}) {
  const maxVisible = 5
  const half = Math.floor(maxVisible / 2)
  const start = Math.max(1, Math.min(current - half, total - maxVisible + 1))
  const end = Math.min(total, start + maxVisible - 1)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <nav
      aria-label="페이지 이동"
      className="mt-8 flex items-center justify-center gap-1"
    >
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label="이전 페이지"
        className="text-text-muted hover:text-text-heading flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <ChevronLeft />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === current ? 'page' : undefined}
          className={[
            'h-9 w-9 rounded-full text-sm font-medium transition-colors',
            p === current
              ? 'bg-primary text-text-inverse'
              : 'text-text-body hover:bg-bg-muted',
          ].join(' ')}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        aria-label="다음 페이지"
        className="text-text-muted hover:text-text-heading flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <ChevronRight />
      </button>
    </nav>
  )
}

// ── QnaListPage ───────────────────────────────────────────────────

export function QnaListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const rawAnswerStatus = searchParams.get('answer_status') ?? 'all'
  const answerStatus: AnswerStatus = (
    ANSWER_STATUSES as readonly string[]
  ).includes(rawAnswerStatus)
    ? (rawAnswerStatus as AnswerStatus)
    : 'all'

  const searchKeyword = searchParams.get('search_keyword') ?? ''

  const rawCategoryId = Number(searchParams.get('category_id'))
  const categoryId =
    searchParams.get('category_id') != null &&
    Number.isFinite(rawCategoryId) &&
    rawCategoryId > 0
      ? rawCategoryId
      : undefined

  const rawSort = searchParams.get('sort') ?? 'latest'
  const sort: SortOption = (SORT_OPTIONS as readonly string[]).includes(rawSort)
    ? (rawSort as SortOption)
    : 'latest'

  const rawPage = Number(searchParams.get('page') ?? 1)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1

  const [inputValue, setInputValue] = useState(searchKeyword)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)

  // URL → inputValue 동기화 (뒤로가기 대응)
  useEffect(() => {
    setInputValue(searchKeyword)
  }, [searchKeyword])

  // Debounce search input → URL update (inputValue가 searchKeyword와 다를 때만 동작)
  useEffect(() => {
    if (inputValue === searchKeyword) return
    const timer = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (inputValue) {
            next.set('search_keyword', inputValue)
          } else {
            next.delete('search_keyword')
          }
          next.delete('page')
          return next
        },
        { replace: true }
      )
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [inputValue, searchKeyword, setSearchParams])

  const { data, isLoading, isError } = useQnaQuestions({
    page,
    page_size: PAGE_SIZE,
    search_keyword: searchKeyword || undefined,
    category_id: categoryId,
    answer_status: answerStatus !== 'all' ? answerStatus : undefined,
    sort,
  })

  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.delete('page')
          return next
        },
        { replace: true }
      )
    }
  }, [page, totalPages, setSearchParams])

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value != null) {
          next.set(key, value)
        } else {
          next.delete(key)
        }
        next.delete('page')
        return next
      })
    },
    [setSearchParams]
  )

  const handleTabChange = useCallback(
    (value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value !== 'all') {
          next.set('answer_status', value)
        } else {
          next.delete('answer_status')
        }
        next.delete('page')
        return next
      })
    },
    [setSearchParams]
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (newPage === 1) {
          next.delete('page')
        } else {
          next.set('page', String(newPage))
        }
        return next
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [setSearchParams]
  )

  const hasFilter = categoryId != null

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-text-heading mb-6 text-2xl font-bold">질의응답</h1>

      {/* 검색바 + 질문하기 버튼 — 탭 위 */}
      <div className="mb-4 flex items-center gap-3">
        <SearchInput
          value={inputValue}
          onValueChange={setInputValue}
          placeholder="질문 검색"
          className="flex-1"
          aria-label="질문 검색"
        />
        <Button size="sm" onClick={() => navigate(ROUTES.QNA.WRITE)}>
          질문하기
        </Button>
      </div>

      <Tabs value={answerStatus} onChange={handleTabChange}>
        <TabList aria-label="답변 상태 필터">
          <Tab value="all">전체보기</Tab>
          <Tab value="answered">답변완료</Tab>
          <Tab value="unanswered">답변 대기중</Tab>
        </TabList>

        <div className="mt-4">
          {/* 총 결과수 + 정렬·카테고리 우측 배치 */}
          <div className="mb-4 flex items-center justify-between">
            {!isLoading && data ? (
              <p className="text-text-muted text-sm">
                총 {data.count.toLocaleString()}개의 질문
              </p>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSortModal(true)}
              >
                {SORT_LABEL[sort]}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button
                variant={hasFilter ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setShowCategoryModal(true)}
              >
                {hasFilter ? '필터 적용됨' : '카테고리'}
              </Button>
            </div>
          </div>

          {/* 질문 목록 */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" label="질문 목록을 불러오는 중..." />
            </div>
          )}

          {isError && (
            <div className="text-text-muted flex flex-col items-center justify-center py-20 text-center">
              <p className="text-error mb-2 font-medium">
                질문 목록을 불러오지 못했습니다.
              </p>
              <p className="text-sm">잠시 후 다시 시도해 주세요.</p>
            </div>
          )}

          {!isLoading && !isError && data && (
            <>
              {data.results.length === 0 ? (
                <div className="text-text-muted flex flex-col items-center justify-center py-20 text-center">
                  <p className="font-medium">등록된 질문이 없습니다.</p>
                  {searchKeyword && (
                    <p className="mt-1 text-sm">
                      &apos;{searchKeyword}&apos;에 대한 검색 결과가 없습니다.
                    </p>
                  )}
                </div>
              ) : (
                <ul className="space-y-3">
                  {data.results.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                  ))}
                </ul>
              )}

              {totalPages > 1 && (
                <Pagination
                  current={page}
                  total={totalPages}
                  onChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </Tabs>

      {/* 카테고리 필터 모달 */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="카테고리 필터"
        maxWidth="max-w-sm"
      >
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Spinner label="카테고리 불러오는 중..." />
            </div>
          }
        >
          <CategoryFilterModalContent
            initialCategoryId={categoryId}
            onApply={(id) =>
              updateParam('category_id', id != null ? String(id) : null)
            }
            onClose={() => setShowCategoryModal(false)}
          />
        </Suspense>
      </Modal>

      {/* 정렬 모달 */}
      <Modal
        isOpen={showSortModal}
        onClose={() => setShowSortModal(false)}
        title="정렬"
        maxWidth="max-w-xs"
      >
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                updateParam('sort', opt)
                setShowSortModal(false)
              }}
              className={[
                'w-full rounded-md px-4 py-3 text-left text-sm transition-colors',
                sort === opt
                  ? 'bg-primary-100 text-primary font-medium'
                  : 'text-text-body hover:bg-bg-muted',
              ].join(' ')}
            >
              {SORT_LABEL[opt]}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
