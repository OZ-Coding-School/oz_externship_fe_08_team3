// === package.json 패치 가이드 ===
//
// 아래 항목들을 기존 package.json에 병합하세요.
// (그대로 복붙하지 말고 각 섹션을 mege)

{
"scripts": {
// ── 측정 ──
"measure": "node scripts/measure-complexity.mjs",
"measure:a11y": "node scripts/a11y-grep.mjs",
"measure:bundle": "vite build && node scripts/compare-bundle.mjs",

    // ── baseline ──
    "baseline": "node scripts/baseline.mjs",
    "baseline:update": "node scripts/baseline.mjs --update",
    "baseline:check": "node scripts/baseline.mjs --strict",
    "baseline:quick": "node scripts/baseline.mjs --skip-build",

    // ── 비교 ──
    "diff:complexity": "node scripts/compare-baseline.mjs",
    "diff:bundle": "node scripts/compare-bundle.mjs",

    // ── safety check (refactor-safety-check 스킬과 연동) ──
    "check:types": "tsc --noEmit",
    "check:lint": "eslint 'src/**/*.{ts,tsx}' --max-warnings 0",
    "check:format": "prettier --check 'src/**/*.{ts,tsx,css,md}'",
    "check:a11y": "playwright test --grep '@a11y'",
    "check:all": "pnpm run check:types && pnpm run check:lint && pnpm run check:format && pnpm run check:a11y"

},

"devDependencies": {
// ── ts 측정 도구 ──
"ts-morph": "^25.0.0",

    // ── ESLint 추가 플러그인 (이미 있으면 skip) ──
    "eslint-plugin-sonarjs": "^3.0.0",
    "eslint-plugin-jsx-a11y": "^6.10.0",
    "eslint-plugin-react-compiler": "^1.0.0",

    // ── a11y 자동 테스트 ──
    "@axe-core/playwright": "^4.10.0",

    // ── 의존성 분석 ──
    "madge": "^8.0.0"

}

// 선택: scc 바이너리는 별도 설치
// Mac: brew install scc
// Linux: cargo install scc 또는 GitHub releases 바이너리
}

# /\*

# 설치 명령어 (pnpm 기준):

pnpm add -D \
 ts-morph \
 eslint-plugin-sonarjs \
 eslint-plugin-jsx-a11y \
 eslint-plugin-react-compiler \
 @axe-core/playwright \
 madge

# scc는 선택 — 없으면 자동으로 wc로 폴백

brew install scc # macOS

============================================================
첫 실행 (Phase 0 baseline 생성):
============================================================

pnpm baseline

# 또는 빌드 없이 빠르게

pnpm baseline:quick

============================================================
리팩토링 도중 — diff 확인:
============================================================

pnpm baseline
cat reports/diff.md

============================================================
PR 머지 후 — baseline 갱신:
============================================================

pnpm baseline:update

============================================================
CI에서 회귀 차단:
============================================================

pnpm baseline:check # 회귀 시 exit 1
\*/
