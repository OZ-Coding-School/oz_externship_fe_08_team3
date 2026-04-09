/**
 * @interface-contract
 *
 * Page: /community/:postId (커뮤니티 게시글 상세)
 * - 카테고리 태그: Bold 20px, 보라색 (#6201E0) (예: "구인/협업")
 * - 게시글 제목: Bold 32px
 * - 작성자 정보: 프로필 이미지 + 닉네임 (우측 상단)
 * - 메타정보: 조회수 N · 좋아요 N · N시간 전
 * - 본문 내용
 * - 하단 액션 버튼: 좋아요 버튼 (숫자 포함) + 공유하기 버튼
 * - 댓글 섹션:
 *   - "댓글 N개" (Bold 20px) + 최신순 정렬 버튼
 *   - 댓글 목록: 프로필 이미지 + 닉네임 + 작성일 + 내용
 *
 * 로그인 상태별 차이:
 * - 비회원: 댓글 입력창 없음, 좋아요 비활성
 * - 회원: 댓글 입력창 표시 (placeholder: "개인정보를 공유 및 요청하거나...") + "등록" 버튼
 * - 회원(작성자): 회원 기능 + 수정/삭제 버튼 표시
 *
 * API:
 * - GET    /api/v1/posts/{post_id}                          → 게시글 상세 조회
 * - GET    /api/v1/posts/{post_id}/comments                 → 댓글 목록 조회 (별도 API, count 필드로 댓글 수 확인)
 * - POST   /api/v1/posts/{post_id}/like                     → 좋아요 (201)
 * - DELETE /api/v1/posts/{post_id}/like                     → 좋아요 취소 (200)
 * - POST   /api/v1/posts/{post_id}/comments                 → 댓글 등록 (201)
 * - DELETE /api/v1/posts/{post_id}                          → 게시글 삭제 (작성자 전용, 200)
 *
 * REQ-CMNT-003: 커뮤니티 게시글 상세 조회
 * REQ-CMNT-004: 커뮤니티 게시글 좋아요
 * REQ-CMNT-005: 커뮤니티 게시글 수정 (수정 버튼 → 이동)
 * REQ-CMNT-006: 커뮤니티 게시글 삭제
 * REQ-CMNT-007: 커뮤니티 댓글 작성
 * REQ-CMNT-008: 커뮤니티 댓글 유저 태그
 * REQ-CMNT-009: 커뮤니티 댓글 목록 조회
 * REQ-CMNT-010: 커뮤니티 댓글 삭제
 */

import { test, expect } from '@playwright/test'

test.describe('커뮤니티 상세 페이지 렌더링 (REQ-CMNT-003)', () => {
  test('커뮤니티 상세 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/community/1')
    await expect(page).toHaveURL('/community/1')
  })
})

test.describe('커뮤니티 상세 - 비로그인 접근 (REQ-CMNT-003)', () => {
  test('비로그인 상태에서 /community/:postId 접근 시 상세 페이지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/community/1')
    await expect(page).toHaveURL('/community/1')
    await expect(page.getByRole('heading').first()).toBeVisible()
  })
})

test.describe('커뮤니티 상세 - 게시글 정보 표시 (REQ-CMNT-003)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/1')
  })

  test('카테고리 태그가 보라색으로 표시된다', async ({ page }) => {
    test.skip()
    const categoryTag = page
      .locator('[data-category]')
      .or(page.getByText(/구인\/협업|자유게시판|스터디/).first())
    await expect(categoryTag).toBeVisible()
  })

  test('게시글 제목이 heading으로 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('heading').first()).toBeVisible()
  })

  test('작성자 프로필 이미지가 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('img', { name: /프로필/ }).first()
    ).toBeVisible()
  })

  test('작성자 닉네임이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText(/\w+/).first()).toBeVisible()
  })

  test('조회수가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText(/조회수/)).toBeVisible()
  })

  test('좋아요 수가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText(/좋아요/)).toBeVisible()
  })

  test('작성 시간이 상대 시간 형식으로 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText(/전/)).toBeVisible()
  })

  test('게시글 본문 내용이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('article')).toBeVisible()
  })

  test('게시글 내용에 첨부된 이미지가 표시된다', async ({ page }) => {
    test.skip()
    const contentArea = page.getByRole('article')
    await expect(contentArea.getByRole('img').first()).toBeVisible()
  })
})

