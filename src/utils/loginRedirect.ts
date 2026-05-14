import { EXTERNAL_URLS } from '@/constants/routes'

export const LOGIN_URL = import.meta.env.VITE_LOGIN_URL ?? EXTERNAL_URLS.LOGIN

/**
 * 로그인 페이지로 이동한다.
 * ?next= 파라미터를 붙여 로그인 후 현재 페이지로 돌아오도록 요청한다.
 * (로그인 사이트가 ?next= 를 지원하지 않으면 기본 동작과 동일)
 */
export function redirectToLogin() {
  const next = window.location.href
  window.location.assign(`${LOGIN_URL}?next=${encodeURIComponent(next)}`)
}
