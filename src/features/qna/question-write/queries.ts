import { useMutation } from '@tanstack/react-query'
import api from '@/api/instance'
import type { QuestionCreateRequest, QuestionCreateResponse } from './types'

export function useCreateQuestion() {
  return useMutation({
    mutationFn: async (payload: QuestionCreateRequest) => {
      const { data } = await api.post<QuestionCreateResponse>(
        '/api/v1/qna/questions/',
        payload
      )
      return data
    },
  })
}
