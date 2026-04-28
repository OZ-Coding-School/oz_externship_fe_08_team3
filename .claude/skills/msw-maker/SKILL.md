---
name: msw-maker
description: API 정보를 입력받아 MSW 핸들러를 자동 생성합니다.
allowed-tools: Read, Edit, Grep
disable-model-invocation: true
---

# MSW Handler Generator

사용자가 입력한 API 정보를 바탕으로 MSW 핸들러를 생성합니다.

## 입력 형식

```
/msw
METHOD /path API 설명

[요청]
{ field: type (required), field: type }

[성공 응답]
STATUS: { field: type }

[에러 응답]
STATUS: { field: type }
STATUS: { field: type }
```

## 입력 검증 (최우선)

아래 필수 정보가 **모두** 포함되어 있는지 먼저 확인합니다. 하나라도 빠져 있으면 **코드를 생성하지 말고** 누락된 항목을 안내하며 재입력을 요청합니다.

### 필수 항목

| 구간              | 필수 여부             | 설명                       |
| ----------------- | --------------------- | -------------------------- |
| **METHOD + PATH** | 항상 필수             | HTTP 메서드와 API 경로     |
| **[요청]**        | POST, PUT, PATCH 필수 | 요청 body 필드와 타입      |
| **[성공 응답]**   | 항상 필수 (204 제외)  | 상태 코드 + 응답 body      |
| **[에러 응답]**   | 선택                  | 에러 상태 코드 + 응답 body |

### 검증 규칙

- GET, DELETE: METHOD, PATH, [성공 응답] 필수
- POST, PUT, PATCH: METHOD, PATH, **[요청]**, [성공 응답] 필수
- 204 No Content: [성공 응답] 생략 가능
- `(required)` 표기가 있는 필드는 핸들러 주석에 필수 여부를 기록

### 누락 시 재입력 요청

누락된 구간을 명확히 안내합니다:

```
아래 정보가 누락되었습니다. 추가로 입력해주세요:

- [요청]: 요청 body 필드를 알려주세요.
  예) { email: string (required), password: string (required) }

- [성공 응답]: 상태 코드와 응답 body를 알려주세요.
  예) 200: { access_token: string }
```

## 입력 예시

### 전체 정보 포함 (권장)

```
/msw
POST /api/v1/accounts/login 이메일 로그인 API

[요청]
{ email: string (required), password: string (required) }

[성공 응답]
200: { access_token: string }

[에러 응답]
400: { error_detail: { field_name: string[] } }
403: { error_detail: { detail: string, expire_at: string } }
```

### GET 요청

```
/msw
GET /api/v1/users 사용자 목록 조회

[성공 응답]
200: [{ id: number, name: string, email: string, createdAt: string }]
```

### DELETE 요청

```
/msw
DELETE /api/v1/posts/:id 게시글 삭제

[성공 응답]
204
```

### 다중 핸들러

각 API를 `---`로 구분합니다. 각 핸들러마다 필수 정보를 모두 검증합니다:

```
/msw
GET /api/v1/users 사용자 목록
[성공 응답]
200: [{ id, name, email }]
---
POST /api/v1/users 사용자 생성
[요청]
{ name: string (required), email: string (required) }
[성공 응답]
201: { id, name, email }
[에러 응답]
400: { error_detail: { field_name: string[] } }
---
DELETE /api/v1/users/:id 사용자 삭제
[성공 응답]
204
```

## 생성 규칙

1. **파일 위치**: @src/mocks/handlers.ts 에 핸들러를 추가합니다.
2. **import**: `msw`의 `http`와 `HttpResponse`를 사용합니다 (이미 import되어 있음).
3. **성공 핸들러 패턴**:
   ```typescript
   // API 설명
   http.METHOD('PATH', async ({ request }) => {
     const body = await request.json()
     return HttpResponse.json(RESPONSE_DATA, { status: STATUS_CODE })
   })
   ```
4. **에러 핸들러 패턴**: [에러 응답]이 있으면 성공 핸들러 바로 아래에 주석 처리된 에러 핸들러를 함께 생성합니다:
   ```typescript
   // [에러] API 설명 - 400 Bad Request
   // http.METHOD('PATH', () => {
   //   return HttpResponse.json(ERROR_DATA, { status: 400 })
   // })
   ```
5. **응답 데이터 생성 규칙**:
   - 사용자가 JSON을 직접 제공하면 그대로 사용합니다.
   - 필드명+타입만 제공하면 현실적인 더미 데이터를 생성합니다.
   - 목록 API는 배열로 2~3개 항목을 생성합니다.
   - 한국어 더미 데이터를 우선 사용합니다 (이름, 주소 등).
   - 204 No Content의 경우 `new HttpResponse(null, { status: 204 })`를 사용합니다.
6. **기존 핸들러 유지**: `handlers` 배열에 새 핸들러를 추가만 합니다. 기존 핸들러는 절대 삭제하지 않습니다.

## 실행 절차

1. $ARGUMENTS를 파싱하여 각 구간([요청], [성공 응답], [에러 응답])을 분리합니다.
2. 필수 정보 검증을 수행합니다. 누락 시 **즉시 재입력을 요청**하고 코드 생성을 중단합니다.
3. 모든 정보가 충족되면 @src/mocks/handlers.ts 파일을 읽습니다.
4. 성공 핸들러를 생성하여 `handlers` 배열에 추가합니다.
5. [에러 응답]이 있으면 주석 처리된 에러 핸들러도 함께 추가합니다.
6. 파일을 저장하고 생성된 핸들러 코드를 사용자에게 보여줍니다.

$ARGUMENTS
