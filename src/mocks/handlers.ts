import { http, HttpResponse } from 'msw'

export const handlers = [
  // 예시 핸들러 — 실제 API에 맞게 수정하세요
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
]
