import { http, HttpResponse } from 'msw'
import type { GetQuestionDetailResponse } from './types'

const MOCK_ANSWER_ID = 801
const MOCK_AUTHOR_ID = 211

export const questionDetailHandler = [
  http.get(
    `${import.meta.env.VITE_API_BASE_URL}/qna/questions/:question_id`,
    ({ params }) => {
      const response: GetQuestionDetailResponse = {
        id: Number(params.question_id),
        title: '[MSW] Django ORM에서 역참조 관계를 설정하는 방법이 궁금합니다',
        content:
          'related_name을 사용하면 된다고 알고 있는데, 구체적인 사용법을 알고 싶습니다.',
        category: {
          id: 41,
          name: 'Python',
          depth: 3,
          names: ['프론트엔드', '프로그래밍 언어', 'Python'],
        },
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
        answers: [
          {
            id: MOCK_ANSWER_ID,
            author: {
              id: MOCK_AUTHOR_ID,
              nickname: '테스트유저',
              profile_image_url: null,
              course_name: 'OZ 코딩스쿨',
              cohort_name: '8기',
            },
            content: '기존 답변 내용입니다.\n\n마크다운으로 작성된 답변입니다.',
            is_adopted: false,
            images: [],
            comments: [
              {
                id: 1001,
                author: {
                  id: 301,
                  nickname: '댓글러',
                  profile_image_url: null,
                },
                content: '도움이 많이 되었습니다. 감사해요!',
                created_at: new Date(Date.now() - 3600000).toISOString(),
                updated_at: new Date(Date.now() - 3600000).toISOString(),
              },
            ],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      }
      return HttpResponse.json(response, { status: 200 })
    }
  ),
]
