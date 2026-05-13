---
name: 첫 a11y 감사 결과 요약 (2026-05-12)
description: src/components/common+layout 전체 감사. 위반 건수, 컴포넌트별 주요 패턴 현황.
type: project
---

감사 대상: src/components/common/, src/components/layout/
감사 일자: 2026-05-12
총 위반: Critical 6건 / Serious 9건 / Moderate 5건 / Minor 3건 = 23건

**Why:** 처음으로 common+layout 전체 a11y 베이스라인 측정. Playwright axe 미구성 상태이므로 수동 그레프+코드 리뷰 기반.

**How to apply:** 후속 감사 시 이 수치를 베이스라인으로 삼아 회귀 여부를 판단한다.

## 주요 현황

- Modal 4종: `<dialog>` 미사용, `div[role=dialog]` 패턴. focus trap 미구현(ESC/포커스 복귀는 수동 구현). aria-labelledby id 중복 위험(hardcoded "modal-title").
- ProfileDropdown: role="menu" 없음, aria-haspopup 없음, ESC 닫기 없음, 키보드 포커스 트랩 없음, onMouseEnter로만 열림.
- Tabs: 화살표 키 네비게이션 미구현 (WAI-ARIA Tabs Pattern 불완전).
- Toast: role="alert" + aria-live="polite" 불일치. 모든 variant에 동일하게 적용.
- SearchInput: label/aria-label 없음.
- Pagination: 페이지 번호 버튼에 aria-label 없음.
- Footer SNS 링크: div에 aria-label만 있고 interactive role 없음.
- Header 내비: button으로 구현된 nav 항목들에 aria-current 없음.
- 애니메이션(toast-in/out, animate-spin): prefers-reduced-motion 전역/컴포넌트 레벨 처리 없음.
- focus-trap-react: package.json에 설치되어 있으며 ChatbotWidget에서만 사용 중. Modal에는 미사용.
