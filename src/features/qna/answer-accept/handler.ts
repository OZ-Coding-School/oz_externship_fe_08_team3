import { http, HttpResponse } from 'msw'
import type { AcceptAnswerResponse } from './types'
import {
  markAnswerAdopted,
  getQuestionIdByAnswer,
} from '@/features/qna/answers/handler'

export const answerAcceptHandlers = [
  http.post(
    `${import.meta.env.VITE_API_BASE_URL}/qna/answers/:id/accept`,
    ({ params }) => {
      const answerId = Number(params.id)
      markAnswerAdopted(answerId)
      const response: AcceptAnswerResponse = {
        question_id: getQuestionIdByAnswer(answerId),
        answer_id: answerId,
        is_adopted: true,
      }
      return HttpResponse.json(response, { status: 200 })
    }
  ),
]
