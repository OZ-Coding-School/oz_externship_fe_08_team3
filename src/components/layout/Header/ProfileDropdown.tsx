import { useEffect, useRef } from 'react'
import { Button } from '@/components/common/Button'

export interface ProfileDropdownProps {
  isOpen: boolean
  onClose: () => void
  nickname: string
  email: string
  onEnroll?: () => void
  onMypage?: () => void
  onLogout?: () => void
}

export function ProfileDropdown({
  isOpen,
  onClose,
  nickname,
  email,
  onEnroll,
  onMypage,
  onLogout,
}: ProfileDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  // 외부 클릭 닫기
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, onClose])

  // ESC 키 닫기
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // 열릴 때 첫 메뉴 항목으로 포커스 이동
  useEffect(() => {
    if (!isOpen) return
    const firstItem =
      ref.current?.querySelector<HTMLElement>('[role="menuitem"]')
    firstItem?.focus()
  }, [isOpen])

  // 메뉴 내 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items =
      ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')
    if (!items?.length) return

    const current = document.activeElement as HTMLElement
    const index = Array.from(items).indexOf(current)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = index < items.length - 1 ? index + 1 : 0
      items[next].focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = index > 0 ? index - 1 : items.length - 1
      items[prev].focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      items[0].focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      items[items.length - 1].focus()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="프로필 메뉴"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="absolute top-full right-0 z-50 mt-2 w-[204px] rounded-xl bg-white px-4 py-6 shadow-[0px_0px_16px_0px_rgba(160,160,160,0.25)]"
    >
      <div className="flex flex-col gap-2">
        {/* 사용자 정보 */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold tracking-tight text-gray-900">
            {nickname}
          </p>
          <p className="text-sm tracking-tight break-all text-gray-400">
            {email}
          </p>
        </div>

        {/* 구분선 */}
        <div className="my-2 border-t border-gray-200" role="separator" />

        {/* 메뉴 항목 */}
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            role="menuitem"
            tabIndex={-1}
            onClick={onEnroll}
            className="text-text-heading hover:text-primary h-12 justify-start"
          >
            수강생 등록
          </Button>
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            role="menuitem"
            tabIndex={-1}
            onClick={onMypage}
            className="text-text-heading hover:text-primary h-12 justify-start tracking-tight"
          >
            마이페이지
          </Button>
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            role="menuitem"
            tabIndex={-1}
            onClick={onLogout}
            className="text-text-heading hover:text-primary h-12 justify-start tracking-tight"
          >
            로그아웃
          </Button>
        </div>
      </div>
    </div>
  )
}
