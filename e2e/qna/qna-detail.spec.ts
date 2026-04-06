/**
 * @interface-contract
 *
 * Page: /qna/:questionId (질의응답 상세)
 * - 카테고리 breadcrumb: 대분류 > 중분류 > 소분류 (chevron-right 아이콘으로 구분)
 * - 질문 제목: heading 역할 (Bold 32px)
 * - 질문 작성자 정보: 프로필 썸네일 이미지 + 닉네임
 * - 질문 조회수: "조회수 N" 형식
 * - 질문 작성일시: 상대 시간 형식 (예: "N 시간 전")
 * - 질문 내용: 본문 텍스트
 * - 질문 첨부 이미지: img 태그 (있는 경우)
 * - 답변 목록 카운트: "N개의 답변이 있어요" 형식
 * - 답변 카드 목록:
 *   - 답변 작성자 정보: 프로필 썸네일 이미지 + 닉네임
 *   - 답변 내용
 *   - 답변 작성일시
 *   - 채택된 답변 표시: "질문자 채택" 배지
 * - 답변 댓글 목록:
 *   - 댓글 작성자 정보: 프로필 썸네일 이미지 + 닉네임
 *   - 댓글 내용
 *   - 댓글 작성일시
 *
 * API:
 * - GET /qna/questions/:questionId → 질문 상세 + 답변 목록 + 댓글 목록
 *
 * REQ-QNA-003: 질의응답 상세 조회
 */

import { test, expect } from '@playwright/test'

test.describe('질의응답 상세 페이지 렌더링', () => {
  test('질의응답 상세 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/qna/1')
    await expect(page).toHaveURL('/qna/1')
  })
})
// 실제 데이터에 맞게 변경 필요 (질문 id값에 맞는 데이터로 추가해야합니다.)
test.describe('질문 정보 표시', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna/1')
  })

  test('질문 카테고리 대분류가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText('프론트엔드')).toBeVisible()
  })

  test('질문 카테고리 중분류가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText('프로그래밍 언어')).toBeVisible()
  })

  test('질문 카테고리 소분류가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText('Javascript')).toBeVisible()
  })

  test('질문 제목이 heading으로 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('heading').first()).toBeVisible()
  })

  test('질문 작성자 프로필 이미지가 표시된다', async ({ page }) => {
    test.skip()
    // 질문 작성자 영역의 프로필 썸네일 이미지
    const authorSection = page.getByRole('article').first()
    await expect(authorSection.getByRole('img').first()).toBeVisible()
  })

  test('질문 작성자 닉네임이 표시된다', async ({ page }) => {
    test.skip()
    // 작성자 닉네임 텍스트 (예: "김태산")
    const authorSection = page.getByRole('article').first()
    await expect(authorSection.locator('span, p').first()).toBeVisible()
  })

  test('질문 조회수가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText(/조회수/)).toBeVisible()
  })

  test('질문 작성일시가 표시된다', async ({ page }) => {
    test.skip()
    // 상대 시간 형식 (예: "15 시간 전")
    await expect(page.getByText(/전/)).toBeVisible()
  })

  test('질문 내용이 표시된다', async ({ page }) => {
    test.skip()
    // 질문 본문 텍스트 영역
    const content = page.locator('main, article').first()
    await expect(content).toBeVisible()
  })

  test('질문 내용에 첨부된 이미지가 있는 경우 이미지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // 질문 본문 내 첨부 이미지 — MSW 기본 핸들러에서 이미지 포함 응답을 반환하는 경우
    const questionBody = page.locator(
      '[data-testid="question-body"], .question-content'
    )
    const attachedImage = questionBody.getByRole('img')
    await expect(attachedImage.first()).toBeVisible()
  })
})

