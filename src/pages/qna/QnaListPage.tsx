/**
 * @figma 질의응답 - 질문 목록페이지 https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-5893&m=dev
 */

import { Suspense, useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import {
  Pencil,
  ArrowUpDown,
  SlidersHorizontal,
  RotateCw,
  X,
} from 'lucide-react'
import {
  Tabs,
  TabList,
  Tab,
  SearchInput,
  Modal,
  LoadingBox,
  Pagination,
  QuestionCard,
  CategoryFilter,
} from '@/components'
import { useQnaQuestions } from '@/features/qna/questions'
import type { QuestionsListParams } from '@/features/qna/questions'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/stores/authStore'
import { redirectToLogin } from '@/utils/loginRedirect'

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

// ── 정렬 Popover ─────────────────────────────────────────────────

function SortPopover({
  sort,
  onSelect,
}: {
  sort: SortOption
  onSelect: (opt: SortOption) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [focusIndex, setFocusIndex] = useState(-1)

  // 외부 클릭 닫기
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  // ESC 닫기 + 키보드 네비게이션
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setOpen(false)
          triggerRef.current?.focus()
          break
        case 'ArrowDown':
          e.preventDefault()
          setFocusIndex((prev) =>
            prev < SORT_OPTIONS.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusIndex((prev) =>
            prev > 0 ? prev - 1 : SORT_OPTIONS.length - 1
          )
          break
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // 열릴 때 & focusIndex 변경 시 해당 버튼에 포커스
  useEffect(() => {
    if (!open) return
    const buttons =
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    if (focusIndex >= 0) {
      buttons?.[focusIndex]?.focus()
    }
  }, [open, focusIndex])

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
        onClick={() => {
          setOpen((p) => {
            if (!p) {
              const idx = SORT_OPTIONS.indexOf(sort)
              setFocusIndex(idx >= 0 ? idx : 0)
            }
            return !p
          })
        }}
        className="flex items-center gap-1 text-base text-gray-700"
      >
        {SORT_LABEL[sort]}
        <ArrowUpDown className="h-5 w-5" />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute top-full right-0 z-50 mt-2 flex w-[138px] flex-col rounded-xl bg-white p-4 shadow-[0_0_16px_rgba(160,160,160,0.25)]"
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                onSelect(opt)
                setOpen(false)
                triggerRef.current?.focus()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(opt)
                  setOpen(false)
                  triggerRef.current?.focus()
                }
              }}
              className={[
                'flex h-[42px] items-center justify-center rounded px-5 text-base font-bold transition-colors',
                sort === opt
                  ? 'bg-[#EFE6FC] text-[#6201E0]'
                  : 'text-[#4D4D4D] hover:bg-[#EFE6FC]',
              ].join(' ')}
            >
              {SORT_LABEL[opt]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── QnaListPage ───────────────────────────────────────────────────

export function QnaListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

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

  // 카테고리 필터 상태 (CategoryFilter에서 전달받음)
  const [tempCategoryId, setTempCategoryId] = useState<number | undefined>(
    categoryId
  )
  const [filterResetKey, setFilterResetKey] = useState(0)
  const handleResetFilter = () => {
    setTempCategoryId(undefined)
    setFilterResetKey((k) => k + 1)
  }

  // URL → inputValue 동기화 (뒤로가기 대응)
  useEffect(() => {
    setInputValue(searchKeyword)
  }, [searchKeyword])

  // Debounce search input → URL update
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
    <div className="mx-auto w-full max-w-[944px] overflow-hidden px-4 pt-[52px] pb-20">
      {/* 페이지 타이틀 */}
      <h1 className="mb-8 text-[32px] leading-[1.4] font-bold tracking-[-0.03em] text-[#121212]">
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
          onClick={() =>
            isAuthenticated ? navigate(ROUTES.QNA.WRITE) : redirectToLogin()
          }
          className="flex h-12 items-center gap-2 rounded-sm bg-[#6201E0] px-9 text-base font-bold text-white transition-colors hover:bg-[#4E01B3]"
        >
          <Pencil className="h-5 w-5" />
          질문하기
        </button>
      </div>

      {/* 탭 + 정렬/필터를 한 줄에 배치 */}
      <Tabs value={answerStatus} onChange={handleTabChange}>
        <div className="flex items-end justify-between border-b border-[#CECECE]">
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
                hasFilter ? 'font-medium text-[#6201E0]' : 'text-[#121212]',
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
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        maxWidth="max-w-[580px]"
        hideCloseButton
        footer={
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleResetFilter()}
              className="flex h-[42px] w-[162px] items-center gap-2 rounded text-xl text-[#4D4D4D] transition-colors hover:bg-gray-100"
            >
              <RotateCw className="h-6 w-6" />
              선택 초기화
            </button>
            <button
              type="button"
              onClick={() => {
                const id = tempCategoryId
                updateParam('category_id', id != null ? String(id) : null)
                setShowCategoryModal(false)
              }}
              className="h-[54px] w-[278px] rounded bg-[#6201E0] text-xl font-bold text-white transition-colors hover:bg-[#4E01B3]"
            >
              필터 적용하기
            </button>
          </div>
        }
      >
        {/* 커스텀 헤더 */}
        <div className="-mx-6 -mt-5 mb-0 flex items-center justify-between px-12 pt-11">
          <h2 className="text-[32px] leading-[1.4] font-bold text-[#121212]">
            필터
          </h2>
          <button
            type="button"
            onClick={() => setShowCategoryModal(false)}
            aria-label="닫기"
            className="rounded-lg p-1 text-[#9D9D9D] transition-colors hover:text-[#121212]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="-mx-6 px-12 pt-[60px] pb-10">
          <h3 className="mb-5 text-xl font-bold text-[#4D4D4D]">
            카테고리 선택
          </h3>
          <Suspense
            fallback={
              <LoadingBox label="카테고리 불러오는 중..." className="py-8" />
            }
          >
            <CategoryFilter
              key={filterResetKey}
              selectedId={tempCategoryId}
              onChange={setTempCategoryId}
            />
          </Suspense>
        </div>
      </Modal>
    </div>
  )
}
