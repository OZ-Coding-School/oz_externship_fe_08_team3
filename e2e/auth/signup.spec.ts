/**
 * @interface-contract
 *
 * Page: /signup (회원가입 방법 선택)
 * - 로고 (alt: "OzCodingSchool")
 * - "현재 회원이신가요?" 텍스트 + "로그인하기" 링크 (보라색 #6201E0) → /login 이동
 * - "카카오로 3초만에 가입하기" 버튼 (노란색 #FEE500, 카카오 아이콘)
 * - "네이버로 가입하기" 버튼 (초록색 #03C75A, 네이버 아이콘)
 * - "일반회원 가입" 텍스트 링크 (밑줄) → /signup/form 이동
 *
 * Page: /signup/form (일반 회원가입 폼)
 * - 필드 (placeholder 기준):
 *   - 이름: "이름을 입력해주세요"
 *   - 닉네임: "닉네임을 입력해주세요" + "중복확인" 버튼
 *   - 생년월일: "8자리 입력해주세요 (ex.20001004)"
 *   - 성별: "남" / "여" pill 토글
 *   - 이메일: "인증코드전송" 버튼, 인증번호 입력 "전송된 코드를 입력해주세요." + "인증번호확인" 버튼
 *   - 휴대전화: 010 분리 3칸 입력 + "인증번호전송" 버튼, "인증번호 6자리를 입력해주세요" + "인증번호확인" 버튼
 *   - 비밀번호: "비밀번호를 입력해주세요"
 *   - 비밀번호 확인: "비밀번호를 다시 입력해주세요"
 * - "가입하기" 버튼 (보라색 #6201E0)
 * - API: POST /accounts/signup → 회원 생성, / 리다이렉트
 * - API: POST /accounts/verification/send-email → 이메일 인증코드 전송
 * - API: POST /accounts/verification/verify-email → 이메일 인증코드 확인
 * - API: POST /accounts/verification/send-sms → SMS 인증코드 전송 (Twilio)
 * - API: POST /accounts/verification/verify-sms → SMS 인증코드 확인
 * - API: GET  /accounts/check-nickname → 닉네임 중복 확인 (회원가입/마이페이지 둘 다 처리)
 * - API: GET /accounts/social-login/kakao → 카카오 소셜 가입
 * - API: GET /accounts/social-login/naver → 네이버 소셜 가입
 */

import { test, expect } from '@playwright/test'

test.describe('회원가입 방법 선택 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup')
  })

  test('회원가입 방법 선택 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/signup')
  })

  test('로고가 표시된다', async ({ page }) => {
    test.skip()
    const logo = page.getByRole('img', { name: 'OzCodingSchool' })
    await expect(logo).toBeVisible()
  })

  test('"현재 회원이신가요?" 텍스트와 "로그인하기" 링크가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await expect(page.getByText('현재 회원이신가요?')).toBeVisible()
    await expect(page.getByRole('link', { name: '로그인하기' })).toBeVisible()
  })

  test('"로그인하기" 링크 클릭 시 /login으로 이동한다', async ({ page }) => {
    await page.getByRole('link', { name: '로그인하기' }).click()
    await expect(page).toHaveURL('/login')
  })

  test('"카카오로 3초만에 가입하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    // 회원가입 페이지 Figma 기준 텍스트 사용 — SocialLoginButton 커스텀 prop일 수 있음
    const kakaoButton = page.getByRole('button', {
      name: '카카오로 3초만에 가입하기',
    })
    await expect(kakaoButton).toBeVisible()
  })

  test('"네이버로 3초만에 가입하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    const naverButton = page.getByRole('button', {
      name: '네이버로 3초만에 가입하기',
    })
    await expect(naverButton).toBeVisible()
  })

  test('"일반회원 가입" 텍스트 링크가 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('link', { name: '일반회원 가입' })
    ).toBeVisible()
  })

  test('"일반회원 가입" 클릭 시 /signup/form으로 이동한다', async ({
    page,
  }) => {
    await page.getByRole('link', { name: '일반회원 가입' }).click()
    await expect(page).toHaveURL('/signup/form')
  })
})

