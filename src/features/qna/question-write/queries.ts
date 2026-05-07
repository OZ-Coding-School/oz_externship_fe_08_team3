import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import api from '@/api/instance'
import type { QuestionCreateRequest, QuestionCreateResponse } from './types'

export function useCreateQuestion() {
  return useMutation<QuestionCreateResponse, AxiosError, QuestionCreateRequest>(
    {
      mutationFn: async (payload) => {
        const { data } = await api.post<QuestionCreateResponse>(
          '/qna/questions/',
          payload
        )
        return data
      },
    }
  )
}
