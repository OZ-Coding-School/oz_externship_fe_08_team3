interface PaginationProps {
  current: number
  total: number
  onChange: (page: number) => void
}

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
