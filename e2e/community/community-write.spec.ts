import { test, expect } from '@playwright/test'

test.describe('커뮤니티 글작성', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/write')
  })

  test('게시글 작성 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/community/write')
  })
})
