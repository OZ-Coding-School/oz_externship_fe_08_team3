import { test, expect } from '@playwright/test'

test.describe('커뮤니티 목록', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community')
  })

  test('커뮤니티 목록 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/community')
  })
})
