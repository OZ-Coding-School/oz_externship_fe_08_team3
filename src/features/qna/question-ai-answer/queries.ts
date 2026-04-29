import { useMutation } from '@tanstack/react-query'
import api from '@/api/instance'
import type { AiFirstAnswerResponse } from './types'

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
