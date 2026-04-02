import { test, expect } from '@playwright/test'

test.describe('질의응답 질문등록', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna/write')
  })

  test('질문 등록 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/qna/write')
  })
})
