import {
  queryOptions,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import api from '@/api/instance'
import type { GetQuestionDetailResponse } from '@/features/qna/question-detail'
import type {
  QuestionUpdateRequest,
  QuestionUpdateResponse,
  GetQuestionPresignedUrlRequest,
  GetQuestionPresignedUrlResponse,
} from './types'

const questionDetailQueryOptions = (questionId: number) =>
  queryOptions({
    queryKey: ['question-detail', questionId],
    queryFn: () =>
      api
        .get<GetQuestionDetailResponse>(`/qna/questions/${questionId}/`)
        .then((res) => res.data),
    staleTime: 60_000,
    retry: 1,
  })

export function useSuspenseGetQuestionDetail(questionId: number) {
  return useSuspenseQuery(questionDetailQueryOptions(questionId))
}

export function useUpdateQuestion(questionId: number) {
  const queryClient = useQueryClient()
  return useMutation<QuestionUpdateResponse, AxiosError, QuestionUpdateRequest>(
    {
      mutationFn: async (payload) => {
        const { data } = await api.put<QuestionUpdateResponse>(
          `/qna/questions/${questionId}/`,
          payload
        )
        return data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['question-detail', questionId],
        })
        queryClient.invalidateQueries({ queryKey: ['qna', 'questions'] })
      },
    }
  )
}

export function useGetQuestionPresignedUrl() {
  return useMutation({
    mutationFn: (data: GetQuestionPresignedUrlRequest) =>
      api
        .post<GetQuestionPresignedUrlResponse>(
          '/qna/questions/presigned-url',
          data
        )
        .then((res) => res.data),
  })
}
