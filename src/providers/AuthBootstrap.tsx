import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { fetchMe } from '@/features/accounts/me'
import { Spinner } from '@/components'

/**
 * 앱 시작 시 인증 상태를 복원한다.
 *
 * 1. localStorage에 accessToken이 있으면 /me로 사용자 정보를 복원한다.
 * 2. accessToken이 없으면 refresh 쿠키로 silent refresh를 시도한다.
 *    (다른 서브도메인에서 로그인한 경우 쿠키가 .ozcodingschool.site 전체에 공유됨)
 * 3. 둘 다 실패하면 비로그인 상태로 유지한다 (리다이렉트 없음).
 */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const { login, logout } = useAuthStore()

  useEffect(() => {
    const init = async () => {
      let token = localStorage.getItem('accessToken')

      // localStorage에 토큰이 없으면 refresh 쿠키로 silent refresh 시도
      if (!token) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/accounts/me/refresh`,
            {},
            { withCredentials: true }
          )
          token = data.access_token
          localStorage.setItem('accessToken', token!)
        } catch {
          // refresh 쿠키도 없음 → 비로그인 상태 유지 (리다이렉트 없음)
          logout()
          setIsReady(true)
          return
        }
      }

      // 토큰으로 사용자 정보 복원
      try {
        const user = await fetchMe()
        login({
          id: user.id,
          nickname: user.nickname,
          email: user.email,
          profileImage: user.profile_image,
          role: user.role,
        })
      } catch {
        // 토큰 만료/무효 → 비로그인 상태 유지
        localStorage.removeItem('accessToken')
        logout()
      } finally {
        setIsReady(true)
      }
    }

    init()
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
