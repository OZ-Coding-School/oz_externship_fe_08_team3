import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

interface PaginationProps {
  current: number
  total: number
  onChange: (page: number) => void
}

const NAV_BTN =
  'flex h-9 w-9 items-center justify-center rounded-full text-[#9D9D9D] transition-colors hover:text-[#121212] disabled:cursor-not-allowed disabled:text-gray-300'

export function Pagination({ current, total, onChange }: PaginationProps) {
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
      {/* First */}
      <button
        onClick={() => onChange(1)}
        disabled={current === 1}
        aria-label="첫 페이지"
        className={NAV_BTN}
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>

      {/* Prev */}
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label="이전 페이지"
        className={NAV_BTN}
      >
        <ChevronLeft className="h-4 w-4" />
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

      {/* Next */}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        aria-label="다음 페이지"
        className={NAV_BTN}
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Last */}
      <button
        onClick={() => onChange(total)}
        disabled={current === total}
        aria-label="마지막 페이지"
        className={NAV_BTN}
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
