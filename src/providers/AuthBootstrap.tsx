import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { fetchMe } from '@/features/accounts/me'
import { Spinner } from '@/components'

/** 쿠키의 Refresh Token으로 Access Token을 재발급받는다. */
async function refreshAccessToken(): Promise<string> {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/accounts/me/refresh`,
    {},
    { withCredentials: true }
  )
  return data.access_token
}

/** /me 응답을 authStore에 저장한다. */
function toLoginPayload(user: Awaited<ReturnType<typeof fetchMe>>) {
  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    profileImage: user.profile_image,
    role: user.role,
  }
}

/**
 * 앱 시작 시 인증 상태를 복원한다.
 * 1. localStorage에 토큰이 있으면 → /me 호출 (실패 시 refresh 후 재시도)
 * 2. 토큰이 없으면 → 쿠키의 Refresh Token으로 재발급 시도 후 /me 호출
 * 3. 모두 실패하면 비로그인 상태로 유지
 */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const { login, logout } = useAuthStore()

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem('accessToken'))

    const restoreWithToken = async () => {
      try {
        const user = await fetchMe()
        login(toLoginPayload(user))
      } catch {
        // 토큰 만료 → refresh 시도
        localStorage.removeItem('accessToken')
        await restoreWithRefresh()
      }
    }

    const restoreWithRefresh = async () => {
      try {
        const newToken = await refreshAccessToken()
        localStorage.setItem('accessToken', newToken)
        const user = await fetchMe()
        login(toLoginPayload(user))
      } catch {
        // 쿠키도 만료 → 비로그인 상태
        localStorage.removeItem('accessToken')
        logout()
      }
    }

    const restore = hasToken ? restoreWithToken : restoreWithRefresh

    restore().finally(() => setIsReady(true))
  }, [login, logout])

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}
