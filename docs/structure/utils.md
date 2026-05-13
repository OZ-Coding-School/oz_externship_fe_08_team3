# utils/

React에 의존하지 않는 순수 유틸리티 함수를 관리한다.

## 디렉토리 구조

```
src/utils/
├── formatDate.ts       # ISO → 한국어 날짜 포맷
├── handleApiError.ts   # Axios 에러 → 메시지 변환
└── relativeTime.ts     # ISO → 상대 시간 ("N분 전")
```

## formatDate

ISO 날짜 문자열을 한국어 로케일 형식으로 변환한다.

```ts
formatDate('2024-01-15T10:30:00Z')
// → "2024. 01. 15. 오전 10:30"
```

- `toLocaleString('ko-KR')` 사용
- 년, 월(2자리), 일(2자리), 시(2자리), 분(2자리) 포함

## handleApiError

Axios 에러에서 HTTP 상태 코드 기반으로 사용자 메시지와 사이드이펙트를 반환한다.

```ts
const { message, action } = handleApiError(
  error,
  { 403: '권한이 없습니다', 404: '질문을 찾을 수 없습니다' },
  { 401: () => navigate('/login') }
)
```

- `messages`: 상태 코드 → 사용자 메시지 매핑
- `actions`: 상태 코드 → 실행할 함수 매핑 (선택)
- 매칭되지 않으면 기본 메시지 반환: `'일시적인 오류가 발생했습니다. 다시 시도해 주세요.'`
- `action`은 호출 측에서 toast 표시 후 실행해야 함

## relativeTime

ISO 날짜 문자열을 현재 시각 기준 상대 시간으로 변환한다.

```ts
getRelativeTime('2024-01-15T10:30:00Z')
// → "3시간 전", "2일 전", "방금" 등
```

**변환 규칙:**

| 경과 시간 | 출력     |
| --------- | -------- |
| < 1분     | 방금     |
| < 60분    | N분 전   |
| < 24시간  | N시간 전 |
| < 30일    | N일 전   |
| < 12개월  | N달 전   |
| ≥ 12개월  | N년 전   |

## 추가 규칙

- React 훅이나 컴포넌트에 의존하는 로직은 `hooks/`에 배치
- 순수 함수만 `utils/`에 위치
- 파일명: camelCase
- 함수명: camelCase (export)
