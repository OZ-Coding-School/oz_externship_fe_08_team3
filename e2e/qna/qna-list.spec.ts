import { test, expect } from '@playwright/test'

test.describe('질의응답 목록', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qna')
  })

  test('질의응답 목록 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/qna')
  })
})
