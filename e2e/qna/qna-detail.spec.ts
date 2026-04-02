import { test, expect } from '@playwright/test'

test.describe('질의응답 상세', () => {
  test('질의응답 상세 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/qna/1')
    await expect(page).toHaveURL('/qna/1')
  })
})