test.describe('회원가입 방법 선택 페이지 - 네비게이션', () => {
  test('헤더의 "회원가입" 버튼 클릭 시 /signup으로 이동한다', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '회원가입' }).click()
    await expect(page).toHaveURL('/signup')
  })

  test('이미 로그인된 상태에서 /signup 접근 시 홈(/)으로 리다이렉트된다', async ({
    page,
  }) => {
    await page.goto('/')
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('AuthStore') || '{}')
      store.state = {
        isAuthenticated: true,
        user: {
          nickname: 'testuser',
          email: 'test@test.com',
          profileImage: null,
        },
      }
      localStorage.setItem('AuthStore', JSON.stringify(store))
    })
    await page.goto('/signup')
    await expect(page).toHaveURL('/')
  })

  test('이미 로그인된 상태에서 /signup/form 접근 시 홈(/)으로 리다이렉트된다', async ({
    page,
  }) => {
    await page.goto('/')
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('AuthStore') || '{}')
      store.state = {
        isAuthenticated: true,
        user: {
          nickname: 'testuser',
          email: 'test@test.com',
          profileImage: null,
        },
      }
      localStorage.setItem('AuthStore', JSON.stringify(store))
    })
    await page.goto('/signup/form')
    await expect(page).toHaveURL('/')
  })
})
// 기능 구현 후 테스트 코드 보완
test.describe('카카오 소셜 가입', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup')
  })

  test('카카오 버튼 클릭 시 카카오 OAuth 흐름이 시작된다', async ({ page }) => {
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('button', { name: '카카오로 3초만에 가입하기' }).click(),
    ])
    expect(popup.url()).toContain('kauth.kakao.com')
  })

  test('이미 가입된 카카오 계정으로 시도 시 로그인 처리 후 홈(/)으로 이동한다', async ({
    page,
  }) => {
    test.skip()
    // 이미 가입된 계정 → MSW 기본 핸들러가 기존 유저 응답 반환 → 홈 리다이렉트
    await page.goto('/oauth/kakao/callback?code=mock_existing_user_code')
    await expect(page).toHaveURL('/')
  })
})
// 기능 구현 후 테스트 코드 보완
test.describe('네이버 소셜 가입', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup')
  })

  test('"네이버로 가입하기" 버튼 클릭 시 네이버 OAuth 흐름이 시작된다', async ({
    page,
  }) => {
    test.skip()
    // GET /accounts/social-login/naver 요청 또는 네이버 도메인으로의 네비게이션 확인
    const [request] = await Promise.all([
      page.waitForRequest((req) =>
        req.url().includes('/accounts/social-login/naver')
      ),
      page.getByRole('button', { name: '네이버로 가입하기' }).click(),
    ])
    expect(request).toBeTruthy()
  })

  test('이미 가입된 네이버 계정으로 시도 시 로그인 처리 후 홈(/)으로 이동한다', async ({
    page,
  }) => {
    test.skip()
    // 이미 가입된 계정 → MSW 기본 핸들러가 기존 유저 응답 반환 → 홈 리다이렉트
    await page.goto('/oauth/naver/callback?code=mock_existing_user_code')
    await expect(page).toHaveURL('/')
  })

  test('신규 네이버 계정으로 시도 시 회원가입 흐름으로 이동한다', async ({
    page,
  }) => {
    test.skip()
    // 신규 유저 → MSW 오버라이드로 신규 유저 응답 반환
    await page.goto('/oauth/naver/callback?code=mock_new_user_code')
    await expect(page).toHaveURL('/signup')
  })

  test('네이버 인증 실패 또는 취소 시 /signup 페이지에 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/oauth/naver/callback?error=access_denied')
    await expect(page).toHaveURL('/signup')
    await expect(page.getByRole('alert')).toBeVisible()
  })
})

