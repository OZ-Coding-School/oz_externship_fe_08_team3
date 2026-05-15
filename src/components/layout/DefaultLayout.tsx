import { useState } from 'react'
import { Outlet } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { ChatbotFab, ChatbotWidget } from '@/components/chatbot'
import { ChatbotPageContextSync } from '@/features/chatbot/ChatbotPageContextSync'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/stores/authStore'

// DEV 전용 권한별 로그인 패널 — 운영 빌드에서는 렌더링 안 됨
interface RoleOption {
  id?: number
  role: UserRole
  label: string
  color: string
  nickname?: string
  profileImage?: string
}

const ROLE_OPTIONS: RoleOption[] = [
  { role: 'USER', label: '일반회원', color: 'bg-gray-500' },
  {
    role: 'STUDENT',
    label: '수강생 (이미지 있음)',
    color: 'bg-blue-400',
    profileImage: 'https://i.pravatar.cc/80?u=student',
  },
  {
    role: 'STUDENT',
    id: 100,
    label: '질문 작성자',
    color: 'bg-blue-600',
    nickname: '질문자',
    profileImage: 'https://i.pravatar.cc/80?u=100',
  },
  {
    role: 'STUDENT',
    id: 211,
    label: '답변 작성자',
    color: 'bg-indigo-600',
    nickname: '테스트유저',
  },
  {
    role: 'STUDENT',
    id: 301,
    label: '댓글 작성자',
    color: 'bg-violet-600',
    nickname: '댓글러',
  },
  { role: 'TA', label: '튜터 (TA)', color: 'bg-green-500' },
  { role: 'OM', label: '운영매니저 (OM)', color: 'bg-yellow-500' },
  { role: 'LC', label: '강사 (LC)', color: 'bg-orange-500' },
  { role: 'ADMIN', label: '관리자', color: 'bg-red-500' },
]

function DevAuthPanel() {
  const { isAuthenticated, user, login, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  if (!import.meta.env.DEV) return null

  const handleLogin = ({
    id,
    role,
    label,
    nickname,
    profileImage,
  }: RoleOption) => {
    localStorage.setItem('accessToken', 'dev-mock-token')
    login({
      id,
      nickname: nickname ?? `Dev ${label}`,
      email: `${role.toLowerCase()}@test.com`,
      role,
      profileImage,
    })
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem('accessToken')
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {isOpen && (
        <div className="mb-2 rounded-lg border border-gray-700 bg-gray-900 p-3 shadow-xl">
          <p className="mb-2 text-xs font-semibold text-gray-400">DEV 로그인</p>
          <div className="flex flex-col gap-1">
            {ROLE_OPTIONS.map((option) => {
              const isActive =
                isAuthenticated &&
                user?.role === option.role &&
                user?.id === option.id
              return (
                <button
                  key={`${option.role}-${option.id ?? 'default'}`}
                  type="button"
                  onClick={() => handleLogin(option)}
                  className={[
                    'flex items-center gap-2 rounded px-3 py-1.5 text-left text-xs text-white transition-opacity hover:opacity-90',
                    option.color,
                    isActive
                      ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900'
                      : '',
                  ].join(' ')}
                >
                  <span>{option.label}</span>
                  {isActive && (
                    <span className="ml-auto text-[10px] opacity-75">현재</span>
                  )}
                </button>
              )
            })}
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 rounded bg-gray-700 px-3 py-1.5 text-xs text-white transition-opacity hover:opacity-90"
              >
                로그아웃
              </button>
            )}
          </div>
          {isAuthenticated && user && (
            <p className="mt-2 truncate text-[10px] text-gray-500">
              {user.nickname} · {user.role ?? '역할없음'}
              {user.id != null ? ` · id:${user.id}` : ''}
            </p>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-white opacity-60 hover:opacity-100"
      >
        {isAuthenticated ? `DEV: ${user?.role ?? '로그인됨'}` : 'DEV 로그인'}
      </button>
    </div>
  )
}

export function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatbotPageContextSync />
      <ChatbotFab />
      <ChatbotWidget />
      <DevAuthPanel />
    </div>
  )
}
