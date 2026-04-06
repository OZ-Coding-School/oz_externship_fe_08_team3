/**
 * @interface-contract
 *
 * Page: /login (로그인)
 * - 헤더: 상단 배너 바 (#222 배경) + 네비게이션 바 (로고, 커뮤니티, 질의응답, 로그인|회원가입)
 * - 오즈코딩스쿨 로고
 * - "아직 회원이 아니신가요?" 텍스트 + "회원가입 하기" 링크 (보라색 #6201E0) → /signup 이동
 * - "카카오 간편 로그인 / 가입" 버튼 (노란색 #FEE500 배경, 카카오 아이콘)
 * - "네이버 간편 로그인 / 가입" 버튼 (초록색 #03C75A 배경, 네이버 아이콘)
 * - 이메일 입력 필드: placeholder "아이디 (example@gmail.com)"
 * - 비밀번호 입력 필드: placeholder "비밀번호 (6~15자의 영문 대소문자, 숫자, 특수문자 포함)"
 * - "아이디 찾기 | 비밀번호 찾기" 링크
 * - "일반회원 로그인" 버튼 (비활성: #ECECEC 배경: #BDBDBD 텍스트, 활성: 활성화 스타일)
 *
 * API:
 * - POST /accounts/login → 이메일/비밀번호 로그인, JWT 발급, / 리다이렉트
 * - GET  /accounts/social-login/kakao    → 카카오 OAuth2 인증 흐름 시작
 * - GET  /accounts/social-login/naver    → 네이버 OAuth2 인증 흐름 시작
 *
 * REQ-USER-006: 이메일 로그인
 * REQ-USER-007: 소셜 로그인 (카카오)
 * REQ-USER-008: 소셜 로그인 (네이버)
 */

import { test, expect } from '@playwright/test'

test.describe('로그인 페이지 렌더링', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('로그인 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/login')
  })

  test('오즈코딩스쿨 로고가 표시된다', async ({ page }) => {
    const logo = page.getByRole('img', { name: 'OzCodingSchool' })
    await expect(logo).toBeVisible()
  })

  test('"아직 회원이 아니신가요?" 텍스트가 표시된다', async ({ page }) => {
    await expect(page.getByText('아직 회원이 아니신가요?')).toBeVisible()
  })

  test('"회원가입 하기" 링크가 표시된다', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: '회원가입 하기' })
    ).toBeVisible()
  })

  test('"회원가입 하기" 링크 클릭 시 /signup으로 이동한다', async ({
    page,
  }) => {
    await page.getByRole('link', { name: '회원가입 하기' }).click()
    await expect(page).toHaveURL('/signup')
  })

  test('"카카오 간편 로그인 / 가입" 버튼이 표시된다', async ({ page }) => {
    const kakaoButton = page.getByRole('button', {
      name: '카카오 간편 로그인/가입',
    })
    await expect(kakaoButton).toBeVisible()
  })

  test('"네이버 간편 로그인 / 가입" 버튼이 표시된다', async ({ page }) => {
    const naverButton = page.getByRole('button', {
      name: '네이버 간편 로그인/가입',
    })
    await expect(naverButton).toBeVisible()
  })

  test('이메일 입력 필드가 표시된다', async ({ page }) => {
    const emailInput = page.getByPlaceholder('아이디 (example@gmail.com)')
    await expect(emailInput).toBeVisible()
  })

  test('비밀번호 입력 필드가 표시된다', async ({ page }) => {
    const passwordInput = page.getByPlaceholder(
      '비밀번호 (6~15자의 영문 대소문자, 숫자, 특수문자 포함)'
    )
    await expect(passwordInput).toBeVisible()
  })

  test('"아이디 찾기" 링크가 표시된다', async ({ page }) => {
    await expect(page.getByRole('link', { name: '아이디 찾기' })).toBeVisible()
  })

  test('"비밀번호 찾기" 링크가 표시된다', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: '비밀번호 찾기' })
    ).toBeVisible()
  })

  test('"일반회원 로그인" 버튼이 표시된다', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: '일반회원 로그인' })
    await expect(loginButton).toBeVisible()
  })
})

