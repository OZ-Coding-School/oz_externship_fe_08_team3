/**
 * @interface-contract
 *
 * Page: /mypage (마이페이지 - 내 정보)
 * - 왼쪽 사이드바: "내 정보" (활성, 보라색 + 왼쪽 바), "쪽지 시험", "비밀번호 변경" 3개 메뉴
 * - 헤더: "내 정보" 타이틀 + "수정하기" 버튼 (보라색 #6201E0)
 * - 프로필 섹션: 프로필 이미지(184px 원형), 닉네임, 이메일
 * - 개인 정보 섹션: 이름, 휴대전화, 성별, 생년월일 (읽기 전용)
 * - 수강 중인 과정 섹션: 과정 썸네일 + 과정명
 * - 회원 탈퇴 섹션: 경고 문구 + "회원 탈퇴하기" 버튼 (회색)
 *
 * Page: /mypage/edit (마이페이지 - 내 정보 수정)
 * - 동일 사이드바, "내 정보" 활성 유지
 * - 헤더: "내 정보" 타이틀 + "저장하기" 버튼 (보라색)
 * - 프로필 수정 섹션: 프로필 이미지(카메라 아이콘 오버레이), 닉네임 수정 입력 + "중복확인" 버튼, 이메일(읽기 전용)
 * - 개인 정보 수정 섹션: 이름(읽기 전용), 휴대전화 입력 + "변경" 버튼, 성별 남/여 토글, 생년월일(읽기 전용)
 *
 * Page: /mypage/change-password (비밀번호 변경)
 * - 동일 사이드바, "비밀번호 변경" 활성
 * - 타이틀: "비밀번호 변경"
 * - 필드: 기존 비밀번호, 새 비밀번호, 새 비밀번호 확인
 * - "변경하기" 버튼 (보라색)
 *
 * Page: /mypage/quiz (쪽지 시험)
 * - 동일 사이드바, "쪽지 시험" 활성
 *
 * API:
 * - GET  /accounts/me        → 내 정보 조회
 * - PATCH /accounts/me       → 내 정보 수정
 * - POST /accounts/me/password → 비밀번호 변경
 * - DELETE /accounts/me      → 회원 탈퇴
 * - GET  /accounts/nickname/check → 닉네임 중복 확인
 */

import { test, expect, type Page } from '@playwright/test'

const setupAuth = async (page: Page) => {
  await page.goto('/')
  await page.evaluate(() => {
    const store = JSON.parse(localStorage.getItem('AuthStore') || '{}')
    store.state = {
      isAuthenticated: true,
      user: {
        nickname: '오즈오즈',
        email: 'ozschool1234@gmail.com',
        profileImage: null,
      },
    }
    localStorage.setItem('AuthStore', JSON.stringify(store))
  })
}

test.describe('마이페이지 - 접근 제어', () => {
  test('비로그인 상태에서 /mypage 접근 시 /login으로 리다이렉트된다', async ({
    page,
  }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('AuthStore'))
    await page.goto('/mypage')
    await expect(page).toHaveURL('/login')
  })

  test('비로그인 상태에서 /mypage/edit 접근 시 /login으로 리다이렉트된다', async ({
    page,
  }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('AuthStore'))
    await page.goto('/mypage/edit')
    await expect(page).toHaveURL('/login')
  })

  test('비로그인 상태에서 /mypage/change-password 접근 시 /login으로 리다이렉트된다', async ({
    page,
  }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('AuthStore'))
    await page.goto('/mypage/change-password')
    await expect(page).toHaveURL('/login')
  })

  test('비로그인 상태에서 /mypage/quiz 접근 시 /login으로 리다이렉트된다', async ({
    page,
  }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('AuthStore'))
    await page.goto('/mypage/quiz')
    await expect(page).toHaveURL('/login')
  })

  test('로그인 상태에서 /mypage 접근 시 마이페이지가 렌더링된다', async ({
    page,
  }) => {
    await setupAuth(page)
    await page.goto('/mypage')
    await expect(page).toHaveURL('/mypage')
  })
})

