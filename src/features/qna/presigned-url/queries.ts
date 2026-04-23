import { useMutation } from '@tanstack/react-query'
import api from '@/api/instance'
import type { GetPresignedUrlRequest, GetPresignedUrlResponse } from './types'

export function useGetPresignedUrl() {
  return useMutation({
    mutationFn: (data: GetPresignedUrlRequest) =>
      api
        .put<GetPresignedUrlResponse>('/api/v1/qna/answers/presigned-url', data)
        .then((res) => res.data),
  })
}
