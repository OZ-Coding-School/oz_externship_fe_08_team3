/**
 * @figma 질의응답 - 질문 목록페이지 https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-5893&m=dev
 */

import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { Pencil, SlidersHorizontal } from 'lucide-react'
import {
  Tabs,
  TabList,
  Tab,
  SearchInput,
  LoadingBox,
  Pagination,
  QuestionCard,
} from '@/components'
import { SortPopover } from '@/components/qna/SortPopover'
import { CategoryFilterModal } from '@/components/qna/CategoryFilterModal'
import { useQnaQuestions } from '@/features/qna/questions'
import type { QuestionsListParams } from '@/features/qna/questions'
import { ROUTES } from '@/constants/routes'

type AnswerStatus = 'all' | 'answered' | 'unanswered'
type SortOption = NonNullable<QuestionsListParams['sort']>

const ANSWER_STATUSES = ['all', 'answered', 'unanswered'] as const

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 300

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
  const sort: SortOption = (['latest', 'oldest'] as readonly string[]).includes(
    rawSort
  )
    ? (rawSort as SortOption)
    : 'latest'

  const rawPage = Number(searchParams.get('page') ?? 1)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1

  const [inputValue, setInputValue] = useState(searchKeyword)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  // URL -> inputValue 동기화 (뒤로가기 대응)
  useEffect(() => {
    setInputValue(searchKeyword)
  }, [searchKeyword])

  // Debounce search input -> URL update
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

  const updateParam = (key: string, value: string | null) => {
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
  }

  const handleTabChange = (value: string) => {
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
  }

  const handlePageChange = (newPage: number) => {
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
  }

  const handleCategoryApply = (id: number | undefined) => {
    updateParam('category_id', id != null ? String(id) : null)
  }

  const hasFilter = categoryId != null

  return (
    <div className="mx-auto w-full max-w-[944px] overflow-hidden px-4 pt-[52px] pb-20">
      {/* 페이지 타이틀 */}
      <h1 className="mb-8 text-[32px] leading-[1.4] font-bold tracking-[-0.03em] text-gray-900">
        질의응답
      </h1>

      {/* 검색바 + 질문하기 버튼 */}
      <div className="mb-[52px] flex items-center justify-between">
        <SearchInput
          value={inputValue}
          onValueChange={setInputValue}
          placeholder="질문 검색"
          className="w-[472px]"
          aria-label="질문 검색"
        />

        <button
          type="button"
          onClick={() => navigate(ROUTES.QNA.WRITE)}
          className="bg-primary hover:bg-primary-800 flex h-12 items-center gap-2 rounded-sm px-9 text-base font-bold text-white transition-colors"
        >
          <Pencil className="h-5 w-5" />
          질문하기
        </button>
      </div>

      {/* 탭 + 정렬/필터를 한 줄에 배치 */}
      <Tabs value={answerStatus} onChange={handleTabChange}>
        <div className="flex items-end justify-between border-b border-gray-300 pb-2">
          <TabList aria-label="답변 상태 필터" className="flex gap-10 border-0">
            <Tab value="all">전체보기</Tab>
            <Tab value="answered">답변완료</Tab>
            <Tab value="unanswered">답변 대기중</Tab>
          </TabList>

          {/* 정렬 popover + 필터 */}
          <div className="flex items-center gap-3">
            <SortPopover
              sort={sort}
              onSelect={(opt) => updateParam('sort', opt)}
            />
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className={[
                'flex items-center gap-1 text-base',
                hasFilter ? 'text-primary font-medium' : 'text-gray-900',
              ].join(' ')}
            >
              필터
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          {/* 질문 목록 */}
          {isLoading && (
            <LoadingBox
              size="lg"
              label="질문 목록을 불러오는 중..."
              className="py-20"
            />
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-20 text-center text-[#9D9D9D]">
              <p className="text-error mb-2 font-medium">
                질문 목록을 불러오지 못했습니다.
              </p>
              <p className="text-sm">잠시 후 다시 시도해 주세요.</p>
            </div>
          )}

          {!isLoading && !isError && data && (
            <>
              {data.results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-[#9D9D9D]">
                  <p className="font-medium">등록된 질문이 없습니다.</p>
                  {searchKeyword && (
                    <p className="mt-1 text-sm">
                      &apos;{searchKeyword}&apos;에 대한 검색 결과가 없습니다.
                    </p>
                  )}
                </div>
              ) : (
                <ul className="flex flex-col">
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
      <CategoryFilterModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categoryId={categoryId}
        onApply={handleCategoryApply}
      />
    </div>
  )
}
