/**
 * @interface-contract
 *
 * Page: /mypage/quiz (쪽지시험 목록)
 * - 왼쪽 사이드바: "내 정보" | "쪽지시험" (활성, 보라색 + 왼쪽 바) | "비밀번호 변경"
 * - 타이틀: "쪽지시험"
 * - 탭: "전체보기" | "응시완료" | "미응시"
 * - 시험 카드 목록: 시험 아이콘, 시험명, 상태 뱃지, 과목명
 *   - 응시 가능 카드: "시험보기" 버튼
 *   - 응시 완료 카드: "상세보기" 버튼
 * - "시험보기" 버튼 클릭 → 참가 코드 입력 모달
 * - 비로그인 접근 시 /login 리다이렉트
 *
 * Modal: 참가 코드 입력 (시험 시작 전)
 * - 시험 아이콘, 시험명, 총 문항 수, 제한시간 표시
 * - 참가 코드 입력 필드 (6자리)
 * - "시험시작" 버튼 클릭 → 코드 검증 후 /quiz/:quizId/exam 이동
 * - 코드 불일치 시 에러 메시지: "*코드번호가 일치하지 않습니다."
 *
 * Page: /quiz/:quizId/exam (쪽지시험 응시하기)
 * - 상단 헤더: 시험명, 문항 수 정보, 남은 시간 타이머, 제출하기 버튼
 * - 경고 배너: 부정행위 경고 문구 (상단 빨간색)
 * - 문제 목록: 번호, 배점, 유형 배지(선택/단답형/OX), 지문, 선택지 또는 입력 필드
 *   - 객관식: radio 선택지
 *   - OX 퀴즈: "맞아요" / "아니에요" 버튼
 *   - 주관식: textarea
 * - "제출하기" 버튼 → 미답변 문항 있을 시 경고 모달 → 전체 답변 시 제출 완료 모달
 * - 제출 완료 모달: "시험 제출이 완료되었습니다" + 확인 버튼 → /quiz/:quizId/result 이동
 * - 부정행위 경고 모달: 화면 이탈 감지 시 표시
 * - 관리자 강제 종료 모달: 관리자가 시험 종료 시 표시
 * - 비로그인 접근 시 /login 리다이렉트
 *
 * Page: /quiz/:quizId/result (쪽지시험 결과 확인)
 * - 시험명, 과목/기간 정보
 * - 문제별 정답/오답 표시 (초록/빨간 배경)
 * - 내 답안 + 정답 표시
 * - "닫기" 버튼 → /mypage/quiz로 이동
 * - 비로그인 접근 시 /login 리다이렉트
 *
 * API:
 * - GET  /exams/deployments                          → 쪽지시험 목록 조회
 * - GET  /exams/deployments/:quizId                  → 쪽지시험 상세(문제) 조회
 * - POST /exams/deployments/:quizId/check-code       → 참가 코드 검증
 * - POST /exams/deployments/:quizId/submissions      → 답안 제출
 * - GET  /exams/submissions/:quizId                  → 제출 결과 조회
 * - GET  /exams/deployments/:quizId/status           → 배포 상태 조회 (이미 제출 여부 등)
 *
 * REQ-QUIZ-001: 쪽지시험 목록 조회 (탭 필터 포함)
 * REQ-QUIZ-002: 참가 코드 입력 후 시험 응시
 * REQ-QUIZ-003: 쪽지시험 제출
 * REQ-QUIZ-004: 쪽지시험 결과 확인
 */

import { test, expect, type Page } from '@playwright/test'

const setupAuth = async (page: Page) => {
  await page.goto('/')
  await page.evaluate(() => {
    const store = JSON.parse(localStorage.getItem('AuthStore') || '{}')
    store.state = {
      isAuthenticated: true,
      user: {
        nickname: '오즈오즈',
        email: 'ozschool1234@gmail.com',
        profileImage: null,
      },
    }
    localStorage.setItem('AuthStore', JSON.stringify(store))
  })
}

// ─── 접근 제어 ──────────────────────────────────────────────────────────────

test.describe('쪽지시험 - 접근 제어', () => {
  test('비로그인 상태에서 /quiz/:quizId/exam 접근 시 /login으로 리다이렉트된다', async ({
    page,
  }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('AuthStore'))
    await page.goto('/quiz/1/exam')
    await expect(page).toHaveURL('/login')
  })

  test('비로그인 상태에서 /quiz/:quizId/result 접근 시 /login으로 리다이렉트된다', async ({
    page,
  }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('AuthStore'))
    await page.goto('/quiz/1/result')
    await expect(page).toHaveURL('/login')
  })

  test('로그인 상태에서 /quiz/:quizId/exam 접근 시 응시 페이지가 렌더링된다', async ({
    page,
  }) => {
    await setupAuth(page)
    await page.goto('/quiz/1/exam')
    await expect(page).toHaveURL('/quiz/1/exam')
  })

  test('로그인 상태에서 /quiz/:quizId/result 접근 시 결과 페이지가 렌더링된다', async ({
    page,
  }) => {
    await setupAuth(page)
    await page.goto('/quiz/1/result')
    await expect(page).toHaveURL('/quiz/1/result')
  })
})

