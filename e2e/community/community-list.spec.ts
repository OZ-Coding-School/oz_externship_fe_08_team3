/**
 * @interface-contract
 *
 * Page: /community (커뮤니티 목록)
 * - 헤더: 네비게이션 바에 "커뮤니티" 버튼 → /community 이동
 * - 페이지 타이틀: "커뮤니티" (Bold 32px)
 * - 검색 바: pill-shaped input, placeholder "질문 검색", 돋보기 아이콘, 검색 유형 드롭다운 (제목 / 내용 / 작성자)
 * - "글쓰기" 버튼: 보라색 (#6201E0) → 비로그인 시 /login 리다이렉트, 로그인 시 /community/write 이동
 * - 카테고리 필터: 수평 탭 버튼 (전체게시판 / 공지사항 / 자유 게시판 / 일상 공유 / 개발 지식 공유 / 취업 정보 공유 / 프로젝트 구인), 좌우 화살표 스크롤
 * - 정렬: "최신순" + 정렬 아이콘 → 드롭다운 (조회순 / 좋아요순 / 댓글순 / 최신순(기본값) / 오래된 순), 정렬 기준 동일 시 2차 정렬 최신순 적용
 * - 게시글 카드: 카테고리 태그, 제목, 내용 미리보기, 좋아요 수, 조회수, 작성자 (프로필 이미지 + 닉네임), 타임스탬프
 * - 카드 클릭 → /community/:postId 이동
 * - 페이지네이션: 목록 하단
 *
 * API:
 * - GET /posts → 게시글 목록 조회 (카테고리, 검색어, 정렬, 페이지 파라미터)
 *
 * REQ-CMNT-002: 커뮤니티 게시글 목록 조회
 */

import { test, expect } from '@playwright/test'

test.describe('커뮤니티 목록 페이지 렌더링', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community')
  })

  test('커뮤니티 목록 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/community')
  })

  test('페이지 타이틀 "커뮤니티"가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('heading', { name: '커뮤니티' })).toBeVisible()
  })

  test('검색 바가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByPlaceholder('질문 검색')).toBeVisible()
  })

  test('"글쓰기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '글쓰기' })).toBeVisible()
  })

  test('카테고리 탭 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '전체게시판' })).toBeVisible()
  })

  test('"최신순" 정렬 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '최신순' })).toBeVisible()
  })
})

test.describe('커뮤니티 목록 - 비로그인 접근 (REQ-CMNT-002)', () => {
  test('비로그인 상태에서 /community 접근 시 목록이 표시된다', async ({
    page,
  }) => {
    test.skip()
    // 요구사항: "게시글 목록 조회는 비 로그인 사용자도 가능합니다"
    await page.goto('/community')
    await expect(page).toHaveURL('/community')
    await expect(page.getByRole('article').first()).toBeVisible()
  })
})

test.describe('커뮤니티 목록 - 헤더 네비게이션', () => {
  test('헤더 "커뮤니티" 버튼 클릭 시 /community로 이동한다', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('link', { name: '커뮤니티' }).click()
    await expect(page).toHaveURL('/community')
  })
})

test.describe('커뮤니티 목록 - "글쓰기" 버튼 네비게이션', () => {
  test('비로그인 상태에서 "글쓰기" 버튼 클릭 시 /login으로 이동한다', async ({
    page,
  }) => {
    await page.goto('/community')
    await page.getByRole('button', { name: '글쓰기' }).click()
    await expect(page).toHaveURL('/login')
  })

  test('로그인 상태에서 "글쓰기" 버튼 클릭 시 /community/write로 이동한다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/community')
    await page.getByRole('button', { name: '글쓰기' }).click()
    await expect(page).toHaveURL('/community/write')
  })
})

test.describe('커뮤니티 목록 - 검색 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community')
  })

  test('검색 바 클릭 시 포커스 상태로 전환된다', async ({ page }) => {
    test.skip()
    const searchInput = page.getByPlaceholder('질문 검색')
    await searchInput.click()
    await expect(searchInput).toBeFocused()
  })

  test('검색어 입력 시 X(초기화) 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await page.getByPlaceholder('질문 검색').fill('러닝')
    await expect(
      page.getByRole('button', { name: '검색어 초기화' })
    ).toBeVisible()
  })

  test('X 버튼 클릭 시 검색어가 초기화된다', async ({ page }) => {
    test.skip()
    const searchInput = page.getByPlaceholder('질문 검색')
    await searchInput.fill('러닝')
    await page.getByRole('button', { name: '검색어 초기화' }).click()
    await expect(searchInput).toHaveValue('')
  })

  test('검색어 입력 후 엔터 시 검색 결과가 표시된다', async ({ page }) => {
    test.skip()
    await page.getByPlaceholder('질문 검색').fill('러닝')
    await page.getByPlaceholder('질문 검색').press('Enter')
    await expect(page).toHaveURL(/[?&]search=/)
  })

  test('검색 결과가 없을 때 빈 상태 메시지가 표시된다', async ({ page }) => {
    test.skip()
    await page.getByPlaceholder('질문 검색').fill('존재하지않는검색어xyz')
    await page.getByPlaceholder('질문 검색').press('Enter')
    await expect(page.getByRole('article')).toHaveCount(0)
  })

  test('검색어 초기화 후 전체 목록이 다시 표시된다', async ({ page }) => {
    test.skip()
    await page.getByPlaceholder('질문 검색').fill('러닝')
    await page.getByPlaceholder('질문 검색').press('Enter')
    await page.getByRole('button', { name: '검색어 초기화' }).click()
    const cards = page.getByRole('article')
    await expect(cards.first()).toBeVisible()
  })

  test('검색 키워드 없이 검색 버튼 클릭 시 전체 게시글이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('질문 검색').press('Enter')
    const cards = page.getByRole('article')
    await expect(cards.first()).toBeVisible()
  })

  test('카테고리 선택 후 키워드 없이 검색 시 해당 카테고리 전체 게시글이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '자유 게시판' }).click()
    await page.getByPlaceholder('질문 검색').press('Enter')
    await expect(page).toHaveURL(/[?&]category_id=\d+/)
    await expect(page.getByRole('article').first()).toBeVisible()
  })
})

