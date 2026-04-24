/**
 * REQ-QNA-006 Q&A 답변 수정 기능 E2E 테스트
 *
 * MSW 서비스 워커 대신 Playwright page.route()로 API를 직접 목킹합니다.
 * MSW mock 데이터와 동일한 구조를 사용합니다:
 * - GET answers → author.id: 211, answerId: 801
 * - POST answers → 201
 * - PUT answers → 200
 */

import { test, expect, type Page } from '@playwright/test'

// ─── 타입 ────────────────────────────────────────────────
type UserRole = 'USER' | 'STUDENT' | 'TA' | 'OM' | 'LC' | 'ADMIN'

interface TestUser {
  id: number
  nickname: string
  email: string
  role: UserRole
}

// ─── 테스트 유저 픽스처 ────────────────────────────────────
/** mock 답변의 author.id(211)와 일치 → 수정 모드 */
const ANSWER_AUTHOR: TestUser = {
  id: 211,
  nickname: '테스트유저',
  email: 'author@test.com',
  role: 'STUDENT',
}

/** id가 다른 수강생 → 내 답변 없음 → 등록 모드 */
const OTHER_STUDENT: TestUser = {
  id: 999,
  nickname: '다른수강생',
  email: 'other@test.com',
  role: 'STUDENT',
}

/** 답변 권한 없는 일반 유저 */
const USER_ROLE_USER: TestUser = {
  id: 500,
  nickname: '일반유저',
  email: 'user@test.com',
  role: 'USER',
}

// ─── API 응답 목 데이터 ───────────────────────────────────
const MOCK_QUESTION = {
  id: 1,
  title: '[MSW] Django ORM에서 역참조 관계를 설정하는 방법이 궁금합니다',
  content:
    'related_name을 사용하면 된다고 알고 있는데, 구체적인 사용법을 알고 싶습니다.',
  category: { id: 1, name: 'Django' },
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

const MOCK_ANSWERS = [
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

// ─── 헬퍼 ────────────────────────────────────────────────
/** 공통 API 목킹 설정 */
async function setupApiMocks(page: Page) {
  // GET 질문 상세
  await page.route('**/api/v1/qna/questions/*/?', (route) => {
    route.fulfill({ status: 200, json: MOCK_QUESTION })
  })
  await page.route('**/api/v1/qna/questions/*/', (route) => {
    route.fulfill({ status: 200, json: MOCK_QUESTION })
  })
  // GET 답변 목록
  await page.route('**/api/v1/qna/questions/*/answers', (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({ status: 200, json: MOCK_ANSWERS })
    } else if (route.request().method() === 'POST') {
      route.fulfill({
        status: 201,
        json: {
          answer_id: 801,
          question_id: 1,
          author_id: 211,
          created_at: new Date().toISOString(),
        },
      })
    } else {
      route.continue()
    }
  })
  // PUT 답변 수정
  await page.route('**/api/v1/qna/answers/**', (route) => {
    if (route.request().method() === 'PUT') {
      route.fulfill({
        status: 200,
        json: { answer_id: 801, updated_at: new Date().toISOString() },
      })
    } else {
      route.continue()
    }
  })
}

/** authStore에 로그인 상태를 주입하고 React 리렌더링 대기 */
async function loginAs(page: Page, user: TestUser) {
  await page.evaluate((u) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__authStore?.getState().login(u)
  }, user)
  await page.waitForTimeout(500)
}

/** 페이지 이동 + 질의응답 상세 컨테이너 렌더링 대기 */
async function gotoDetail(page: Page) {
  await setupApiMocks(page)
  await page.goto('/qna/1')
  // 질의응답 상세 placeholder 텍스트가 표시될 때까지 대기
  await page.waitForSelector('text=질의응답 상세', { timeout: 15000 })
}

/** 답변 목록 데이터가 DOM에 반영될 때까지 대기 */
async function waitForAnswers(page: Page) {
  await page.waitForSelector('text=수정일:', { timeout: 10000 })
}

