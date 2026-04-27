import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import api from '@/api/instance'
import type { AcceptAnswerResponse } from './types'

export function useAcceptAnswer(answerId: number, questionId: number) {
  const queryClient = useQueryClient()

  return useMutation<AcceptAnswerResponse, AxiosError>({
    mutationFn: () =>
      api
        .post<AcceptAnswerResponse>(`/api/v1/qna/answers/${answerId}/accept`)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] })
    },
  })
}
