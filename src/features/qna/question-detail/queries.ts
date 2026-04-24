import { useQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { GetQuestionDetailResponse } from './types'

export function useGetQuestionDetail(questionId: number) {
  return useQuery({
    queryKey: ['question-detail', questionId],
    queryFn: () =>
      api
        .get<GetQuestionDetailResponse>(`/api/v1/qna/questions/${questionId}/`)
        .then((res) => res.data),
    staleTime: 60_000,
    retry: 1,
    enabled: questionId > 0,
  })
}