test.describe('일반 회원가입 폼 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup/form')
  })

  test('일반 회원가입 폼 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/signup/form')
  })

  test('이름 입력 필드가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByPlaceholder('이름을 입력해주세요')).toBeVisible()
  })

  test('닉네임 입력 필드와 "중복확인" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByPlaceholder('닉네임을 입력해주세요')).toBeVisible()
    await expect(page.getByRole('button', { name: '중복확인' })).toBeVisible()
  })

  test('생년월일 입력 필드가 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByPlaceholder('8자리 입력해주세요 (ex.20001004)')
    ).toBeVisible()
  })

  test('성별 "남"/"여" 토글 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '남' })).toBeVisible()
    await expect(page.getByRole('button', { name: '여' })).toBeVisible()
  })

  test('이메일 입력 필드, "인증코드전송" 버튼, 인증번호 입력 필드, "인증번호확인" 버튼이 표시된다', async ({
    page,
  }) => {
    test.skip()
    await expect(page.getByPlaceholder('이메일을 입력해주세요')).toBeVisible()
    await expect(
      page.getByRole('button', { name: '인증코드전송' })
    ).toBeVisible()
    await expect(
      page.getByPlaceholder('전송된 코드를 입력해주세요.')
    ).toBeVisible()
    // 이메일 인증번호확인 버튼: 동명의 버튼이 휴대폰 인증에도 존재하므로 first() 사용
    await expect(
      page.getByRole('button', { name: '인증번호확인' }).first()
    ).toBeVisible()
  })

  test('휴대전화 입력 필드, "인증번호전송" 버튼, 인증번호 입력 필드, "인증번호확인" 버튼이 표시된다', async ({
    page,
  }) => {
    test.skip()
    // 휴대전화 번호 3칸 입력 필드
    await expect(page.getByRole('textbox', { name: '앞자리' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: '중간자리' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: '뒷자리' })).toBeVisible()
    await expect(
      page.getByRole('button', { name: '인증번호전송' })
    ).toBeVisible()
    await expect(
      page.getByPlaceholder('전송된 코드를 입력해주세요.').last()
    ).toBeVisible()
    // 휴대폰 인증번호확인 버튼: last() 로 이메일 인증번호확인과 구분
    await expect(
      page.getByRole('button', { name: '인증번호확인' }).last()
    ).toBeVisible()
  })

  test('비밀번호 입력 필드와 비밀번호 확인 입력 필드가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await expect(page.getByPlaceholder('비밀번호를 입력해주세요')).toBeVisible()
    await expect(
      page.getByPlaceholder('비밀번호를 다시 입력해주세요')
    ).toBeVisible()
  })

  test('"가입하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '가입하기' })).toBeVisible()
  })
})

test.describe('일반 회원가입 폼 - 성별 선택', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup/form')
  })

  test('"남" 버튼 클릭 시 선택 상태로 변경된다', async ({ page }) => {
    test.skip()
    const maleButton = page.getByRole('button', { name: '남' })
    await maleButton.click()
    // 선택 상태: aria-pressed="true" 또는 선택된 스타일로 확인
    await expect(maleButton).toHaveAttribute('aria-pressed', 'true')
  })

  test('"여" 버튼 클릭 시 선택 상태로 변경된다', async ({ page }) => {
    test.skip()
    const femaleButton = page.getByRole('button', { name: '여' })
    await femaleButton.click()
    await expect(femaleButton).toHaveAttribute('aria-pressed', 'true')
  })

  test('성별 선택 후 다른 성별 버튼 클릭 시 선택이 전환된다', async ({
    page,
  }) => {
    test.skip()
    const maleButton = page.getByRole('button', { name: '남' })
    const femaleButton = page.getByRole('button', { name: '여' })
    await maleButton.click()
    await expect(maleButton).toHaveAttribute('aria-pressed', 'true')
    await femaleButton.click()
    await expect(femaleButton).toHaveAttribute('aria-pressed', 'true')
  })
})

