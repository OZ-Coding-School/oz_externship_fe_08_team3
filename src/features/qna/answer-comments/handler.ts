import { http, HttpResponse } from 'msw'
import type { PostCommentResponse } from './types'

export const answerCommentsHandlers = [
  http.post(
    `${import.meta.env.VITE_API_BASE_URL}/qna/answers/:answer_id/comments`,
    ({ params }) => {
      const response: PostCommentResponse = {
        id: Date.now(),
        answer_id: Number(params.answer_id),
        created_at: new Date().toISOString(),
      }
      return HttpResponse.json(response, { status: 201 })
    }
  ),
]
