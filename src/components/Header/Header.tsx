import { useState } from 'react'
import { useNavigate } from 'react-router'
import logoImg from '@/assets/logo.png'
import { ROUTES } from '../../constants/routes'
import { ProfileIcon } from './icons'
import { ProfileDropdown } from './ProfileDropdown'
import { useAuthStore } from '@/stores/authStore'

export interface HeaderUser {
  nickname: string
  email: string
  profileImage?: string | null
}

export interface HeaderProps {
  bannerText?: string
  onLogout?: () => void
}

export function Header({
  bannerText = '🚨 선착순 모집! 국비지원 받고 4주 완성',
  onLogout,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()

  return (
    <header className="flex flex-col w-full">
      {/* Top banner */}
      <div className="bg-black flex items-center justify-center h-12 px-4">
        <p className="text-base text-white whitespace-nowrap">
          {bannerText}
        </p>
      </div>

      {/* Navigation bar */}
      <div className="bg-white border-b border-black/20">
        <div className="max-w-[1200px] mx-auto h-16 flex items-center justify-between px-4">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-15">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="flex items-center shrink-0"
              aria-label="홈으로 이동"
            >
              <img src={logoImg} alt="OzCodingSchool" className="h-5 w-auto" />
            </button>

            <nav className="flex items-center gap-15">
              <button
                onClick={() => navigate(ROUTES.COMMUNITY.LIST)}
                className="text-lg text-gray-900 tracking-tight hover:text-primary transition-colors duration-150 py-2.5 px-2.5"
              >
                커뮤니티
              </button>
              <button
                onClick={() => navigate(ROUTES.QNA.LIST)}
                className="text-lg text-gray-900 tracking-tight hover:text-primary transition-colors duration-150 py-2.5 px-2.5"
              >
                질의응답
              </button>
            </nav>
          </div>

          {/* Right: Auth or Profile */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onMouseEnter={() => setDropdownOpen(true)}
                onClick={() => setDropdownOpen((v) => !v)}
                aria-label="프로필 메뉴"
                aria-expanded={dropdownOpen}
                className="rounded-full overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
              >
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <ProfileIcon />
                )}
              </button>

              <ProfileDropdown
                isOpen={dropdownOpen}
                onClose={() => setDropdownOpen(false)}
                nickname={user!.nickname}
                email={user!.email}
                onEnroll={() => { navigate(ROUTES.ENROLL); setDropdownOpen(false) }}
                onMypage={() => { navigate(ROUTES.MYPAGE.PROFILE); setDropdownOpen(false) }}
                onLogout={() => { onLogout?.(); setDropdownOpen(false) }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 text-base text-gray-600 tracking-tight">
              <button
                onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                className="hover:text-gray-900 transition-colors duration-150"
              >
                로그인
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => navigate(ROUTES.AUTH.SIGNUP)}
                className="hover:text-gray-900 transition-colors duration-150"
              >
                회원가입
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
