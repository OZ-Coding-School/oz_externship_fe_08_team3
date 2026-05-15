import { useEffect, useRef } from 'react'
import { Button } from '@/components/common/Button'
import { EXTERNAL_URLS } from '@/constants/routes'

export interface ProfileDropdownProps {
  isOpen: boolean
  onClose: () => void
  nickname: string
  email: string
  onLogout?: () => void
}

export function ProfileDropdown({
  isOpen,
  onClose,
  nickname,
  email,
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
          <a
            href={EXTERNAL_URLS.SIGNUP}
            role="menuitem"
            tabIndex={-1}
            className="text-text-heading hover:text-primary hover:bg-bg-accent flex h-12 items-center rounded-md px-3 text-sm font-medium transition-colors"
          >
            수강생 등록
          </a>
          <a
            href={EXTERNAL_URLS.MYPAGE}
            role="menuitem"
            tabIndex={-1}
            className="text-text-heading hover:text-primary hover:bg-bg-accent flex h-12 items-center rounded-md px-3 text-sm font-medium tracking-tight transition-colors"
          >
            마이페이지
          </a>
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
