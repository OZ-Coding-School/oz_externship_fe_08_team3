import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/instance'
import type { QuestionDeleteResponse } from './types'

export function useDeleteQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (questionId: number) =>
      api
        .delete<QuestionDeleteResponse>(`/qna/questions/${questionId}/`)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qna', 'questions'] })
    },
  })
}