// ─── 테스트 스위트 ──────────────────────────────────────────
test.describe('QnaDetailPage — REQ-QNA-006 답변 수정', () => {
  // ─── 기본 렌더링 ─────────────────────────────────────────
  test.describe('기본 렌더링', () => {
    test('페이지가 /qna/1에서 정상 로드된다', async ({ page }) => {
      await gotoDetail(page)
      await expect(page).toHaveURL('/qna/1')
    })

    test('잘못된 questionId(비숫자)로 접근하면 /qna로 리다이렉트된다', async ({
      page,
    }) => {
      await page.goto('/qna/abc')
      await page.waitForURL('/qna', { timeout: 5000 })
      await expect(page).toHaveURL('/qna')
    })
  })

  // ─── 답변 목록 표시 ───────────────────────────────────────
  test.describe('답변 목록 표시', () => {
    test.beforeEach(async ({ page }) => {
      await gotoDetail(page)
      await waitForAnswers(page)
    })

    test('답변 카드(article)가 렌더링된다', async ({ page }) => {
      await expect(page.getByRole('article').first()).toBeVisible()
    })

    test('"답변 N개" 헤더가 표시된다', async ({ page }) => {
      await expect(page.getByText(/답변 \d+개/)).toBeVisible()
    })

    test('답변 작성자 닉네임이 표시된다', async ({ page }) => {
      await expect(page.getByText('테스트유저')).toBeVisible()
    })

    test('답변 작성자 코스/기수 정보가 표시된다', async ({ page }) => {
      await expect(page.getByText(/OZ 코딩스쿨/)).toBeVisible()
    })

    test('"수정일:" 형식의 날짜가 표시된다', async ({ page }) => {
      await expect(page.getByText(/수정일:/)).toBeVisible()
    })

    test('답변 내용이 마크다운으로 렌더링된다', async ({ page }) => {
      await expect(page.getByText('기존 답변 내용입니다.')).toBeVisible()
    })
  })

  // ─── GET 에러 상태 ────────────────────────────────────────
  test.describe('답변 로드 실패 상태', () => {
    test('GET answers 500 에러 시 에러 메시지가 표시된다', async ({ page }) => {
      // 질문 상세는 성공, 답변만 실패
      await page.route('**/api/v1/qna/questions/*/', (route) => {
        route.fulfill({ status: 200, json: MOCK_QUESTION })
      })
      await page.route('**/api/v1/qna/questions/*/answers', (route) => {
        route.fulfill({ status: 500 })
      })
      await page.goto('/qna/1')
      await page.waitForSelector('text=질의응답 상세', { timeout: 15000 })
      await expect(page.getByText('답변을 불러오지 못했습니다.')).toBeVisible({
        timeout: 10000,
      })
    })
  })

  // ─── RBAC 권한 제어 ───────────────────────────────────────
  test.describe('RBAC 권한 제어', () => {
    test.beforeEach(async ({ page }) => {
      await gotoDetail(page)
      await waitForAnswers(page)
    })

    test('비로그인 상태 → 답변 버튼 미노출', async ({ page }) => {
      await expect(
        page.getByRole('button', { name: /답변하기|답변 수정하기/ })
      ).not.toBeVisible()
    })

    test('USER 권한 로그인 → 답변 버튼 미노출', async ({ page }) => {
      await loginAs(page, USER_ROLE_USER)
      await expect(
        page.getByRole('button', { name: /답변하기|답변 수정하기/ })
      ).not.toBeVisible()
    })

    test('STUDENT 권한 로그인 → 답변 버튼 노출', async ({ page }) => {
      await loginAs(page, OTHER_STUDENT)
      await expect(
        page.getByRole('button', { name: /답변하기|답변 수정하기/ })
      ).toBeVisible({ timeout: 5000 })
    })

    test('TA 권한 로그인 → 답변 버튼 노출', async ({ page }) => {
      await loginAs(page, { ...OTHER_STUDENT, role: 'TA' })
      await expect(
        page.getByRole('button', { name: /답변하기|답변 수정하기/ })
      ).toBeVisible({ timeout: 5000 })
    })

    test('ADMIN 권한 로그인 → 답변 버튼 노출', async ({ page }) => {
      await loginAs(page, { ...OTHER_STUDENT, role: 'ADMIN' })
      await expect(
        page.getByRole('button', { name: /답변하기|답변 수정하기/ })
      ).toBeVisible({ timeout: 5000 })
    })
  })

  // ─── 답변 등록 (create mode) ──────────────────────────────
  test.describe('답변 등록 — create mode (내 답변 없는 유저)', () => {
    test.beforeEach(async ({ page }) => {
      await gotoDetail(page)
      await waitForAnswers(page)
      await loginAs(page, OTHER_STUDENT)
      await expect(page.getByRole('button', { name: '답변하기' })).toBeVisible({
        timeout: 5000,
      })
    })

    test('"답변하기" 버튼이 표시된다', async ({ page }) => {
      await expect(page.getByRole('button', { name: '답변하기' })).toBeVisible()
    })

    test('"답변하기" 클릭 시 마크다운 에디터 폼이 열린다', async ({ page }) => {
      await page.getByRole('button', { name: '답변하기' }).click()
      await expect(page.locator('textarea').first()).toBeVisible()
    })

    test('내용 입력 후 "등록하기" 클릭 시 성공 토스트가 표시된다', async ({
      page,
    }) => {
      await page.getByRole('button', { name: '답변하기' }).click()
      await page.locator('textarea').first().fill('새로운 답변 내용입니다.')
      await page.getByRole('button', { name: '등록하기' }).click()
      await expect(page.getByText('답변이 등록되었습니다.')).toBeVisible({
        timeout: 10000,
      })
    })

    test('등록 성공 후 폼이 닫히고 "답변하기" 버튼이 다시 표시된다', async ({
      page,
    }) => {
      await page.getByRole('button', { name: '답변하기' }).click()
      await page.locator('textarea').first().fill('새 답변')
      await page.getByRole('button', { name: '등록하기' }).click()
      await expect(page.getByRole('button', { name: '답변하기' })).toBeVisible({
        timeout: 10000,
      })
    })

    test('빈 내용으로 "등록하기" 클릭 시 "답변 내용을 입력해주세요." 에러가 표시된다', async ({
      page,
    }) => {
      await page.getByRole('button', { name: '답변하기' }).click()
      await page.getByRole('button', { name: '등록하기' }).click()
      await expect(page.getByText('답변 내용을 입력해주세요.')).toBeVisible()
    })

    test('"취소" 클릭 시 폼이 닫히고 "답변하기" 버튼이 복구된다', async ({
      page,
    }) => {
      await page.getByRole('button', { name: '답변하기' }).click()
      await page.getByRole('button', { name: '취소' }).click()
      await expect(page.getByRole('button', { name: '답변하기' })).toBeVisible()
    })
  })

  // ─── 답변 수정 (edit mode) ────────────────────────────────
  test.describe('답변 수정 — edit mode (mock 답변 author.id=211)', () => {
    test.beforeEach(async ({ page }) => {
      await gotoDetail(page)
      await waitForAnswers(page)
      await loginAs(page, ANSWER_AUTHOR)
      await expect(
        page.getByRole('button', { name: '답변 수정하기' })
      ).toBeVisible({ timeout: 5000 })
    })

    test('"답변 수정하기" 버튼이 표시된다', async ({ page }) => {
      await expect(
        page.getByRole('button', { name: '답변 수정하기' })
      ).toBeVisible()
    })

    test('"답변 수정하기" 클릭 시 마크다운 에디터가 열린다', async ({
      page,
    }) => {
      await page.getByRole('button', { name: '답변 수정하기' }).click()
      await expect(page.locator('textarea').first()).toBeVisible()
    })

    test('에디터에 기존 답변 내용이 미리 로드된다', async ({ page }) => {
      await page.getByRole('button', { name: '답변 수정하기' }).click()
      const value = await page.locator('textarea').first().inputValue()
      expect(value).toContain('기존 답변 내용입니다.')
    })

    test('내용 수정 후 "수정하기" 클릭 시 성공 토스트가 표시된다', async ({
      page,
    }) => {
      await page.getByRole('button', { name: '답변 수정하기' }).click()
      await page.locator('textarea').first().fill('수정된 답변 내용입니다.')
      await page.getByRole('button', { name: '수정하기' }).click()
      await expect(
        page.getByText('모든 변경 사항이 저장되었습니다.')
      ).toBeVisible({ timeout: 10000 })
    })

    test('수정 성공 후 폼이 닫히고 "답변 수정하기" 버튼이 복구된다', async ({
      page,
    }) => {
      await page.getByRole('button', { name: '답변 수정하기' }).click()
      await page.locator('textarea').first().fill('수정된 내용')
      await page.getByRole('button', { name: '수정하기' }).click()
      await expect(
        page.getByRole('button', { name: '답변 수정하기' })
      ).toBeVisible({ timeout: 10000 })
    })

    test('빈 내용으로 "수정하기" 클릭 시 "답변 내용을 입력해주세요." 에러가 표시된다', async ({
      page,
    }) => {
      await page.getByRole('button', { name: '답변 수정하기' }).click()
      await page.locator('textarea').first().fill('')
      await page.getByRole('button', { name: '수정하기' }).click()
      await expect(page.getByText('답변 내용을 입력해주세요.')).toBeVisible()
    })

    test('"취소" 클릭 시 폼이 닫힌다', async ({ page }) => {
      await page.getByRole('button', { name: '답변 수정하기' }).click()
      await page.getByRole('button', { name: '취소' }).click()
      await expect(
        page.getByRole('button', { name: '답변 수정하기' })
      ).toBeVisible()
    })
  })

  // ─── API 에러 처리 ────────────────────────────────────────
  test.describe('API 에러 처리', () => {
    test('PUT 400 에러 시 "유효하지 않은 답변 수정 요청입니다." 토스트가 표시된다', async ({
      page,
    }) => {
      // 기본 목킹 후 PUT만 400으로 오버라이드
      await page.route('**/api/v1/qna/questions/*/', (route) => {
        route.fulfill({ status: 200, json: MOCK_QUESTION })
      })
      await page.route('**/api/v1/qna/questions/*/answers', (route) => {
        route.fulfill({ status: 200, json: MOCK_ANSWERS })
      })
      await page.route('**/api/v1/qna/answers/**', (route) => {
        route.fulfill({ status: 400, json: { detail: 'bad request' } })
      })
      await page.goto('/qna/1')
      await page.waitForSelector('text=질의응답 상세', { timeout: 15000 })
      await waitForAnswers(page)
      await loginAs(page, ANSWER_AUTHOR)
      await page
        .getByRole('button', { name: '답변 수정하기' })
        .click({ timeout: 5000 })
      await page.locator('textarea').first().fill('수정 내용')
      await page.getByRole('button', { name: '수정하기' }).click()
      await expect(
        page.getByText('유효하지 않은 답변 수정 요청입니다.')
      ).toBeVisible({ timeout: 10000 })
    })

    test('PUT 400 에러 시 에디터에 포커스가 이동한다', async ({ page }) => {
      await page.route('**/api/v1/qna/questions/*/', (route) => {
        route.fulfill({ status: 200, json: MOCK_QUESTION })
      })
      await page.route('**/api/v1/qna/questions/*/answers', (route) => {
        route.fulfill({ status: 200, json: MOCK_ANSWERS })
      })
      await page.route('**/api/v1/qna/answers/**', (route) => {
        route.fulfill({ status: 400, json: { detail: 'bad request' } })
      })
      await page.goto('/qna/1')
      await page.waitForSelector('text=질의응답 상세', { timeout: 15000 })
      await waitForAnswers(page)
      await loginAs(page, ANSWER_AUTHOR)
      await page
        .getByRole('button', { name: '답변 수정하기' })
        .click({ timeout: 5000 })
      await page.locator('textarea').first().fill('수정 내용')
      await page.getByRole('button', { name: '수정하기' }).click()
      await expect(page.locator('textarea').first()).toBeFocused({
        timeout: 10000,
      })
    })

    test('POST 400 에러 시 "유효하지 않은 답변 등록 요청입니다." 토스트가 표시된다', async ({
      page,
    }) => {
      await page.route('**/api/v1/qna/questions/*/', (route) => {
        route.fulfill({ status: 200, json: MOCK_QUESTION })
      })
      await page.route('**/api/v1/qna/questions/*/answers', (route) => {
        if (route.request().method() === 'GET') {
          route.fulfill({ status: 200, json: MOCK_ANSWERS })
        } else {
          route.fulfill({ status: 400, json: { detail: 'bad request' } })
        }
      })
      await page.goto('/qna/1')
      await page.waitForSelector('text=질의응답 상세', { timeout: 15000 })
      await waitForAnswers(page)
      await loginAs(page, OTHER_STUDENT)
      await page
        .getByRole('button', { name: '답변하기' })
        .click({ timeout: 5000 })
      await page.locator('textarea').first().fill('내용')
      await page.getByRole('button', { name: '등록하기' }).click()
      await expect(
        page.getByText('유효하지 않은 답변 등록 요청입니다.')
      ).toBeVisible({ timeout: 10000 })
    })
  })

  // ─── 임시 저장 복원 ───────────────────────────────────────
  test.describe('임시 저장(draft) 복원', () => {
    const DRAFT_KEY = 'answer-draft-801'
    const DRAFT_CONTENT = '임시로 저장된 내용입니다.'

    test.beforeEach(async ({ page }) => {
      await gotoDetail(page)
      await waitForAnswers(page)
      await page.evaluate(
        ({ key, content }) => localStorage.setItem(key, content),
        { key: DRAFT_KEY, content: DRAFT_CONTENT }
      )
      await loginAs(page, ANSWER_AUTHOR)
      await page
        .getByRole('button', { name: '답변 수정하기' })
        .click({ timeout: 5000 })
    })

    test('임시 저장 내용이 있으면 복원 안내 문구가 표시된다', async ({
      page,
    }) => {
      await expect(
        page.getByText('이전에 작성 중이던 내용이 있습니다. 복원할까요?')
      ).toBeVisible()
    })

    test('"복원하기" 클릭 시 임시 저장 내용이 에디터에 반영된다', async ({
      page,
    }) => {
      await page.getByRole('button', { name: '복원하기' }).click()
      const value = await page.locator('textarea').first().inputValue()
      expect(value).toContain(DRAFT_CONTENT)
    })

    test('"버리기" 클릭 시 복원 프롬프트가 닫히고 localStorage 초안이 삭제된다', async ({
      page,
    }) => {
      await page.getByRole('button', { name: '버리기' }).click()
      await expect(
        page.getByText('이전에 작성 중이던 내용이 있습니다.')
      ).not.toBeVisible()
      const draft = await page.evaluate(
        (key) => localStorage.getItem(key),
        DRAFT_KEY
      )
      expect(draft).toBeNull()
    })
  })
})
