import { http, HttpResponse } from 'msw'
import type { AcceptAnswerResponse } from './types'

export const answerAcceptHandlers = [
  http.post('/api/v1/qna/answers/:id/accept', ({ params }) => {
    const response: AcceptAnswerResponse = {
      question_id: 10501,
      answer_id: Number(params.id),
      is_adopted: true,
    }
    return HttpResponse.json(response, { status: 200 })
  }),
]