test.describe('로그인 페이지 - 버튼 비활성/활성 상태', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('이메일과 비밀번호가 모두 비어있을 때 "일반회원 로그인" 버튼이 비활성 상태이다', async ({
    page,
  }) => {
    const loginButton = page.getByRole('button', { name: '일반회원 로그인' })
    await expect(loginButton).toBeDisabled()
  })

  test('이메일만 입력된 경우 "일반회원 로그인" 버튼이 비활성 상태이다', async ({
    page,
  }) => {
    await page
      .getByPlaceholder('아이디 (example@gmail.com)')
      .fill('test@example.com')
    const loginButton = page.getByRole('button', { name: '일반회원 로그인' })
    await expect(loginButton).toBeDisabled()
  })

  test('비밀번호만 입력된 경우 "일반회원 로그인" 버튼이 비활성 상태이다', async ({
    page,
  }) => {
    await page
      .getByPlaceholder(
        '비밀번호 (6~15자의 영문 대소문자, 숫자, 특수문자 포함)'
      )
      .fill('Test123!')
    const loginButton = page.getByRole('button', { name: '일반회원 로그인' })
    await expect(loginButton).toBeDisabled()
  })

  test('이메일과 비밀번호를 모두 입력하면 "일반회원 로그인" 버튼이 활성화된다', async ({
    page,
  }) => {
    await page
      .getByPlaceholder('아이디 (example@gmail.com)')
      .fill('test@example.com')
    await page
      .getByPlaceholder(
        '비밀번호 (6~15자의 영문 대소문자, 숫자, 특수문자 포함)'
      )
      .fill('Test123!')
    const loginButton = page.getByRole('button', { name: '일반회원 로그인' })
    await expect(loginButton).toBeEnabled()
  })
})

test.describe('이메일 로그인 (REQ-USER-006)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('올바른 이메일과 비밀번호 입력 후 "일반회원 로그인" 클릭 시 홈(/)으로 이동한다', async ({
    page,
  }) => {
    test.skip()
    // MSW 기본 핸들러가 POST /accounts/login 성공 응답을 처리한다고 가정
    await page
      .getByPlaceholder('아이디 (example@gmail.com)')
      .fill('test@example.com')
    await page
      .getByPlaceholder(
        '비밀번호 (6~15자의 영문 대소문자, 숫자, 특수문자 포함)'
      )
      .fill('Test123!')
    await page.getByRole('button', { name: '일반회원 로그인' }).click()
    await expect(page).toHaveURL('/')
  })

  test('존재하지 않는 이메일로 로그인 시도 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // MSW에서 404 오버라이드 필요 — 핸들러 구현 후 msw.overrideError 사용
    await page
      .getByPlaceholder('아이디 (example@gmail.com)')
      .fill('notexist@example.com')
    await page
      .getByPlaceholder(
        '비밀번호 (6~15자의 영문 대소문자, 숫자, 특수문자 포함)'
      )
      .fill('Test123!')
    await page.getByRole('button', { name: '일반회원 로그인' }).click()
    // Input 컴포넌트: 에러 메시지는 <p role="alert" aria-live="polite"> 로 표시
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('틀린 비밀번호로 로그인 시도 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // MSW에서 401 오버라이드 필요 — 핸들러 구현 후 msw.overrideError 사용
    await page
      .getByPlaceholder('아이디 (example@gmail.com)')
      .fill('test@example.com')
    await page
      .getByPlaceholder(
        '비밀번호 (6~15자의 영문 대소문자, 숫자, 특수문자 포함)'
      )
      .fill('WrongPass1!')
    await page.getByRole('button', { name: '일반회원 로그인' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })
})
// 소셜 로그인 기능 개발 후 주석 해제
// test.describe('카카오 소셜 로그인 (REQ-USER-007)', () => {
//   test.beforeEach(async ({ page }) => {
//     await page.goto('/login')
//   })

//   test('"카카오 간편 로그인 / 가입" 버튼 클릭 시 카카오 OAuth 인증 흐름이 시작된다', async ({
//     page,
//   }) => {
//     test.skip()
//     // GET /oauth/kakao 요청 또는 카카오 도메인으로의 네비게이션을 확인
//     const [request] = await Promise.all([
//       page.waitForRequest((req) => req.url().includes('/oauth/kakao')),
//       page.getByRole('button', { name: '카카오로 계속하기' }).click(),
//     ])
//     expect(request).toBeTruthy()
//   })

//   test('카카오 인증 완료 후 서버에 등록된 계정이면 홈(/)으로 이동한다', async ({
//     page,
//   }) => {
//     test.skip()
//     // OAuth 콜백 처리 후 리다이렉트 확인 — 실제 OAuth 흐름은 E2E에서 MSW로 모킹
//     await page.goto('/oauth/kakao/callback?code=mock_code')
//     await expect(page).toHaveURL('/')
//   })