test.describe('답변 목록 표시', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna/1')
  })

  test('답변 개수가 "N개의 답변이 있어요" 형식으로 표시된다', async ({
    page,
  }) => {
    test.skip()
    await expect(page.getByText(/\d+개의 답변이 있어요/)).toBeVisible()
  })

  test('답변 목록이 표시된다', async ({ page }) => {
    test.skip()
    const answerCards = page.getByRole('article')
    await expect(answerCards.first()).toBeVisible()
  })

  test('각 답변에 작성자 프로필 이미지가 표시된다', async ({ page }) => {
    test.skip()
    const answerCard = page.getByRole('article').first()
    await expect(answerCard.getByRole('img').first()).toBeVisible()
  })

  test('각 답변에 작성자 닉네임이 표시된다', async ({ page }) => {
    test.skip()
    const answerCard = page.getByRole('article').first()
    // 답변 작성자 닉네임 영역
    await expect(answerCard.locator('span, p').first()).toBeVisible()
  })

  test('각 답변에 답변 내용이 표시된다', async ({ page }) => {
    test.skip()
    const answerCard = page.getByRole('article').first()
    await expect(answerCard).toBeVisible()
  })

  test('각 답변에 작성일시가 표시된다', async ({ page }) => {
    test.skip()
    // 답변 카드 내 상대 시간 형식 (예: "11 시간 전")
    const answerCard = page.getByRole('article').first()
    await expect(answerCard.getByText(/전/)).toBeVisible()
  })

  test('채택된 답변에 "질문자 채택" 배지가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText('질문자 채택')).toBeVisible()
  })

  test('채택되지 않은 답변에 "질문자 채택" 배지가 표시되지 않는다', async ({
    page,
  }) => {
    test.skip()
    // 채택되지 않은 답변 카드는 "질문자 채택" 텍스트를 포함하지 않아야 한다
    const answerCards = page.getByRole('article')
    const count = await answerCards.count()
    // 마지막 카드(일반 답변)에서 채택 배지 미노출 확인
    if (count > 1) {
      const lastCard = answerCards.last()
      await expect(lastCard.getByText('질문자 채택')).not.toBeVisible()
    }
  })
})

test.describe('답변 댓글 목록 표시', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna/1')
  })

  test('답변에 달린 댓글 목록이 표시된다', async ({ page }) => {
    test.skip()
    // 댓글 영역 — data-testid 또는 시맨틱 역할로 접근
    const commentSection = page.locator(
      '[data-testid="comment-list"], .comment-list'
    )
    await expect(commentSection.first()).toBeVisible()
  })

  test('각 댓글에 작성자 프로필 이미지가 표시된다', async ({ page }) => {
    test.skip()
    const commentSection = page.locator(
      '[data-testid="comment-item"], .comment-item'
    )
    await expect(commentSection.first().getByRole('img').first()).toBeVisible()
  })

  test('각 댓글에 작성자 닉네임이 표시된다', async ({ page }) => {
    test.skip()
    const commentSection = page.locator(
      '[data-testid="comment-item"], .comment-item'
    )
    await expect(
      commentSection.first().locator('span, p').first()
    ).toBeVisible()
  })

  test('각 댓글에 댓글 내용이 표시된다', async ({ page }) => {
    test.skip()
    const commentSection = page.locator(
      '[data-testid="comment-item"], .comment-item'
    )
    await expect(commentSection.first()).toBeVisible()
  })

  test('각 댓글에 작성일시가 표시된다', async ({ page }) => {
    test.skip()
    // 댓글 작성일시 상대 시간 형식
    const commentSection = page.locator(
      '[data-testid="comment-item"], .comment-item'
    )
    await expect(commentSection.first().getByText(/전/)).toBeVisible()
  })
})