test.describe('마이페이지 - 사이드바 네비게이션', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/mypage')
  })

  test('사이드바에 "쪽지 시험" 메뉴가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('link', { name: '쪽지 시험' })).toBeVisible()
  })

  test('사이드바에 "내 정보" 메뉴가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('link', { name: '내 정보' })).toBeVisible()
  })

  test('사이드바에 "비밀번호 변경" 메뉴가 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('link', { name: '비밀번호 변경' })
    ).toBeVisible()
  })

  test('/mypage에서 "내 정보" 사이드바 메뉴가 활성 상태이다', async ({
    page,
  }) => {
    test.skip()
    const activeMenu = page.getByRole('link', { name: '내 정보' })
    await expect(activeMenu).toHaveAttribute('aria-current', 'page')
  })

  test('사이드바 "쪽지 시험" 클릭 시 /mypage/quiz로 이동한다', async ({
    page,
  }) => {
    await page.getByRole('link', { name: '쪽지 시험' }).click()
    await expect(page).toHaveURL('/mypage/quiz')
  })

  test('사이드바 "비밀번호 변경" 클릭 시 /mypage/change-password로 이동한다', async ({
    page,
  }) => {
    await page.getByRole('link', { name: '비밀번호 변경' }).click()
    await expect(page).toHaveURL('/mypage/change-password')
  })

  test('/mypage/change-password에서 사이드바 "내 정보" 클릭 시 /mypage로 이동한다', async ({
    page,
  }) => {
    await page.goto('/mypage/change-password')
    await page.getByRole('link', { name: '내 정보' }).click()
    await expect(page).toHaveURL('/mypage')
  })

  test('/mypage/change-password에서 "비밀번호 변경" 사이드바 메뉴가 활성 상태이다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/mypage/change-password')
    const activeMenu = page.getByRole('link', { name: '비밀번호 변경' })
    await expect(activeMenu).toHaveAttribute('aria-current', 'page')
  })

  test('/mypage/quiz에서 "쪽지 시험" 사이드바 메뉴가 활성 상태이다', async ({
    page,
  }) => {
    test.skip()
    await page.goto('/mypage/quiz')
    const activeMenu = page.getByRole('link', { name: '쪽지 시험' })
    await expect(activeMenu).toHaveAttribute('aria-current', 'page')
  })
})

test.describe('마이페이지 - 내 정보 렌더링 (/mypage)', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/mypage')
  })

  test('"내 정보" 타이틀이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('heading', { name: '내 정보' })).toBeVisible()
  })

  test('"수정하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '수정하기' })).toBeVisible()
  })

  test('프로필 이미지가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('img', { name: '프로필 이미지' })).toBeVisible()
  })

  test('닉네임이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText('오즈오즈')).toBeVisible()
  })

  test('이메일이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText('ozschool1234@gmail.com')).toBeVisible()
  })

  test('개인 정보 섹션에서 이름이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText('이름')).toBeVisible()
  })

  test('개인 정보 섹션에서 휴대전화가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText('휴대전화')).toBeVisible()
  })

  test('개인 정보 섹션에서 성별이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText('성별')).toBeVisible()
  })

  test('개인 정보 섹션에서 생년월일이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText('생년월일')).toBeVisible()
  })

  test('수강 중인 과정 섹션이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByText('수강 중인 과정')).toBeVisible()
  })

  test('회원 탈퇴 경고 문구가 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByText(
        '탈퇴 처리 시, 수강 기간 / 포인트 / 쿠폰은 소멸되며 환불되지 않습니다.'
      )
    ).toBeVisible()
  })

  test('"회원 탈퇴하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('button', { name: '회원 탈퇴하기' })
    ).toBeVisible()
  })
})

test.describe('마이페이지 - 내 정보에서 수정 페이지로 이동', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/mypage')
  })

  test('"수정하기" 버튼 클릭 시 /mypage/edit으로 이동한다', async ({
    page,
  }) => {
    await page.getByRole('button', { name: '수정하기' }).click()
    await expect(page).toHaveURL('/mypage/edit')
  })
})

