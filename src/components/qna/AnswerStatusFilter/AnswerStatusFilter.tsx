export type AnswerStatusFilterValue = 'all' | 'answered' | 'unanswered'

const STATUS_OPTIONS: {
  value: AnswerStatusFilterValue
  label: string
}[] = [
  { value: 'all', label: '전체보기' },
  { value: 'answered', label: '답변완료' },
  { value: 'unanswered', label: '답변 대기중' },
]

export function AnswerStatusFilter({
  value,
  onChange,
}: {
  value: AnswerStatusFilterValue
  onChange: (value: AnswerStatusFilterValue) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="답변 상태 필터"
      className="flex min-w-0 flex-wrap gap-x-3 gap-y-2 sm:gap-x-10"
    >
      {STATUS_OPTIONS.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={[
              'relative shrink-0 px-2 py-3 text-sm font-medium transition-colors duration-150 outline-none sm:px-4',
              'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-inset',
              selected
                ? 'text-primary after:bg-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-t-full'
                : 'text-text-muted hover:text-text-body',
            ].join(' ')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
