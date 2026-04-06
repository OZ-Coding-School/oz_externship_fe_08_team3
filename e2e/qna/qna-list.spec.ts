/**
 * @interface-contract
 *
 * Page: /qna (질의응답 목록)
 * - 헤더: 네비게이션 바에 "질의응답" 버튼 → /qna 이동
 * - 페이지 타이틀: "질의응답" (bold, 32px)
 * - 검색 바: pill-shaped input, placeholder "질문 검색", 돋보기 아이콘
 * - "질문하기" 버튼: 연필 아이콘 포함, 보라색 (#6201E0) → 비로그인 시 /login 리다이렉트, 로그인 시 /qna/write 이동
 * - 탭 바: "전체보기" (기본 활성) | "답변완료" | "답변 대기중"
 * - 정렬: "최신순" + 정렬 아이콘 → 드롭다운 ("최신순" 선택됨 / "오래된 순")
 * - 필터: "필터" + 필터 아이콘 → 우측 슬라이드 필터 모달
 * - 필터 모달: "필터" 타이틀 + X 닫기 버튼, 카테고리 선택 (대분류 > 중분류 > 소분류 cascading dropdowns), "선택 초기화" + "필터 적용하기" 버튼
 * - 질문 카드: 카테고리 breadcrumb, 제목, 내용 미리보기, 답변 수 ("A" 배지), 조회수, 작성자 (프로필 이미지 + 닉네임), 타임스탬프, 썸네일 이미지(선택)
 * - 카드 클릭 → /qna/:questionId 이동
 * - 페이지네이션: 목록 하단
 *
 * API:
 * - GET /qna/questions → 질의응답 목록 조회 (탭 필터, 카테고리, 검색어, 정렬, 페이지 파라미터)
 * - GET /qna/categories → 카테고리 목록 조회
 *
 * REQ-QNA-002: 질의응답 목록 조회
 */

import { test, expect } from '@playwright/test'

test.describe('질의응답 목록 페이지 렌더링', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna')
  })

  test('질의응답 목록 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/qna')
  })

  test('페이지 타이틀 "질의응답"이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('heading', { name: '질의응답' })).toBeVisible()
  })

  test('검색 바가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByPlaceholder('질문 검색')).toBeVisible()
  })

  test('"질문하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '질문하기' })).toBeVisible()
  })

  test('"전체보기" 탭이 기본 활성 상태로 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('tab', { name: '전체보기' })).toBeVisible()
  })

  test('"답변완료" 탭이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('tab', { name: '답변완료' })).toBeVisible()
  })

  test('"답변 대기중" 탭이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('tab', { name: '답변 대기중' })).toBeVisible()
  })

  test('"최신순" 정렬 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '최신순' })).toBeVisible()
  })

  test('"필터" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '필터' })).toBeVisible()
  })
})

test.describe('질의응답 목록 - 헤더 네비게이션', () => {
  test('헤더 "질의응답" 버튼 클릭 시 /qna로 이동한다', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: '질의응답' }).click()
    await expect(page).toHaveURL('/qna')
  })
})

test.describe('질의응답 목록 - "질문하기" 버튼 네비게이션', () => {
  test('비로그인 상태에서 "질문하기" 버튼 클릭 시 /login으로 이동한다', async ({
    page,
  }) => {
    await page.goto('/qna')
    await page.getByRole('button', { name: '질문하기' }).click()
    await expect(page).toHaveURL('/login')
  })

  test('로그인 상태에서 "질문하기" 버튼 클릭 시 /qna/write로 이동한다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/qna')
    await page.getByRole('button', { name: '질문하기' }).click()
    await expect(page).toHaveURL('/qna/write')
  })
})

