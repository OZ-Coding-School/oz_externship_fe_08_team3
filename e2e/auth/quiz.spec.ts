import { test, expect } from '@playwright/test'

test.describe('쪽지시험', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mypage/quiz')
  })

  test('쪽지시험 목록 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/mypage/quiz')
  })
})
