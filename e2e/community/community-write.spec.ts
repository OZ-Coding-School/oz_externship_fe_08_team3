/**
 * @interface-contract
 *
 * Page: /community/write (커뮤니티 게시글 작성)
 * - 헤더: 로그인된 상태 (프로필 아이콘 표시)
 * - 페이지 타이틀: "커뮤니티 게시글 작성" (Bold 32px)
 * - 구분선
 * - 상단 카드 (카테고리 + 제목 영역):
 *   - 카테고리 단일 드롭다운 (ARIA combobox 패턴): "카테고리 선택"
 *     - 옵션 예: 구인/협업, 자유게시판, 스터디 모집 등
 *   - 제목 입력 필드: placeholder "제목을 입력해 주세요"
 * - 마크다운 에디터 영역:
 *   - 툴바 (Bold, Italic 등 서식 버튼)
 *   - 좌측: 마크다운 입력 패널
 *   - 우측: 마크다운 미리보기 패널
 * - "등록하기" 버튼 (우측 정렬, 보라색 #6201E0)
 * - 에러 팝업 (필수 항목 미입력 시): 모달 다이얼로그 + "확인" 버튼
 *
 * 접근 권한: 로그인 유저만 접근 가능
 * - 비로그인 → /login 리다이렉트
 *
 * API:
 * - GET  /api/v1/posts/categories → 카테고리 목록 조회
 * - POST /api/v1/posts            → 게시글 생성 (201: {detail, pk}), /community/:pk 리다이렉트
 *
 * REQ-CMNT-001: 커뮤니티 게시글 등록
 */

import { test, expect } from '@playwright/test'

test.describe('게시글 작성 페이지 렌더링', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/write')
  })

  test('게시글 작성 페이지가 렌더링된다', async ({ page }) => {
    test.skip()
    // 비로그인 상태에서 접근 시 /login으로 리다이렉트되므로 로그인 후 접근 필요
    await expect(page).toHaveURL('/community/write')
  })

  test('페이지 타이틀 "커뮤니티 게시글 작성"이 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('heading', { name: '커뮤니티 게시글 작성' })
    ).toBeVisible()
  })

  test('"카테고리 선택" 드롭다운이 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('combobox', { name: '카테고리 선택' })
    ).toBeVisible()
  })

  test('제목 입력 필드가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByPlaceholder('제목을 입력해 주세요')).toBeVisible()
  })

  test('마크다운 에디터 영역이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('region', { name: /에디터/ })).toBeVisible()
  })

  test('마크다운 미리보기 패널이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('region', { name: '미리보기' })).toBeVisible()
  })

  test('"등록하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '등록하기' })).toBeVisible()
  })
})

test.describe('게시글 작성 - 접근 권한', () => {
  test('비로그인 상태에서 /community/write 접근 시 /login으로 리다이렉트된다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/community/write')
    await expect(page).toHaveURL('/login')
  })

  test('로그인 유저가 /community/write에 정상 접근된다', async ({ page }) => {
    test.skip()
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('AuthStore') || '{}')
      store.state = {
        isAuthenticated: true,
        user: {
          nickname: 'testuser',
          email: 'test@test.com',
          profileImage: null,
          role: 'student',
        },
      }
      localStorage.setItem('AuthStore', JSON.stringify(store))
    })
    await page.goto('/community/write')
    await expect(page).toHaveURL('/community/write')
  })
})

test.describe('게시글 작성 - 카테고리 드롭다운 동작', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/write')
  })

  test('"카테고리 선택" 드롭다운 클릭 시 옵션 목록이 열린다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('combobox', { name: '카테고리 선택' }).click()
    await expect(page.getByRole('option').first()).toBeVisible()
  })

  test('카테고리 선택 후 드롭다운에 선택된 값이 표시된다', async ({ page }) => {
    test.skip()
    await page.getByRole('combobox', { name: '카테고리 선택' }).click()
    await page.getByRole('option').first().click()
    await expect(
      page.getByRole('combobox', { name: '카테고리 선택' })
    ).not.toHaveText('카테고리 선택')
  })
})

test.describe('게시글 작성 - 제목 입력', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/write')
  })

  test('제목 입력 필드에 텍스트를 입력할 수 있다', async ({ page }) => {
    test.skip()
    const titleInput = page.getByPlaceholder('제목을 입력해 주세요')
    await titleInput.fill('러닝 메이트 구합니다')
    await expect(titleInput).toHaveValue('러닝 메이트 구합니다')
  })

  test('제목 필드 클릭 시 포커스 상태로 전환된다', async ({ page }) => {
    test.skip()
    const titleInput = page.getByPlaceholder('제목을 입력해 주세요')
    await titleInput.click()
    await expect(titleInput).toBeFocused()
  })
})

