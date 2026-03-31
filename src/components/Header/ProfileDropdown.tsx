import { useEffect, useRef } from 'react'
import { Button } from '@/components/Button'

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
      className="absolute right-0 top-full mt-2 w-[204px] bg-white rounded-xl shadow-[0px_0px_16px_0px_rgba(160,160,160,0.25)] px-4 py-6 z-50"
    >
      <div className="flex flex-col gap-2">
        {/* User info */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold text-gray-900 tracking-tight ">
            {nickname}
          </p>
          <p className="text-sm text-gray-400 tracking-tight break-all">
            {email}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-2" />

        {/* Menu */}
        <nav className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={onEnroll}
            className="justify-start text-text-heading h-12 hover:text-primary"
          >
            수강생 등록
          </Button>
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={onMypage}
            className="justify-start tracking-tight text-text-heading h-12 hover:text-primary"
          >
            마이페이지
          </Button>
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={onLogout}
            className="justify-start tracking-tight text-text-heading h-12 hover:text-primary"
          >
            로그아웃
          </Button>
        </nav>
      </div>
    </div>
  )
}

export default ProfileDropdown