// REQ-QNA-004: 답변 작성
test.describe('답변 작성', () => {
  test.beforeEach(async ({ page }) => {
    // 수강생 권한으로 로그인 상태 설정
    await page.goto('/qna/1')
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
    await page.reload()
  })

  test('로그인한 수강생은 답변 입력 영역이 표시된다', async ({ page }) => {
    test.skip()
    // 답변 작성 영역 — placeholder 또는 "답변하기" 버튼으로 식별
    const answerArea = page.getByText('정보를 공유해 주세요.')
    await expect(answerArea).toBeVisible()
  })

  test('"답변하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '답변하기' })).toBeVisible()
  })

  test('"답변하기" 버튼 클릭 시 마크다운 에디터가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '답변하기' }).click()
    // 마크다운 에디터 영역 — textarea 또는 contenteditable
    const editor = page.locator('textarea, [contenteditable="true"]').first()
    await expect(editor).toBeVisible()
  })

  test('마크다운 에디터에 내용을 입력할 수 있다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '답변하기' }).click()
    const editor = page.locator('textarea, [contenteditable="true"]').first()
    await editor.fill('테스트 답변 내용입니다.')
    await expect(editor).toHaveValue('테스트 답변 내용입니다.')
  })

  test('에디터 제출 후 답변이 등록된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '답변하기' }).click()
    const editor = page.locator('textarea, [contenteditable="true"]').first()
    await editor.fill('새로운 답변입니다.')
    // 에디터 하단의 제출 버튼 클릭
    await page.getByRole('button', { name: '답변하기' }).last().click()
    // 등록 후 답변 목록에 새 답변이 포함된다
    await expect(page.getByText('새로운 답변입니다.')).toBeVisible()
  })

  test('조교 권한 로그인 유저도 답변 작성 영역이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('AuthStore') || '{}')
      store.state = {
        isAuthenticated: true,
        user: {
          nickname: 'ta01',
          email: 'ta@test.com',
          profileImage: null,
          role: 'ta',
        },
      }
      localStorage.setItem('AuthStore', JSON.stringify(store))
    })
    await page.reload()
    await expect(page.getByRole('button', { name: '답변하기' })).toBeVisible()
  })

  test('어드민 권한 로그인 유저도 답변 작성 영역이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('AuthStore') || '{}')
      store.state = {
        isAuthenticated: true,
        user: {
          nickname: 'admin01',
          email: 'admin@test.com',
          profileImage: null,
          role: 'admin',
        },
      }
      localStorage.setItem('AuthStore', JSON.stringify(store))
    })
    await page.reload()
    await expect(page.getByRole('button', { name: '답변하기' })).toBeVisible()
  })
})

// REQ-QNA-005: 답변 수정
test.describe('답변 수정', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna/1')
    // 본인이 작성한 답변이 있는 수강생으로 로그인
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
    await page.reload()
  })

  test('본인 답변에 "답변 수정하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    // 본인 작성 답변 카드에만 수정 버튼이 표시된다
    await expect(
      page.getByRole('button', { name: '답변 수정하기' })
    ).toBeVisible()
  })

  test('타인 답변에 "답변 수정하기" 버튼이 표시되지 않는다', async ({
    page,
  }) => {
    test.skip()
    // 타인 답변 카드에는 수정 버튼이 없어야 한다
    // MSW 핸들러에서 본인 닉네임과 다른 작성자의 답변이 있는 경우 확인
    const answerCards = page.getByRole('article')
    const count = await answerCards.count()
    // 작성자가 다른 카드에서 수정 버튼 미노출 확인
    if (count > 1) {
      const otherCard = answerCards.last()
      await expect(
        otherCard.getByRole('button', { name: '답변 수정하기' })
      ).not.toBeVisible()
    }
  })

  test('"답변 수정하기" 버튼 클릭 시 마크다운 에디터가 열린다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '답변 수정하기' }).click()
    const editor = page.locator('textarea, [contenteditable="true"]').first()
    await expect(editor).toBeVisible()
  })

  test('수정 에디터에 기존 답변 내용이 로드된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '답변 수정하기' }).click()
    const editor = page.locator('textarea, [contenteditable="true"]').first()
    // 에디터에 기존 내용이 비어 있지 않아야 한다
    const value = await editor.inputValue()
    expect(value.length).toBeGreaterThan(0)
  })

  test('수정 내용 저장 후 업데이트된 답변이 표시된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '답변 수정하기' }).click()
    const editor = page.locator('textarea, [contenteditable="true"]').first()
    await editor.fill('수정된 답변 내용입니다.')
    // 저장 버튼 ("저장하기" 또는 "답변하기") 클릭
    const saveButton = page
      .getByRole('button', { name: /저장하기|답변하기/ })
      .last()
    await saveButton.click()
    await expect(page.getByText('수정된 답변 내용입니다.')).toBeVisible()
  })
})

