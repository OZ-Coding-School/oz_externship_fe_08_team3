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

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 z-50 mt-2 w-[204px] rounded-xl bg-white px-4 py-6 shadow-[0px_0px_16px_0px_rgba(160,160,160,0.25)]"
    >
      <div className="flex flex-col gap-2">
        {/* User info */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold tracking-tight text-gray-900">
            {nickname}
          </p>
          <p className="text-sm tracking-tight break-all text-gray-400">
            {email}
          </p>
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-gray-200" />

        {/* Menu */}
        <nav className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={onEnroll}
            className="text-text-heading hover:text-primary h-12 justify-start"
          >
            수강생 등록
          </Button>
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={onMypage}
            className="text-text-heading hover:text-primary h-12 justify-start tracking-tight"
          >
            마이페이지
          </Button>
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={onLogout}
            className="text-text-heading hover:text-primary h-12 justify-start tracking-tight"
          >
            로그아웃
          </Button>
        </nav>
      </div>
    </div>
  )
}

export default ProfileDropdown
