import { http, HttpResponse } from 'msw'
import { answersHandlers } from '@/features/qna/answers'
import { presignedUrlHandlers } from '@/features/qna/presigned-url'

export const handlers = [
  // 예시 핸들러 — 실제 API에 맞게 수정하세요
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
  ...answersHandlers,
  ...presignedUrlHandlers,
]
