import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import api from '@/api/instance'
import type {
  PostAnswerRequest,
  PostAnswerResponse,
  GetAnswersResponse,
  PutAnswerRequest,
  PutAnswerResponse,
} from './types'

export function usePostAnswer(questionId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PostAnswerRequest) =>
      api
        .post<PostAnswerResponse>(`/qna/questions/${questionId}/answers`, data)
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
        .get<GetAnswersResponse>(`/qna/questions/${questionId}/answers`)
        .then((res) => res.data),
    staleTime: 60_000,
    retry: 1,
    enabled: questionId > 0,
  })
}

export function usePutAnswer(answerId: number | undefined, questionId: number) {
  const queryClient = useQueryClient()

  return useMutation<PutAnswerResponse, AxiosError, PutAnswerRequest>({
    mutationFn: async (data: PutAnswerRequest) => {
      if (answerId === undefined) throw new Error('answerId is required')
      const res = await api.put<PutAnswerResponse>(
        `/qna/answers/${answerId}`,
        data
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] })
    },
  })
}
