import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import api from '@/api/instance'
import type { AcceptAnswerResponse } from './types'

export function useAcceptAnswer(questionId: number) {
  const queryClient = useQueryClient()

  return useMutation<AcceptAnswerResponse, AxiosError, number>({
    mutationFn: (answerId: number) =>
      api
        .post<AcceptAnswerResponse>(`/qna/answers/${answerId}/accept`)
        .then((res) => res.data),
    onSuccess: () => {
      // TanStack Query가 두 호출을 내부적으로 병렬 처리한다
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] })
      queryClient.invalidateQueries({
        queryKey: ['question-detail', questionId],
      })
    },
  })
}
