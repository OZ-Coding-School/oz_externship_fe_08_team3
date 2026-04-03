/**
 * @interface-contract
 *
 * Page: /qna/write (질문 등록)
 * - 헤더: 로그인된 상태 (프로필 아이콘 표시)
 * - 페이지 타이틀: "질문 작성하기" (Bold 32px)
 * - 구분선
 * - 상단 카드 (카테고리 + 제목 영역):
 *   - 카테고리 3단계 드롭다운 (가로 3개, ARIA combobox 패턴):
 *     - "대분류 선택" 드롭다운 (기본 enabled)
 *     - "중분류 선택" 드롭다운 (대분류 미선택 시 disabled)
 *     - "소분류 선택" 드롭다운 (중분류 미선택 시 disabled)
 *     - 드롭다운 옵션: 대분류(프론트엔드, 백엔드), 중분류(프로그래밍 언어, 웹 프레임워크 등), 소분류(JavaScript, React 등)
 *   - 제목 입력 필드: placeholder "제목을 입력해 주세요"
 * - 마크다운 에디터 영역:
 *   - 툴바 (Bold, Italic 등 서식 버튼)
 *   - 좌측: 마크다운 입력 패널, placeholder "내용을 입력해 주세요."
 *   - 우측: 마크다운 미리보기 패널
 * - "등록하기" 버튼 (우측 정렬, 보라색 #6201E0)
 * - 에러 팝업 (필수 항목 미입력 시): 모달 다이얼로그 + "확인" 버튼
 *
 * 접근 권한: 수강생 권한 로그인 유저만 접근 가능
 * - 비로그인 → /login 리다이렉트
 * - 일반 유저(수강생 아님) → 접근 제한 (에러 또는 리다이렉트)
 *
 * API:
 * - GET  /qna/categories → 카테고리 목록 조회
 * - POST /qna/questions  → 질문 생성, /qna/:questionId 리다이렉트
 *
 * REQ-QNA-001: 질문 등록
 */

import { test, expect } from '@playwright/test'

test.describe('질문 등록 페이지 렌더링', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna/write')
  })

  test('질문 등록 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/qna/write')
  })

  test('페이지 타이틀 "질문 작성하기"가 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('heading', { name: '질문 작성하기' })
    ).toBeVisible()
  })

  test('"대분류 선택" 드롭다운이 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('combobox', { name: '대분류 선택' })
    ).toBeVisible()
  })

  test('"중분류 선택" 드롭다운이 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('combobox', { name: '중분류 선택' })
    ).toBeVisible()
  })

  test('"소분류 선택" 드롭다운이 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('combobox', { name: '소분류 선택' })
    ).toBeVisible()
  })

  test('제목 입력 필드가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByPlaceholder('제목을 입력해 주세요')).toBeVisible()
  })

  test('마크다운 에디터 영역이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByPlaceholder('내용을 입력해 주세요.')).toBeVisible()
  })

  test('마크다운 미리보기 패널이 표시된다', async ({ page }) => {
    test.skip()
    // 우측 미리보기 패널 — aria-label 또는 특정 텍스트로 구분
    await expect(page.getByRole('region', { name: '미리보기' })).toBeVisible()
  })

  test('"등록하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '등록하기' })).toBeVisible()
  })
})

