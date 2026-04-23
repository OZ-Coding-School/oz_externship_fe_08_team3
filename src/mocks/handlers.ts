import { http, HttpResponse } from 'msw'
import { categoriesHandler } from '@/features/qna/categories'
import { questionWriteHandler } from '@/features/qna/question-write'

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
  ...categoriesHandler,
  ...questionWriteHandler,
]
