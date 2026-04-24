import { useMutation } from '@tanstack/react-query'
import api from '@/api/instance'
import type { PostAnswerRequest, PostAnswerResponse } from './types'

export function usePostAnswer(questionId: number) {
  return useMutation({
    mutationFn: (data: PostAnswerRequest) =>
      api
        .post<PostAnswerResponse>(
          `/api/v1/qna/questions/${questionId}/answers`,
          data
        )
        .then((res) => res.data),
  })
}