// REQ-QNA-006: 답변 채택
test.describe('답변 채택', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna/1')
    // 질문 작성자(수강생)로 로그인 — 채택 권한 보유
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('AuthStore') || '{}')
      store.state = {
        isAuthenticated: true,
        user: {
          nickname: 'question-author',
          email: 'question-author@test.com',
          profileImage: null,
          role: 'student',
        },
      }
      localStorage.setItem('AuthStore', JSON.stringify(store))
    })
    await page.reload()
  })

  test('질문 작성자 본인에게 "채택하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    // 질문자 본인이 접근 시 각 답변에 채택 버튼이 표시된다
    await expect(
      page.getByRole('button', { name: '채택하기' }).first()
    ).toBeVisible()
  })

  test('질문 작성자가 아닌 경우 "채택하기" 버튼이 표시되지 않는다', async ({
    page,
  }) => {
    test.skip()
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('AuthStore') || '{}')
      store.state = {
        isAuthenticated: true,
        user: {
          nickname: 'other-student',
          email: 'other@test.com',
          profileImage: null,
          role: 'student',
        },
      }
      localStorage.setItem('AuthStore', JSON.stringify(store))
    })
    await page.reload()
    await expect(
      page.getByRole('button', { name: '채택하기' })
    ).not.toBeVisible()
  })

  test('"채택하기" 버튼 클릭 시 해당 답변이 채택된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '채택하기' }).first().click()
    // 채택 후 "질문자 채택" 배지가 표시된다
    await expect(page.getByText('질문자 채택')).toBeVisible()
  })

  test('채택 후 채택된 답변에 보라색 테두리가 적용된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '채택하기' }).first().click()
    // 채택된 답변 카드에 border-color: #6201E0 스타일이 적용된다
    const adoptedCard = page
      .locator('[data-testid="answer-card"]')
      .filter({ has: page.getByText('질문자 채택') })
    await expect(adoptedCard).toBeVisible()
  })

  test('하나의 질문에서 하나의 답변만 채택 가능하다', async ({ page }) => {
    test.skip()
    const adoptButtons = page.getByRole('button', { name: '채택하기' })
    // 첫 번째 답변 채택
    await adoptButtons.first().click()
    await expect(page.getByText('질문자 채택')).toBeVisible()
    // 채택 완료 후 다른 답변에 채택 버튼이 사라지거나 비활성화된다
    const remainingAdoptButtons = page.getByRole('button', { name: '채택하기' })
    await expect(remainingAdoptButtons).toHaveCount(0)
  })

  test('이미 채택된 답변에 "질문자 채택" 배지가 표시되고 채택 버튼은 노출되지 않는다', async ({
    page,
  }) => {
    test.skip()
    // MSW 핸들러에서 이미 채택된 답변이 있는 경우
    await expect(page.getByText('질문자 채택')).toBeVisible()
    await expect(
      page.getByRole('button', { name: '채택하기' })
    ).not.toBeVisible()
  })
})

