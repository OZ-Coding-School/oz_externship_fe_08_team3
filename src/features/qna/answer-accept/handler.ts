import { http, HttpResponse } from 'msw'
import type { AcceptAnswerResponse } from './types'
import { markAnswerAdopted } from '@/features/qna/answers/handler'

export const answerAcceptHandlers = [
  http.post('/api/v1/qna/answers/:id/accept', ({ params }) => {
    const answerId = Number(params.id)
    markAnswerAdopted(answerId)
    const response: AcceptAnswerResponse = {
      question_id: 10501,
      answer_id: answerId,
      is_adopted: true,
    }
    return HttpResponse.json(response, { status: 200 })
  }),
]