//   test('카카오 인증 완료 후 서버에 미등록 계정이면 회원가입 흐름으로 이동한다', async ({
//     page,
//   }) => {
//     test.skip()
//     // MSW에서 신규 유저 응답 오버라이드 필요
//     await page.goto('/oauth/kakao/callback?code=mock_new_user_code')
//     await expect(page).toHaveURL('/signup')
//   })

//   test('카카오 인증 실패 또는 취소 시 로그인 페이지에 오류 메시지가 표시된다', async ({
//     page,
//   }) => {
//     test.skip()
//     // MSW에서 에러 응답 오버라이드 필요
//     await page.goto('/oauth/kakao/callback?error=access_denied')
//     await expect(page).toHaveURL('/login')
//     await expect(page.getByRole('alert')).toBeVisible()
//   })
// })

// test.describe('네이버 소셜 로그인 (REQ-USER-008)', () => {
//   test.beforeEach(async ({ page }) => {
//     await page.goto('/login')
//   })

//   test('"네이버 간편 로그인 / 가입" 버튼 클릭 시 네이버 OAuth 인증 흐름이 시작된다', async ({
//     page,
//   }) => {
//     test.skip()
//     // GET /oauth/naver 요청 또는 네이버 도메인으로의 네비게이션을 확인
//     const [request] = await Promise.all([
//       page.waitForRequest((req) => req.url().includes('/oauth/naver')),
//       page.getByRole('button', { name: '네이버로 계속하기' }).click(),
//     ])
//     expect(request).toBeTruthy()
//   })

//   test('네이버 인증 완료 후 서버에 등록된 계정이면 홈(/)으로 이동한다', async ({
//     page,
//   }) => {
//     test.skip()
//     await page.goto('/oauth/naver/callback?code=mock_code')
//     await expect(page).toHaveURL('/')
//   })

//   test('네이버 인증 완료 후 서버에 미등록 계정이면 회원가입 흐름으로 이동한다', async ({
//     page,
//   }) => {
//     test.skip()
//     await page.goto('/oauth/naver/callback?code=mock_new_user_code')
//     await expect(page).toHaveURL('/signup')
//   })

//   test('네이버 인증 실패 또는 취소 시 로그인 페이지에 오류 메시지가 표시된다', async ({
//     page,
//   }) => {
//     test.skip()
//     await page.goto('/oauth/naver/callback?error=access_denied')
//     await expect(page).toHaveURL('/login')
//     await expect(page.getByRole('alert')).toBeVisible()
//   })
// })

test.describe('로그인 성공 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('로그인 성공 후 네비게이션에서 "로그인|회원가입" 대신 사용자 정보가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // MSW 기본 핸들러가 POST /accounts/login 성공 응답 + 유저 정보 반환
    await page
      .getByPlaceholder('아이디 (example@gmail.com)')
      .fill('test@example.com')
    await page
      .getByPlaceholder(
        '비밀번호 (6~15자의 영문 대소문자, 숫자, 특수문자 포함)'
      )
      .fill('Test123!')
    await page.getByRole('button', { name: '일반회원 로그인' }).click()
    await expect(page).toHaveURL('/')
    // 인증 상태: Header에 프로필 아이콘/이미지 표시, 로그인 버튼 미표시
    await expect(page.getByRole('button', { name: '로그인' })).not.toBeVisible()
    // authStore: isAuthenticated=true → 프로필 영역 렌더링
    // 프로필 이미지 또는 아이콘이 표시되는지 확인 (구현 후 정확한 셀렉터 보완)
    await expect(page.getByLabel('홈으로 이동')).toBeVisible()
  })

  test('이미 로그인된 상태에서 /login 접근 시 홈(/)으로 리다이렉트된다', async ({
    page,
  }) => {
    test.skip()
    // 로그인 후 /login 재접근 시 리다이렉트 확인
    // authStore에 인증 상태가 있을 때 LoginPage에서 navigate('/')
    await page
      .getByPlaceholder('아이디 (example@gmail.com)')
      .fill('test@example.com')
    await page
      .getByPlaceholder(
        '비밀번호 (6~15자의 영문 대소문자, 숫자, 특수문자 포함)'
      )
      .fill('Test123!')
    await page.getByRole('button', { name: '일반회원 로그인' }).click()
    await expect(page).toHaveURL('/')
    await page.goto('/login')
    await expect(page).toHaveURL('/')
  })
})