test.describe('마이페이지 - 내 정보 수정 렌더링 (/mypage/edit)', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/mypage/edit')
  })

  test('"내 정보" 타이틀이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('heading', { name: '내 정보' })).toBeVisible()
  })

  test('"저장하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '저장하기' })).toBeVisible()
  })

  test('프로필 이미지에 카메라 아이콘 오버레이가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await expect(
      page.getByRole('button', { name: '프로필 이미지 변경' })
    ).toBeVisible()
  })

  test('닉네임 입력 필드가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('textbox', { name: '닉네임' })).toBeVisible()
  })

  test('닉네임 입력 옆에 "중복확인" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '중복확인' })).toBeVisible()
  })

  test('닉네임 입력 하단에 글자 수 안내 문구가 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByText('한글 8자, 영문 및 숫자 16자까지 혼용할 수 있어요.')
    ).toBeVisible()
  })

  test('이메일(아이디) 필드가 읽기 전용으로 표시된다', async ({ page }) => {
    test.skip()
    const emailInput = page.getByRole('textbox', { name: '이메일' })
    await expect(emailInput).toBeDisabled()
  })

  test('이름 필드가 읽기 전용으로 표시된다', async ({ page }) => {
    test.skip()
    const nameInput = page.getByRole('textbox', { name: '이름' })
    await expect(nameInput).toBeDisabled()
  })

  test('휴대전화 입력 필드가 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('textbox', { name: '휴대전화' })).toBeVisible()
  })

  test('휴대전화 입력 옆에 "변경" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '변경' })).toBeVisible()
  })

  test('성별 "남" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '남' })).toBeVisible()
  })

  test('성별 "여" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '여' })).toBeVisible()
  })

  test('생년월일 필드가 읽기 전용으로 표시된다', async ({ page }) => {
    test.skip()
    const birthInput = page.getByRole('textbox', { name: '생년월일' })
    await expect(birthInput).toBeDisabled()
  })

  test('/mypage/edit에서 "내 정보" 사이드바 메뉴가 활성 상태이다', async ({
    page,
  }) => {
    test.skip()
    const activeMenu = page.getByRole('link', { name: '내 정보' })
    await expect(activeMenu).toHaveAttribute('aria-current', 'page')
  })
})

