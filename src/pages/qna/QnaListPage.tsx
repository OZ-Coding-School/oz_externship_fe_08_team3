/**
 * @figma 질의응답 - 질문 목록페이지 https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-5893&m=dev
 */

import { Suspense, useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router'
import {
  Tabs,
  TabList,
  Tab,
  SearchInput,
  Modal,
  Button,
  Spinner,
} from '@/components'
import { useQnaQuestions } from '@/features/qna/questions'
import { useQnaCategories } from '@/features/qna/categories'
import type { UserCategory } from '@/features/qna/categories'
import type { QuestionListItem } from '@/features/qna/questions'
import { formatDate } from '@/utils/formatDate'
import { ROUTES } from '@/constants/routes'

type AnswerStatus = 'all' | 'answered' | 'unanswered'
type SortOption = 'latest' | 'views'

const PAGE_SIZE = 10

function CategoryFilterContent({
  selectedId,
  onSelect,
}: {
  selectedId: number | undefined
  onSelect: (id: number | undefined) => void
}) {
  const { data: categories } = useQnaCategories()

  return (
    <div className="space-y-3">
      <button
        onClick={() => onSelect(undefined)}
        className={[
          'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
          selectedId == null
            ? 'bg-primary-100 text-primary font-medium'
            : 'text-text-body hover:bg-bg-muted',
        ].join(' ')}
      >
        전체
      </button>
      {categories.map((cat: UserCategory) => (
        <div key={cat.id}>
          <p className="text-text-muted px-3 py-1 text-xs font-semibold tracking-wide">
            {cat.name}
          </p>
          {cat.children.map((child: UserCategory) => (
            <button
              key={child.id}
              onClick={() => onSelect(child.id)}
              className={[
                'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
                selectedId === child.id
                  ? 'bg-primary-100 text-primary font-medium'
                  : 'text-text-body hover:bg-bg-muted',
              ].join(' ')}
            >
              {child.name}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

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
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-text-muted truncate text-xs">
            {categoryPath}
          </span>
          <span
            className={[
              'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
              isAnswered
                ? 'bg-success-bg text-success'
                : 'bg-warning-bg text-warning',
            ].join(' ')}
          >
            {isAnswered ? '답변완료' : '답변 대기중'}
          </span>
        </div>

        <h2 className="text-text-heading mb-1 truncate text-base font-semibold">
          {question.title}
        </h2>

        <p className="text-text-body mb-3 line-clamp-2 text-sm">
          {question.content_preview}
        </p>

        <div className="text-text-muted flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span>{question.author.nickname}</span>
            {question.author.course_name && (
              <>
                <span>·</span>
                <span>{question.author.course_name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span>답변 {question.answer_count}</span>
            <span>조회 {question.view_count}</span>
            <time dateTime={question.created_at}>
              {formatDate(question.created_at)}
            </time>
          </div>
        </div>
      </Link>
    </li>
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
      className="mt-6 flex items-center justify-center gap-1"
    >
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label="이전 페이지"
        className="text-text-muted hover:bg-bg-muted disabled:text-disable rounded-md px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed"
      >
        이전
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === current ? 'page' : undefined}
          className={[
            'h-9 min-w-9 rounded-md px-3 text-sm transition-colors',
            p === current
              ? 'bg-primary text-text-inverse font-medium'
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
        className="text-text-muted hover:bg-bg-muted disabled:text-disable rounded-md px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed"
      >
        다음
      </button>
    </nav>
  )
}

export function QnaListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const answerStatus = (searchParams.get('answer_status') ??
    'all') as AnswerStatus
  const searchKeyword = searchParams.get('search_keyword') ?? ''
  const categoryId = searchParams.get('category_id')
    ? Number(searchParams.get('category_id'))
    : undefined
  const sort = (searchParams.get('sort') ?? 'latest') as SortOption
  const page = Number(searchParams.get('page') ?? 1)

  const [inputValue, setInputValue] = useState(searchKeyword)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)

  const isFirstRender = useRef(true)

  // Debounce search input → URL update (skip initial mount to avoid spurious navigation)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
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
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue, setSearchParams])

  const { data, isLoading, isError } = useQnaQuestions({
    page,
    page_size: PAGE_SIZE,
    search_keyword: searchKeyword || undefined,
    category_id: categoryId,
    answer_status: answerStatus !== 'all' ? answerStatus : undefined,
    sort,
  })

  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0

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

  const categoryName = searchParams.get('category_id')
    ? '필터 적용됨'
    : '카테고리'

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-text-heading text-2xl font-bold">질의응답</h1>
        <Button size="sm" onClick={() => navigate(ROUTES.QNA.WRITE)}>
          질문 등록
        </Button>
      </div>

      <Tabs value={answerStatus} onChange={handleTabChange}>
        <TabList aria-label="답변 상태 필터">
          <Tab value="all">전체보기</Tab>
          <Tab value="answered">답변완료</Tab>
          <Tab value="unanswered">답변 대기중</Tab>
        </TabList>

        <div className="mt-4">
          {/* 검색 + 필터 영역 */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <SearchInput
              value={inputValue}
              onValueChange={setInputValue}
              placeholder="질문 검색"
              className="flex-1"
              aria-label="질문 검색"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowCategoryModal(true)}
            >
              {categoryName}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowSortModal(true)}
            >
              {sort === 'views' ? '조회수순' : '최신순'}
            </Button>
          </div>

          {/* 총 결과 수 */}
          {!isLoading && data && (
            <p className="text-text-muted mb-3 text-sm">
              총 {data.count.toLocaleString()}개의 질문
            </p>
          )}

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
          <CategoryFilterContent
            selectedId={categoryId}
            onSelect={(id) => {
              updateParam('category_id', id != null ? String(id) : null)
              setShowCategoryModal(false)
            }}
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
          {(['latest', 'views'] as SortOption[]).map((opt) => (
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
              {opt === 'latest' ? '최신순' : '조회수순'}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
