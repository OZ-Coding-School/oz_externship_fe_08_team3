import { http, HttpResponse } from 'msw'
import type { PostAnswerResponse } from './types'

export const answersHandlers = [
  http.post('/api/v1/qna/questions/:question_id/answers', ({ params }) => {
    const response: PostAnswerResponse = {
      answer_id: 801,
      question_id: Number(params.question_id),
      author_id: 211,
      created_at: new Date().toISOString(),
    }
    return HttpResponse.json(response, { status: 201 })
  }),
]