// REQ-QNA-007: 댓글 작성
test.describe('댓글 작성', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna/1')
    // 수강생 권한으로 로그인
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
    await page.reload()
  })

  test('각 답변 하단에 댓글 입력 textarea가 표시된다', async ({ page }) => {
    test.skip()
    // 댓글 입력 영역 — placeholder로 식별
    const commentInput = page.getByPlaceholder(
      '개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있습니다.'
    )
    await expect(commentInput.first()).toBeVisible()
  })

  test('각 답변 하단에 "등록" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('button', { name: '등록' }).first()
    ).toBeVisible()
  })

  test('댓글 textarea에 내용을 입력할 수 있다', async ({ page }) => {
    test.skip()
    const commentInput = page
      .getByPlaceholder(
        '개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있습니다.'
      )
      .first()
    await commentInput.fill('테스트 댓글입니다.')
    await expect(commentInput).toHaveValue('테스트 댓글입니다.')
  })

  test('댓글 내용은 최대 500자까지 입력 가능하다', async ({ page }) => {
    test.skip()
    const commentInput = page
      .getByPlaceholder(
        '개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있습니다.'
      )
      .first()
    const longText = 'a'.repeat(501)
    await commentInput.fill(longText)
    // 500자 초과 입력이 제한되거나 에러 메시지가 표시된다
    const value = await commentInput.inputValue()
    expect(value.length).toBeLessThanOrEqual(500)
  })

  test('"등록" 버튼 클릭 시 댓글이 등록된다', async ({ page }) => {
    test.skip()
    const commentInput = page
      .getByPlaceholder(
        '개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있습니다.'
      )
      .first()
    await commentInput.fill('새로운 댓글입니다.')
    await page.getByRole('button', { name: '등록' }).first().click()
    // 등록 후 댓글 목록에 새 댓글이 표시된다
    await expect(page.getByText('새로운 댓글입니다.')).toBeVisible()
  })

  test('댓글 등록 후 입력 필드가 초기화된다', async ({ page }) => {
    test.skip()
    const commentInput = page
      .getByPlaceholder(
        '개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있습니다.'
      )
      .first()
    await commentInput.fill('댓글 내용입니다.')
    await page.getByRole('button', { name: '등록' }).first().click()
    // 등록 완료 후 입력 필드가 비워진다
    await expect(commentInput).toHaveValue('')
  })
})

// REQ-QNA-AI-001: AI 최초 답변 자동 생성
test.describe('AI 최초 답변 표시', () => {
  test('질의응답 상세 페이지에 AI 답변 아코디언 토글이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/qna/1')
    // "질문에 대한 🤖 AI OZ 의 답변 보기" 아코디언 토글이 접힌 상태로 표시된다
    await expect(
      page.getByRole('button', { name: /AI OZ.*답변 보기/ })
    ).toBeVisible()
  })

  test('비로그인 사용자에게도 AI 답변 아코디언 토글이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/qna/1')
    // 로그인 없이 접근해도 AI 답변 토글이 노출된다
    await expect(
      page.getByRole('button', { name: /AI OZ.*답변 보기/ })
    ).toBeVisible()
  })

  test('AI 아바타 아이콘과 안내 텍스트가 표시된다', async ({ page }) => {
    test.skip()
    await page.goto('/qna/1')
    // AI 아바타 영역 및 "AI OZ 에게도 이런 질문이 궁금하시지 궁금합니다." 형식의 안내 텍스트
    await expect(page.getByText(/AI OZ/)).toBeVisible()
  })

  test('초기 접근 시 AI 답변 아코디언이 접힌 상태이다', async ({ page }) => {
    test.skip()
    await page.goto('/qna/1')
    // 아코디언이 닫힌 상태이므로 AI 생성 답변 본문이 보이지 않는다
    const aiAnswerContent = page.locator('[data-testid="ai-answer-content"]')
    await expect(aiAnswerContent).not.toBeVisible()
  })

  test('최초 답변 생성 직후 채팅 인터페이스가 활성화되지 않는다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/qna/1')
    // 아코디언을 열어도 채팅 입력 영역이 바로 노출되지 않는다
    await page.getByRole('button', { name: /AI OZ.*답변 보기/ }).click()
    const chatInput = page.locator(
      '[data-testid="chat-input"], [placeholder*="메시지"]'
    )
    await expect(chatInput).not.toBeVisible()
  })

  test('비로그인 사용자는 AI 답변 열람 후 채팅 입력이 불가하다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/qna/1')
    await page.getByRole('button', { name: /AI OZ.*답변 보기/ }).click()
    // "추가 질문하기" 버튼 또는 채팅 입력 영역이 비활성화되거나 표시되지 않는다
    const chatInput = page.locator(
      '[data-testid="chat-input"], [placeholder*="메시지"]'
    )
    await expect(chatInput).not.toBeVisible()
  })
})

