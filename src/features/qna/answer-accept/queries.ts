import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import api from '@/api/instance'
import type { AcceptAnswerResponse } from './types'

export function useAcceptAnswer(questionId: number) {
  const queryClient = useQueryClient()

  return useMutation<AcceptAnswerResponse, AxiosError, number>({
    mutationFn: (answerId: number) =>
      api
        .post<AcceptAnswerResponse>(`/api/v1/qna/answers/${answerId}/accept`)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] })
      queryClient.invalidateQueries({
        queryKey: ['question-detail', questionId],
      })
    },
  })
}
