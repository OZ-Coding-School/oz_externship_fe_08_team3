import axios from 'axios'
import type { MeResponse } from './types'

/**
 * 현재 로그인된 사용자 정보를 가져온다.
 * interceptor를 거치지 않는 별도 axios 사용 — /me 실패 시 로그인 리다이렉트 방지.
 * AuthBootstrap에서 실패를 직접 처리한다 (토큰 삭제 + 비로그인 상태 유지).
 */
export async function fetchMe(): Promise<MeResponse> {
  const token = localStorage.getItem('accessToken')
  const { data } = await axios.get<MeResponse>(
    `${import.meta.env.VITE_API_BASE_URL}/accounts/me`,
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  )
  return data
}
