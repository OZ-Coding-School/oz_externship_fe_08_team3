import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './visual.setup'

test.describe('QnA 페이지 시각적 회귀 테스트', () => {
  test('QnaListPage', async ({ page }) => {
    await page.goto('/qna')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('qna-list.png', { fullPage: true })
  })

  test('QnaDetailPage', async ({ page }) => {
    await page.goto('/qna/1')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('qna-detail.png', { fullPage: true })
  })

  test('QnaWritePage', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/qna/write')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('qna-write.png', { fullPage: true })
  })

  test('QnaEditPage', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/qna/1/edit')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('qna-edit.png', { fullPage: true })
  })
})
