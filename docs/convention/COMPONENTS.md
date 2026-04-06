# 컴포넌트 구조

## 디렉토리 구성

```
src/components/
├── common/          # 공통 UI 컴포넌트 (도메인 무관)
├── layout/          # 페이지 레이아웃 컴포넌트
├── auth/            # 로그인/회원가입 도메인 컴포넌트
├── mypage/          # 마이페이지 도메인 컴포넌트
├── quiz/            # 쪽지시험 도메인 컴포넌트
├── qna/             # 질의응답 도메인 컴포넌트
├── community/       # 커뮤니티 도메인 컴포넌트
├── chatbot/         # 챗봇 도메인 컴포넌트
└── index.ts         # barrel export (common + layout re-export)
```

## common/ — 공통 UI 컴포넌트

여러 도메인에서 재사용되는 범용 컴포넌트입니다.

| 컴포넌트          | 설명                              |
| ----------------- | --------------------------------- |
| Avatar            | 프로필 이미지                     |
| Badge             | 상태 뱃지                         |
| Button            | 버튼                              |
| Card              | 카드 레이아웃                     |
| Checkbox          | 체크박스                          |
| Dropdown          | 드롭다운 선택                     |
| Input             | 텍스트 입력                       |
| Modal             | 모달 (Alert, Confirm, Restore)    |
| PasswordInput     | 비밀번호 입력 (토글 표시)         |
| SearchInput       | 검색 입력                         |
| SocialLoginButton | 소셜 로그인 버튼 (카카오, 네이버) |
| Spinner           | 로딩 스피너                       |
| SuccessCard       | 성공 안내 카드                    |
| Tabs              | 탭 전환                           |
| Toast             | 토스트 알림                       |

## layout/ — 레이아웃 컴포넌트

페이지 공통 레이아웃을 구성하는 컴포넌트입니다.

| 컴포넌트 | 설명                                  |
| -------- | ------------------------------------- |
| Header   | GNB — 로고, 네비게이션, 프로필/로그인 |
| Footer   | 푸터 — 사이트 정보, 링크              |

## 도메인별 컴포넌트

각 도메인에서만 사용되는 컴포넌트를 관리합니다. 구현 시 해당 폴더에 생성합니다.

| 폴더       | 용도                 | 예시                                   |
| ---------- | -------------------- | -------------------------------------- |
| auth/      | 로그인/회원가입 전용 | 아이디 찾기 모달, 비밀번호 재설정 모달 |
| mypage/    | 마이페이지 전용      | 프로필 카드, 탈퇴 모달                 |
| quiz/      | 쪽지시험 전용        | 문제 카드, 타이머, 참가코드 모달       |
| qna/       | 질의응답 전용        | 답변 폼, 채택 버튼, AI 답변 영역       |
| community/ | 커뮤니티 전용        | 댓글 목록, 좋아요 버튼                 |
| chatbot/   | 챗봇 전용            | 채팅 버블, 플로팅 위젯                 |

## 컴포넌트 파일 규칙

```
ComponentName/
├── ComponentName.tsx    # 컴포넌트 구현 (named export)
├── icons.tsx            # 전용 아이콘 (있는 경우)
└── index.ts             # barrel export
```

- **named export만 사용** (default export 사용 안 함)
- 스타일링은 **Tailwind CSS v4** `@theme` 토큰 클래스 사용
- import: 공통은 `@/components`에서, 도메인은 `@/components/{domain}`에서

## import 경로

```typescript
// 공통 컴포넌트 — barrel export로 짧게
import { Button, Modal, Toast } from '@/components'

// 도메인 컴포넌트 — 도메인 폴더에서 직접
import { AnswerForm } from '@/components/qna/AnswerForm'

// 레이아웃 컴포넌트 — barrel export로 짧게
import { Header, Footer } from '@/components'

// 컴포넌트 내부에서 다른 공통 컴포넌트 참조
import { Button } from '@/components/common/Button'
```