test.describe('커뮤니티 상세 - 좋아요 버튼 (REQ-CMNT-004)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/1')
  })

  test('게시글 하단에 좋아요 버튼이 표시된다', async ({ page }) => {
    test.skip()

    await expect(page.getByRole('button', { name: /좋아요/ })).toBeVisible()
  })

  test('로그인 상태에서 좋아요 버튼 클릭 시 좋아요 수가 증가한다', async ({
    page,
  }) => {
    test.skip()
    const likeButton = page.getByRole('button', { name: /좋아요/ })
    const beforeText = await likeButton.textContent()
    await likeButton.click()
    const afterText = await likeButton.textContent()
    expect(afterText).not.toBe(beforeText)
  })

  test('좋아요 상태에서 버튼 클릭 시 좋아요가 취소된다 (좋아요 수 감소)', async ({
    page,
  }) => {
    test.skip()
    const likeButton = page.getByRole('button', { name: /좋아요/ })
    await likeButton.click() // 좋아요 활성화
    const likedText = await likeButton.textContent()
    await likeButton.click() // 좋아요 취소
    const cancelledText = await likeButton.textContent()
    expect(cancelledText).not.toBe(likedText)
  })

  test('비로그인 상태에서 좋아요 버튼 클릭 시 /login으로 이동한다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: /좋아요/ }).click()
    await expect(page).toHaveURL('/login')
  })

  test('공유하기 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '공유하기' })).toBeVisible()
  })

  test('공유하기 버튼 클릭 시 URL이 클립보드에 복사된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '공유하기' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })
})

test.describe('커뮤니티 상세 - 댓글 섹션 (REQ-CMNT-009)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/1')
  })

  test('"댓글 N개" 형식으로 댓글 수가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText(/댓글/)).toBeVisible()
    await expect(page.getByText(/\d+개/)).toBeVisible()
  })

  test('댓글 목록에 작성자 프로필·닉네임·날짜·내용이 표시된다', async ({
    page,
  }) => {
    test.skip()
    const firstComment = page
      .locator('[data-comment]')
      .or(page.getByRole('listitem').first())
    await expect(firstComment).toBeVisible()
  })

  test('최신순 정렬 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '최신순' })).toBeVisible()
  })

  test('댓글 목록에 작성일시가 표시된다', async ({ page }) => {
    test.skip()
    // REQ-CMNT-009: 댓글 목록 확인 가능 항목 — 작성일시
    const firstComment = page
      .locator('[data-comment]')
      .or(page.getByRole('listitem').first())
    await expect(
      firstComment.getByText(
        /전|\d{4}-\d{2}-\d{2}|\d+:\d+|\d{4}년 \d{1,2}월 \d{1,2}일/
      )
    ).toBeVisible()
  })

  test('댓글 목록에 태그된 유저 닉네임(@닉네임)이 구분 표시된다', async ({
    page,
  }) => {
    test.skip()
    await expect(
      page.locator('[data-mention]').or(page.locator('.mention')).first()
    ).toBeVisible()
  })

  test('댓글 목록에 무한 스크롤이 적용된다 (10개 단위)', async ({ page }) => {
    test.skip()
    const before = await page.locator('[data-comment]').count()
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForFunction(
      (beforeCount) =>
        document.querySelectorAll('[data-comment]').length > beforeCount,
      before
    )
    const after = await page.locator('[data-comment]').count()
    expect(after).toBeGreaterThan(before)
  })
})

test.describe('커뮤니티 상세 - 댓글 등록 (회원) (REQ-CMNT-007)', () => {
  test.beforeEach(async ({ page }) => {
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
    await page.goto('/community/1')
  })

  test('로그인 상태에서 댓글 입력창이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('textbox')).toBeVisible()
  })

  test('댓글 입력창의 placeholder 안내 문구가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByPlaceholder(/개인정보/)).toBeVisible()
  })

  test('"등록" 버튼 클릭 시 댓글이 등록된다', async ({ page }) => {
    test.skip()
    await page.getByRole('textbox').fill('좋은 게시글이네요!')
    await page.getByRole('button', { name: '등록' }).click()
    await expect(page.getByText('좋은 게시글이네요!')).toBeVisible()
  })

  test('빈 내용으로 "등록" 클릭 시 요청이 전송되지 않는다', async ({
    page,
  }) => {
    test.skip()
    const registerButton = page.getByRole('button', { name: '등록' })
    await expect(registerButton).toBeDisabled()
  })
})

test.describe('커뮤니티 상세 - 댓글 입력창 (비로그인)', () => {
  test('비로그인 상태에서 댓글 입력창이 표시되지 않는다', async ({ page }) => {
    test.skip()
    // REQ-CMNT-007: 댓글 작성은 로그인 회원만 가능
    await page.goto('/community/1')
    await expect(page.getByPlaceholder(/개인정보/)).not.toBeVisible()
  })
})