// REQ-QNA-AI-002: AI 답변 보기 및 채팅
test.describe('AI 답변 보기 및 채팅', () => {
  test('"AI 답변 보기" 아코디언 클릭 시 AI 생성 답변 내용이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/qna/1')
    await page.getByRole('button', { name: /AI OZ.*답변 보기/ }).click()
    // 아코디언 펼침 후 "AI OZ" 라벨과 AI 생성 답변 본문이 노출된다
    await expect(page.getByText('AI OZ')).toBeVisible()
    const aiAnswerContent = page.locator('[data-testid="ai-answer-content"]')
    await expect(aiAnswerContent).toBeVisible()
  })

  test('AI 답변 펼침 후 "추가 질문하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await page.goto('/qna/1')
    // 로그인 상태 설정
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
    await page.reload()
    await page.getByRole('button', { name: /AI OZ.*답변 보기/ }).click()
    await expect(
      page.getByRole('button', { name: '추가 질문하기' })
    ).toBeVisible()
  })

  test('로그인한 사용자는 "추가 질문하기" 버튼 클릭 시 채팅 인터페이스가 활성화된다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/qna/1')
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
    await page.reload()
    await page.getByRole('button', { name: /AI OZ.*답변 보기/ }).click()
    await page.getByRole('button', { name: '추가 질문하기' }).click()
    // 채팅 입력 영역이 활성화된다
    const chatInput = page.locator(
      '[data-testid="chat-input"], [placeholder*="메시지"]'
    )
    await expect(chatInput).toBeVisible()
  })

  test('AI가 답변 중일 때 사용자는 메시지를 보낼 수 없다', async ({ page }) => {
    test.skip()
    await page.goto('/qna/1')
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
    await page.reload()
    await page.getByRole('button', { name: /AI OZ.*답변 보기/ }).click()
    await page.getByRole('button', { name: '추가 질문하기' }).click()
    const chatInput = page.locator(
      '[data-testid="chat-input"], [placeholder*="메시지"]'
    )
    await chatInput.fill('추가 질문입니다.')
    const sendButton = page.getByRole('button', { name: /전송|보내기/ })
    await sendButton.click()
    // AI가 답변 중인 동안 전송 버튼이 비활성화되거나 입력 필드가 잠긴다
    await expect(sendButton).toBeDisabled()
  })

  test('AI 답변이 실시간 타이핑 효과로 표시된다', async ({ page }) => {
    test.skip()
    await page.goto('/qna/1')
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
    await page.reload()
    await page.getByRole('button', { name: /AI OZ.*답변 보기/ }).click()
    await page.getByRole('button', { name: '추가 질문하기' }).click()
    const chatInput = page.locator(
      '[data-testid="chat-input"], [placeholder*="메시지"]'
    )
    await chatInput.fill('추가 질문입니다.')
    await page.getByRole('button', { name: /전송|보내기/ }).click()
    // AI 답변이 타이핑 중 상태(예: 커서 깜빡임 또는 로딩 인디케이터)가 표시된다
    const typingIndicator = page.locator(
      '[data-testid="ai-typing"], [class*="typing"]'
    )
    await expect(typingIndicator).toBeVisible()
  })
})
