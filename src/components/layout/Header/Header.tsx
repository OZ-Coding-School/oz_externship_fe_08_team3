import { useState } from 'react'
import logoImg from '@/assets/logo.png'
import defaultProfile from '@/assets/default-profile.png'
import { EXTERNAL_URLS } from '@/constants/routes'
import { ProfileDropdown } from './ProfileDropdown'
import { useAuthStore } from '@/stores/authStore'

export interface HeaderProps {
  bannerText?: string
  onLogout?: () => void
}

function HeaderBanner({ text }: { text: string }) {
  return (
    <div className="flex h-12 items-center justify-center bg-black px-4">
      <p className="truncate text-sm text-white sm:text-base">{text}</p>
    </div>
  )
}

function HeaderLogo() {
  return (
    <a
      href={EXTERNAL_URLS.HOME}
      className="flex shrink-0 items-center"
      aria-label="홈으로 이동"
    >
      <img
        src={logoImg}
        alt="OzCodingSchool"
        width={120}
        height={20}
        className="h-5 w-auto"
      />
    </a>
  )
}

function HeaderNav() {
  return (
    <nav className="hidden items-center gap-8 md:flex lg:gap-15">
      <a
        href={EXTERNAL_URLS.COMMUNITY}
        className="hover:text-primary px-2.5 py-2.5 text-lg tracking-tight text-gray-900 transition-colors duration-150"
      >
        커뮤니티
      </a>
      <a
        href={EXTERNAL_URLS.QNA}
        className="hover:text-primary px-2.5 py-2.5 text-lg tracking-tight text-gray-900 transition-colors duration-150"
      >
        질의응답
      </a>
    </nav>
  )
}

function AuthLinks() {
  return (
    <div className="flex items-center gap-3 text-sm tracking-tight text-gray-600 sm:text-base">
      <a
        href={EXTERNAL_URLS.LOGIN}
        className="transition-colors duration-150 hover:text-gray-900"
      >
        로그인
      </a>
      <span className="text-gray-400" aria-hidden="true">
        |
      </span>
      <a
        href={EXTERNAL_URLS.SIGNUP}
        className="transition-colors duration-150 hover:text-gray-900"
      >
        회원가입
      </a>
    </div>
  )
}

function ProfileMenu({
  dropdownOpen,
  setDropdownOpen,
  onLogout,
}: {
  dropdownOpen: boolean
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>
  onLogout?: () => void
}) {
  const { user } = useAuthStore()

  return (
    <div className="relative">
      <button
        type="button"
        onMouseEnter={() => setDropdownOpen(true)}
        onClick={() => setDropdownOpen((v) => !v)}
        aria-label="프로필 메뉴"
        aria-haspopup="menu"
        aria-expanded={dropdownOpen}
        className="focus-visible:ring-primary overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <img
          src={user?.profileImage ?? defaultProfile}
          alt=""
          width={40}
          height={40}
          className="aspect-square h-10 w-10 rounded-full object-cover"
        />
      </button>

      <ProfileDropdown
        isOpen={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        nickname={user?.nickname ?? ''}
        email={user?.email ?? ''}
        onLogout={() => {
          onLogout?.()
          setDropdownOpen(false)
        }}
      />
    </div>
  )
}

export function Header({
  bannerText = '🚨 선착순 모집! 국비지원 받고 4주 완성',
  onLogout,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <header className="flex w-full flex-col">
      <HeaderBanner text={bannerText} />

      <div className="border-b border-black/20 bg-white">
        <div className="max-w-container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8 lg:gap-15">
            <HeaderLogo />
            <HeaderNav />
          </div>

          {isAuthenticated ? (
            <ProfileMenu
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              onLogout={onLogout}
            />
          ) : (
            <AuthLinks />
          )}
        </div>
      </div>
    </header>
  )
}