test.describe('질문 등록 - 접근 권한', () => {
  test('비로그인 상태에서 /qna/write 접근 시 /login으로 리다이렉트된다', async ({
    page,
  }) => {
    test.skip()
    // 비로그인: authStore 기본 상태가 isAuthenticated: false이므로 별도 설정 불필요
    await page.goto('/qna/write')
    await expect(page).toHaveURL('/login')
  })

  test('수강생이 아닌 일반 유저가 /qna/write 접근 시 접근 제한된다', async ({
    page,
  }) => {
    test.skip()
    // 일반 유저 로그인 상태: localStorage로 authStore 설정 (role: 'user')
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('AuthStore') || '{}')
      store.state = {
        isAuthenticated: true,
        user: {
          nickname: 'normaluser',
          email: 'user@test.com',
          profileImage: null,
          role: 'user',
        },
      }
      localStorage.setItem('AuthStore', JSON.stringify(store))
    })
    await page.goto('/qna/write')
    // 수강생이 아닌 경우 접근 제한 — 에러 페이지 또는 / 리다이렉트
    await expect(page).not.toHaveURL('/qna/write')
  })

  test('수강생 권한 유저가 /qna/write에 정상 접근된다', async ({ page }) => {
    test.skip()
    // 수강생 로그인 상태: localStorage로 authStore 설정 (role: 'student')
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('AuthStore') || '{}')
      store.state = {
        isAuthenticated: true,
        user: {
          nickname: 'student01',
          email: 'student@test.com',
          profileImage: null,
          role: 'student',
        },
      }
      localStorage.setItem('AuthStore', JSON.stringify(store))
    })
    await page.goto('/qna/write')
    await expect(page).toHaveURL('/qna/write')
  })
})

test.describe('질문 등록 - 카테고리 드롭다운 동작', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna/write')
  })

  test('초기 상태에서 "중분류 선택" 드롭다운이 비활성 상태이다', async ({
    page,
  }) => {
    test.skip()
    // Dropdown 컴포넌트: disabled + aria-disabled 설정
    const midCategory = page.getByRole('combobox', { name: '중분류 선택' })
    await expect(midCategory).toBeDisabled()
  })

  test('초기 상태에서 "소분류 선택" 드롭다운이 비활성 상태이다', async ({
    page,
  }) => {
    test.skip()
    const subCategory = page.getByRole('combobox', { name: '소분류 선택' })
    await expect(subCategory).toBeDisabled()
  })

  test('"대분류 선택" 드롭다운 클릭 시 옵션 목록이 열린다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('combobox', { name: '대분류 선택' }).click()
    await expect(page.getByRole('option', { name: '프론트엔드' })).toBeVisible()
    await expect(page.getByRole('option', { name: '백엔드' })).toBeVisible()
  })

  test('대분류 선택 시 "중분류 선택" 드롭다운이 활성화된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('combobox', { name: '대분류 선택' }).click()
    await page.getByRole('option', { name: '프론트엔드' }).click()
    const midCategory = page.getByRole('combobox', { name: '중분류 선택' })
    await expect(midCategory).toBeEnabled()
  })

  test('대분류 선택 후 중분류 선택 시 "소분류 선택" 드롭다운이 활성화된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('combobox', { name: '대분류 선택' }).click()
    await page.getByRole('option', { name: '프론트엔드' }).click()
    await page.getByRole('combobox', { name: '중분류 선택' }).click()
    await page.getByRole('option', { name: '웹 프레임워크' }).click()
    const subCategory = page.getByRole('combobox', { name: '소분류 선택' })
    await expect(subCategory).toBeEnabled()
  })

  test('대분류 선택 변경 시 중분류·소분류 선택이 초기화된다', async ({
    page,
  }) => {
    test.skip()
    // 프론트엔드 선택 후 중분류까지 선택
    await page.getByRole('combobox', { name: '대분류 선택' }).click()
    await page.getByRole('option', { name: '프론트엔드' }).click()
    await page.getByRole('combobox', { name: '중분류 선택' }).click()
    await page.getByRole('option', { name: '웹 프레임워크' }).click()
    // 대분류를 백엔드로 변경
    await page.getByRole('combobox', { name: '프론트엔드' }).click()
    await page.getByRole('option', { name: '백엔드' }).click()
    // 중분류가 초기 상태(비활성)로 돌아왔는지 확인
    const midCategory = page.getByRole('combobox', { name: '중분류 선택' })
    await expect(midCategory).toBeDisabled()
  })

  test('키보드 방향키로 드롭다운 옵션 탐색이 가능하다', async ({ page }) => {
    test.skip()
    // Dropdown 컴포넌트: Arrow Up/Down, Enter, Space, Escape 키보드 네비게이션 지원
    const topCategory = page.getByRole('combobox', { name: '대분류 선택' })
    await topCategory.press('Space')
    await topCategory.press('ArrowDown')
    await topCategory.press('Enter')
    await expect(topCategory).not.toHaveValue('')
  })

  test('Escape 키로 드롭다운 옵션 목록이 닫힌다', async ({ page }) => {
    test.skip()
    const topCategory = page.getByRole('combobox', { name: '대분류 선택' })
    await topCategory.click()
    await expect(page.getByRole('option', { name: '프론트엔드' })).toBeVisible()
    await topCategory.press('Escape')
    await expect(
      page.getByRole('option', { name: '프론트엔드' })
    ).not.toBeVisible()
  })
})

