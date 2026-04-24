import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/api/instance'
import type {
  PostAnswerRequest,
  PostAnswerResponse,
  GetAnswersResponse,
} from './types'

export function usePostAnswer(questionId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PostAnswerRequest) =>
      api
        .post<PostAnswerResponse>(
          `/api/v1/qna/questions/${questionId}/answers`,
          data
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] })
    },
  })
}

export function useGetAnswers(questionId: number) {
  return useQuery({
    queryKey: ['answers', questionId],
    queryFn: () =>
      api
        .get<GetAnswersResponse>(`/api/v1/qna/questions/${questionId}/answers`)
        .then((res) => res.data),
    staleTime: 60_000,
    retry: 1,
    enabled: questionId > 0,
  })
}
