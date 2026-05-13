---
name: Batch 1 — Atoms 리팩토링 결과
description: Spinner/LoadingBox/Badge/Avatar/UserAvatar/SuccessCard 첫 번째 배치 완료 내용 및 패턴 노트
type: project
---

완료일: 2026-05-12

## 변경 내용

### Spinner

- `aria-label` 제거, `sr-only` span 추가로 교체
- 이유: aria-label은 role=status와 함께 쓸 때 일부 스크린리더에서 무시됨. sr-only 텍스트가 더 안정적

### Badge

- `text-yellow-700` → `text-warning` 시맨틱 토큰 교체
- `warning` 토큰 = `#f6a818` (App.css 정의됨)

### Avatar

- SIZE_PX 테이블 추가 (sm:32, md:40, lg:48, xl:64)
- `<img>` 태그에 `width={px}` `height={px}` 속성 추가 (CLS 방지)

### UserAvatar

- SIZE_PX 테이블 추가 (sm:24, md:32, lg:48) — SIZE_CLASS와 별도 운용
- `<img>` 태그에 `width={px}` `height={px}` 속성 추가
- `NonNullable<UserAvatarProps['size']>` 타입으로 SIZE_PX 키 타입 안전하게 정의

### SuccessCard

- `text-gray-900` → `text-text-heading`
- `text-gray-600` → `text-text-body`
- icons.tsx: `fill="#14C786"` → `fill="var(--color-success-dark)"`

### LoadingBox

- 변경 없음 (Spinner 래퍼로서 충분히 깔끔)

## 주의사항

- `warning-dark` 토큰은 App.css에 없음. warning 계열은 `text-warning`, `bg-warning-bg`, `border-warning`만 존재
- `success-dark` 토큰(#14c786)은 App.css에 있으나 DESIGN_TOKENS.md 표에는 없음. SVG에서 CSS 변수로 직접 참조 가능
- UserAvatar는 SIZE_CLASS(`as const`)와 SIZE_PX 두 테이블을 분리 운용. 통합하지 않는 게 타입 안전성 유지에 유리

## Safety Check 결과

- tsc: 에러 0
- eslint: warning 0
- prettier: 전체 통과

**Why:** 토큰은 정의돼 있어도 문서에 없는 경우 있음. App.css를 직접 확인이 신뢰도 더 높음.
**How to apply:** 다음 배치부터 디자인 토큰 참조 시 DESIGN_TOKENS.md보다 App.css @theme 직접 확인 우선.
