/**
 * @interface-contract
 *
 * Page: /community/:postId/edit (커뮤니티 게시글 수정)
 * - 페이지 타이틀: "커뮤니티 게시글 수정" (Bold 32px)
 * - 기존 작성 내용이 채워진 상태로 진입
 * - 수정 가능 항목:
 *   - 카테고리 단일 드롭다운 (기존 카테고리 선택 상태)
 *   - 제목 입력 필드 (기존 제목 채워짐)
 *   - 마크다운 에디터 (기존 내용 채워짐)
 *   - 첨부 이미지 (추가/삭제 가능)
 * - "수정하기" 버튼 (우측 정렬, 보라색 #6201E0)
 * - 에러 팝업 (필수 항목 비워둔 경우): 모달 + "확인" 버튼
 *
 * 접근 권한: 게시글 작성자 본인만 접근 가능
 * - 비로그인 → /login 리다이렉트
 * - 타인 게시글 → /community/:postId 또는 /community 리다이렉트
 *
 * API:
 * - GET  /api/v1/posts/{post_id}            → 기존 게시글 데이터 조회
 * - GET  /api/v1/posts/categories           → 카테고리 목록 조회
 * - PUT  /api/v1/posts/{post_id}            → 게시글 수정 (200: {detail, pk})
 *
 * REQ-CMNT-005: 커뮤니티 게시글 수정
 */

import { test, expect } from '@playwright/test'

test.describe('게시글 수정 페이지 렌더링 (REQ-CMNT-005)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/1/edit')
  })

  test('게시글 수정 페이지가 렌더링된다', async ({ page }) => {
    test.skip()
    // 비로그인 상태에서 접근 시 /login으로 리다이렉트되므로 로그인 후 접근 필요
    await expect(page).toHaveURL('/community/1/edit')
  })

  test('페이지 타이틀 "커뮤니티 게시글 작성"이 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('heading', { name: '커뮤니티 게시글 작성' })
    ).toBeVisible()
  })

  test('카테고리 드롭다운이 기존 카테고리 선택 상태로 표시된다', async ({
    page,
  }) => {
    test.skip()
    const categoryDropdown = page.getByRole('combobox', {
      name: '카테고리 선택',
    })
    await expect(categoryDropdown).toBeVisible()
    await expect(categoryDropdown).not.toHaveText('카테고리 선택')
  })

  test('제목 입력 필드에 기존 제목이 채워진 상태로 표시된다', async ({
    page,
  }) => {
    test.skip()
    const titleInput = page.getByPlaceholder('제목을 입력해 주세요')
    await expect(titleInput).not.toHaveValue('')
  })

  test('마크다운 에디터에 기존 내용이 채워진 상태로 표시된다', async ({
    page,
  }) => {
    test.skip()
    const editor = page.getByPlaceholder('내용을 입력해 주세요.')
    await expect(editor).not.toHaveValue('')
  })

  test('"완료" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '완료' })).toBeVisible()
  })
})

test.describe('게시글 수정 - 접근 권한 (REQ-CMNT-005)', () => {
  test('비로그인 상태에서 /community/:postId/edit 접근 시 /login으로 리다이렉트된다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/community/1/edit')
    await expect(page).toHaveURL('/login')
  })

  test('타인 게시글 수정 페이지 접근 시 상세 페이지로 리다이렉트된다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/community/1/edit')
    await expect(page).toHaveURL(/\/community\/1$|\/community$/)
  })
})

test.describe('게시글 수정 - 내용 변경 (REQ-CMNT-005)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/1/edit')
  })

  test('카테고리를 변경할 수 있다', async ({ page }) => {
    test.skip()
    const dropdown = page.getByRole('combobox', { name: '카테고리 선택' })
    const before = await dropdown.textContent()
    await dropdown.click()
    await page.getByRole('option').nth(1).click()
    await expect(dropdown).not.toHaveText(before!)
  })

  test('제목을 변경할 수 있다', async ({ page }) => {
    test.skip()
    const titleInput = page.getByPlaceholder('제목을 입력해 주세요')
    await titleInput.clear()
    await titleInput.fill('수정된 제목입니다')
    await expect(titleInput).toHaveValue('수정된 제목입니다')
  })

  test('내용을 변경할 수 있다', async ({ page }) => {
    test.skip()
    const editor = page.getByPlaceholder('내용을 입력해 주세요.')
    await editor.clear()
    await editor.fill('수정된 내용입니다.')
    await expect(editor).toHaveValue('수정된 내용입니다.')
  })

  test('이미지 첨부 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('button', { name: /image|이미지/i })
    ).toBeVisible()
  })

  test('이미지 첨부 버튼 클릭 시 파일 선택 다이얼로그가 열린다', async ({
    page,
  }) => {
    test.skip()
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByRole('button', { name: /image|이미지/i }).click()
    const fileChooser = await fileChooserPromise
    expect(fileChooser).toBeTruthy()
  })
})

test.describe('게시글 수정 - 유효성 검사 (REQ-CMNT-005)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/1/edit')
  })

  test('제목을 비운 상태에서 "수정하기" 클릭 시 에러 팝업이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('제목을 입력해 주세요').clear()
    await page.getByRole('button', { name: '완료' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('내용을 비운 상태에서 "수정하기" 클릭 시 에러 팝업이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('내용을 입력해 주세요.').clear()
    await page.getByRole('button', { name: '완료' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('에러 팝업의 "확인" 버튼 클릭 시 팝업이 닫힌다', async ({ page }) => {
    test.skip()
    await page.getByPlaceholder('제목을 입력해 주세요').clear()
    await page.getByRole('button', { name: '완료' }).click()
    await page.getByRole('button', { name: '확인' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})

test.describe('게시글 수정 성공 플로우 (REQ-CMNT-005)', () => {
  test('수정 후 "수정하기" 클릭 시 해당 게시글 상세 페이지로 이동한다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/community/1/edit')
    await page
      .getByPlaceholder('제목을 입력해 주세요')
      .fill('수정된 제목입니다')
    await page.getByRole('button', { name: '완료' }).click()
    await expect(page).toHaveURL(/\/community\/\d+$/)
  })

  test('"수정하기" 클릭 후 로딩 상태가 표시된다', async ({ page }) => {
    test.skip()
    await page.goto('/community/1/edit')
    const submitButton = page.getByRole('button', { name: '완료' })
    await submitButton.click()
    await expect(submitButton).toHaveAttribute('aria-busy', 'true')
  })

  test('API 오류 발생 시 에러 메시지가 표시된다', async ({ page }) => {
    test.skip()
    // TODO: MSW에서 PUT /api/v1/posts/1 500 오버라이드 필요
    await page.goto('/community/1/edit')
    await page.getByRole('button', { name: '완료' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })
})
