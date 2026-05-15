import { useMutation, useQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { AiFirstAnswerResponse } from './types'

export const AI_FIRST_ANSWER_QUERY_KEY = (questionId: number) =>
  ['qna', 'ai-first-answer', questionId] as const

export function useGetAiFirstAnswer(
  questionId: number,
  enabled: boolean = true
) {
  return useQuery<AiFirstAnswerResponse>({
    queryKey: AI_FIRST_ANSWER_QUERY_KEY(questionId),
    queryFn: () =>
      api
        .get<AiFirstAnswerResponse>(`/qna/questions/${questionId}/ai-answer`)
        .then((res) => res.data),
    enabled: enabled && questionId > 0,
    retry: false,
  })
}

export function useCreateAiFirstAnswer(questionId: number) {
  return useMutation({
    mutationFn: () =>
      api
        .post<AiFirstAnswerResponse>(
          `/qna/questions/${questionId}/ai-answer`,
          null,
          { timeout: 30_000 }
        )
        .then((res) => res.data),
  })
}
