// tests/a11y.spec.ts
//
// Phase 0에서 a11y baseline을 잡고, 이후 PR마다 회귀 방지.
// 필요 패키지:
//   pnpm add -D @axe-core/playwright
//
// MSW 또는 dev 서버가 켜져있는 상태에서 동작 (playwright.config.ts의 webServer 설정 확인).

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'qna-list', path: '/qna' },
  // detail 페이지는 dev 데이터에 따라 ID 조정
  { name: 'qna-detail', path: '/qna/1' },
  { name: 'qna-write', path: '/qna/write' },
]

for (const p of PAGES) {
  test(`@a11y page: ${p.name}`, async ({ page }) => {
    await page.goto(p.path)
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22aa',
        'best-practice',
      ])
      // 알려진 false positive는 disableRules로 제외
      // .disableRules(['color-contrast']) // 토큰 마이그레이션 중이면 임시 제외
      .analyze()

    // 위반 리포트를 첨부로 — Playwright 리포트에서 확인 가능
    await test.info().attach(`axe-${p.name}`, {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    })

    expect(
      results.violations,
      `${p.name}: ${results.violations.length} violations`
    ).toEqual([])
  })
}

test.describe('@a11y common components', () => {
  test('Modal: ESC closes', async ({ page }) => {
    await page.goto('/')
    // 모달 트리거 — 실제 UI에 맞게 조정
    // await page.click('[data-test="open-modal"]');
    // await expect(page.locator('dialog[open]')).toBeVisible();
    // await page.keyboard.press('Escape');
    // await expect(page.locator('dialog[open]')).toBeHidden();
    test.skip(true, '실제 UI 트리거에 맞게 구현')
  })

  test('Tab navigation: focus is trapped in modal', async () => {
    test.skip(true, '실제 UI 트리거에 맞게 구현')
  })

  test('Chatbot: open-close preserves state', async () => {
    test.skip(true, 'Activity 도입 후 활성화')
  })
})
