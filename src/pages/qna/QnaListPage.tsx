/**
 * @figma 질의응답 - 질문 목록페이지 https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-5893&m=dev
 */

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import {
  Tabs,
  TabList,
  Tab,
  SearchInput,
  Modal,
  Button,
  LoadingBox,
  Pagination,
  QuestionCard,
  CategoryFilter,
} from '@/components'
import { useQnaQuestions } from '@/features/qna/questions'
import type { QuestionsListParams } from '@/features/qna/questions'
import { ROUTES } from '@/constants/routes'

type AnswerStatus = 'all' | 'answered' | 'unanswered'
type SortOption = NonNullable<QuestionsListParams['sort']>

const ANSWER_STATUSES = ['all', 'answered', 'unanswered'] as const
const SORT_OPTIONS = ['latest', 'oldest'] as const

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 300

const SORT_LABEL: Record<SortOption, string> = {
  latest: '최신순',
  oldest: '오래된순',
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
            <LoadingBox
              size="lg"
              label="질문 목록을 불러오는 중..."
              className="py-20"
            />
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
            <LoadingBox label="카테고리 불러오는 중..." className="py-8" />
          }
        >
          <CategoryFilter
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
              type="button"
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
