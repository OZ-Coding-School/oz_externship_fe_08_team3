import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/instance'
import type { PostCommentRequest, PostCommentResponse } from './types'

export function usePostComment(answerId: number, questionId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PostCommentRequest) =>
      api
        .post<PostCommentResponse>(`/qna/answers/${answerId}/comments`, data)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] })
      queryClient.invalidateQueries({
        queryKey: ['question-detail', questionId],
      })
    },
  })
}
