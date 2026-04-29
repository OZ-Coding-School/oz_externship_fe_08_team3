import { Outlet } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { ChatbotFab, ChatbotWidget } from '@/components/chatbot'
import { ChatbotPageContextSync } from '@/features/chatbot/ChatbotPageContextSync'
import { useAuthStore } from '@/stores/authStore'

// DEV 전용 로그인 버튼 — 운영 빌드에서는 렌더링 안 됨
function DevLoginButton() {
  const { isAuthenticated, login, logout } = useAuthStore()

  if (!import.meta.env.DEV) return null

  const handleClick = () => {
    if (isAuthenticated) {
      logout()
      localStorage.removeItem('accessToken')
    } else {
      localStorage.setItem('accessToken', 'dev-mock-token')
      login({ nickname: 'dev', email: 'dev@test.com' })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-4 left-4 z-50 rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-white opacity-60 hover:opacity-100"
    >
      {isAuthenticated ? 'DEV 로그아웃' : 'DEV 로그인'}
    </button>
  )
}

export function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
      <Footer />
      <ChatbotPageContextSync />
      <ChatbotFab />
      <ChatbotWidget />
      <DevLoginButton />
    </div>
  )
}
