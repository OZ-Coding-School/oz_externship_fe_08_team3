# 디자인 토큰

모든 토큰은 `src/App.css`의 `@theme {}` 블록에 CSS 변수로 정의되어 있으며, Figma 파일(`4rJmEFUU2HMWVy3qUcYZRs`)에서 추출한 값 기반입니다.
Tailwind CSS v4 유틸리티 클래스로 바로 사용 가능합니다.

---

## 색상 (Color)

### Brand Primary

| 토큰          | 값            | Tailwind 클래스           |
| ------------- | ------------- | ------------------------- |
| `primary-50`  | `#f2effd`     | `bg-primary-50`           |
| `primary-100` | `#ede6ff`     | `bg-primary-100`          |
| `primary-200` | `#d7cbf7`     | `bg-primary-200`          |
| `primary-300` | `#b69cf1`     | `bg-primary-300`          |
| `primary-400` | `#986be9`     | `bg-primary-400`          |
| `primary-500` | `#7c35d9`     | `bg-primary-500`          |
| **`primary`** | **`#6201e0`** | **`bg-primary`** (기본값) |
| `primary-700` | `#5601c9`     | `bg-primary-700`          |
| `primary-800` | `#4e01b3`     | `bg-primary-800`          |
| `accent`      | `#aa3bff`     | `bg-accent`               |

### Neutral / Gray

| 토큰       | 값        | 용도         |
| ---------- | --------- | ------------ |
| `gray-50`  | `#ffffff` | 흰색         |
| `gray-100` | `#f5f5f5` | 배경 서브    |
| `gray-200` | `#dddddd` | 보더         |
| `gray-300` | `#cecece` | 비활성       |
| `gray-400` | `#a6a6a6` | 플레이스홀더 |
| `gray-500` | `#666666` | 본문 텍스트  |
| `gray-600` | `#4d4d4d` |              |
| `gray-700` | `#303030` |              |
| `gray-800` | `#222222` | Footer 배경  |
| `gray-900` | `#121212` | 제목 텍스트  |

### 시맨틱 (Semantic)

배경·텍스트·보더는 의미 기반 토큰을 우선 사용합니다.

| 토큰            | 값                     | Tailwind 클래스        |
| --------------- | ---------------------- | ---------------------- |
| `bg-base`       | `#ffffff`              | `bg-bg-base`           |
| `bg-subtle`     | `#fafafb`              | `bg-bg-subtle`         |
| `bg-muted`      | `#f5f5f5`              | `bg-bg-muted`          |
| `bg-accent`     | `rgba(170,59,255,0.1)` | `bg-bg-accent`         |
| `text-heading`  | `#121212`              | `text-text-heading`    |
| `text-body`     | `#666666`              | `text-text-body`       |
| `text-muted`    | `#a6a6a6`              | `text-text-muted`      |
| `text-inverse`  | `#ffffff`              | `text-text-inverse`    |
| `border-base`   | `#dddddd`              | `border-border-base`   |
| `border-accent` | `rgba(170,59,255,0.5)` | `border-border-accent` |

### 상태 (Status)

| 토큰         | 값        | Tailwind 클래스 |
| ------------ | --------- | --------------- |
| `success`    | `#5eb669` | `text-success`  |
| `success-bg` | `#e7f4e9` | `bg-success-bg` |
| `warning`    | `#f6a818` | `text-warning`  |
| `warning-bg` | `#fdeece` | `bg-warning-bg` |
| `error`      | `#cc0a0a` | `text-error`    |
| `error-bg`   | `#f9e2e2` | `bg-error-bg`   |
| `info`       | `#3b82f6` | `text-info`     |
| `info-bg`    | `#eff6ff` | `bg-info-bg`    |

### 소셜 브랜드

| 토큰         | 값        | 용도               |
| ------------ | --------- | ------------------ |
| `kakao`      | `#ffe812` | 카카오 버튼 배경   |
| `kakao-text` | `#392020` | 카카오 버튼 텍스트 |
| `naver`      | `#00c73c` | 네이버 버튼 배경   |
| `naver-text` | `#ffffff` | 네이버 버튼 텍스트 |

---