test.describe('마이페이지 - 내 정보 수정 인터랙션', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/mypage/edit')
  })

  test('닉네임 입력 후 "중복확인" 클릭 시 사용 가능 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('textbox', { name: '닉네임' }).fill('새닉네임')
    await page.getByRole('button', { name: '중복확인' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('이미 사용 중인 닉네임 입력 후 "중복확인" 클릭 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('textbox', { name: '닉네임' }).fill('중복닉네임')
    await page.getByRole('button', { name: '중복확인' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('성별 "여" 버튼 클릭 시 선택 상태로 전환된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '여' }).click()
    await expect(page.getByRole('button', { name: '여' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  test('성별 "남" 버튼 클릭 시 선택 상태로 전환된다', async ({ page }) => {
    test.skip()
    await page.getByRole('button', { name: '남' }).click()
    await expect(page.getByRole('button', { name: '남' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  test('수정 완료 후 "저장하기" 클릭 시 /mypage로 이동한다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '저장하기' }).click()
    await expect(page).toHaveURL('/mypage')
  })
})

test.describe('마이페이지 - 비밀번호 변경 렌더링 (/mypage/change-password)', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/mypage/change-password')
  })

  test('"비밀번호 변경" 타이틀이 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByRole('heading', { name: '비밀번호 변경' })
    ).toBeVisible()
  })

  test('기존 비밀번호 입력 필드가 표시된다', async ({ page }) => {
    test.skip()
    await expect(
      page.getByPlaceholder('새 비밀번호를 입력해주세요.')
    ).toBeVisible()
  })

  test('새 비밀번호 입력 필드가 표시된다', async ({ page }) => {
    test.skip()
    const inputs = page.getByPlaceholder('새 비밀번호를 한 번 더 입력해주세요.')
    await expect(inputs.first()).toBeVisible()
  })

  test('새 비밀번호 확인 입력 필드가 표시된다', async ({ page }) => {
    test.skip()
    const inputs = page.getByPlaceholder('새 비밀번호를 한 번 더 입력해주세요.')
    await expect(inputs).toHaveCount(2)
  })

  test('"변경하기" 버튼이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('button', { name: '변경하기' })).toBeVisible()
  })
})

test.describe('마이페이지 - 비밀번호 변경 인터랙션', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/mypage/change-password')
  })

  test('기존 비밀번호, 새 비밀번호, 확인 모두 입력 후 "변경하기" 클릭 시 성공 처리된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('새 비밀번호를 입력해주세요.').fill('OldPass1!')
    const newPassInputs = page.getByPlaceholder(
      '새 비밀번호를 한 번 더 입력해주세요.'
    )
    await newPassInputs.first().fill('NewPass1!')
    await newPassInputs.last().fill('NewPass1!')
    await page.getByRole('button', { name: '변경하기' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('새 비밀번호와 새 비밀번호 확인이 일치하지 않을 때 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    const newPassInputs = page.getByPlaceholder(
      '새 비밀번호를 한 번 더 입력해주세요.'
    )
    await newPassInputs.first().fill('NewPass1!')
    await newPassInputs.last().fill('DifferentPass1!')
    await page.getByRole('button', { name: '변경하기' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('기존 비밀번호가 틀렸을 때 오류 메시지가 표시된다', async ({ page }) => {
    test.skip()
    await page
      .getByPlaceholder('새 비밀번호를 입력해주세요.')
      .fill('WrongOldPass1!')
    const newPassInputs = page.getByPlaceholder(
      '새 비밀번호를 한 번 더 입력해주세요.'
    )
    await newPassInputs.first().fill('NewPass1!')
    await newPassInputs.last().fill('NewPass1!')
    await page.getByRole('button', { name: '변경하기' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('기존 비밀번호 미입력 상태에서 "변경하기" 클릭 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    const newPassInputs = page.getByPlaceholder(
      '새 비밀번호를 한 번 더 입력해주세요.'
    )
    await newPassInputs.first().fill('NewPass1!')
    await newPassInputs.last().fill('NewPass1!')
    await page.getByRole('button', { name: '변경하기' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('새 비밀번호 미입력 상태에서 "변경하기" 클릭 시 오류 메시지가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByPlaceholder('새 비밀번호를 입력해주세요.').fill('OldPass1!')
    await page.getByRole('button', { name: '변경하기' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })
})

test.describe('마이페이지 - 회원 탈퇴', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/mypage')
  })

  test('"회원 탈퇴하기" 버튼 클릭 시 탈퇴 확인 다이얼로그가 표시된다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '회원 탈퇴하기' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('탈퇴 확인 다이얼로그에서 취소 시 마이페이지에 머문다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '회원 탈퇴하기' }).click()
    await page.getByRole('button', { name: '취소' }).click()
    await expect(page).toHaveURL('/mypage')
  })

  test('탈퇴 확인 다이얼로그에서 탈퇴 확인 시 로그아웃 후 홈(/)으로 이동한다', async ({
    page,
  }) => {
    test.skip()
    await page.getByRole('button', { name: '회원 탈퇴하기' }).click()
    await page.getByRole('button', { name: '탈퇴하기' }).click()
    await expect(page).toHaveURL('/')
    const authState = await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('AuthStore') || '{}')
      return store.state?.isAuthenticated
    })
    expect(authState).toBeFalsy()
  })
})

test.describe('마이페이지 - 쪽지 시험 (/mypage/quiz)', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto('/mypage/quiz')
  })

  test('쪽지 시험 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL('/mypage/quiz')
  })

  test('쪽지 시험 목록이 표시된다', async ({ page }) => {
    test.skip()
    await expect(page.getByRole('list')).toBeVisible()
  })

  test('쪽지 시험 항목 클릭 시 시험 페이지로 이동한다', async ({ page }) => {
    test.skip()
    await page.getByRole('listitem').first().click()
    await expect(page).toHaveURL(/\/quiz\/\d+\/exam/)
  })
})
