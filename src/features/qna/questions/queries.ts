import { queryOptions, useQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { QuestionsListResponse, QuestionsListParams } from './types'

function questionsQueryOptions(params: QuestionsListParams = {}) {
  return queryOptions({
    queryKey: ['qna', 'questions', params],
    queryFn: async () => {
      const { data } = await api.get<QuestionsListResponse>('/qna/questions/', {
        params,
      })
      return data
    },
  })
}

export function useQnaQuestions(params: QuestionsListParams = {}) {
  return useQuery(questionsQueryOptions(params))
}