test.describe('게시글 작성 - 마크다운 에디터', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/write')
  })

  test('마크다운 입력 패널에 내용을 입력할 수 있다', async ({ page }) => {
    test.skip()
    const editor = page.getByPlaceholder('내용을 입력해 주세요.')
    await editor.fill('## 모집 내용\n\n함께 공부할 분을 찾습니다.')
    await expect(editor).not.toBeEmpty()
  })

  test('마크다운 입력 시 우측 미리보기 패널에 렌더링된 결과가 표시된다', async ({
    page,
  }) => {
    test.skip()
    const editor = page.getByPlaceholder('내용을 입력해 주세요.')
    await editor.fill('## 모집 내용')
    const preview = page.getByRole('region', { name: '미리보기' })
    await expect(preview.getByRole('heading', { level: 2 })).toBeVisible()
  })

  test('에디터 툴바의 Bold 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: /bold|굵게/i })).toBeVisible()
  })

  test('에디터 툴바의 Italic 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('button', { name: /italic|기울임/i })
    ).toBeVisible()
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

test.describe('게시글 작성 - 유효성 검사', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/write')
  })

  test('카테고리 미선택 상태에서 "등록하기" 클릭 시 에러 팝업이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('제목을 입력해 주세요').fill('제목')
    await page.getByRole('button', { name: '등록하기' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('제목 미입력 상태에서 "등록하기" 클릭 시 에러 팝업이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '등록하기' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('내용 미입력 상태에서 "등록하기" 클릭 시 에러 팝업이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('제목을 입력해 주세요').fill('제목만 입력')
    await page.getByRole('button', { name: '등록하기' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('에러 팝업의 "확인" 버튼 클릭 시 팝업이 닫힌다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '등록하기' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: '확인' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('에러 팝업 배경 클릭(Escape) 시 팝업이 닫힌다', async ({ page }) => {
    test.skip()
    // Modal 컴포넌트: Escape 키 또는 배경 클릭으로 닫기 지원
    await page.getByRole('button', { name: '등록하기' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.locator('[aria-modal="true"]').press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})

test.describe('게시글 등록 성공 플로우 (REQ-CMNT-001)', () => {
  test('모든 필수 항목 입력 후 "등록하기" 클릭 시 게시글 상세 페이지로 이동한다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/community/write')

    // 카테고리 선택
    await page.getByRole('combobox', { name: '카테고리 선택' }).click()
    await page.getByRole('option').first().click()

    // 제목 입력
    await page
      .getByPlaceholder('제목을 입력해 주세요')
      .fill('러닝 메이트 함께해요')

    // 내용 입력
    await page
      .getByPlaceholder('내용을 입력해 주세요.')
      .fill('함께 열공할 분을 모집합니다.')

    // 등록
    await page.getByRole('button', { name: '등록하기' }).click()

    // 생성된 게시글 상세 페이지로 이동
    await expect(page).toHaveURL(/\/community\/\d+/)
  })

  test('"등록하기" 버튼 클릭 후 로딩 상태가 표시된다', async ({ page }) => {
    test.skip()
    await page.goto('/community/write')
    await page.getByRole('combobox', { name: '카테고리 선택' }).click()
    await page.getByRole('option').first().click()
    await page.getByPlaceholder('제목을 입력해 주세요').fill('로딩 상태 확인')
    await page
      .getByPlaceholder('내용을 입력해 주세요.')
      .fill('로딩 중인지 확인합니다.')

    const submitButton = page.getByRole('button', { name: '등록하기' })
    await submitButton.click()
    await expect(submitButton).toHaveAttribute('aria-busy', 'true')
  })

  test('API 오류 발생 시 에러 메시지가 표시된다', async ({ page }) => {
    test.skip()
    await page.goto('/community/write')
    await page.getByRole('combobox', { name: '카테고리 선택' }).click()
    await page.getByRole('option').first().click()
    await page.getByPlaceholder('제목을 입력해 주세요').fill('오류 테스트')
    await page
      .getByPlaceholder('내용을 입력해 주세요.')
      .fill('서버 오류 시 처리를 테스트합니다.')
    await page.getByRole('button', { name: '등록하기' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })
})
