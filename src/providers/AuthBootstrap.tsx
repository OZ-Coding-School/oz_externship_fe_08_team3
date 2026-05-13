import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { fetchMe } from '@/features/accounts/me'
import { Spinner } from '@/components'

/**
 * 앱 시작 시 localStorage에 토큰이 있으면 /me를 호출해 사용자 정보를 복원한다.
 * 토큰이 없거나 만료되면 로그아웃 상태로 유지.
 */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const hasToken = Boolean(localStorage.getItem('accessToken'))
  const [isReady, setIsReady] = useState(!hasToken)
  const { login, logout } = useAuthStore()

  useEffect(() => {
    if (!hasToken) return

    fetchMe()
      .then((user) => {
        login({
          id: user.id,
          nickname: user.nickname,
          email: user.email,
          profileImage: user.profile_image,
          role: user.role,
        })
      })
      .catch(() => {
        // 토큰 만료/무효 → 로그아웃
        localStorage.removeItem('accessToken')
        logout()
      })
      .finally(() => {
        setIsReady(true)
      })
  }, [hasToken, login, logout])

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}
