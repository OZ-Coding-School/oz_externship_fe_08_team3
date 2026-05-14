import { http, HttpResponse } from 'msw'

// MSW 핸들러: GET /api/v1/accounts/me + POST /api/v1/accounts/me/refresh
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

  /**
   * POST /accounts/me/refresh — 토큰 재발급 MSW 핸들러
   *
   * 개발/테스트 환경에서는 항상 새 토큰을 발급한다.
   * 실제 서버는 httpOnly 쿠키(refreshToken)로 인증하므로
   * 이 핸들러는 개발 환경 전용이다.
   */
  http.post('*/accounts/me/refresh', () => {
    return HttpResponse.json({ access_token: 'msw-refreshed-token' })
  }),
]