test.describe('커뮤니티 상세 - 댓글 유저 태그 (REQ-CMNT-008)', () => {
  test.beforeEach(async ({ page }) => {
    // REQ-CMNT-008: 유저 태그는 로그인 회원만 가능 (댓글 입력창 필요)
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
    await page.goto('/community/1')
  })

  test('댓글 입력창에 "@" 입력 시 유저 자동완성 목록이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('textbox').fill('@')
    await expect(page.getByRole('listbox')).toBeVisible()
  })

  test('자동완성 목록에서 유저 선택 시 댓글 입력창에 @닉네임이 삽입된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('textbox').fill('@')
    await page.getByRole('option').first().click()
    const value = await page.getByRole('textbox').inputValue()
    expect(value).toMatch(/@\S+/)
  })

  test('@ 이후 닉네임 입력 시 자동완성 목록이 필터링된다', async ({ page }) => {
    test.skip()
    await page.getByRole('textbox').fill('@김')
    await expect(page.getByRole('listbox')).toBeVisible()
    const options = page.getByRole('option')
    expect(await options.count()).toBeGreaterThan(0)
  })
})

test.describe('커뮤니티 상세 - 댓글 삭제 (REQ-CMNT-010)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/1')
  })

  test('본인이 작성한 댓글에 삭제 버튼이 표시된다', async ({ page }) => {
    test.skip()
    const myComment = page.locator('[data-comment][data-mine="true"]').first()
    await expect(myComment.getByRole('button', { name: '삭제' })).toBeVisible()
  })

  test('타인이 작성한 댓글에 삭제 버튼이 표시되지 않는다', async ({ page }) => {
    test.skip()
    const othersComment = page
      .locator('[data-comment]:not([data-mine="true"])')
      .first()
    await expect(
      othersComment.getByRole('button', { name: '삭제' })
    ).not.toBeVisible()
  })

  test('댓글 삭제 버튼 클릭 시 확인 팝업이 표시된다', async ({ page }) => {
    test.skip()
    const myComment = page.locator('[data-comment][data-mine="true"]').first()
    await myComment.getByRole('button', { name: '삭제' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog')).toContainText(
      '댓글을 삭제하시겠습니까?'
    )
  })

  test('댓글 삭제 팝업에서 "확인" 클릭 시 해당 댓글이 목록에서 제거된다', async ({
    page,
  }) => {
    test.skip()
    const myComment = page.locator('[data-comment][data-mine="true"]').first()
    const commentText = await myComment.textContent()
    await myComment.getByRole('button', { name: '삭제' }).click()
    await page.getByRole('dialog').getByRole('button', { name: '확인' }).click()
    await expect(page.getByText(commentText!)).not.toBeVisible()
  })

  test('댓글 삭제 팝업에서 "취소" 클릭 시 댓글이 삭제되지 않는다', async ({
    page,
  }) => {
    test.skip()
    const myComment = page.locator('[data-comment][data-mine="true"]').first()
    await myComment.getByRole('button', { name: '삭제' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: '취소' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await expect(myComment).toBeVisible()
  })
})

test.describe('커뮤니티 상세 - 수정/삭제 버튼 (작성자)', () => {
  test.beforeEach(async ({ page }) => {
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
    await page.goto('/community/1')
  })

  test('본인 게시글에서 "수정" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '수정' })).toBeVisible()
  })

  test('본인 게시글에서 "삭제" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '삭제' })).toBeVisible()
  })

  test('"수정" 버튼 클릭 시 /community/:postId/edit로 이동한다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '수정' }).click()
    await expect(page).toHaveURL('/community/1/edit')
  })

  test('"삭제" 버튼 클릭 시 확인 모달이 표시된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '삭제' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('삭제 확인 모달에 "복구할 수 없다"는 안내 문구가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '삭제' }).click()
    await expect(page.getByRole('dialog')).toContainText(/복구할 수 없/)
  })

  test('삭제 확인 후 /community로 이동한다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '삭제' }).click()
    await page.getByRole('dialog').getByRole('button', { name: '삭제' }).click()
    await expect(page).toHaveURL('/community')
  })

  test('삭제 확인 모달에서 "취소" 클릭 시 게시글이 삭제되지 않는다', async ({
    page,
  }) => {
    test.skip()
    // REQ-CMNT-006: 삭제 취소 시 게시글 유지
    await page.getByRole('button', { name: '삭제' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: '취소' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await expect(page).toHaveURL('/community/1')
  })

  test('타인 게시글에서 수정/삭제 버튼이 표시되지 않는다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '수정' })).not.toBeVisible()
    await expect(page.getByRole('button', { name: '삭제' })).not.toBeVisible()
  })
})