test.describe('일반 회원가입 폼 - 닉네임 중복 확인', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup/form')
  })

  test('닉네임 입력 후 "중복확인" 클릭 시 사용 가능 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // MSW 기본 핸들러가 GET /accounts/check-nickname 성공 응답 처리
    await page.getByPlaceholder('닉네임을 입력해주세요').fill('availableNick')
    await page.getByRole('button', { name: '중복확인' }).click()
    // Input 컴포넌트: successMessage로 성공 표시
    await expect(page.getByText('사용 가능한 닉네임입니다')).toBeVisible()
  })

  test('이미 사용 중인 닉네임 입력 후 "중복확인" 클릭 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // MSW 오버라이드로 409 응답 반환 — 핸들러 구현 후 msw.overrideError 사용
    await page.getByPlaceholder('닉네임을 입력해주세요').fill('duplicateNick')
    await page.getByRole('button', { name: '중복확인' }).click()
    // Input 컴포넌트: aria-invalid="true" + <p role="alert"> 에러 메시지
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('닉네임 미입력 상태에서 "중복확인" 클릭 시 입력 요청 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '중복확인' }).click()
    const nicknameInput = page.getByPlaceholder('닉네임을 입력해주세요')
    await expect(nicknameInput).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByRole('alert')).toBeVisible()
  })
})

