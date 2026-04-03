import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './visual.setup'

test.describe('Quiz 페이지 시각적 회귀 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('QuizListPage', async ({ page }) => {
    await page.goto('/mypage/quiz')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('quiz-list.png', { fullPage: true })
  })

  test('QuizExamPage', async ({ page }) => {
    await page.goto('/quiz/1/exam')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('quiz-exam.png', { fullPage: true })
  })

  test('QuizResultPage', async ({ page }) => {
    await page.goto('/quiz/1/result')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('quiz-result.png', { fullPage: true })
  })
})