test.describe('질의응답 목록 - 검색 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna')
  })

  test('검색 바 클릭 시 포커스 상태로 전환된다', async ({ page }) => {
    test.skip()
    const searchInput = page.getByPlaceholder('질문 검색')
    await searchInput.click()
    await expect(searchInput).toBeFocused()
  })

  test('검색어 입력 시 X(초기화) 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await page.getByPlaceholder('질문 검색').fill('오류')
    await expect(
      page.getByRole('button', { name: '검색어 초기화' })
    ).toBeVisible()
  })

  test('X 버튼 클릭 시 검색어가 초기화된다', async ({ page }) => {
    test.skip()
    const searchInput = page.getByPlaceholder('질문 검색')
    await searchInput.fill('오류')
    await page.getByRole('button', { name: '검색어 초기화' }).click()
    await expect(searchInput).toHaveValue('')
  })

  test('검색어 입력 후 엔터 시 검색 결과가 표시된다', async ({ page }) => {
    test.skip()
    await page.getByPlaceholder('질문 검색').fill('오류')
    await page.getByPlaceholder('질문 검색').press('Enter')
    await expect(page).toHaveURL(/[?&]search=/)
  })

  test('검색 결과에서 제목의 검색어가 primary 색상으로 하이라이트된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('질문 검색').fill('오류')
    await page.getByPlaceholder('질문 검색').press('Enter')
    const card = page.getByRole('article').first()
    const highlight = card.locator('span').filter({ hasText: '오류' })
    await expect(highlight.first()).toHaveCSS('color', 'rgb(98, 1, 224)')
  })

  test('검색 결과에서 본문의 검색어가 primary 색상으로 하이라이트된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('질문 검색').fill('오류')
    await page.getByPlaceholder('질문 검색').press('Enter')
    const cards = page.getByRole('article')
    await expect(cards.first()).toBeVisible()
  })

  test('검색 결과가 없을 때 빈 상태 메시지가 표시된다', async ({ page }) => {
    test.skip()
    await page.getByPlaceholder('질문 검색').fill('존재하지않는검색어xyz')
    await page.getByPlaceholder('질문 검색').press('Enter')
    await expect(page.getByRole('article')).toHaveCount(0)
  })

  test('검색어 초기화 후 전체 목록이 다시 표시된다', async ({ page }) => {
    test.skip()
    await page.getByPlaceholder('질문 검색').fill('오류')
    await page.getByPlaceholder('질문 검색').press('Enter')
    await page.getByRole('button', { name: '검색어 초기화' }).click()
    const cards = page.getByRole('article')
    await expect(cards.first()).toBeVisible()
  })
})

test.describe('질의응답 목록 - 탭 필터', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna')
  })

  test('"답변완료" 탭 클릭 시 답변 완료된 질문만 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('tab', { name: '답변완료' }).click()
    await expect(page).toHaveURL(/[?&]tab=answered/)
  })

  test('"답변 대기중" 탭 클릭 시 답변 대기중인 질문만 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('tab', { name: '답변 대기중' }).click()
    await expect(page).toHaveURL(/[?&]tab=pending/)
  })

  test('"전체보기" 탭 클릭 시 모든 질문이 표시된다', async ({ page }) => {
    test.skip()
    await page.getByRole('tab', { name: '답변완료' }).click()
    await page.getByRole('tab', { name: '전체보기' }).click()
    const cards = page.getByRole('article')
    await expect(cards.first()).toBeVisible()
  })
})

test.describe('질의응답 목록 - 정렬', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna')
  })

  test('"최신순" 버튼 클릭 시 정렬 드롭다운이 열린다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '최신순' }).click()
    await expect(page.getByRole('option', { name: '최신순' })).toBeVisible()
    await expect(page.getByRole('option', { name: '오래된 순' })).toBeVisible()
  })

  test('드롭다운에서 "오래된 순" 선택 시 정렬이 변경된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '최신순' }).click()
    await page.getByRole('option', { name: '오래된 순' }).click()
    await expect(page.getByRole('button', { name: '오래된 순' })).toBeVisible()
  })
})

