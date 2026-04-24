import { http, HttpResponse } from 'msw'
import type { PutAnswerResponse } from './types'

export const answerEditHandlers = [
  http.put('/api/v1/qna/answers/:id', ({ params }) => {
    const response: PutAnswerResponse = {
      answer_id: Number(params.id),
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json(response, { status: 200 })
  }),
]
