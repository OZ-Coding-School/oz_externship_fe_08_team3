import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './visual.setup'

test.describe('MyPage 페이지 시각적 회귀 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('MypagePage', async ({ page }) => {
    await page.goto('/mypage')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('mypage.png', { fullPage: true })
  })

  test('MypageEditPage', async ({ page }) => {
    await page.goto('/mypage/edit')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('mypage-edit.png', { fullPage: true })
  })

  test('ChangePasswordPage', async ({ page }) => {
    await page.goto('/mypage/change-password')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('change-password.png', {
      fullPage: true,
    })
  })
})
