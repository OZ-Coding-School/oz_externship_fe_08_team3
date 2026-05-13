import api from '@/api/instance'
import type { MeResponse } from './types'

/** 현재 로그인된 사용자 정보를 가져온다. */
export async function fetchMe(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>('/accounts/me')
  return data
}