test.describe('질문 등록 - 제목 입력', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna/write')
  })

  test('제목 입력 필드에 텍스트를 입력할 수 있다', async ({ page }) => {
    test.skip()
    const titleInput = page.getByPlaceholder('제목을 입력해 주세요')
    await titleInput.fill('React useState 동작 원리를 알고 싶습니다')
    await expect(titleInput).toHaveValue(
      'React useState 동작 원리를 알고 싶습니다'
    )
  })

  test('제목 필드 클릭 시 포커스 상태로 전환된다', async ({ page }) => {
    test.skip()
    const titleInput = page.getByPlaceholder('제목을 입력해 주세요')
    await titleInput.click()
    await expect(titleInput).toBeFocused()
  })
})

test.describe('질문 등록 - 마크다운 에디터', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna/write')
  })

  test('마크다운 입력 패널에 내용을 입력할 수 있다', async ({ page }) => {
    test.skip()
    const editor = page.getByPlaceholder('내용을 입력해 주세요.')
    await editor.fill('## 질문 내용\n\nReact Hook에 대해 질문합니다.')
    await expect(editor).toHaveValue(
      '## 질문 내용\n\nReact Hook에 대해 질문합니다.'
    )
  })

  test('마크다운 입력 시 우측 미리보기 패널에 렌더링된 결과가 표시된다', async ({
    page,
  }) => {
    test.skip()
    const editor = page.getByPlaceholder('내용을 입력해 주세요.')
    await editor.fill('## 제목 텍스트')
    // 미리보기 패널에 h2 요소가 렌더링되어야 한다
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
    // 파일 입력 요소가 존재하고, 이미지 버튼 클릭 시 트리거된다
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByRole('button', { name: /image|이미지/i }).click()
    const fileChooser = await fileChooserPromise
    expect(fileChooser).toBeTruthy()
  })
})

