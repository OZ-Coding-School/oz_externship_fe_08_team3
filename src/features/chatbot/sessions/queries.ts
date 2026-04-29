import { queryOptions, useQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { ChatSessionListResponse } from './types'

// TODO: 실제 백엔드 API 경로 확인 후 조정 필요
export const SESSIONS_QUERY_KEY = ['chatbot', 'sessions'] as const

export const sessionsQueryOptions = queryOptions({
  queryKey: [...SESSIONS_QUERY_KEY],
  queryFn: () =>
    api.get<ChatSessionListResponse>('/chatbot/sessions/').then((r) => r.data),
  staleTime: 0,
})

export function useGetSessions() {
  return useQuery(sessionsQueryOptions)
}