// ─── 쪽지시험 목록 페이지 (/mypage/quiz) ────────────────────────────────────

test.describe('쪽지시험 목록 렌더링 (/mypage/quiz) (REQ-QUIZ-001)', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/mypage/quiz')
  })

  test('쪽지시험 목록 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/mypage/quiz')
  })

  test('"쪽지시험" 타이틀이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('heading', { name: '쪽지시험' })).toBeVisible()
  })

  test('탭 "전체보기"가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('tab', { name: '전체보기' })).toBeVisible()
  })

  test('탭 "응시완료"가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('tab', { name: '응시완료' })).toBeVisible()
  })

  test('탭 "미응시"가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('tab', { name: '미응시' })).toBeVisible()
  })

  test('기본 탭은 "전체보기"가 활성 상태이다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('tab', { name: '전체보기' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  test('"응시완료" 탭 클릭 시 응시완료 목록만 표시된다', async ({ page }) => {
    test.skip()
    await page.getByRole('tab', { name: '응시완료' }).click()
    await expect(page.getByRole('tab', { name: '응시완료' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  test('"미응시" 탭 클릭 시 미응시 목록만 표시된다', async ({ page }) => {
    test.skip()
    await page.getByRole('tab', { name: '미응시' }).click()
    await expect(page.getByRole('tab', { name: '미응시' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  test('시험 카드 목록이 표시된다', async ({ page }) => {
    test.skip()
    const cards = page.getByRole('listitem')
    await expect(cards.first()).toBeVisible()
  })

  test('응시 가능한 시험 카드에 "시험보기" 버튼이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await expect(
      page.getByRole('button', { name: '시험보기' }).first()
    ).toBeVisible()
  })

  test('응시 완료된 시험 카드에 "상세보기" 버튼이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await expect(
      page.getByRole('button', { name: '상세보기' }).first()
    ).toBeVisible()
  })
})

// ─── 참가 코드 입력 모달 (/mypage/quiz → 참가 코드 모달) ────────────────────

test.describe('참가 코드 입력 모달 (REQ-QUIZ-002)', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/mypage/quiz')
  })

  test('"시험보기" 버튼 클릭 시 참가 코드 입력 모달이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '시험보기' }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('참가 코드 모달에 시험명이 표시된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '시험보기' }).first().click()
    await expect(page.getByRole('dialog').getByRole('heading')).toBeVisible()
  })

  test('참가 코드 모달에 총 문항 수와 제한시간이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '시험보기' }).first().click()
    // 예: "총 10문항 · 제한시간 20분"
    await expect(
      page.getByRole('dialog').getByText(/문항|제한시간/)
    ).toBeVisible()
  })

  test('참가 코드 입력 필드가 표시된다 (6자리)', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '시험시작' }).first().click()
    await expect(
      page.getByRole('dialog').getByPlaceholder(/6자리/)
    ).toBeVisible()
  })

  test('"시험시작" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '시험시작' }).first().click()
    await expect(
      page.getByRole('dialog').getByRole('button', { name: '시험시작' })
    ).toBeVisible()
  })

  test('올바른 참가 코드 입력 후 "시험시작" 클릭 시 응시 페이지로 이동한다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '시험시작' }).first().click()
    await page.getByRole('dialog').getByPlaceholder(/6자리/).fill('123456')
    await page
      .getByRole('dialog')
      .getByRole('button', { name: '시험시작' })
      .click()
    await expect(page).toHaveURL(/\/quiz\/\d+\/exam/)
  })

  test('잘못된 참가 코드 입력 시 에러 메시지가 표시된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '시험시작' }).first().click()
    await page.getByRole('dialog').getByPlaceholder(/6자리/).fill('000000')
    await page
      .getByRole('dialog')
      .getByRole('button', { name: '시험시작' })
      .click()
    await expect(
      page.getByRole('dialog').getByText('*코드번호가 일치하지 않습니다')
    ).toBeVisible()
  })

  test('참가 코드 모달 닫기(X) 버튼 클릭 시 모달이 닫힌다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '시험시작' }).first().click()
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /닫기|close/i })
      .click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})

// ─── 쪽지시험 응시 페이지 (/quiz/:quizId/exam) ──────────────────────────────

test.describe('쪽지시험 응시 페이지 렌더링 (/quiz/:quizId/exam) (REQ-QUIZ-002)', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/quiz/1/exam')
  })

  test('쪽지시험 응시 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/quiz/1/exam')
  })

  test('시험명이 헤더에 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('heading').first()).toBeVisible()
  })

  test('남은 시간 타이머가 표시된다', async ({ page }) => {
    test.skip()
    // 예: "17:11 뒤에 끝나요" 형식의 타이머
    await expect(page.getByText(/\d{2}:\d{2} 뒤에 끝나요/)).toBeVisible()
  })

  test('경고 배너(부정행위 경고)가 상단에 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('문제 목록이 표시된다', async ({ page }) => {
    test.skip()
    // 문제는 번호 + 지문 구조
    await expect(page.getByText(/1\./)).toBeVisible()
  })

  test('객관식 문제에 선택지가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('radio').first()).toBeVisible()
  })

  test('하단에 "제출하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '제출하기' })).toBeVisible()
  })
})

