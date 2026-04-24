import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/instance'
import type { PutAnswerRequest, PutAnswerResponse } from './types'

export function usePutAnswer(answerId: number, questionId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PutAnswerRequest) =>
      api
        .put<PutAnswerResponse>(`/api/v1/qna/answers/${answerId}`, data)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] })
    },
  })
}