test.describe('질문 등록 - 유효성 검사', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna/write')
  })

  test('제목 미입력 상태에서 "등록하기" 클릭 시 에러 팝업이 표시된다', async ({
    page,
  }) => {
    test.skip()
    // 내용 입력 없이 등록 시도
    await page.getByRole('button', { name: '등록하기' }).click()
    // 에러 팝업: role="dialog" 모달
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('질문 내용 미입력 상태에서 "등록하기" 클릭 시 에러 팝업이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('제목을 입력해 주세요').fill('제목만 입력')
    await page.getByRole('button', { name: '등록하기' }).click()
    // "질문 내용을 입력해 주세요." 메시지가 포함된 다이얼로그
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('질문 내용을 입력해 주세요.')).toBeVisible()
  })

  test('에러 팝업의 "확인" 버튼 클릭 시 팝업이 닫힌다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '등록하기' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: '확인' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('에러 팝업 배경 클릭 시 팝업이 닫힌다', async ({ page }) => {
    test.skip()
    // Modal 컴포넌트: 배경 클릭으로 닫기 지원
    await page.getByRole('button', { name: '등록하기' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    // 오버레이 영역 클릭 (다이얼로그 바깥)
    await page.locator('[aria-modal="true"]').press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('카테고리 미선택 상태에서 "등록하기" 클릭 시 에러 팝업이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page
      .getByPlaceholder('제목을 입력해 주세요')
      .fill('카테고리 없는 질문')
    await page.getByPlaceholder('내용을 입력해 주세요.').fill('내용 입력')
    await page.getByRole('button', { name: '등록하기' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })
})

test.describe('질문 등록 성공 플로우', () => {
  test('모든 필수 항목 입력 후 "등록하기" 클릭 시 질문 상세 페이지로 이동한다', async ({
    page,
  }) => {
    test.skip()
    // MSW 기본 핸들러가 POST /qna/questions 성공 응답(201) + 생성된 questionId 반환
    // 수강생 로그인 상태 필요 — loginAs(page, msw, 'student') 구현 후 보완
    await page.goto('/qna/write')

    // 카테고리 선택
    await page.getByRole('combobox', { name: '대분류 선택' }).click()
    await page.getByRole('option', { name: '프론트엔드' }).click()
    await page.getByRole('combobox', { name: '중분류 선택' }).click()
    await page.getByRole('option', { name: '웹 프레임워크' }).click()
    await page.getByRole('combobox', { name: '소분류 선택' }).click()
    await page.getByRole('option', { name: 'React' }).click()

    // 제목 입력
    await page
      .getByPlaceholder('제목을 입력해 주세요')
      .fill('React useState 동작 원리가 궁금합니다')

    // 내용 입력
    await page
      .getByPlaceholder('내용을 입력해 주세요.')
      .fill(
        'useState를 사용할 때 상태 업데이트가 비동기적으로 처리되는 이유가 무엇인가요?'
      )

    // 등록
    await page.getByRole('button', { name: '등록하기' }).click()

    // 생성된 질문 상세 페이지로 이동
    await expect(page).toHaveURL(/\/qna\/\d+/)
  })

  test('"등록하기" 버튼 클릭 후 로딩 상태가 표시된다', async ({ page }) => {
    test.skip()
    // Button 컴포넌트: aria-busy={loading} loading 상태
    await page.goto('/qna/write')
    await page.getByRole('combobox', { name: '대분류 선택' }).click()
    await page.getByRole('option', { name: '프론트엔드' }).click()
    await page.getByRole('combobox', { name: '중분류 선택' }).click()
    await page.getByRole('option', { name: '웹 프레임워크' }).click()
    await page.getByRole('combobox', { name: '소분류 선택' }).click()
    await page.getByRole('option', { name: 'React' }).click()
    await page
      .getByPlaceholder('제목을 입력해 주세요')
      .fill('로딩 상태 확인 테스트')
    await page
      .getByPlaceholder('내용을 입력해 주세요.')
      .fill('로딩 중인지 확인합니다.')

    const submitButton = page.getByRole('button', { name: '등록하기' })
    await submitButton.click()
    // 요청 처리 중 aria-busy=true 상태 확인
    await expect(submitButton).toHaveAttribute('aria-busy', 'true')
  })

  test('API 오류 발생 시 에러 메시지가 표시된다', async ({ page }) => {
    test.skip()
    // MSW에서 POST /qna/questions 500 오버라이드 필요
    // msw.overrideError('POST', '/qna/questions', 500, '서버 오류가 발생했습니다') 사용
    await page.goto('/qna/write')
    await page.getByRole('combobox', { name: '대분류 선택' }).click()
    await page.getByRole('option', { name: '프론트엔드' }).click()
    await page.getByRole('combobox', { name: '중분류 선택' }).click()
    await page.getByRole('option', { name: '웹 프레임워크' }).click()
    await page.getByRole('combobox', { name: '소분류 선택' }).click()
    await page.getByRole('option', { name: 'React' }).click()
    await page.getByPlaceholder('제목을 입력해 주세요').fill('오류 테스트 질문')
    await page
      .getByPlaceholder('내용을 입력해 주세요.')
      .fill('서버 오류 시 처리를 테스트합니다.')
    await page.getByRole('button', { name: '등록하기' }).click()
    // 에러 상태: 다이얼로그 또는 alert 표시
    await expect(page.getByRole('dialog')).toBeVisible()
  })
})