test.describe('커뮤니티 목록 - 검색 유형 필터', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community')
  })

  test('검색 유형 드롭다운이 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('button', { name: /검색 유형|제목/ })
    ).toBeVisible()
  })

  test('검색 유형 드롭다운 클릭 시 "제목 / 내용 / 작성자" 옵션이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: /검색 유형|제목/ }).click()
    await expect(page.getByRole('option', { name: '제목' })).toBeVisible()
    await expect(page.getByRole('option', { name: '내용' })).toBeVisible()
    await expect(page.getByRole('option', { name: '작성자' })).toBeVisible()
  })

  test('검색 유형 드롭다운에 "제목+내용" 옵션이 표시된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: /검색 유형|제목/ }).click()
    await expect(page.getByRole('option', { name: '제목+내용' })).toBeVisible()
  })

  test('검색 유형 "작성자" 선택 후 검색어 입력 시 해당 조건으로 검색된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: /검색 유형|제목/ }).click()
    await page.getByRole('option', { name: '작성자' }).click()
    await page.getByPlaceholder('질문 검색').fill('김태산')
    await page.getByPlaceholder('질문 검색').press('Enter')
    await expect(page).toHaveURL(/[?&]search=/)
  })
})

test.describe('커뮤니티 목록 - 카테고리 필터 (REQ-CMNT-002)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community')
  })

  test('카테고리 탭 버튼 목록이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '전체게시판' })).toBeVisible()
    await expect(page.getByRole('button', { name: '공지사항' })).toBeVisible()
    await expect(
      page.getByRole('button', { name: '자유 게시판' })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: '프로젝트 구인' })
    ).toBeVisible()
  })

  test('카테고리 탭 클릭 시 해당 카테고리 게시글만 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '프로젝트 구인' }).click()
    await expect(page).toHaveURL(/[?&]category_id=\d+/)
  })
})

test.describe('커뮤니티 목록 - 정렬', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community')
  })

  test('"최신순" 버튼 클릭 시 정렬 드롭다운이 열린다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '최신순' }).click()
    await expect(page.getByRole('option', { name: '조회순' })).toBeVisible()
    await expect(page.getByRole('option', { name: '좋아요순' })).toBeVisible()
    await expect(page.getByRole('option', { name: '댓글순' })).toBeVisible()
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

test.describe('커뮤니티 목록 - 게시글 카드 렌더링 (REQ-CMNT-002)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community')
  })

  test('게시글 카드 목록이 표시된다', async ({ page }) => {
    test.skip()
    const cards = page.getByRole('article')
    await expect(cards.first()).toBeVisible()
  })

  test('게시글 카드에 카테고리 태그가 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    await expect(
      card
        .locator('[data-category]')
        .or(
          card.getByText(
            /공지사항|자유 계시판|일상 공유|개발 지식 공유|취업 정보 공유|프로젝트 구인/
          )
        )
    ).toBeVisible()
  })

  test('게시글 카드에 게시글 제목이 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    await expect(card.getByRole('heading')).toBeVisible()
  })

  test('게시글 카드에 내용 미리보기가 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    const preview = card.locator('p')
    await expect(preview).toBeVisible()
  })

  test('게시글 카드에 좋아요 수가 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    await expect(card.getByText(/좋아요/)).toBeVisible()
  })

  test('게시글 카드에 조회수가 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    await expect(card.getByText(/조회수/)).toBeVisible()
  })

  test('게시글 카드에 작성자 닉네임이 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    await expect(
      card.locator('[data-nickname]').or(card.getByText(/\S+/))
    ).toBeVisible()
  })

  test('게시글 카드에 상대 시간 형식이 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    await expect(card.getByText(/전/)).toBeVisible()
  })

  test('게시글 카드에 댓글 수가 표시된다', async ({ page }) => {
    test.skip()
    const card = page.getByRole('article').first()
    await expect(card.getByText(/댓글/)).toBeVisible()
  })

  test('게시글 카드에 작성자 프로필 썸네일 이미지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    const card = page.getByRole('article').first()
    await expect(card.getByRole('img', { name: /프로필/ })).toBeVisible()
  })

  test('이미지가 첨부된 게시글 카드에 썸네일 이미지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    const cardWithImage = page
      .getByRole('article')
      .filter({ has: page.getByRole('img', { name: /썸네일|첨부/ }) })
      .first()
    await expect(
      cardWithImage.getByRole('img', { name: /썸네일|첨부/ })
    ).toBeVisible()
  })
})

test.describe('커뮤니티 목록 - 카드 클릭 네비게이션', () => {
  test('게시글 카드 클릭 시 해당 게시글 상세 페이지(/community/:postId)로 이동한다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/community')
    await page.getByRole('article').first().click()
    await expect(page).toHaveURL(/\/community\/\d+/)
  })
})

test.describe('커뮤니티 목록 - 페이지네이션', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community')
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

  test('첫 페이지에서 이전/처음 버튼이 비활성 상태이다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('button', { name: '이전 페이지' })
    ).toBeDisabled()
    await expect(page.getByRole('button', { name: '첫 페이지' })).toBeDisabled()
  })
})
