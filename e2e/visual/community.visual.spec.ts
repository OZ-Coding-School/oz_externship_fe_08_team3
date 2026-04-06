import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './visual.setup'

test.describe('Community 페이지 시각적 회귀 테스트', () => {
  test('CommunityListPage', async ({ page }) => {
    await page.goto('/community')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('community-list.png', {
      fullPage: true,
    })
  })

  test('CommunityDetailPage', async ({ page }) => {
    await page.goto('/community/1')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('community-detail.png', {
      fullPage: true,
    })
  })

  test('CommunityWritePage', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/community/write')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('community-write.png', {
      fullPage: true,
    })
  })

  test('CommunityEditPage', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/community/1/edit')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('community-edit.png', {
      fullPage: true,
    })
  })
})