test.describe('일반 회원가입 폼 - 이메일 인증', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup/form')
  })

  test('이메일 입력 후 "인증코드전송" 클릭 시 인증번호 입력 필드가 활성화된다', async ({
    page,
  }) => {
    test.skip()
    // MSW 기본 핸들러가 POST /accounts/verification/send-email 성공 응답 처리
    await page.getByLabel('이메일').fill('test@example.com')
    await page.getByRole('button', { name: '인증코드전송' }).click()
    const codeInput = page.getByPlaceholder('전송된 코드를 입력해주세요.')
    await expect(codeInput).toBeEnabled()
  })

  test('올바른 인증번호 입력 후 "인증번호확인" 클릭 시 인증 성공 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // MSW 기본 핸들러가 POST /accounts/verification/verify-email 성공 응답 처리
    await page.getByLabel('이메일').fill('test@example.com')
    await page.getByRole('button', { name: '인증코드전송' }).click()
    await page.getByPlaceholder('전송된 코드를 입력해주세요.').fill('VALID01')
    await page.getByRole('button', { name: '인증번호확인' }).first().click()
    await expect(page.getByText('이메일 인증이 완료되었습니다')).toBeVisible()
  })

  test('잘못된 인증번호 입력 후 "인증번호확인" 클릭 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // MSW 오버라이드로 400 응답 반환 — 핸들러 구현 후 msw.overrideError 사용
    await page.getByLabel('이메일').fill('test@example.com')
    await page.getByRole('button', { name: '인증코드전송' }).click()
    await page.getByPlaceholder('전송된 코드를 입력해주세요.').fill('WRONG1')
    await page.getByRole('button', { name: '인증번호확인' }).first().click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('이미 가입된 이메일로 "인증코드전송" 클릭 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // MSW 오버라이드로 409 응답 반환 — 핸들러 구현 후 msw.overrideError 사용
    await page.getByLabel('이메일').fill('already@example.com')
    await page.getByRole('button', { name: '인증코드전송' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('이메일 미입력 상태에서 "인증코드전송" 클릭 시 입력 요청 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '인증코드전송' }).click()
    const emailInput = page.getByLabel('이메일')
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('올바르지 않은 이메일 형식 입력 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByLabel('이메일').fill('invalid-email')
    await page.getByLabel('이메일').blur()
    // Input 컴포넌트: aria-invalid="true" + <p role="alert"> 에러 메시지
    const emailInput = page.getByLabel('이메일')
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByRole('alert')).toBeVisible()
  })
})

test.describe('일반 회원가입 폼 - 휴대전화 인증', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup/form')
  })

  test('휴대전화 번호 입력 후 "인증번호전송" 클릭 시 인증번호 입력 필드가 활성화된다', async ({
    page,
  }) => {
    test.skip()
    // MSW 기본 핸들러가 POST /accounts/verification/send-sms 성공 응답 처리
    // 휴대전화 입력: 010-____-____ 3칸 분리 구조 (구현에 따라 단일/분리 필드)
    await page.getByRole('button', { name: '인증번호전송' }).click()
    const codeInput = page.getByPlaceholder('인증번호 6자리를 입력해주세요')
    await expect(codeInput).toBeEnabled()
  })

  test('올바른 인증번호(6자리) 입력 후 "인증번호확인" 클릭 시 인증 성공 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // MSW 기본 핸들러가 POST /accounts/verification/verify-sms 성공 응답 처리
    await page.getByRole('button', { name: '인증번호전송' }).click()
    await page.getByPlaceholder('인증번호 6자리를 입력해주세요').fill('123456')
    await page.getByRole('button', { name: '인증번호확인' }).last().click()
    await expect(page.getByText('휴대전화 인증이 완료되었습니다')).toBeVisible()
  })

  test('잘못된 인증번호 입력 후 "인증번호확인" 클릭 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // MSW 오버라이드로 400 응답 반환 — 핸들러 구현 후 msw.overrideError 사용
    await page.getByRole('button', { name: '인증번호전송' }).click()
    await page.getByPlaceholder('인증번호 6자리를 입력해주세요').fill('000000')
    await page.getByRole('button', { name: '인증번호확인' }).last().click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('이미 가입된 휴대전화 번호로 "인증번호전송" 클릭 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // MSW 오버라이드로 409 응답 반환 — 핸들러 구현 후 msw.overrideError 사용
    await page.getByRole('button', { name: '인증번호전송' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('휴대전화 번호 미입력 상태에서 "인증번호전송" 클릭 시 입력 요청 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '인증번호전송' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })
})

test.describe('일반 회원가입 폼 - 비밀번호 유효성 검사', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup/form')
  })

  test('8~15자 영문 대소문자, 숫자, 특수문자를 포함한 비밀번호 입력 시 유효 처리된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('비밀번호를 입력해주세요').fill('Valid1234@')
    await page.getByPlaceholder('비밀번호를 입력해주세요').blur()
    const passwordInput = page.getByPlaceholder('비밀번호를 입력해주세요')
    await expect(passwordInput).not.toHaveAttribute('aria-invalid', 'true')
  })

  test('7자 이하 비밀번호 입력 시 유효성 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('비밀번호를 입력해주세요').fill('Ab1@567')
    await page.getByPlaceholder('비밀번호를 입력해주세요').blur()
    const passwordInput = page.getByPlaceholder('비밀번호를 입력해주세요')
    await expect(passwordInput).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('16자 이상 비밀번호 입력 시 유효성 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page
      .getByPlaceholder('비밀번호를 입력해주세요')
      .fill('Abcdefgh1234567@')
    await page.getByPlaceholder('비밀번호를 입력해주세요').blur()
    const passwordInput = page.getByPlaceholder('비밀번호를 입력해주세요')
    await expect(passwordInput).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('특수문자 미포함 비밀번호 입력 시 유효성 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('비밀번호를 입력해주세요').fill('Abcdef12345')
    await page.getByPlaceholder('비밀번호를 입력해주세요').blur()
    const passwordInput = page.getByPlaceholder('비밀번호를 입력해주세요')
    await expect(passwordInput).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('비밀번호와 비밀번호 확인이 일치하지 않을 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('비밀번호를 입력해주세요').fill('Valid1234@')
    await page
      .getByPlaceholder('비밀번호를 다시 입력해주세요')
      .fill('Different1@')
    await page.getByPlaceholder('비밀번호를 다시 입력해주세요').blur()
    const confirmInput = page.getByPlaceholder('비밀번호를 다시 입력해주세요')
    await expect(confirmInput).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('비밀번호와 비밀번호 확인이 일치할 시 오류 메시지가 사라진다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('비밀번호를 입력해주세요').fill('Valid1234@')
    await page
      .getByPlaceholder('비밀번호를 다시 입력해주세요')
      .fill('Valid1234@')
    await page.getByPlaceholder('비밀번호를 다시 입력해주세요').blur()
    const confirmInput = page.getByPlaceholder('비밀번호를 다시 입력해주세요')
    await expect(confirmInput).not.toHaveAttribute('aria-invalid', 'true')
  })
})

test.describe('일반 회원가입 폼 - 필수 항목 유효성 검사', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup/form')
  })

  test('모든 필수 항목 미입력 상태에서 "가입하기" 클릭 시 각 필드에 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '가입하기' }).click()
    // 하나 이상의 alert가 렌더링되어야 함
    const alerts = page.getByRole('alert')
    await expect(alerts.first()).toBeVisible()
  })

  test('이름 미입력 상태에서 "가입하기" 클릭 시 이름 필드에 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '가입하기' }).click()
    const nameInput = page.getByPlaceholder('이름을 입력해주세요')
    await expect(nameInput).toHaveAttribute('aria-invalid', 'true')
  })

  test('닉네임 중복 확인 미완료 상태에서 "가입하기" 클릭 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // 닉네임 입력 후 중복확인 미클릭 상태에서 가입 시도
    await page.getByPlaceholder('닉네임을 입력해주세요').fill('myNick')
    await page.getByRole('button', { name: '가입하기' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('생년월일 8자리 미만 입력 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('8자리 입력해주세요 (ex.20001004)').fill('2000')
    await page.getByPlaceholder('8자리 입력해주세요 (ex.20001004)').blur()
    const birthInput = page.getByPlaceholder('8자리 입력해주세요 (ex.20001004)')
    await expect(birthInput).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('이메일 인증 미완료 상태에서 "가입하기" 클릭 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // 이메일만 입력하고 인증 미완료 상태에서 가입 시도
    await page.getByLabel('이메일').fill('test@example.com')
    await page.getByRole('button', { name: '가입하기' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('휴대전화 인증 미완료 상태에서 "가입하기" 클릭 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    // 휴대전화 입력만 하고 인증 미완료 상태에서 가입 시도
    await page.getByRole('button', { name: '가입하기' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })
})

// msw 응답값은 테스트케이스에 맞도록 반영해야함 (이메일, 휴대전화 인증코드)
test.describe('일반 회원가입 - 성공 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup/form')
  })

  test('모든 필수 항목 입력 및 인증 완료 후 "가입하기" 클릭 시 홈으로 이동한다', async ({
    page,
  }) => {
    test.skip()
    // MSW 기본 핸들러가 모든 인증 API 및 POST /accounts/signup 성공 응답 처리
    // 이름 입력
    await page.getByPlaceholder('이름을 입력해주세요').fill('홍길동')
    // 닉네임 입력 및 중복확인
    await page.getByPlaceholder('닉네임을 입력해주세요').fill('gildong123')
    await page.getByRole('button', { name: '중복확인' }).click()
    // 생년월일 입력
    await page
      .getByPlaceholder('8자리 입력해주세요 (ex.20001004)')
      .fill('20001004')
    // 성별 선택
    await page.getByRole('button', { name: '남' }).click()
    // 이메일 인증
    await page.getByLabel('이메일').fill('test@example.com')
    await page.getByRole('button', { name: '인증코드전송' }).click()
    await page.getByPlaceholder('전송된 코드를 입력해주세요.').fill('VALID01')
    await page.getByRole('button', { name: '인증번호확인' }).first().click()
    // 휴대전화 인증
    await page.getByRole('textbox', { name: '앞자리' }).fill('010')
    await page.getByRole('textbox', { name: '중간자리' }).fill('1234')
    await page.getByRole('textbox', { name: '뒷자리' }).fill('5678')
    await page.getByRole('button', { name: '인증번호전송' }).click()
    await page
      .getByPlaceholder('전송된 코드를 입력해주세요.')
      .last()
      .fill('VALID01')
    await page.getByRole('button', { name: '인증번호확인' }).last().click()
    // 비밀번호 입력
    await page.getByPlaceholder('비밀번호를 입력해주세요').fill('Valid1234@')
    await page
      .getByPlaceholder('비밀번호를 다시 입력해주세요')
      .fill('Valid1234@')
    // 가입하기
    await page.getByRole('button', { name: '가입하기' }).click()
    await expect(page).toHaveURL('/')
  })
})
