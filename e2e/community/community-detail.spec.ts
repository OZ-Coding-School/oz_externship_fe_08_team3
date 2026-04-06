import { test, expect } from '@playwright/test'

test.describe('커뮤니티 상세', () => {
  test('커뮤니티 상세 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/community/1')
    await expect(page).toHaveURL('/community/1')
  })
})