// ─── 쪽지시험 제출 플로우 ────────────────────────────────────────────────────

test.describe('쪽지시험 제출 (REQ-QUIZ-003)', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/quiz/1/exam')
  })

  test('미답변 문항이 있을 때 "제출하기" 클릭 시 경고 모달이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '제출하기' }).click()
    // 부완성 경고 모달
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('미답변 경고 모달에서 "확인" 클릭 시 모달이 닫히고 응시 페이지에 머문다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '제출하기' }).click()
    await page.getByRole('dialog').getByRole('button', { name: '확인' }).click()
    await expect(page).toHaveURL('/quiz/1/exam')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('모든 문항 답변 후 "제출하기" 클릭 시 제출 완료 모달이 표시된다', async ({
    page,
  }) => {
    test.skip()
    // 모든 문항에 답변 후 제출
    const radios = page.getByRole('radio')
    for (const radio of await radios.all()) {
      await radio.click().catch(() => {})
    }
    await page.getByRole('button', { name: '제출하기' }).click()
    // "시험 제출이 완료되었습니다" 성공 모달
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(
      page.getByRole('dialog').getByText(/제출이 완료/)
    ).toBeVisible()
  })

  test('제출 완료 모달에서 "확인" 클릭 시 결과 페이지로 이동한다', async ({
    page,
  }) => {
    test.skip()
    const radios = page.getByRole('radio')
    for (const radio of await radios.all()) {
      await radio.click().catch(() => {})
    }
    await page.getByRole('button', { name: '제출하기' }).click()
    await page.getByRole('dialog').getByRole('button', { name: '확인' }).click()
    await expect(page).toHaveURL(/\/quiz\/1\/result/)
  })

  test('이미 제출한 시험의 응시 페이지 접근 시 결과 페이지로 리다이렉트된다', async ({
    page,
  }) => {
    test.skip()
    // MSW에서 GET /exams/deployments/1/status 가 "이미 제출" 상태를 반환하도록 오버라이드 필요
    await expect(page).toHaveURL(/\/quiz\/1\/result/)
  })
})

// ─── 부정행위 / 관리자 강제 종료 모달 ──────────────────────────────────────

test.describe('쪽지시험 응시 중 특수 상황 모달', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/quiz/1/exam')
  })

  test('화면 이탈 감지 시 부정행위 경고 모달이 표시된다', async ({ page }) => {
    test.skip()
    // visibilitychange 이벤트 트리거로 화면 이탈 감지 시뮬레이션
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden',
        writable: true,
      })
      document.dispatchEvent(new Event('visibilitychange'))
    })
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(
      page.getByRole('dialog').getByText(/부정행위|감점/)
    ).toBeVisible()
  })

  test('부정행위 경고 모달에서 "확인" 클릭 시 모달이 닫힌다', async ({
    page,
  }) => {
    test.skip()
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden',
        writable: true,
      })
      document.dispatchEvent(new Event('visibilitychange'))
    })
    await page.getByRole('dialog').getByRole('button', { name: '확인' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('관리자 강제 종료 시 종료 모달이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(
      page.getByRole('dialog').getByText(/관리자에 의해|종료/)
    ).toBeVisible()
  })

  test('관리자 강제 종료 모달에서 "확인" 클릭 시 목록 페이지로 이동한다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('dialog').getByRole('button', { name: '확인' }).click()
    await expect(page).toHaveURL('/mypage/quiz')
  })
})

// ─── 쪽지시험 결과 확인 페이지 (/quiz/:quizId/result) ───────────────────────

test.describe('쪽지시험 결과 확인 페이지 렌더링 (/quiz/:quizId/result) (REQ-QUIZ-004)', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/quiz/1/result')
  })

  test('쪽지시험 결과 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/quiz/1/result')
  })

  test('시험명이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('heading').first()).toBeVisible()
  })

  test('문제별 정답/오답 결과가 표시된다', async ({ page }) => {
    test.skip()
    const resultItems = page.getByRole('listitem')
    await expect(resultItems.first()).toBeVisible()
  })

  test('정답 항목은 초록색 배경으로 표시된다', async ({ page }) => {
    test.skip()
    // 정답 항목 컨테이너에 초록 계열 클래스 또는 스타일이 적용됨
    await expect(page.locator('[data-result="correct"]').first()).toBeVisible()
  })

  test('오답 항목은 빨간색 배경으로 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.locator('[data-result="wrong"]').first()).toBeVisible()
  })

  test('"완료" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page
        .getByRole('button', { name: '완료' })
        .or(page.getByRole('link', { name: '완료' }))
    ).toBeVisible()
  })

  test('"완료" 버튼 클릭 시 /mypage/quiz로 이동한다', async ({ page }) => {
    test.skip()
    const closeButton = page
      .getByRole('button', { name: '완료' })
      .or(page.getByRole('link', { name: '완료' }))
    await closeButton.click()
    await expect(page).toHaveURL('/mypage/quiz')
  })
})
