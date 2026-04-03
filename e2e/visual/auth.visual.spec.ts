import { test, expect } from '@playwright/test'

test.describe('Auth 페이지 시각적 회귀 테스트', () => {
  test('LoginPage', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('login.png', { fullPage: true })
  })

  test('SignupSelectPage', async ({ page }) => {
    await page.goto('/signup')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('signup-select.png', {
      fullPage: true,
    })
  })

  test('SignupPage', async ({ page }) => {
    await page.goto('/signup/form')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('signup.png', { fullPage: true })
  })
})
