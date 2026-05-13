import { http, HttpResponse } from 'msw'

// MSW 핸들러: GET /api/v1/accounts/me
export const meHandlers = [
  http.get('*/accounts/me', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 })
    }

    // 개발용 더미 사용자
    return HttpResponse.json({
      id: 1,
      nickname: 'dev',
      email: 'dev@test.com',
      profile_image: null,
      role: 'STUDENT',
    })
  }),
]
