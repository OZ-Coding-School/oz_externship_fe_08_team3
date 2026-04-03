import { test, expect } from '@playwright/test'

test.describe('Home 페이지 시각적 회귀 테스트', () => {
  test('HomePage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home.png', { fullPage: true })
  })
})