## 간격 (Spacing)

Figma `.gap` / `.padding` 기준값.

| 토큰          | 값   | Tailwind 클래스    |
| ------------- | ---- | ------------------ |
| `spacing-0.5` | 2px  | `p-0.5`, `gap-0.5` |
| `spacing-1`   | 4px  | `p-1`, `gap-1`     |
| `spacing-2`   | 8px  | `p-2`, `gap-2`     |
| `spacing-3`   | 12px | `p-3`, `gap-3`     |
| `spacing-4`   | 16px | `p-4`, `gap-4`     |
| `spacing-5`   | 20px | `p-5`, `gap-5`     |
| `spacing-6`   | 24px | `p-6`, `gap-6`     |
| `spacing-8`   | 32px | `p-8`, `gap-8`     |
| `spacing-10`  | 40px | `p-10`, `gap-10`   |
| `spacing-12`  | 48px | `p-12`, `gap-12`   |
| `spacing-16`  | 64px | `p-16`, `gap-16`   |
| `spacing-20`  | 80px | `p-20`, `gap-20`   |

---

## 타이포그래피 (Typography)

**폰트**: `Pretendard` (기본 / 제목)

### 폰트 크기

| 토큰        | 값   | Tailwind 클래스 |
| ----------- | ---- | --------------- |
| `text-xs`   | 12px | `text-xs`       |
| `text-sm`   | 14px | `text-sm`       |
| `text-base` | 16px | `text-base`     |
| `text-lg`   | 18px | `text-lg`       |
| `text-xl`   | 20px | `text-xl`       |
| `text-2xl`  | 24px | `text-2xl`      |
| `text-3xl`  | 30px | `text-3xl`      |
| `text-4xl`  | 36px | `text-4xl`      |
| `text-5xl`  | 48px | `text-5xl`      |
| `text-6xl`  | 56px | `text-6xl`      |

### 폰트 굵기

| 토큰            | 값  | Tailwind 클래스 |
| --------------- | --- | --------------- |
| `font-normal`   | 400 | `font-normal`   |
| `font-medium`   | 500 | `font-medium`   |
| `font-semibold` | 600 | `font-semibold` |
| `font-bold`     | 700 | `font-bold`     |

### 줄 높이

| 토큰              | 값   | Tailwind 클래스   |
| ----------------- | ---- | ----------------- |
| `leading-tight`   | 118% | `leading-tight`   |
| `leading-snug`    | 130% | `leading-snug`    |
| `leading-normal`  | 140% | `leading-normal`  |
| `leading-relaxed` | 150% | `leading-relaxed` |

---

## 모서리 반경 (Border Radius)

Figma `.Radius` 기준.

| 토큰          | 값     | Tailwind 클래스 |
| ------------- | ------ | --------------- |
| `radius-none` | 0px    | `rounded-none`  |
| `radius-sm`   | 4px    | `rounded-sm`    |
| `radius-md`   | 6px    | `rounded-md`    |
| `radius-lg`   | 8px    | `rounded-lg`    |
| `radius-xl`   | 12px   | `rounded-xl`    |
| `radius-2xl`  | 16px   | `rounded-2xl`   |
| `radius-full` | 9999px | `rounded-full`  |

---

## 그림자 (Shadow)

| 토큰        | Tailwind 클래스 | 용도                 |
| ----------- | --------------- | -------------------- |
| `shadow-sm` | `shadow-sm`     | 카드, 인풋 서브 강조 |
| `shadow-md` | `shadow-md`     | 드롭다운, 팝오버     |
| `shadow-lg` | `shadow-lg`     | 모달, 토스트         |
| `shadow-xl` | `shadow-xl`     | 오버레이 레이어      |

---

## 레이아웃 (Layout)

| 토큰              | 값     | 용도                                 |
| ----------------- | ------ | ------------------------------------ |
| `width-container` | 1200px | `max-w-container` 컨테이너 최대 너비 |
| `width-sidebar`   | 240px  | 사이드바 너비                        |

```tsx
// 컨테이너 중앙 정렬 패턴
<div className="max-w-container mx-auto px-4">{/* 페이지 콘텐츠 */}</div>
```
