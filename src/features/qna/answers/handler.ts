import { http, HttpResponse } from 'msw'
import type { PostAnswerResponse, GetAnswersResponse } from './types'

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
        is_adopted: false,
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
]
