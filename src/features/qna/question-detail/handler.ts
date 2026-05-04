import { http, HttpResponse } from 'msw'
import type { GetQuestionDetailResponse } from './types'

export const questionDetailHandler = [
  http.get(
    `${import.meta.env.VITE_API_BASE_URL}/qna/questions/:question_id/`,
    ({ params }) => {
      const response: GetQuestionDetailResponse = {
        id: Number(params.question_id),
        title: '[MSW] Django ORM에서 역참조 관계를 설정하는 방법이 궁금합니다',
        content:
          'related_name을 사용하면 된다고 알고 있는데, 구체적인 사용법을 알고 싶습니다.',
        category: { id: 41, name: 'ORM' },
        images: [],
        view_count: 42,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: {
          id: 100,
          nickname: '질문자',
          profile_image_url: null,
          course_name: 'OZ 코딩스쿨',
          cohort_name: '8기',
        },
        answers: [],
      }
      return HttpResponse.json(response, { status: 200 })
    }
  ),
]
