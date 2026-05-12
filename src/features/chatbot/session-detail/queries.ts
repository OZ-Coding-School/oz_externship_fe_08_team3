import { queryOptions, useQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { ChatSessionDetailResponse } from './types'

export const SESSION_DETAIL_QUERY_KEY = (sessionId: number) =>
  ['chatbot', 'session-detail', sessionId] as const

export const sessionDetailQueryOptions = (sessionId: number) =>
  queryOptions({
    queryKey: [...SESSION_DETAIL_QUERY_KEY(sessionId)],
    queryFn: () =>
      api
        .get<ChatSessionDetailResponse>(`/chatbot/sessions/${sessionId}/`)
        .then((r) => r.data),
    staleTime: 0,
    enabled: sessionId > 0,
  })

export function useGetSessionDetail(sessionId: number) {
  return useQuery(sessionDetailQueryOptions(sessionId))
}
