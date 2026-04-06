import { type Page } from '@playwright/test'

/**
 * MSW가 활성화된 dev 환경에서 authStore를 초기화하여 로그인 상태를 설정한다.
 * Zustand devtools 미들웨어를 사용하므로 window에서 스토어에 접근 가능.
 */
export async function loginAsTestUser(page: Page) {
  await page.goto('/')
  await page.evaluate(() => {
    const store = JSON.stringify({
      state: {
        isAuthenticated: true,
        user: {
          nickname: '테스트유저',
          email: 'test@example.com',
          profileImage: null,
          role: 'student',
        },
      },
      version: 0,
    })
    localStorage.setItem('auth-storage', store)
  })
}
