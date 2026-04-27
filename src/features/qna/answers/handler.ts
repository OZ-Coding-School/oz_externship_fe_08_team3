import { http, HttpResponse } from 'msw'
import type {
  PostAnswerResponse,
  GetAnswersResponse,
  PutAnswerResponse,
} from './types'

// MSW 상태 — accept POST 후 GET 응답에 반영
const _adoptedAnswerIds = new Set<number>()

export function markAnswerAdopted(answerId: number) {
  _adoptedAnswerIds.add(answerId)
}

export const answersHandlers = [
  http.get('/api/v1/qna/questions/:question_id/answers', () => {
    const response: GetAnswersResponse = [
      {
        id: 801,
        author: {
          id: 211,
          nickname: '테스트유저',
          profile_image_url: null,
          course_name: 'OZ 코딩스쿨',
          cohort_name: '8기',
        },
        content: '기존 답변 내용입니다.\n\n마크다운으로 작성된 답변입니다.',
        is_adopted: _adoptedAnswerIds.has(801),
        images: [],
        comments: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    return HttpResponse.json(response, { status: 200 })
  }),

  http.post('/api/v1/qna/questions/:question_id/answers', ({ params }) => {
    const response: PostAnswerResponse = {
      answer_id: 801,
      question_id: Number(params.question_id),
      author_id: 211,
      created_at: new Date().toISOString(),
    }
    return HttpResponse.json(response, { status: 201 })
  }),

  http.put('/api/v1/qna/answers/:id', ({ params }) => {
    const response: PutAnswerResponse = {
      answer_id: Number(params.id),
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json(response, { status: 200 })
  }),
]