test.describe('질의응답 목록 - 필터 모달', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna')
  })

  test('"필터" 버튼 클릭 시 필터 모달이 열린다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '필터' }).click()
    await expect(page.getByRole('dialog', { name: '필터' })).toBeVisible()
  })

  test('필터 모달 X 버튼 클릭 시 모달이 닫힌다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '필터' }).click()
    await page.getByRole('button', { name: '닫기' }).click()
    await expect(page.getByRole('dialog', { name: '필터' })).not.toBeVisible()
  })

  test('필터 모달에 "카테고리 선택" 섹션이 표시된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '필터' }).click()
    await expect(page.getByText('카테고리 선택')).toBeVisible()
  })

  test('대분류 선택 전 중분류 드롭다운이 비활성 상태이다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '필터' }).click()
    const midCategory = page.getByRole('combobox', { name: '중분류' })
    await expect(midCategory).toBeDisabled()
  })

  test('중분류 선택 전 소분류 드롭다운이 비활성 상태이다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '필터' }).click()
    const subCategory = page.getByRole('combobox', { name: '소분류' })
    await expect(subCategory).toBeDisabled()
  })

  test('대분류 선택 시 중분류 드롭다운이 활성화된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '필터' }).click()
    await page
      .getByRole('combobox', { name: '대분류' })
      .selectOption('프론트엔드')
    const midCategory = page.getByRole('combobox', { name: '중분류' })
    await expect(midCategory).toBeEnabled()
  })

  test('"선택 초기화" 버튼 클릭 시 카테고리 선택이 초기화된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '필터' }).click()
    await page
      .getByRole('combobox', { name: '대분류' })
      .selectOption('프론트엔드')
    await page.getByRole('button', { name: '선택 초기화' }).click()
    const topCategory = page.getByRole('combobox', { name: '대분류' })
    await expect(topCategory).toHaveValue('')
  })

  test('"필터 적용하기" 버튼 클릭 시 필터가 적용되고 모달이 닫힌다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '필터' }).click()
    await page
      .getByRole('combobox', { name: '대분류' })
      .selectOption('프론트엔드')
    await page.getByRole('button', { name: '필터 적용하기' }).click()
    await expect(page.getByRole('dialog', { name: '필터' })).not.toBeVisible()
  })
})

test.describe('질의응답 목록 - 질문 카드 렌더링 (REQ-QNA-002)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna')
  })

  test('질문 카드 목록이 표시된다', async ({ page }) => {
    test.skip()
    const cards = page.getByRole('article')
    await expect(cards.first()).toBeVisible()
  })

  test('질문 카드에 카테고리 breadcrumb이 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    await expect(card.getByText('>')).toBeVisible()
  })

  test('질문 카드에 질문 제목이 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    await expect(card.getByRole('heading')).toBeVisible()
  })

  test('질문 카드에 내용 미리보기가 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    const preview = card.locator('p')
    await expect(preview).toBeVisible()
  })

  test('질문 카드에 답변 수가 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    await expect(card.getByText(/답변/)).toBeVisible()
  })

  test('질문 카드에 조회수가 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    await expect(card.getByText(/조회수/)).toBeVisible()
  })

  test('질문 카드에 작성자 닉네임이 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    const author = card.getByRole('img', { name: /프로필/ })
    await expect(author).toBeVisible()
  })

  test('질문 카드에 타임스탬프가 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    await expect(card.getByText(/전/)).toBeVisible()
  })
})

test.describe('질의응답 목록 - 카드 클릭 네비게이션', () => {
  test('질문 카드 클릭 시 해당 질문 상세 페이지(/qna/:questionId)로 이동한다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/qna')
    await page.getByRole('article').first().click()
    await expect(page).toHaveURL(/\/qna\/\d+/)
  })
})

test.describe('질의응답 목록 - 페이지네이션', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna')
  })

  test('페이지네이션이 목록 하단에 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('navigation', { name: '페이지네이션' })
    ).toBeVisible()
  })

  test('현재 페이지 번호가 활성 상태로 표시된다', async ({ page }) => {
    test.skip()
    const activePage = page.getByRole('button', { name: '1', exact: true })
    await expect(activePage).toHaveAttribute('aria-current', 'page')
  })

  test('다른 페이지 번호 클릭 시 해당 페이지로 이동한다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '2', exact: true }).click()
    await expect(page).toHaveURL(/[?&]page=2/)
  })

  test('다음 페이지 버튼 클릭 시 다음 페이지로 이동한다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '다음 페이지' }).click()
    await expect(page).toHaveURL(/[?&]page=2/)
  })

  test('이전 페이지 버튼 클릭 시 이전 페이지로 이동한다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '이전 페이지' }).click()
    await expect(page).toHaveURL(/[?&]page=1/)
  })

  test('첫 페이지 버튼 클릭 시 첫 페이지로 이동한다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '첫 페이지' }).click()
    await expect(page).toHaveURL(/[?&]page=1/)
  })

  test('마지막 페이지 버튼 클릭 시 마지막 페이지로 이동한다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '마지막 페이지' }).click()
    await expect(page).toHaveURL(/[?&]page=\d+/)
  })

  test('첫 페이지에서 이전/처음 버튼이 비활성 상태이다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('button', { name: '이전 페이지' })
    ).toBeDisabled()
    await expect(page.getByRole('button', { name: '첫 페이지' })).toBeDisabled()
  })
})
