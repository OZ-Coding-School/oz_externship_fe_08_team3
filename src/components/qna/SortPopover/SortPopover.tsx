import { useState, useEffect, useRef } from 'react'
import { ArrowUpDown } from 'lucide-react'
import type { QuestionsListParams } from '@/features/qna/questions'

type SortOption = NonNullable<QuestionsListParams['sort']>

const SORT_OPTIONS = ['latest', 'oldest'] as const

const SORT_LABEL: Record<SortOption, string> = {
  latest: '최신순',
  oldest: '오래된순',
}

// ── 정렬 Popover ─────────────────────────────────────────────────

export function SortPopover({
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

  // 외부 클릭 닫기 + ESC/키보드 네비게이션
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

    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKeyDown)
    }
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
        aria-expanded={open}
        onClick={() => {
          setOpen((p) => {
            if (!p) {
              const idx = SORT_OPTIONS.indexOf(sort)
              setFocusIndex(idx >= 0 ? idx : 0)
            }
            return !p
          })
        }}
        className="flex items-center gap-1 text-base text-[#303030]"
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
