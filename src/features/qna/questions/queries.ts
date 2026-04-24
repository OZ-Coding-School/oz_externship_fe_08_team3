import { queryOptions, useQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { QuestionsListResponse, QuestionsListParams } from './types'

function questionsQueryOptions(params: QuestionsListParams = {}) {
  const normalized = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v != null && v !== '')
  ) as QuestionsListParams

  return queryOptions({
    queryKey: ['qna', 'questions', 'list', normalized],
    queryFn: async () => {
      const { data } = await api.get<QuestionsListResponse>('/qna/questions/', {
        params: normalized,
      })
      return data
    },
    placeholderData: (prev) => prev,
  })
}

// 탭/필터/페이지 전환 시 stale 데이터를 유지하고 isLoading 상태를 직접 제어하기 위해 useQuery 사용
export function useQnaQuestions(params: QuestionsListParams = {}) {
  return useQuery(questionsQueryOptions(params))
}
