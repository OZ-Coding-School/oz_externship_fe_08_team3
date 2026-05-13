import { useMutation } from '@tanstack/react-query'
import api from '@/api/instance'
import type { SupportRequest, SupportResponse } from './types'

export function usePostSupport() {
  return useMutation({
    mutationFn: (data: SupportRequest) =>
      api
        .post<SupportResponse>('/chatbot/support/', data)
        .then((res) => res.data),
  })
}
