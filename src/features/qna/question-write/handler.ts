import { http, HttpResponse } from 'msw'
import type { QuestionCreateResponse } from './types'

export const questionWriteHandler = [
  http.post('/api/v1/qna/questions/', async () => {
    const response: QuestionCreateResponse = {
      message: '질문이 성공적으로 등록되었습니다.',
      question_id: Math.floor(Math.random() * 1000) + 1,
    }
    return HttpResponse.json(response, { status: 201 })
  }),
]
